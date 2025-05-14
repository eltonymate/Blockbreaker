/**
 * Serveur local simple pour tester l'application Block Breaker
 */

const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Servir les fichiers statiques du répertoire actuel
app.use(express.static(__dirname));

// Route par défaut pour servir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
  console.log(`Pour tester l'authentification, accédez à http://localhost:${port}/auth-test.html`);
  console.log(`Pour tester Firebase, accédez à http://localhost:${port}/firebase-test.html`);
  console.log(`Pour vérifier la config des domaines Firebase, accédez à http://localhost:${port}/firebase-domain-check.html`);
  console.log(`Pour jouer au jeu, accédez à http://localhost:${port}/index.html`);
  console.log(`\nAppuyez sur Ctrl+C pour arrêter le serveur`);
});