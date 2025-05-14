console.log("Vérification de votre configuration Firebase pour blockbreaker-two.vercel.app");

// Domaine à vérifier
const domainToCheck = "blockbreaker-two.vercel.app";

// Vos paramètres Firebase actuels
const currentConfig = {
  apiKey: "AIzaSyDGF6zqjC8-gObKnH7eZ7DoM-WZYwf6XXw",
  authDomain: "blockbreak-b32ba.firebaseapp.com",
  projectId: "blockbreak-b32ba",
  storageBucket: "blockbreak-b32ba.appspot.com",
  messagingSenderId: "41456038193",
  appId: "1:41456038193:web:40453fd5aaf12be257c010",
  measurementId: "G-3LM5BVRLDZ"
};

console.log("\n--- VÉRIFICATION DE LA CONFIGURATION ---");
console.log(`Auth domain actuel: ${currentConfig.authDomain}`);
console.log(`Domaine du site: ${domainToCheck}`);

console.log("\n--- RECOMMANDATIONS ---");
console.log(`1. Accédez à la console Firebase pour votre projet "blockbreak-b32ba"`);
console.log(`2. Allez dans Authentication > Settings > Authorized domains`);
console.log(`3. Ajoutez "${domainToCheck}" à la liste des domaines autorisés`);
console.log(`4. Vérifiez également dans Project Settings > Your Apps > Domain configuration`);

console.log("\n--- VÉRIFICATION DE CORS ---");
console.log(`Si vous avez des erreurs CORS, allez dans:`);
console.log(`1. Firestore > Rules`);
console.log(`2. Storage > Rules`);
console.log(`Et vérifiez que vos règles autorisent les requêtes depuis ${domainToCheck}`);

console.log("\n--- VÉRIFICATIONS SUPPLÉMENTAIRES ---");
console.log("- Assurez-vous que l'authentification par email/mot de passe est bien activée");
console.log("- Vérifiez que votre application est bien déployée avec la bonne configuration Firebase");
console.log("- Vérifiez la console du navigateur pour les messages d'erreur spécifiques");

console.log("\n--- DOCUMENTATION ---");
console.log("Pour plus d'informations, consultez:");
console.log("https://firebase.google.com/docs/auth/web/cordova");
console.log("https://firebase.google.com/docs/hosting/custom-domain");
