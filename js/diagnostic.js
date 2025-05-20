/**
 * Fonction de diagnostic pour le jeu Block Breaker
 * Cette fonction aide à identifier les erreurs dans la console
 */

// Écouteur d'erreurs JavaScript
window.addEventListener('error', function(event) {
  const errorDiv = document.createElement('div');
  errorDiv.style.position = 'fixed';
  errorDiv.style.bottom = '10px';
  errorDiv.style.left = '10px';
  errorDiv.style.padding = '10px';
  errorDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
  errorDiv.style.color = 'white';
  errorDiv.style.borderRadius = '5px';
  errorDiv.style.zIndex = '9999';
  errorDiv.textContent = `Erreur: ${event.message} (${event.filename})`;
  document.body.appendChild(errorDiv);
  
  console.error('Erreur détectée:', event.message);
  console.error('Fichier source:', event.filename);
  console.error('Ligne:', event.lineno);
  console.error('Colonne:', event.colno);
  console.error('Objet d\'erreur:', event.error);
  
  return false;
});

// Vérifie l'état de chargement des fichiers JavaScript
function checkScriptLoading() {
  const scripts = document.querySelectorAll('script');
  console.log('--- Diagnostic des scripts ---');
  
  scripts.forEach(script => {
    const src = script.src || 'Script inline';
    console.log(`Script: ${src} - ${script.async ? 'async' : 'sync'}`);
  });
}

// Vérifie si les éléments essentiels du DOM existent
function checkDomElements() {
  console.log('--- Diagnostic des éléments DOM ---');
  const essentialElements = [
    'gameCanvas',
    'scoreBoard',
    'gameInfo',
    'lives',
    'level',
    'message',
    'restartBtn'
  ];
  
  essentialElements.forEach(id => {
    const element = document.getElementById(id);
    console.log(`Élément #${id}: ${element ? 'Trouvé' : 'MANQUANT'}`);
  });
}

// Vérifie si les variables globales importantes existent
function checkGlobalVariables() {
  console.log('--- Diagnostic des variables globales ---');
  const globals = [
    'startGame', 
    'getScore', 
    'firebaseInitialized',
    'onFirebaseInitialized'
  ];
  
  globals.forEach(varName => {
    console.log(`Variable '${varName}': ${typeof window[varName] !== 'undefined' ? 'Définie' : 'NON DÉFINIE'}`);
  });
}

// Exécute tous les tests de diagnostic
function runAllDiagnostics() {
  console.log('=== DIAGNOSTICS BLOCK BREAKER ===');
  checkScriptLoading();
  checkDomElements();
  checkGlobalVariables();
  console.log('=== FIN DES DIAGNOSTICS ===');
}

// Exécuter les diagnostics lorsque la page est chargée
window.addEventListener('load', runAllDiagnostics);

console.log('Diagnostic Block Breaker chargé avec succès');
