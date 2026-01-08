// ============================================
// MODULE FAQ - GESTION DE L'ACCORDÉON
// ============================================


// J'ai créé un système d'accordéon pour afficher/masquer les réponses FAQ
// avec animations fluides et accessibilité

(function() {
    'use strict';
    
    console.log('Module FAQ : chargement...');
    
    // ============================================
    // INITIALISATION DE LA FAQ
    // ============================================
    /**
     * J'initialise l'accordéon FAQ
     * Cette fonction gère l'ouverture/fermeture des questions
     */
    function initFAQ() {
        // Je récupère tous les items de la FAQ
        const faqItems = document.querySelectorAll('.faq-item');
        
        // Je vérifie qu'il y a au moins un élément FAQ
        if (faqItems.length === 0) {
            console.warn('FAQ : Aucun élément .faq-item trouvé');
            return;
        }
        
        // Je configure chaque item FAQ
        faqItems.forEach((item, index) => {
            // Je récupère le bouton question
            const question = item.querySelector('.faq-question');
            
            // Je vérifie que le bouton existe
            if (!question) {
                console.warn(`FAQ : Question non trouvée dans l'item ${index + 1}`);
                return;
            }
            
            // J'ajoute l'attribut aria pour l'accessibilité
            question.setAttribute('aria-expanded', 'false');
            question.setAttribute('aria-controls', `faq-answer-${index}`);
            
            // Je configure l'id de la réponse pour l'accessibilité
            const answer = item.querySelector('.faq-answer');
            if (answer) {
                answer.setAttribute('id', `faq-answer-${index}`);
            }
            
            // J'écoute le clic sur la question
            question.addEventListener('click', () => {
                // Je récupère l'état actuel de l'item
                const isActive = item.classList.contains('active');
                
                // Je ferme tous les autres items pour n'avoir qu'un seul ouvert à la fois
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        // Je ferme l'item
                        otherItem.classList.remove('active');
                        
                        // Je mets à jour l'aria
                        const otherQuestion = otherItem.querySelector('.faq-question');
                        if (otherQuestion) {
                            otherQuestion.setAttribute('aria-expanded', 'false');
                        }
                        
                        console.log(`FAQ : Item ${Array.from(faqItems).indexOf(otherItem) + 1} fermé`);
                    }
                });
                
                // Je toggle l'item actuel
                item.classList.toggle('active');
                
                // Je mets à jour l'aria
                const newState = item.classList.contains('active');
                question.setAttribute('aria-expanded', newState);
                
                // J'anime le scroll vers l'item si on l'ouvre
                if (newState && !isActive) {
                    setTimeout(() => {
                        item.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest'
                        });
                    }, 300);
                }
                
                // Log pour le debug
                console.log(`FAQ : Item ${index + 1} ${newState ? 'ouvert' : 'fermé'}`);
            });
            
            // J'ajoute le support du clavier pour l'accessibilité
            question.addEventListener('keydown', (e) => {
                // J'écoute la touche Entrée et Espace
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
                
                // J'écoute les touches fléchées pour la navigation
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    // Je passe au prochain item
                    const nextItem = item.nextElementSibling;
                    if (nextItem) {
                        const nextQuestion = nextItem.querySelector('.faq-question');
                        if (nextQuestion) {
                            nextQuestion.focus();
                        }
                    }
                }
                
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    // Je passe à l'item précédent
                    const prevItem = item.previousElementSibling;
                    if (prevItem) {
                        const prevQuestion = prevItem.querySelector('.faq-question');
                        if (prevQuestion) {
                            prevQuestion.focus();
                        }
                    }
                }
            });
        });
        
        console.log(`FAQ : ${faqItems.length} items initialisés avec succès`);
    }
    
    // ============================================
    // DÉMARRAGE AUTOMATIQUE
    // ============================================
    // J'attends que le DOM soit chargé avant d'initialiser
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFAQ);
    } else {
        // Le DOM est déjà chargé, j'initialise immédiatement
        initFAQ();
    }
    
    // ============================================
    // EXPORT DE LA FONCTION
    // ============================================
    // J'expose la fonction pour permettre une réinitialisation si nécessaire
    window.initFAQ = initFAQ;
    
    console.log('Module FAQ : chargé');
    
})();