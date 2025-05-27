/**
 * game.js - Integrated Block Breaker Game with Authentication
 * Combines original authentication with improved game mechanics
 */

// DOM Elements
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("scoreBoard");
const messageDisplay = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");
const livesDisplay = document.getElementById("lives");
const levelDisplay = document.getElementById("level");

// Game variables
let paddleWidth = 75, paddleHeight = 12, paddleX;
let ballRadius = 8;
let x, y, dx, dy;
let rightPressed = false, leftPressed = false;
let score = 0, lives = 3, level = 1, gameRunning = true;
let isGameOver = false;

// Audio elements for sound effects
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let soundEnabled = true;

// Function to create and play a sound
function playSound(frequency, type, duration, volume) {
  if (!soundEnabled || !audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gainNode.gain.value = volume;
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.start();
  
  setTimeout(() => {
    oscillator.stop();
  }, duration);
}

// Sound effects
function playBrickHitSound(row) {
  const frequencies = [261.63, 293.66, 329.63, 349.23]; // C4, D4, E4, F4
  playSound(frequencies[row % frequencies.length], 'triangle', 100, 0.3);
}

function playPaddleHitSound() {
  playSound(196.00, 'sine', 80, 0.2); // G3
}

function playWallHitSound() {
  playSound(164.81, 'sine', 50, 0.15); // E3
}

function playLifeLostSound() {
  playSound(98.00, 'sawtooth', 300, 0.3); // G2
}

function playLevelCompleteSound() {
  // Play a little melody
  setTimeout(() => playSound(392.00, 'sine', 100, 0.2), 0);    // G4
  setTimeout(() => playSound(440.00, 'sine', 100, 0.2), 150);  // A4
  setTimeout(() => playSound(493.88, 'sine', 100, 0.2), 300);  // B4
  setTimeout(() => playSound(587.33, 'sine', 300, 0.3), 450);  // D5
}

function playGameOverSound() {
  setTimeout(() => playSound(196.00, 'sawtooth', 200, 0.3), 0);    // G3
  setTimeout(() => playSound(185.00, 'sawtooth', 200, 0.3), 250);  // F#3
  setTimeout(() => playSound(174.61, 'sawtooth', 200, 0.3), 500);  // F3
  setTimeout(() => playSound(164.81, 'sawtooth', 500, 0.3), 750);  // E3
}

function playGameWonSound() {
  setTimeout(() => playSound(261.63, 'sine', 150, 0.2), 0);     // C4
  setTimeout(() => playSound(293.66, 'sine', 150, 0.2), 150);   // D4
  setTimeout(() => playSound(329.63, 'sine', 150, 0.2), 300);   // E4
  setTimeout(() => playSound(349.23, 'sine', 150, 0.2), 450);   // F4
  setTimeout(() => playSound(392.00, 'sine', 150, 0.2), 600);   // G4
  setTimeout(() => playSound(440.00, 'sine', 150, 0.2), 750);   // A4
  setTimeout(() => playSound(493.88, 'sine', 150, 0.2), 900);   // B4
  setTimeout(() => playSound(523.25, 'sine', 400, 0.3), 1050);  // C5
}

// Define colors for bricks
const colors = ["#FF6F61", "#FFB400", "#00C896", "#4285F4"];

// Level definitions
const levels = [
  { rows: 3, cols: 5 },
  { rows: 4, cols: 6 },
  { rows: 5, cols: 7 }
];

// Trail effect
let trail = [];

// Bricks array
let bricks = [];

// Setup level based on current level number
function setupLevel() {
  const { rows, cols } = levels[level - 1];
  bricks = [];
  
  for (let r = 0; r < rows; r++) {
    bricks[r] = [];
    for (let c = 0; c < cols; c++) {
      let status = 1;
      
      // Level 1: Standard formation (all bricks)
      // Level 2: Checkerboard pattern
      if (level === 2 && (r + c) % 2 === 1) {
        status = 0;
      }
        // Level 3: Inverted Pyramid formation (point down)
      if (level === 3) {
        // For inverted pyramid, we have more bricks at the top and fewer at the bottom
        const maxColsInRow = Math.floor(cols * (rows - r) / rows);
        const startCol = Math.floor((cols - maxColsInRow) / 2);
        const endCol = startCol + maxColsInRow;
        
        if (c < startCol || c >= endCol) {
          status = 0;
        }
      }
      
      bricks[r][c] = { x: 0, y: 0, status: status };
    }
  }
}

// Reset ball and paddle positions
function resetBallAndPaddle() {
  paddleX = (canvas.width - paddleWidth) / 2;
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = 3;
  dy = -3;
  trail = [];
}

// Draw trail effect behind the ball
function drawTrail() {
  for (let i = 0; i < trail.length; i++) {
    const t = trail[i];
    ctx.beginPath();
    ctx.arc(t.x, t.y, ballRadius * (1 - i / trail.length), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 247, 255, ${0.5 * (1 - i / trail.length)})`;
    ctx.fill();
    ctx.closePath();
  }
}

// Draw the ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#00f7ff";
  ctx.fill();
  ctx.closePath();
}

// Draw the paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.roundRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight, [10]);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.closePath();
}

// Draw the bricks
function drawBricks() {
  const { rows, cols } = levels[level - 1];
  const brickWidth = (canvas.width - (cols + 1) * 10) / cols;
  const brickHeight = 20;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const b = bricks[r][c];
      if (b.status === 1) {
        const brickX = c * (brickWidth + 10) + 10;
        const brickY = r * (brickHeight + 10) + 30;
        b.x = brickX;
        b.y = brickY;
        ctx.beginPath();
        ctx.roundRect(brickX, brickY, brickWidth, brickHeight, 10);
        ctx.fillStyle = colors[r % colors.length];
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Detect collisions between ball and bricks
function collisionDetection() {
  const { cols } = levels[level - 1];
  const brickWidth = (canvas.width - (cols + 1) * 10) / cols;
  const brickHeight = 20;

  for (let r = 0; r < bricks.length; r++) {
    for (let c = 0; c < bricks[r].length; c++) {
      const b = bricks[r][c];
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          playBrickHitSound(r);
          updateUI();

          // Check if all bricks are destroyed
          if (bricks.flat().every(b => b.status === 0)) {
            if (level < levels.length) {              // Pause the game briefly to show level completion
              gameRunning = false;
              
              // Show level completed message
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              
              ctx.fillStyle = "#00f7ff";
              ctx.font = "bold 24px 'Segoe UI', sans-serif";
              ctx.textAlign = "center";
              ctx.fillText(`Niveau ${level} terminé !`, canvas.width / 2, canvas.height / 2 - 15);
              ctx.font = "18px 'Segoe UI', sans-serif";
              ctx.fillText(`Préparation du niveau ${level + 1}...`, canvas.width / 2, canvas.height / 2 + 15);
              
              playLevelCompleteSound();
              
              // Wait a moment before starting next level
              setTimeout(() => {
                level++;
                setupLevel();
                resetBallAndPaddle();
                updateUI();
                gameRunning = true;
                draw();
              }, 2000);
            } else {
              // Game completed
              playGameWonSound();
              endGame("🎉 Félicitations, tu as terminé tous les niveaux !");
            }
          }
        }
      }
    }
  }
}

// Update UI elements (score, lives, level)
function updateUI() {
  scoreDisplay.textContent = `Score: ${score}`;
  livesDisplay.textContent = `Vies: ${lives}`;
  levelDisplay.textContent = `Niveau: ${level}`;
}

// End the game
function endGame(msg) {
  isGameOver = true;
  gameRunning = false;
  messageDisplay.textContent = msg;
  restartBtn.style.display = "inline-block";
  
  if (msg.includes("Game Over")) {
    playGameOverSound();
  }

  // Add score to the logged-in user in Firebase
  if (typeof addScoreToUser === "function" && typeof isUserLoggedIn === "function" && isUserLoggedIn()) {
    // Send score to Firebase
    addScoreToUser(score)
      .then(() => {
        console.log("Score sauvegardé avec succès");
      })
      .catch(error => {
        console.error("Erreur lors de la sauvegarde du score:", error);
      });
  }
}

// Main game loop
function draw() {
  if (!gameRunning || isGameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawTrail();
  drawBall();
  drawPaddle();
  collisionDetection();

  // Wall collision detection
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
    playWallHitSound();
  }
  if (y + dy < ballRadius) {
    dy = -dy;
    playWallHitSound();
  } else if (y + dy > canvas.height - ballRadius) {
    // Paddle collision detection
    if (x > paddleX && x < paddleX + paddleWidth) {
      // Calculate angle of reflection based on where the ball hits the paddle
      const hitPoint = x - (paddleX + paddleWidth / 2);
      dx = hitPoint * 0.15; // The further from center, the more angled the bounce
      dy = -Math.abs(dy);
      playPaddleHitSound();
    } else {
      // Ball missed the paddle
      lives--;
      playLifeLostSound();
      updateUI();
      if (lives === 0) {
        endGame("💥 Game Over !");
      } else {
        resetBallAndPaddle();
      }
    }
  }

  // Move paddle
  if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 5;
  else if (leftPressed && paddleX > 0) paddleX -= 5;

  // Update ball position
  x += dx;
  y += dy;

  // Update trail effect
  trail.unshift({ x, y });
  if (trail.length > 15) trail.pop();

  requestAnimationFrame(draw);
}

// Event listeners for keyboard controls
document.addEventListener("keydown", e => {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
  if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
  if (e.key === " " || e.key === "Spacebar") { // Handle spacebar
    if (!gameRunning && !isGameOver && startBtn.style.display !== "none") {
      startGame();
    } else if (isGameOver && restartBtn.style.display !== "none") {
      restartGame();
    }
  }
});

document.addEventListener("keyup", e => {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
  if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
});

// Touch controls for mobile devices
let touchX = null;

// Add touch event listeners to the canvas
canvas.addEventListener("touchstart", e => {
  e.preventDefault();
  const touch = e.touches[0];
  touchX = touch.clientX;
});

canvas.addEventListener("touchmove", e => {
  e.preventDefault();
  if (!touchX) return;
  
  const touch = e.touches[0];
  const moveX = touch.clientX - touchX;
  
  // Move paddle based on touch movement
  paddleX += moveX * 1.5;
  
  // Keep paddle within canvas boundaries
  if (paddleX < 0) paddleX = 0;
  if (paddleX > canvas.width - paddleWidth) paddleX = canvas.width - paddleWidth;
  
  touchX = touch.clientX;
});

canvas.addEventListener("touchend", e => {
  e.preventDefault();
  touchX = null;
});

// Function to restart the game
function restartGame() {
  score = 0;
  lives = 3;
  level = 1;
  gameRunning = true;
  isGameOver = false;
  messageDisplay.textContent = "";
  restartBtn.style.display = "none";
  setupLevel();
  resetBallAndPaddle();
  updateUI();
  draw();
}

// Restart button event listener
restartBtn.addEventListener("click", restartGame);

// Add roundRect method if not supported by browser
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
    this.beginPath();
    this.moveTo(x + radius, y);
    this.arcTo(x + width, y, x + width, y + height, radius);
    this.arcTo(x + width, y + height, x, y + height, radius);
    this.arcTo(x, y + height, x, y, radius);
    this.arcTo(x, y, x + width, y, radius);
    this.closePath();
    return this;
  };
}

// Function to initialize the game (without starting)
function initGame() {
  isGameOver = false;
  gameRunning = false;
  score = 0;
  lives = 3;
  level = 1;
  scoreDisplay.textContent = "Score: 0";
  messageDisplay.textContent = "Cliquez sur 'Commencer' pour jouer";
  restartBtn.style.display = "none";
  
  // Get the start button
  const startBtn = document.getElementById("startBtn");
  if (startBtn) {
    startBtn.style.display = "inline-block";
  }
  
  setupLevel();
  resetBallAndPaddle();
  updateUI();
  
  // Draw the initial state without animation
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw a semi-transparent overlay
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw the game elements in a paused state
  drawBricks();
  drawBall();
  drawPaddle();
  
  // Draw "Press Start" message on canvas
  ctx.fillStyle = "#00f7ff";
  ctx.font = "bold 24px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("PRÊT À JOUER !", canvas.width / 2, canvas.height / 2);
}

// Function to start the game
function startGame() {
  const startBtn = document.getElementById("startBtn");
  if (startBtn) {
    startBtn.style.display = "none";
  }
  
  // Clear any previous message
  messageDisplay.textContent = "";
  
  // Add a brief countdown before starting
  let countDown = 3;
  
  function countdown() {
    if (countDown > 0) {
      // Clear canvas and draw game elements
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBricks();
      drawBall();
      drawPaddle();
      
      // Draw countdown number
      ctx.fillStyle = "#ffcc00";
      ctx.font = "bold 48px 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(countDown, canvas.width / 2, canvas.height / 2);
      
      countDown--;
      setTimeout(countdown, 1000);
    } else {
      // Start the game
      isGameOver = false;
      gameRunning = true;
      draw();
    }
  }
  
  countdown();
}

// Start button event listener
const startBtn = document.getElementById("startBtn");
if (startBtn) {
  startBtn.addEventListener("click", startGame);
}

// Sound toggle button
const toggleSoundBtn = document.getElementById("toggleSoundBtn");
if (toggleSoundBtn) {
  toggleSoundBtn.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      toggleSoundBtn.textContent = "🔊";
      toggleSoundBtn.classList.remove("muted");
      toggleSoundBtn.title = "Désactiver le son";
    } else {
      toggleSoundBtn.textContent = "🔇";
      toggleSoundBtn.classList.add("muted");
      toggleSoundBtn.title = "Activer le son";
    }
  });
}

// Pause game when user leaves the tab/window
let gamePaused = false;
let wasRunningBeforePause = false;

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // User left the page
    if (gameRunning && !isGameOver) {
      wasRunningBeforePause = true;
      gamePaused = true;
      gameRunning = false;
    }
  } else {
    // User returned to the page
    if (gamePaused && wasRunningBeforePause && !isGameOver) {
      // Show a countdown before resuming
      messageDisplay.textContent = "Le jeu reprend dans 3...";
      setTimeout(() => {
        messageDisplay.textContent = "Le jeu reprend dans 2...";
        setTimeout(() => {
          messageDisplay.textContent = "Le jeu reprend dans 1...";
          setTimeout(() => {
            messageDisplay.textContent = "";
            gamePaused = false;
            gameRunning = true;
            draw();
          }, 1000);
        }, 1000);
      }, 1000);
    }
  }
});

// Export functions for use in other files
window.initGame = initGame;
window.startGame = startGame;
window.getScore = () => score;
