/**
 * user-firebase-nickname.js - Gestion des utilisateurs avec Firebase par nickname pour Block Breaker
 * Version simplifiée avec authentification par nickname uniquement
 */

import { 
  db,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from './firebase-config-nickname.js';

// Éléments du DOM pour la gestion utilisateur
const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");
const userInfoSection = document.getElementById("userInfoSection");
const gameSection = document.getElementById("gameSection");
const authSection = document.getElementById("authSection");
const leaderboardSection = document.getElementById("leaderboardSection");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginNickname = document.getElementById("loginNickname");
const loginPassword = document.getElementById("loginPassword");
const registerNickname = document.getElementById("registerNickname");
const registerPassword = document.getElementById("registerPassword");

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");
const backToGameBtn = document.getElementById("backToGameBtn");

const userNicknameSpan = document.getElementById("userNickname");
const bestScoreValueSpan = document.getElementById("bestScoreValue");
const leaderboardBody = document.getElementById("leaderboardBody");

const showRegisterLink = document.getElementById("showRegisterLink");
const showLoginLink = document.getElementById("showLoginLink");
const messageDisplay = document.getElementById("message");

// État actuel de l'utilisateur
let currentUser = null;

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

// Bouton retour au jeu depuis le classement
backToGameBtn.addEventListener("click", () => {
  leaderboardSection.style.display = "none";
  gameSection.style.display = "block";
});

// Fonction pour générer un ID unique
function generateUniqueId() {
  return 'uid_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

// Inscription d'un nouvel utilisateur
registerBtn.addEventListener("click", async () => {
  const nickname = registerNickname.value.trim();
  const password = registerPassword.value;
  
  if (!nickname || !password) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  try {
    console.log("Début de l'inscription pour:", nickname);
    
    // Vérifier si Firebase est initialisé correctement
    if (!db) {
      throw new Error("Firebase DB n'est pas initialisé correctement");
    }
    
    // Vérifier si le nickname est déjà utilisé
    try {
      const usersRef = collection(db, "users");
      const nicknameQuery = query(usersRef, where("nickname", "==", nickname));
      const querySnapshot = await getDocs(nicknameQuery);
      
      if (!querySnapshot.empty) {
        alert("Ce nickname est déjà utilisé");
        return;
      }
    } catch (dbError) {
      console.error("Erreur lors de la vérification du nickname:", dbError);
      alert("Erreur lors de la vérification du nickname");
      return;
    }
    
    // Générer un ID utilisateur unique
    const userId = generateUniqueId();
    
    // Créer un document utilisateur dans Firestore
    try {
      await setDoc(doc(db, "users", userId), {
        uid: userId,
        nickname: nickname,
        password: password, // Note: Dans un système réel, il faudrait hasher le mot de passe
        bestScore: 0,
        scores: []
      });
      console.log("Document utilisateur créé dans Firestore");
      
      // Connecter automatiquement l'utilisateur
      currentUser = {
        uid: userId,
        nickname: nickname,
        bestScore: 0,
        scores: []
      };
      
      // Enregistrer l'ID de l'utilisateur dans le localStorage pour la "session"
      localStorage.setItem('currentUserId', userId);
      
      updateUI(true);
      alert("Inscription réussie !");
    } catch (firestoreError) {
      console.error("Erreur lors de la création du document Firestore:", firestoreError);
      alert("Erreur lors de l'inscription");
    }
  } catch (error) {
    console.error("Erreur détaillée lors de l'inscription:", error);
    
    // Afficher l'erreur dans l'UI si la fonction existe
    if (window.handleFirebaseError) {
      window.handleFirebaseError(error);
    } else {
      alert("Erreur lors de l'inscription: " + error.message);
    }
  }
});

// Connexion d'un utilisateur
loginBtn.addEventListener("click", async () => {
  const nickname = loginNickname.value.trim();
  const password = loginPassword.value;
  
  if (!nickname || !password) {
    alert("Veuillez remplir tous les champs");
    return;
  }
  
  try {
    console.log("Tentative de connexion pour:", nickname);
    
    if (!db) {
      throw new Error("Firebase DB n'est pas initialisé correctement");
    }
    
    // Rechercher l'utilisateur par nickname
    const usersRef = collection(db, "users");
    const nicknameQuery = query(usersRef, where("nickname", "==", nickname));
    const querySnapshot = await getDocs(nicknameQuery);
    
    if (querySnapshot.empty) {
      alert("Aucun compte ne correspond à ce nickname");
      return;
    }
    
    // Vérifier le mot de passe
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    
    if (userData.password !== password) {
      alert("Mot de passe incorrect");
      return;
    }
    
    // Utilisateur authentifié
    currentUser = userData;
    
    // Enregistrer l'ID de l'utilisateur dans le localStorage pour la "session"
    localStorage.setItem('currentUserId', userData.uid);
    
    console.log("Connexion réussie:", userData.uid);
    updateUI(true);
  } catch (error) {
    console.error("Erreur détaillée lors de la connexion:", error);
    
    // Afficher l'erreur dans l'UI si la fonction existe
    if (window.handleFirebaseError) {
      window.handleFirebaseError(error);
    } else {
      alert("Erreur lors de la connexion: " + error.message);
    }
  }
});

// Déconnexion
logoutBtn.addEventListener("click", async () => {
  try {
    currentUser = null;
    localStorage.removeItem('currentUserId');
    updateUI(false);
    alert("Vous avez été déconnecté");
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
  }
});

// Vérifier si l'utilisateur est déjà connecté au chargement de la page
window.addEventListener('DOMContentLoaded', async () => {
  const userId = localStorage.getItem('currentUserId');
  
  if (userId) {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      
      if (userDoc.exists()) {
        currentUser = userDoc.data();
        updateUI(true);
        
        // Mettre à jour l'affichage du meilleur score
        bestScoreValueSpan.textContent = currentUser.bestScore;
        
        // Charger le classement
        loadLeaderboard();
      } else {
        // Document utilisateur non trouvé, déconnecter
        localStorage.removeItem('currentUserId');
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  }
});

// Fonction pour mettre à jour l'interface utilisateur
function updateUI(isLoggedIn) {
  if (isLoggedIn && currentUser) {
    // Si l'utilisateur est connecté
    authSection.style.display = "none";
    gameSection.style.display = "block";
    leaderboardSection.style.display = "none";
    
    userNicknameSpan.textContent = currentUser.nickname;
    
    // Afficher un message de bienvenue
    messageDisplay.textContent = `Bienvenue, ${currentUser.nickname}!`;
    setTimeout(() => {
      messageDisplay.textContent = "";
    }, 2000);
    
    // Démarrer le jeu si la fonction existe
    if (typeof window.initGame === "function") {
      window.initGame();
    }
  } else {
    // Si l'utilisateur n'est pas connecté
    authSection.style.display = "block";
    gameSection.style.display = "none";
    leaderboardSection.style.display = "none";
    loginSection.style.display = "block";
    registerSection.style.display = "none";
  }
}

// Fonction pour ajouter un score à l'utilisateur connecté
async function addScoreToUser(score) {
  if (!currentUser) return;
  
  try {
    // Référence au document utilisateur
    const userRef = doc(db, "users", currentUser.uid);
    
    // Structure du score
    const newScore = {
      score: score,
      date: new Date().toISOString()
    };
    
    // Récupérer les données actuelles
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const scores = userData.scores || [];
      
      // Mettre à jour les scores
      scores.push(newScore);
      
      // Mettre à jour le meilleur score si nécessaire
      const bestScore = Math.max(userData.bestScore || 0, score);
      
      // Mettre à jour le document dans Firestore
      await updateDoc(userRef, {
        scores: scores,
        bestScore: bestScore
      });
      
      // Mettre à jour l'affichage
      bestScoreValueSpan.textContent = bestScore;
      
      // Mettre à jour currentUser
      currentUser.scores = scores;
      currentUser.bestScore = bestScore;
      
      // Recharger le classement
      loadLeaderboard();
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout du score:", error);
  }
}

// Fonction pour charger le classement
async function loadLeaderboard() {
  try {
    // Créer une requête pour les 10 meilleurs scores
    const leaderboardQuery = query(
      collection(db, "users"),
      orderBy("bestScore", "desc"),
      limit(10)
    );
    
    // Récupérer les résultats
    const querySnapshot = await getDocs(leaderboardQuery);
    
    // Vider le tableau
    leaderboardBody.innerHTML = "";
    
    // Remplir avec les nouveaux résultats
    let rank = 1;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const row = document.createElement("tr");
      
      // Mettre en évidence l'utilisateur actuel
      if (currentUser && data.uid === currentUser.uid) {
        row.classList.add("current-user");
      }
      
      row.innerHTML = `
        <td>${rank}</td>
        <td>${data.nickname}</td>
        <td>${data.bestScore}</td>
      `;
      
      leaderboardBody.appendChild(row);
      rank++;
    });
  } catch (error) {
    console.error("Erreur lors du chargement du classement:", error);
  }
}

// Ajouter les boutons pour afficher le classement
const showLeaderboardBtn = document.createElement("button");
showLeaderboardBtn.id = "showLeaderboardBtn";
showLeaderboardBtn.textContent = "Voir le classement";
showLeaderboardBtn.addEventListener("click", () => {
  gameSection.style.display = "none";
  leaderboardSection.style.display = "block";
  loadLeaderboard();
});

// Ajouter le bouton au DOM
document.getElementById("userInfoSection").appendChild(showLeaderboardBtn);

// Exporter les fonctions pour les autres modules
window.addScoreToUser = addScoreToUser;
window.isUserLoggedIn = () => currentUser !== null;
