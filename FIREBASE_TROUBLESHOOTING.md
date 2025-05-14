# Guide de dépannage Firebase pour Block Breaker

Ce guide vous aide à résoudre les problèmes courants lors de l'utilisation de Firebase dans l'application Block Breaker.

## Problème 1: Erreur "auth/configuration-not-found"

### Symptômes
- Message d'erreur: "Firebase: Error (auth/configuration-not-found)"
- L'authentification échoue systématiquement
- Impossible de s'inscrire ou de se connecter

### Causes possibles
1. **Domaine non autorisé**: Le domaine depuis lequel vous accédez à l'application n'est pas autorisé dans la configuration Firebase.
2. **Configuration Firebase incorrecte**: Les paramètres de Firebase ne sont pas correctement configurés.

### Solutions

#### 1. Ajouter le domaine aux domaines autorisés
1. Connectez-vous à la [console Firebase](https://console.firebase.google.com/project/blockbreak-b32ba)
2. Accédez à **Authentication** > **Settings** > **Authorized domains**
3. Ajoutez `localhost` et `127.0.0.1` à la liste
4. Si vous utilisez un port spécifique, ajoutez également `localhost:3000`

#### 2. Vérifier la configuration Firebase
1. Exécutez l'outil de vérification de domaine: http://localhost:3000/firebase-domain-check.html
2. Vérifiez que vous utilisez les bonnes clés API dans `firebase-config.js`

#### 3. Méthode alternative pour localhost
Si les problèmes persistent avec localhost, essayez cette méthode temporaire:
```javascript
// Dans firebase-config.js, ajoutez ces lignes avant l'initialisation de l'authentification
auth.config.emulator = {};
auth.config.authDomain = "blockbreak-b32ba.firebaseapp.com";
```

## Problème 2: Erreur lors du déploiement sur Vercel

### Symptômes
- L'authentification fonctionne localement mais pas sur vercel.app
- Vous voyez l'erreur "Firebase: Error (auth/invalid-api-key)"

### Solutions

#### 1. Vérifier les variables d'environnement
Assurez-vous que les variables d'environnement sont correctement configurées sur Vercel:

1. Accédez au tableau de bord Vercel de votre projet
2. Allez dans **Settings** > **Environment Variables**
3. Vérifiez que vous avez une variable pour la clé API Firebase:
   - Nom: `FIREBASE_API_KEY`
   - Valeur: `AIzaSyDGF6zqjC8-gObKnH7eZ7DoM-WZYwf6XXw`

#### 2. Ajouter le domaine Vercel aux domaines autorisés
1. Connectez-vous à la [console Firebase](https://console.firebase.google.com/project/blockbreak-b32ba)
2. Accédez à **Authentication** > **Settings** > **Authorized domains**
3. Ajoutez le domaine complet de votre application Vercel (exemple: `blockbreaker-123.vercel.app`)

## Problème 3: Erreurs de connexion à Firestore

### Symptômes
- L'authentification fonctionne, mais l'accès à la base de données échoue
- Message d'erreur: "Firebase: Error (permission-denied)"

### Solutions

#### 1. Vérifier les règles de sécurité Firestore
1. Accédez à la [console Firebase](https://console.firebase.google.com/project/blockbreak-b32ba)
2. Allez dans **Firestore Database** > **Rules**
3. Vérifiez que les règles permettent la lecture/écriture pour les utilisateurs authentifiés:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /leaderboard/{entry} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

#### 2. Utiliser le bon mode Firestore

Assurez-vous que vous utilisez le mode approprié (production ou test) dans vos paramètres Firebase.

## Astuces générales de dépannage

1. **Vérifiez la console du navigateur** pour des erreurs détaillées
2. **Utilisez l'outil de vérification de domaine** pour diagnostiquer les problèmes de configuration
3. **Essayez en navigation privée** pour éviter les problèmes de cache
4. **Videz le cache du navigateur** si vous avez récemment modifié la configuration Firebase
5. **Vérifiez que Firebase est correctement initialisé** dans votre code avant de l'utiliser

## Ressources supplémentaires

- [Documentation Firebase Authentication](https://firebase.google.com/docs/auth)
- [Gestion des erreurs Firebase Auth](https://firebase.google.com/docs/auth/web/errors)
- [Règles de sécurité Firestore](https://firebase.google.com/docs/firestore/security/get-started)
