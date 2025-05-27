/**
 * firebase-config-nickname.js - Configuration Firebase pour Block Breaker (version nickname)
 * Version simplifiée sans authentification Firebase Auth
 */

// Import des fonctions Firebase nécessaires
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where,
  orderBy, 
  limit, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-analytics.js";

// Configuration de votre projet Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDGF6zqjC8-gObKnH7eZ7DoM-WZYwf6XXw",
  authDomain: "blockbreak-b32ba.firebaseapp.com",
  projectId: "blockbreak-b32ba",
  storageBucket: "blockbreak-b32ba.appspot.com",
  messagingSenderId: "41456038193",
  appId: "1:41456038193:web:40453fd5aaf12be257c010",
  measurementId: "G-3LM5BVRLDZ"
};

// Initialisation de Firebase
console.log("Initialisation de Firebase avec la configuration:", firebaseConfig);

let app, db, analytics;

try {
  app = initializeApp(firebaseConfig);
  console.log("Firebase App initialisée avec succès");
  
  try {
    analytics = getAnalytics(app);
    console.log("Firebase Analytics initialisé avec succès");
  } catch (analyticsError) {
    console.warn("Erreur lors de l'initialisation d'Analytics:", analyticsError);
    analytics = null;
  }
  
  db = getFirestore(app);
  console.log("Firebase Firestore initialisé avec succès");

  // Si tout est bien initialisé, on notifie que c'est prêt
  if (typeof window !== 'undefined' && window.onFirebaseInitialized) {
    window.onFirebaseInitialized();
  }
} catch (error) {
  console.error("Erreur critique lors de l'initialisation de Firebase:", error);
  if (typeof window !== 'undefined' && window.handleFirebaseError) {
    window.handleFirebaseError(error);
  }
}

// Export des objets Firebase pour les utiliser dans d'autres fichiers
export { 
  app, 
  db, 
  analytics,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs
};
