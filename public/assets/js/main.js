// Chargement de tous les modules dans le bon ordre
(function() {
    'use strict';
    
    console.log('Application Haut Sommet : démarrage...');
    
    // Je définis l'ordre de chargement des modules
    const modules = [
        './assets/js/modules/config.js',
        './assets/js/modules/validation.js',
        './assets/js/modules/email.js',
        './assets/js/modules/menu.js',
        './assets/js/modules/form.js',
        './assets/js/modules/faq.js'
    ];
    
    // Je charge un script de manière dynamique
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.defer = true;
            script.onload = () => {
                console.log(`Module chargé : ${src}`);
                resolve();
            };
            script.onerror = () => {
                console.error(`Erreur de chargement : ${src}`);
                reject(new Error(`Impossible de charger ${src}`));
            };
            document.head.appendChild(script);
        });
    }
    
    // Je charge tous les modules l'un après l'autre
    async function loadAllModules() {
        try {
            for (const module of modules) {
                await loadScript(module);
            }
            console.log('Tous les modules sont chargés.');
            initApp();
        } catch (error) {
            console.error('Erreur lors du chargement des modules :', error);
            showError();
        }
    }
    
    // Je vérifie que l'application est prête
    function initApp() {
        console.log('Application prête.');
        
        // Je vérifie que tous les modules essentiels sont disponibles
        const requiredModules = [
            'EMAILJS_CONFIG',
            'validateInput',
            'validateFormData',
            'sanitizeInput',
            'sendEmail'
        ];
        
        const missingModules = requiredModules.filter(mod => !window[mod]);
        
        if (missingModules.length > 0) {
            console.error('Modules manquants :', missingModules);
            showError();
        } else {
            console.log('Tous les modules requis sont disponibles.');
        }
    }
    
    // J'affiche une erreur si le chargement échoue
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
    
    // Je démarre le chargement
    loadAllModules();
    
})();