// ============================================
// CHARGEMENT DE TOUS LES MODULES
// ============================================
// J'ai créé un système de chargement asynchrone des modules
// dans le bon ordre pour garantir que toutes les dépendances sont respectées

(function() {
    'use strict';
    
    console.log('Application Haut Sommet : démarrage...');
    
    // ============================================
    // ORDRE DE CHARGEMENT DES MODULES
    // ============================================
    // Je définis l'ordre de chargement des modules
    // L'ordre est important car certains modules dépendent d'autres
    const modules = [
        './assets/js/modules/config.js',      // Je charge d'abord la configuration
        './assets/js/modules/validation.js',  // Puis la validation 
        './assets/js/modules/email.js',       // L'envoi d'email 
        './assets/js/modules/sms.js',         // L'envoi de SMS 
        './assets/js/modules/menu.js',        // Le menu de navigation
        './assets/js/modules/form.js',        // Le formulaire 
        './assets/js/modules/faq.js'          // La FAQ 
    ];
    
    // ============================================
    // FONCTION DE CHARGEMENT D'UN SCRIPT
    // ============================================
    // Je charge un script de manière dynamique et asynchrone
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            // Je crée un nouvel élément script
            const script = document.createElement('script');
            script.src = src;
            script.defer = true;
            
            // Je gère le succès du chargement
            script.onload = () => {
                console.log(`Module chargé : ${src}`);
                resolve();
            };
            
            // Je gère les erreurs de chargement
            script.onerror = () => {
                console.error(`Erreur de chargement : ${src}`);
                reject(new Error(`Impossible de charger ${src}`));
            };
            
            // J'ajoute le script au head
            document.head.appendChild(script);
        });
    }
    
    // ============================================
    // CHARGEMENT SÉQUENTIEL DES MODULES
    // ============================================
    // Je charge tous les modules l'un après l'autre
    async function loadAllModules() {
        try {
            // Je charge chaque module dans l'ordre défini
            for (const module of modules) {
                await loadScript(module);
                // J'attends un petit peu entre chaque module pour éviter les problèmes
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            
            console.log(' Tous les modules sont chargés.');
            
            // J'initialise l'application
            initApp();
            
        } catch (error) {
            console.error('Erreur lors du chargement des modules :', error);
            showError();
        }
    }
    
    // ============================================
    // VÉRIFICATION DE L'APPLICATION
    // ============================================
    // Je vérifie que l'application est prête et que tous les modules sont disponibles
    function initApp() {
        console.log('Vérification de l\'application...');
        
        // Je vérifie que tous les modules essentiels sont disponibles
        const requiredModules = [
            'EMAILJS_CONFIG',
            'validateInput',
            'validateFormData',
            'sanitizeInput',
            'sendEmail'
        ];
        
        // Je filtre les modules manquants
        const missingModules = requiredModules.filter(mod => !window[mod]);
        
        // Je vérifie s'il manque des modules
        if (missingModules.length > 0) {
            console.error('Modules manquants :', missingModules);
            showError();
            return;
        }
        
        console.log(' Tous les modules requis sont disponibles.');
        console.log('Application prête.');
        
        // J'ajoute une classe au body pour indiquer que tout est chargé
        document.body.classList.add('app-ready');
        
        // J'anime l'apparition du contenu
        document.querySelectorAll('.fade-in-up').forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // ============================================
    // AFFICHAGE D'UNE ERREUR
    // ============================================
    // J'affiche une erreur si le chargement échoue
    function showError() {
        // Je crée un div d'erreur
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 20px;
            border-radius: 8px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;
        errorDiv.innerHTML = `
            <strong style="display: block; margin-bottom: 10px;">⚠ Erreur de chargement</strong>
            <p style="margin: 0; font-size: 14px;">
                Impossible de charger l'application.<br>
                Veuillez rafraîchir la page.
            </p>
            <button onclick="location.reload()" style="
                margin-top: 15px;
                padding: 8px 16px;
                background: white;
                color: #dc3545;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
            ">
                Rafraîchir
            </button>
        `;
        
        // J'ajoute l'animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        
        // J'ajoute l'erreur au body
        document.body.appendChild(errorDiv);
        
        console.error('Interface d\'erreur affichée');
    }
    
    // ============================================
    // DÉMARRAGE DE L'APPLICATION
    // ============================================
    // Je démarre le chargement des modules
    console.log('Démarrage du chargement des modules...');
    loadAllModules();
    
})();