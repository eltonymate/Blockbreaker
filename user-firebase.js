/**
 * user-firebase.js - Gestion des utilisateurs avec Firebase pour Block Breaker
 * Responsable: Personne 3 - Système d'authentification
 */

import { 
  auth, 
  db, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs
} from './firebase-config.js';

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
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const registerNickname = document.getElementById("registerNickname");
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");
const backToGameBtn = document.getElementById("backToGameBtn");

const userNicknameSpan = document.getElementById("userNickname");
const userEmailSpan = document.getElementById("userEmail");
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

// Inscription d'un nouvel utilisateur
registerBtn.addEventListener("click", async () => {
  const nickname = registerNickname.value.trim();
  const email = registerEmail.value.trim();
  const password = registerPassword.value;
  
  if (!nickname || !email || !password) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  try {
    console.log("Début de l'inscription pour:", email);
    
    // Vérifier si Firebase est initialisé correctement
    if (!auth) {
      throw new Error("Firebase Auth n'est pas initialisé correctement");
    }
    
    // Vérifier si le nickname est déjà utilisé
    try {
      const nicknameQuery = query(collection(db, "users"));
      const querySnapshot = await getDocs(nicknameQuery);
      const isNicknameExists = querySnapshot.docs.some(
        doc => doc.data().nickname === nickname
      );
      
      if (isNicknameExists) {
        alert("Ce nickname est déjà utilisé");
        return;
      }
    } catch (dbError) {
      console.error("Erreur lors de la vérification du nickname:", dbError);
      // Continuer l'inscription même si la vérification échoue
    }
    
    // Créer le compte dans Firebase Auth
    console.log("Tentative de création du compte...");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Compte créé avec succès:", user.uid);
    
    // Créer un document utilisateur dans Firestore
    try {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        nickname: nickname,
        email: email,
        bestScore: 0,
        scores: []
      });
      console.log("Document utilisateur créé dans Firestore");
    } catch (firestoreError) {
      console.error("Erreur lors de la création du document Firestore:", firestoreError);
      // L'utilisateur est déjà créé, donc on continue sans bloquer
    }
    
    alert("Inscription réussie !");
  } catch (error) {
    console.error("Erreur détaillée lors de l'inscription:", error);
    
    // Afficher l'erreur dans l'UI si la fonction existe
    if (window.handleFirebaseError) {
      window.handleFirebaseError(error);
    }
    
    if (error.code === 'auth/email-already-in-use') {
      alert("Cet email est déjà utilisé");
    } else if (error.code === 'auth/invalid-email') {
      alert("Format d'email invalide");
    } else if (error.code === 'auth/weak-password') {
      alert("Le mot de passe est trop faible (minimum 6 caractères)");
    } else if (error.code === 'auth/network-request-failed') {
      alert("Problème de connexion réseau. Vérifiez votre connexion internet.");
    } else if (error.code === 'auth/configuration-not-found') {
      alert("Erreur de configuration Firebase. Veuillez réessayer plus tard.");
    } else {
      alert("Erreur lors de l'inscription: " + error.message);
    }
  }
});

// Connexion d'un utilisateur
loginBtn.addEventListener("click", async () => {
  const email = loginEmail.value.trim();
  const password = loginPassword.value;
  
  if (!email || !password) {
    alert("Veuillez remplir tous les champs");
    return;
  }
  
  try {
    console.log("Tentative de connexion pour:", email);
    
    if (!auth) {
      throw new Error("Firebase Auth n'est pas initialisé correctement");
    }
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Connexion réussie:", userCredential.user.uid);
  } catch (error) {
    console.error("Erreur détaillée lors de la connexion:", error);
    
    // Afficher l'erreur dans l'UI si la fonction existe
    if (window.handleFirebaseError) {
      window.handleFirebaseError(error);
    }
    
    if (error.code === 'auth/user-not-found') {
      alert("Aucun compte ne correspond à cet email");
    } else if (error.code === 'auth/wrong-password') {
      alert("Mot de passe incorrect");
    } else if (error.code === 'auth/invalid-email') {
      alert("Format d'email invalide");
    } else if (error.code === 'auth/configuration-not-found') {
      alert("Erreur de configuration Firebase. Veuillez réessayer plus tard.");
    } else {
      alert("Identifiants incorrects ou problème de connexion");
    }
  }
});

// Déconnexion
logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    alert("Vous avez été déconnecté");
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
  }
});

// Observer les changements d'état d'authentification
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Utilisateur connecté
    try {
      // Récupérer les données utilisateur depuis Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        currentUser = userDoc.data();
        updateUI(true);
        
        // Mettre à jour l'affichage du meilleur score
        bestScoreValueSpan.textContent = currentUser.bestScore;
        
        // Charger le classement
        loadLeaderboard();
      } else {
        console.error("Document utilisateur non trouvé!");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  } else {
    // Utilisateur déconnecté
    currentUser = null;
    updateUI(false);
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
    userEmailSpan.textContent = currentUser.email;
    
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
  if (!currentUser || !auth.currentUser) return;
  
  try {
    // Référence au document utilisateur
    const userRef = doc(db, "users", auth.currentUser.uid);
    
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
window.isUserLoggedIn = () => auth.currentUser !== null;
