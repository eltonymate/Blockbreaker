/**
 * user.js - Gestion des utilisateurs pour Block Breaker
 * Responsable: Personne 3 - Système d'authentification
 */

// Éléments du DOM pour la gestion utilisateur
const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");
const userInfoSection = document.getElementById("userInfoSection");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginNickname = document.getElementById("loginNickname");
const loginEmail = document.getElementById("loginEmail");
const registerNickname = document.getElementById("registerNickname");
const registerEmail = document.getElementById("registerEmail");

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");

const userNicknameSpan = document.getElementById("userNickname");
const userEmailSpan = document.getElementById("userEmail");

const showRegisterLink = document.getElementById("showRegisterLink");
const showLoginLink = document.getElementById("showLoginLink");

// Structure pour stocker les utilisateurs (dans une application réelle, ce serait une base de données)
let users = JSON.parse(localStorage.getItem("blockbreakerUsers")) || [];
let currentUser = JSON.parse(localStorage.getItem("blockbreakerCurrentUser")) || null;

// Navigation entre les formulaires
showRegisterLink.addEventListener("click", (e) => {
  e.preventDefault();
  loginSection.style.display = "none";
  registerSection.style.display = "block";
});

showLoginLink.addEventListener("click", (e) => {
  e.preventDefault();
  registerSection.style.display = "none";
  loginSection.style.display = "block";
});

// Inscription d'un nouvel utilisateur
registerBtn.addEventListener("click", () => {
  const nickname = registerNickname.value.trim();
  const email = registerEmail.value.trim();
  
  if (!nickname || !email) {
    alert("Veuillez remplir tous les champs");
    return;
  }
  
  // Vérifier si l'utilisateur existe déjà
  const existingUser = users.find(user => 
    user.email === email || user.nickname === nickname
  );
  
  if (existingUser) {
    alert("Cet email ou ce nickname est déjà utilisé");
    return;
  }
  
  // Création du nouvel utilisateur
  const newUser = {
    id: Date.now().toString(),
    nickname,
    email,
    scores: [],
    bestScore: 0
  };
  
  users.push(newUser);
  localStorage.setItem("blockbreakerUsers", JSON.stringify(users));
  
  // Connexion automatique
  loginUser(newUser);
  alert("Inscription réussie !");
});

// Connexion d'un utilisateur
loginBtn.addEventListener("click", () => {
  const nickname = loginNickname.value.trim();
  const email = loginEmail.value.trim();
  
  if (!nickname || !email) {
    alert("Veuillez remplir tous les champs");
    return;
  }
  
  const user = users.find(user => 
    user.nickname === nickname && user.email === email
  );
  
  if (user) {
    loginUser(user);
  } else {
    alert("Identifiants incorrects");
  }
});

// Déconnexion
logoutBtn.addEventListener("click", () => {
  currentUser = null;
  localStorage.removeItem("blockbreakerCurrentUser");
  updateUI();
  
  // Afficher message de déconnexion
  alert("Vous avez été déconnecté");
});

// Fonction pour connecter un utilisateur
function loginUser(user) {
  currentUser = user;
  localStorage.setItem("blockbreakerCurrentUser", JSON.stringify(user));
  updateUI();
}

// Fonction pour ajouter un score à l'utilisateur connecté
function addScoreToUser(score) {
  if (!currentUser) return;
  
  // Ajouter le score à l'historique
  currentUser.scores.push({
    score,
    date: new Date().toISOString()
  });
  
  // Mettre à jour le meilleur score si nécessaire
  if (score > currentUser.bestScore) {
    currentUser.bestScore = score;
  }
  
  // Mettre à jour l'utilisateur dans le tableau et dans le localStorage
  const userIndex = users.findIndex(user => user.id === currentUser.id);
  if (userIndex !== -1) {
    users[userIndex] = currentUser;
    localStorage.setItem("blockbreakerUsers", JSON.stringify(users));
    localStorage.setItem("blockbreakerCurrentUser", JSON.stringify(currentUser));
  }
}

// Fonction pour vérifier si un utilisateur est connecté
function isUserLoggedIn() {
  return currentUser !== null;
}

// Fonction pour mettre à jour l'interface utilisateur
function updateUI() {
  // Récupérer les sections principales
  const authSection = document.getElementById("authSection");
  const gameSection = document.getElementById("gameSection");

  if (currentUser) {
    // Si l'utilisateur est connecté
    authSection.style.display = "none";
    gameSection.style.display = "block";
    userInfoSection.style.display = "block";
    
    userNicknameSpan.textContent = currentUser.nickname;
    userEmailSpan.textContent = currentUser.email;
    
    // Démarrer le jeu si la fonction existe
    if (typeof startGame === "function") {
      startGame();
    }
  } else {
    // Si l'utilisateur n'est pas connecté
    authSection.style.display = "block";
    gameSection.style.display = "none";
    loginSection.style.display = "block";
    registerSection.style.display = "none";
  }
}

// Initialiser l'interface au chargement
document.addEventListener("DOMContentLoaded", () => {
  // Vérifier si un utilisateur est déjà connecté
  updateUI();
  
  // Si un utilisateur est connecté, afficher un message de bienvenue
  if (currentUser) {
    messageDisplay.textContent = `Bienvenue, ${currentUser.nickname}!`;
    setTimeout(() => {
      messageDisplay.textContent = "";
    }, 2000);
  }
});

// Exposer les fonctions pour les autres modules
window.addScoreToUser = addScoreToUser;
window.isUserLoggedIn = isUserLoggedIn;
