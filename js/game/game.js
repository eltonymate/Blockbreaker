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
      bricks[r][c] = { x: 0, y: 0, status: 1 };
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
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#fff";
        ctx.stroke();
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
          updateUI();

          // Check if all bricks are destroyed
          if (bricks.flat().every(b => b.status === 0)) {
            if (level < levels.length) {
              // Next level
              level++;
              setupLevel();
              resetBallAndPaddle();
              updateUI();
            } else {
              // Game completed
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
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
  if (y + dy < ballRadius) dy = -dy;
  else if (y + dy > canvas.height - ballRadius) {
    // Paddle collision detection
    if (x > paddleX && x < paddleX + paddleWidth) {
      // Calculate angle of reflection based on where the ball hits the paddle
      const hitPoint = x - (paddleX + paddleWidth / 2);
      dx = hitPoint * 0.15; // The further from center, the more angled the bounce
      dy = -Math.abs(dy);
    } else {
      // Ball missed the paddle
      lives--;
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
});

document.addEventListener("keyup", e => {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
  if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
});

// Restart button event listener
restartBtn.addEventListener("click", () => {
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
});

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

// Function to start the game
function startGame() {
  isGameOver = false;
  gameRunning = true;
  score = 0;
  lives = 3;
  level = 1;
  scoreDisplay.textContent = "Score: 0";
  messageDisplay.textContent = "";
  restartBtn.style.display = "none";
  setupLevel();
  resetBallAndPaddle();
  updateUI();
  draw();
}

// Export functions for use in other files
window.startGame = startGame;
window.getScore = () => score;
