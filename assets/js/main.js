// MAIN.JS - Le point d'entrée de l'application


// Ce fichier contrôle tous les modules


(function() {
    'use strict';
    
    console.log('Application Haut Sommet - Démarrage...');
    
    // CHARGEMENT DES MODULES
    
    
    // Les modules sont chargés dans l'ordre de dépendance
    const modules = [
        'config.js',        // 1. Configuration (pas de dépendance)
        'validation.js',    // 2. Validation (pas de dépendance)
        'email.js',         // 3. Email (dépend de config)
        'menu.js',          // 4. Menu (indépendant)
        'form.js'           // 5. Form (dépend de tout)
    ];
    
    // Fonction pour charger un script dynamiquement
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.defer = true;
            script.onload = () => {
                console.log(`Module chargé: ${src}`);
                resolve();
            };
            script.onerror = () => {
                console.error(`Erreur de chargement: ${src}`);
                reject(new Error(`Impossible de charger ${src}`));
            };
            document.head.appendChild(script);
        });
    }
    
    // Charger tous les modules séquentiellement
    async function loadAllModules() {
        try {
            for (const module of modules) {
                await loadScript(module);
            }
            console.log('Tous les modules sont chargés !');
            initApp();
        } catch (error) {
            console.error('Erreur lors du chargement des modules:', error);
            showError();
        }
    }
    
    // Initialiser l'application une fois tous les modules chargés
    function initApp() {
        console.log('🎉 Application prête !');
        
        // Vérifier que les modules essentiels sont bien chargés
        const requiredModules = [
            'EMAILJS_CONFIG',
            'validateInput',
            'validateFormData',
            'sanitizeInput',
            'sendEmail'
        ];
        
        const missingModules = requiredModules.filter(mod => !window[mod]);
        
        if (missingModules.length > 0) {
            console.error(' Modules manquants:', missingModules);
            showError();
        } else {
            console.log('Tous les modules requis sont disponibles');
        }
    }
    
    // Afficher une erreur si le chargement échoue
    function showError() {
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
        `;
        errorDiv.innerHTML = `
            <strong>Erreur de chargement</strong><br>
            Impossible de charger l'application.<br>
            Veuillez rafraîchir la page.
        `;
        document.body.appendChild(errorDiv);
    }
    
    // Démarrer le chargement des modules
    loadAllModules();
    
})();