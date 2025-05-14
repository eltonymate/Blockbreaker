# Guide pour tester Block Breaker en local

Ce guide explique comment tester l'application Block Breaker sur votre machine locale.

## Prérequis

- [Node.js](https://nodejs.org/) installé sur votre machine
- Un terminal (PowerShell ou ligne de commande Windows)

## Installation

1. Ouvrez un terminal (PowerShell) dans le dossier du projet (C:\Users\Scuola\OneDrive - HESSO\Bureau\MEGA CLOUD\Blockbreaker)

2. Installez les dépendances nécessaires :

```powershell
npm install
```

Cette commande va installer Express, qui est nécessaire pour le serveur local.

## Lancement du serveur local

Pour démarrer le serveur local :

```powershell
npm start
```

ou 

```powershell
node server.js
```

Le serveur va démarrer et vous verrez un message comme celui-ci :

```
Serveur en écoute sur http://localhost:3000
Pour tester l'authentification, accédez à http://localhost:3000/auth-test.html
Pour tester Firebase, accédez à http://localhost:3000/firebase-test.html
Pour jouer au jeu, accédez à http://localhost:3000/index.html
```

## Accès à l'application

Ouvrez votre navigateur et accédez à l'une des adresses suivantes :

- **Jeu principal** : [http://localhost:3000](http://localhost:3000) ou [http://localhost:3000/index.html](http://localhost:3000/index.html) 
- **Test d'authentification** : [http://localhost:3000/auth-test.html](http://localhost:3000/auth-test.html)
- **Test de Firebase** : [http://localhost:3000/firebase-test.html](http://localhost:3000/firebase-test.html)
- **Vérification des domaines Firebase** : [http://localhost:3000/firebase-domain-check.html](http://localhost:3000/firebase-domain-check.html) (NOUVEAU)

## Test des fonctionnalités

### Vérification de la configuration Firebase

Avant de tester l'authentification, il est important de vérifier que Firebase est correctement configuré pour fonctionner avec localhost :

1. Accédez à [http://localhost:3000/firebase-domain-check.html](http://localhost:3000/firebase-domain-check.html)
2. Cliquez sur le bouton "Vérifier la configuration Firebase"
3. Lisez les résultats et suivez les instructions si des erreurs sont détectées

### Test de l'authentification

Une fois la configuration vérifiée, utilisez la page auth-test.html pour tester les fonctionnalités d'authentification :

1. Accédez à [http://localhost:3000/auth-test.html](http://localhost:3000/auth-test.html)
2. Essayez de vous inscrire avec un email et un mot de passe
3. Si l'inscription réussit, essayez de vous déconnecter
4. Reconnectez-vous avec les mêmes identifiants

### Test du jeu complet

Accédez à la page principale (index.html) pour tester le jeu avec l'authentification :

1. Inscrivez-vous ou connectez-vous
2. Jouez au jeu Block Breaker
3. Vérifiez que votre score est bien enregistré

## Résolution des problèmes

### Erreur "auth/configuration-not-found"

Si vous obtenez cette erreur :

1. Vérifiez que vous utilisez bien le serveur local (http://localhost:3000) et non le protocole file://
2. Assurez-vous que localhost:3000 est ajouté aux domaines autorisés dans la console Firebase

### Erreurs CORS

Si vous rencontrez des erreurs CORS :

1. Vérifiez que vous exécutez bien l'application depuis le serveur local
2. Assurez-vous que vos règles Firestore permettent les requêtes depuis localhost

## Arrêt du serveur

Pour arrêter le serveur, appuyez sur `Ctrl+C` dans le terminal.
