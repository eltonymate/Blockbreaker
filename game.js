/**
 * game.js - Mécanique de jeu Block Breaker
 * Responsable: Personne 1 - Mécanique du jeu
 */

// Éléments du DOM
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("scoreBoard");
const messageDisplay = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");

// Variables du jeu
let paddleHeight = 10, paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 3;
let dy = -3;
const ballRadius = 8;
let rightPressed = false;
let leftPressed = false;

// Configuration des briques
const brickRowCount = 4;
const brickColumnCount = 6;
const brickWidth = 65;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = [];
let score = 0;
let isGameOver = false;

// Initialisation des briques
function initBricks() {
  bricks = [];
  for(let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for(let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}

initBricks();

// Écouteurs d'événements pour le contrôle du paddle
document.addEventListener("keydown", (e) => {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
  if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
});
document.addEventListener("keyup", (e) => {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
  if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
});

// Redémarrer le jeu
restartBtn.addEventListener("click", () => {
  document.location.reload();
});

// Détection de collision
function collisionDetection() {
  for(let c = 0; c < brickColumnCount; c++) {
    for(let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth &&
            y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          scoreDisplay.textContent = `Score: ${score}`;
          if (score === brickRowCount * brickColumnCount) {
            endGame("🎉 Félicitations, tu as gagné !");
          }
        }
      }
    }
  }
}

// Dessin de la balle
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#00f7ff";
  ctx.fill();
  ctx.closePath();
}

// Dessin du paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.closePath();
}

// Dessin des briques
function drawBricks() {
  for(let c = 0; c < brickColumnCount; c++) {
    for(let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#ff4081";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Fin de partie
function endGame(msg) {
  isGameOver = true;
  messageDisplay.textContent = msg;
  restartBtn.style.display = "inline-block";
  
  // Ajouter le score à l'utilisateur connecté
  if (typeof addScoreToUser === "function" && isUserLoggedIn()) {
    addScoreToUser(score);
  }
}

// Fonction principale de jeu
function draw() {
  if (isGameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();

  // Gestion des collisions avec les murs
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
  if (y + dy < ballRadius) dy = -dy;
  else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) dy = -dy;
    else endGame("💥 Game Over !");
  }

  // Contrôle du paddle
  if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 5;
  else if (leftPressed && paddleX > 0) paddleX -= 5;

  x += dx;
  y += dy;

  requestAnimationFrame(draw);
}

// Fonction pour démarrer le jeu
function startGame() {
  isGameOver = false;
  score = 0;
  scoreDisplay.textContent = "Score: 0";
  messageDisplay.textContent = "";
  restartBtn.style.display = "none";
  initBricks();
  paddleX = (canvas.width - paddleWidth) / 2;
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = 3;
  dy = -3;
  draw();
}

// Le jeu ne démarre plus automatiquement au chargement
// mais seulement après connexion via la fonction updateUI() dans user.js

// Exporter les fonctions pour pouvoir les utiliser dans d'autres fichiers
window.startGame = startGame;
window.getScore = () => score;
