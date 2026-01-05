// Module FAQ - Gestion de l'accordéon
(function() {
    'use strict';
    
    console.log('Module FAQ : chargement...');
    
    /**
     * J'initialise l'accordéon FAQ
     * Cette fonction gère l'ouverture/fermeture des questions
     */
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        if (faqItems.length === 0) {
            console.warn('FAQ : Aucun élément .faq-item trouvé');
            return;
        }
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            if (!question) {
                console.warn('FAQ : Question non trouvée dans un item');
                return;
            }
            
            question.addEventListener('click', () => {
                // Je ferme tous les autres items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Je toggle l'item actuel
                item.classList.toggle('active');
                
                // Log pour le debug
                const isActive = item.classList.contains('active');
                console.log(`FAQ : Item ${isActive ? 'ouvert' : 'fermé'}`);
            });
        });
        
        console.log(`FAQ : ${faqItems.length} items initialisés avec succès`);
    }
    
    // J'attends que le DOM soit chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFAQ);
    } else {
        // Le DOM est déjà chargé
        initFAQ();
    }
    
    // J'expose la fonction pour permettre une réinitialisation si nécessaire
    window.initFAQ = initFAQ;
    
    console.log('Module FAQ : chargé');
    
})();