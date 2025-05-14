# Configuration de localhost pour Firebase

Pour que Firebase Authentication fonctionne correctement en local, vous devez ajouter `localhost` à la liste des domaines autorisés dans votre projet Firebase.

## Étapes pour ajouter localhost à Firebase Authentication

1. Connectez-vous à la [console Firebase](https://console.firebase.google.com/project/blockbreak-b32ba)
2. Sélectionnez votre projet **blockbreak-b32ba**
3. Dans le menu de gauche, cliquez sur **Authentication**
4. Allez dans l'onglet **Settings** (Paramètres)
5. Faites défiler jusqu'à la section **Authorized domains** (Domaines autorisés)
6. Cliquez sur **Add domain** (Ajouter un domaine)
7. Ajoutez les domaines suivants :
   - `localhost`
   - `127.0.0.1`
8. Cliquez sur **Ajouter**

## Vérification de la configuration

Nous avons créé un outil spécial pour vérifier que votre configuration Firebase est correcte :

1. Démarrez le serveur local avec `npm start`
2. Ouvrez la page de vérification : [http://localhost:3000/firebase-domain-check.html](http://localhost:3000/firebase-domain-check.html)
3. Cliquez sur le bouton "Vérifier la configuration Firebase"
4. Lisez les résultats pour déterminer si la configuration est correcte

Si vous préférez tester directement l'authentification :

1. Ouvrez la page de test d'authentification: [http://localhost:3000/auth-test.html](http://localhost:3000/auth-test.html)
2. Essayez de vous inscrire avec un nouvel email
3. Si l'opération réussit, vous verrez un message de succès

## Erreurs courantes et solutions

### Erreur "auth/configuration-not-found"

Cette erreur se produit lorsque vous utilisez Firebase Authentication depuis un domaine non autorisé.

**Solution :** 
- Vérifiez que `localhost` et `127.0.0.1` sont bien dans la liste des domaines autorisés
- Si vous utilisez un port autre que la valeur par défaut, vous devrez peut-être ajouter explicitement `localhost:VOTRE_PORT`
- Après avoir ajouté les domaines, attendez quelques minutes pour que les changements soient appliqués
- Videz le cache de votre navigateur et réessayez

### Erreur "Firebase: Error (auth/network-request-failed)"

Cette erreur peut indiquer un problème de connexion réseau ou des restrictions de pare-feu.

**Solution :**
- Vérifiez votre connexion Internet
- Désactivez temporairement les logiciels de sécurité qui pourraient bloquer les connexions
- Essayez un autre navigateur

## Remarques importantes

- Les domaines autorisés doivent être ajoutés manuellement pour chaque projet Firebase
- Dans certaines configurations, il peut être nécessaire d'ajouter également `localhost:3000` (avec le port) comme domaine autorisé
- Les modifications des paramètres Firebase peuvent prendre quelques minutes pour être effectives
