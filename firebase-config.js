/**
 * firebase-config.js - Configuration Firebase pour Block Breaker
 * Responsable: Personne 3 - Système d'authentification
 */

// Import des fonctions Firebase nécessaires
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  orderBy, 
  limit, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

// Configuration de votre projet Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDGF6zqjC8-gObKnH7eZ7DoM-WZYwf6XXw",
  authDomain: "blockbreak-b32ba.firebaseapp.com",
  projectId: "blockbreak-b32ba",
  storageBucket: "blockbreak-b32ba.firebasestorage.app",
  messagingSenderId: "41456038193",
  appId: "1:41456038193:web:40453fd5aaf12be257c010",
  measurementId: "G-3LM5BVRLDZ"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Export des objets Firebase pour les utiliser dans d'autres fichiers
export { 
  app, 
  auth, 
  db, 
  analytics,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  getDocs
};
