/**
 * firebase-domain-check.js - Utilitaire pour vérifier la configuration des domaines Firebase
 */

// Import des fonctions Firebase
import { auth } from './firebase-config.js';

/**
 * Vérifie la configuration Firebase pour l'authentification locale
 */
async function checkFirebaseSetup() {
    const results = document.getElementById('results');
    const addLogEntry = (message, type = 'info') => {
        const logItem = document.createElement('div');
        logItem.className = `log ${type}`;
        logItem.textContent = message;
        results.appendChild(logItem);
    };

    try {
        // Vérifier si l'objet auth est correctement initialisé
        if (!auth) {
            addLogEntry('❌ Erreur: L\'objet auth Firebase n\'est pas initialisé', 'error');
            return;
        }

        addLogEntry('✅ Firebase Auth est correctement initialisé');
        
        // Vérifier le domaine actuel
        const currentDomain = window.location.hostname;
        addLogEntry(`📌 Domaine actuel: ${currentDomain}`);
        
        // Vérifier si nous sommes sur localhost
        if (currentDomain === 'localhost' || currentDomain === '127.0.0.1') {
            addLogEntry('📌 Vous utilisez un domaine local. Assurez-vous que ce domaine est ajouté à la liste des domaines autorisés dans la console Firebase.');
        }
        
        // Vérifier les paramètres de configuration Firebase
        const authDomain = auth.config?.authDomain || 'Non disponible';
        addLogEntry(`📌 Domaine d'authentification Firebase configuré: ${authDomain}`);

        // Test de fonctionnalité simple (vérification de l'état d'authentification)
        addLogEntry('🔍 Test des fonctionnalités d\'authentification...');
        
        const getCurrentUser = () => {
            return new Promise((resolve) => {
                const unsubscribe = auth.onAuthStateChanged(user => {
                    unsubscribe();
                    resolve(user);
                });
            });
        };

        const currentUser = await getCurrentUser();
        
        if (currentUser) {
            addLogEntry(`✅ Utilisateur actuellement connecté: ${currentUser.email}`, 'success');
        } else {
            addLogEntry('ℹ️ Aucun utilisateur connecté actuellement');
        }

        addLogEntry('✅ Test terminé avec succès', 'success');
    } catch (error) {
        addLogEntry(`❌ Erreur lors du test: ${error.message} (code: ${error.code})`, 'error');
        
        // Vérifications spécifiques pour les erreurs courantes
        if (error.code === 'auth/configuration-not-found') {
            addLogEntry(`⚠️ L'erreur "auth/configuration-not-found" indique que le domaine actuel n'est pas autorisé dans Firebase.`, 'error');
            addLogEntry(`📝 Solution: Ajoutez "${window.location.hostname}" à la liste des domaines autorisés dans la console Firebase.`, 'info');
        }
    }
}

// Exporter les fonctions pour utilisation dans la page HTML
window.checkFirebaseSetup = checkFirebaseSetup;
