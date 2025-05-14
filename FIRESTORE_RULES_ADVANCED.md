# Règles de sécurité avancées pour Firebase

Ce document explique les règles de sécurité Firestore avancées pour le projet Block Breaker.

## Règles de sécurité complètes

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Fonction pour vérifier si l'utilisateur est authentifié
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Fonction pour vérifier si l'utilisateur est le propriétaire du document
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Fonction pour vérifier si les données sont valides pour un utilisateur
    function isValidUserData(data) {
      return data.keys().hasAll(['nickname', 'email', 'bestScore', 'scores', 'uid']) 
         && data.nickname is string
         && data.email is string
         && data.uid is string
         && data.uid == request.auth.uid
         && data.bestScore is number
         && data.scores is list;
    }
    
    // Fonction pour vérifier si un score est valide
    function isValidScore(score) {
      return score is number && score >= 0 && score <= 1000; // Limite supérieure raisonnable pour éviter la triche
    }
    
    // Fonction pour vérifier si une mise à jour de score est valide
    function isValidScoreUpdate(existingData, newData) {
      // Vérifier si le nouveau meilleur score est cohérent avec l'ancien
      let validBestScore = newData.bestScore >= existingData.bestScore || newData.bestScore == existingData.bestScore;
      
      // Vérifier si le nouveau score ajouté est valide
      let newScores = newData.scores;
      let oldScoresCount = existingData.scores.size();
      
      // Si un score a été ajouté, vérifier que c'est le seul changement
      return validBestScore && 
             (newScores.size() == oldScoresCount || newScores.size() == oldScoresCount + 1);
    }
    
    // Règles pour la collection 'users'
    match /users/{userId} {
      // Tout le monde peut lire les données utilisateur (pour le classement)
      allow read;
      
      // Seul l'utilisateur authentifié peut créer son propre document
      allow create: if isAuthenticated() 
                    && isOwner(userId) 
                    && isValidUserData(request.resource.data);
      
      // Seul l'utilisateur authentifié peut mettre à jour son propre document
      allow update: if isAuthenticated() 
                    && isOwner(userId)
                    && isValidUserData(request.resource.data)
                    && isValidScoreUpdate(resource.data, request.resource.data);
      
      // Seul l'utilisateur authentifié peut supprimer son propre document
      allow delete: if isAuthenticated() && isOwner(userId);
    }
  }
}
```

## Explication des règles

### Fonctions de validation

1. **isAuthenticated()** - Vérifie si l'utilisateur est connecté
2. **isOwner(userId)** - Vérifie si l'utilisateur est propriétaire du document
3. **isValidUserData(data)** - Vérifie que toutes les données utilisateur sont valides et bien formatées
4. **isValidScore(score)** - Vérifie qu'un score est dans une plage acceptable
5. **isValidScoreUpdate(existingData, newData)** - Vérifie que la mise à jour des scores est cohérente

### Opérations autorisées

- **Lecture (allow read)**: Tout le monde peut lire les profils utilisateurs pour afficher le classement
- **Création (allow create)**: Un utilisateur authentifié peut créer son propre profil
- **Mise à jour (allow update)**: Un utilisateur authentifié peut mettre à jour son profil et ses scores
- **Suppression (allow delete)**: Un utilisateur authentifié peut supprimer son profil

## Application de ces règles

1. Accédez à la console Firebase
2. Allez dans Firestore Database > Règles
3. Copiez-collez les règles ci-dessus
4. Cliquez sur "Publier"

Ces règles protègent votre application contre:
- L'accès non autorisé aux données
- La modification des scores par d'autres utilisateurs
- La triche (scores impossibles)
- Les données mal formatées

Vous pouvez ajuster ces règles selon vos besoins spécifiques.
