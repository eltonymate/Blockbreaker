# Configuration de Firebase pour Block Breaker

Pour utiliser ce jeu avec Firebase, suivez les étapes ci-dessous:

## 1. Créer un projet Firebase

1. Allez sur [console.firebase.google.com](https://console.firebase.google.com/)
2. Cliquez sur "Ajouter un projet"
3. Nommez-le (ex: "block-breaker") et suivez les instructions

## 2. Activer Firebase Authentication

1. Dans la console Firebase, allez à "Authentication" 
2. Cliquez sur "Commencer"
3. Activez la méthode "Email/Mot de passe"

## 3. Créer une base de données Firestore

1. Allez à "Firestore Database"
2. Cliquez sur "Créer une base de données"
3. Choisissez le mode "production" ou "test"
4. Sélectionnez l'emplacement le plus proche de vos joueurs

## 4. Configurer les règles de sécurité Firestore

Utilisez ces règles de base pour Firestore:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Autoriser l'accès en lecture au classement pour tout le monde
    match /users/{userId} {
      allow read;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Règles de sécurité pour votre projet spécifique

Pour votre projet **blockbreak-b32ba**, connectez-vous à la console Firebase à cette adresse:
[https://console.firebase.google.com/project/blockbreak-b32ba](https://console.firebase.google.com/project/blockbreak-b32ba)

Voici comment ajouter les règles de sécurité:

1. Accédez à **Firestore Database** dans le menu de gauche
2. Cliquez sur l'onglet **Règles**
3. Copiez-collez le code de règles ci-dessus
4. Cliquez sur **Publier**

## 5. Obtenir la configuration Firebase

1. Cliquez sur l'icône ⚙️ (paramètres) puis "Paramètres du projet"
2. Allez à l'onglet "Général"
3. Faites défiler jusqu'à "Vos applications" et cliquez sur l'icône Web (</>) 
4. Suivez les étapes et copiez l'objet de configuration

## 6. Mettre à jour le fichier firebase-config.js

Ouvrez le fichier `firebase-config.js` et remplacez l'objet `firebaseConfig` par celui que vous avez copié:

```javascript
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_PROJECT_ID.firebaseapp.com",
  projectId: "VOTRE_PROJECT_ID",
  storageBucket: "VOTRE_PROJECT_ID.appspot.com",
  messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
  appId: "VOTRE_APP_ID"
};
```

## 7. Tester l'application

Ouvrez le fichier index.html dans un navigateur et vérifiez que:
- L'inscription et la connexion fonctionnent
- Les scores sont sauvegardés
- Le classement est mis à jour

## Structure de la base de données

La base de données Firestore contient une collection "users" avec les documents suivants:

```
users/{userId}
  - uid: string
  - nickname: string
  - email: string
  - bestScore: number
  - scores: array
    - score: number
    - date: string (ISO format)
```

## Résolution des problèmes courants

- **Erreur CORS**: Utilisez un serveur local comme Live Server pour tester
- **Authentification refusée**: Vérifiez que l'authentification par email est activée
- **Erreur Firestore**: Assurez-vous que les règles de sécurité sont correctement configurées
