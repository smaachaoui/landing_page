// Formulaire multi-étapes OPTIMISÉ
// Système de navigation fluide et ergonomique entre 5 étapes
const formSteps = document.querySelectorAll('.form-step');
const prevButtons = document.querySelectorAll('.nav-prev');
const nextButtons = document.querySelectorAll('.nav-next');
const form = document.querySelector('.form-calculator');
const progressBar = document.getElementById('progressBar');

let currentStep = 0;
const totalSteps = 4; // Nombre d'étapes (sans compter la confirmation)

// ============================================
// MISE À JOUR DE LA BARRE DE PROGRESSION
// ============================================
function updateProgressBar() {
    const progressBarContainer = document.querySelector('.progress-bar-container');
    
    // Masquer la barre à l'étape de confirmation (étape 5, index 4)
    if (currentStep >= 4) {
        if (progressBarContainer) {
            progressBarContainer.classList.add('hidden');
        }
    } else {
        if (progressBarContainer) {
            progressBarContainer.classList.remove('hidden');
        }
        
        const progress = ((currentStep + 1) / totalSteps) * 100;
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }
}

function scrollToCalculator(options = {}) {
    const el = document.querySelector('#calculator');
    if (!el) return;

    const header = document.querySelector('.header');
    const headerH = header ? header.getBoundingClientRect().height : 0;

    // marge supplémentaire pour respirer
    const offset = headerH + 20;

    const top = window.scrollY + el.getBoundingClientRect().top - offset;
    
    // Scroll fluide vers le formulaire
    window.scrollTo({ 
        top, 
        behavior: options.behavior || 'smooth' 
    });
}

// Fonction pour maintenir le focus sur le formulaire lors des sélections
function lockScrollToCalculator() {
    const calculator = document.querySelector('#calculator');
    if (!calculator) return;
    
    const header = document.querySelector('.header');
    const headerH = header ? header.getBoundingClientRect().height : 0;
    const offset = headerH + 20;
    
    // Calcul de la position cible
    const targetTop = calculator.offsetTop - offset;
    
    // Si l'utilisateur est proche du formulaire, on le maintient en place
    const currentScroll = window.scrollY;
    const calculatorBottom = calculator.offsetTop + calculator.offsetHeight;
    
    if (currentScroll >= targetTop - 100 && currentScroll <= calculatorBottom) {
        window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
        });
    }
}


// ============================================
// AFFICHAGE DES ÉTAPES AVEC ANIMATIONS
// ============================================
function showStep(stepIndex) {
    // Animation de sortie de l'étape actuelle
    const currentStepElement = document.querySelector('.form-step.active');
    if (currentStepElement) {
        currentStepElement.style.opacity = '0';
        currentStepElement.style.transform = 'translateX(-20px)';
    }
    
    setTimeout(() => {
        formSteps.forEach(step => step.classList.remove('active'));
        
        if (formSteps[stepIndex]) {
            formSteps[stepIndex].classList.add('active');
            
            // Animation d'entrée de la nouvelle étape
            formSteps[stepIndex].style.opacity = '0';
            formSteps[stepIndex].style.transform = 'translateX(20px)';
            
            setTimeout(() => {
                formSteps[stepIndex].style.transition = 'all 0.3s ease';
                formSteps[stepIndex].style.opacity = '1';
                formSteps[stepIndex].style.transform = 'translateX(0)';
            }, 50);
        }
        
        // Je mets à jour l'indicateur de progression
        document.querySelectorAll('.current-step').forEach(span => {
            span.textContent = Math.min(stepIndex + 1, totalSteps);
        });
        
        // Mise à jour de la barre de progression
        updateProgressBar();
        
        // Mise à jour de l'état du bouton Suivant
        updateNextButtonState();
        
        // Focus sur le premier champ de la nouvelle étape
        focusFirstField();
        
        // Scroll vers le haut du formulaire avec un léger délai
        setTimeout(() => {
            scrollToCalculator({ behavior: 'smooth' });
        }, 100);
        
    }, 150);
}

// ============================================
// FOCUS AUTOMATIQUE SUR LE PREMIER CHAMP
// ============================================
function focusFirstField() {
    setTimeout(() => {
        const currentStepElement = formSteps[currentStep];
        if (currentStepElement) {
            // Chercher le premier input non-radio ou le premier select
            const firstField = currentStepElement.querySelector('input[type="text"], input[type="email"], input[type="tel"], select');
            if (firstField && !firstField.disabled) {
                firstField.focus({ preventScroll: true });

            }
        }
    }, 400);
}

// ============================================
// VALIDATION DE L'ÉTAPE ACTUELLE
// ============================================
function validateCurrentStep() {
    const currentStepElement = formSteps[currentStep];
    const requiredInputs = currentStepElement.querySelectorAll('input[required], select[required]');
    
    const radioGroups = {};
    const otherInputs = [];
    
    // Je sépare les boutons radio des autres champs
    requiredInputs.forEach(input => {
        if (input.type === 'radio') {
            radioGroups[input.name] = radioGroups[input.name] || false;
            if (input.checked) radioGroups[input.name] = true;
        } else {
            otherInputs.push(input);
        }
    });
    
    // Je vérifie que tous les groupes radio ont une sélection
    const radioValid = Object.keys(radioGroups).length === 0 || 
                      Object.values(radioGroups).every(checked => checked);
    
    // Je vérifie que tous les autres champs sont remplis et valides
    const otherValid = otherInputs.every(input => {
        if (input.type === 'text' || input.type === 'email' || input.type === 'tel') {
            return input.value.trim() !== '' && window.validateInput(input);
        } else if (input.tagName === 'SELECT') {
            return input.value !== '';
        }
        return true;
    });
    
    return radioValid && otherValid;
}

// ============================================
// MISE À JOUR DYNAMIQUE DU BOUTON SUIVANT
// ============================================
function updateNextButtonState() {
    const currentNextButton = formSteps[currentStep]?.querySelector('.nav-next');
    
    if (currentNextButton) {
        const isValid = validateCurrentStep();
        currentNextButton.disabled = !isValid;
        
        // Feedback visuel
        if (isValid) {
            currentNextButton.style.opacity = '1';
            currentNextButton.style.cursor = 'pointer';
        } else {
            currentNextButton.style.opacity = '0.5';
            currentNextButton.style.cursor = 'not-allowed';
        }
    }
}

// ============================================
// INDICATION VISUELLE DE COMPLÉTION
// ============================================
function markStepAsComplete(stepIndex) {
    const stepElement = formSteps[stepIndex];
    if (stepElement && !stepElement.classList.contains('step-completed')) {
        stepElement.classList.add('step-completed');
        
        // Animation de succès
        const checkmark = document.createElement('div');
        checkmark.innerHTML = '<i class="bi bi-check-circle-fill" style="color: #48BB78; font-size: 1.5rem;"></i>';
        checkmark.style.position = 'absolute';
        checkmark.style.top = '10px';
        checkmark.style.right = '10px';
        checkmark.style.animation = 'successPop 0.6s ease-out';
        stepElement.style.position = 'relative';
        stepElement.appendChild(checkmark);
    }
}

// ============================================
// GESTION DU BOUTON PRÉCÉDENT
// ============================================
prevButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });
});

// ============================================
// GESTION DU BOUTON SUIVANT
// ============================================
nextButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (validateCurrentStep()) {
            // Marquer l'étape comme complétée
            markStepAsComplete(currentStep);
            
            if (currentStep < formSteps.length - 1) {
                currentStep++;
                showStep(currentStep);
            }
        } else {
            // Animation de shake pour indiquer l'erreur
            const currentStepElement = formSteps[currentStep];
            currentStepElement.style.animation = 'shake 0.5s';
            setTimeout(() => {
                currentStepElement.style.animation = '';
            }, 500);
            
            alert('Veuillez remplir tous les champs requis.');
        }
    });
});

// ============================================
// AVANCEMENT AUTOMATIQUE INTELLIGENT
// ============================================
document.querySelectorAll('.option input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
        // Animation de sélection
        const option = radio.closest('.option');
        if (option) {
            option.style.transform = 'scale(1.05)';
            setTimeout(() => {
                option.style.transform = '';
            }, 200);
        }
        
        // Mise à jour immédiate du bouton
        updateNextButtonState();
        
        // Si "Appartement" est sélectionné, ne pas avancer automatiquement
        if (radio.name === 'habitation' && radio.value === 'appartement') {
            return;
        }
        
        // Vérification spéciale pour le locataire - Non éligible
        if (radio.name === 'statut' && radio.value === 'locataire') {
            setTimeout(() => {
                alert('Votre profil n\'est pas éligible.\n\nMalheureusement vous n\'êtes pas éligible aux aides pour l\'installation d\'une pompe à chaleur.');
                form.reset();
                currentStep = 0;
                showStep(currentStep);
            }, 300);
            return;
        }
        
        // Si "Autre" type de chauffage, ne pas avancer
        if (radio.name === 'chauffage' && radio.value === 'autre') {
            return;
        }
        
        // Vérifier s'il y a des champs texte requis
        const hasTextField = formSteps[currentStep].querySelector(
            'input[type="text"][required], input[type="tel"][required], input[type="email"][required], select[required]'
        );
        
        // Avancement automatique si pas de champs texte requis
        if (!hasTextField && currentStep < formSteps.length - 1) {
            setTimeout(() => {
                if (validateCurrentStep()) {
                    markStepAsComplete(currentStep);
                    currentStep++;
                    showStep(currentStep);
                }
            }, 400);
        }
    });
});

// ============================================
// GESTION DES CLICS SUR LES LABELS
// ============================================
document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', function(e) {
        if (e.target.tagName === 'INPUT') return;
        
        const radio = this.querySelector('input[type="radio"]');
        if (radio) {
            radio.checked = true;
            radio.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
});

// ============================================
// VALIDATION EN TEMPS RÉEL POUR TOUS LES CHAMPS
// ============================================
function setupRealtimeValidation() {
    document.querySelectorAll('input, select').forEach(field => {
        // Validation lors du changement
        field.addEventListener('input', () => {
            updateNextButtonState();
            
            // Retirer l'erreur visuelle si elle existe
            if (field.classList.contains('input-error')) {
                if (window.validateInput && window.validateInput(field)) {
                    field.classList.remove('input-error');
                }
            }
        });
        
        field.addEventListener('change', () => {
            updateNextButtonState();
        });
        
        // Validation à la perte de focus
        field.addEventListener('blur', () => {
            if (field.value.trim() !== '' && window.validateInput) {
                window.validateInput(field);
            }
        });
    });
}

// ============================================
// AUTO-FORMATAGE DU TÉLÉPHONE
// ============================================
function setupPhoneFormatting() {
    const phoneInput = document.querySelector('input[name="telephone"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Garder que les chiffres
            
            // Limiter à 10 chiffres
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            
            // Formater avec espaces (06 12 34 56 78)
            if (value.length > 2) {
                value = value.match(/.{1,2}/g).join(' ');
            }
            
            e.target.value = value;
        });
    }
}

// ============================================
// SOUMISSION DU FORMULAIRE
// ============================================
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Vérification du consentement RGPD
    const consentRGPD = document.getElementById('consent-rgpd');
    if (!consentRGPD || !consentRGPD.checked) {
        alert('Vous devez accepter la politique de confidentialité pour continuer.');
        return;
    }
    
    if (!validateCurrentStep()) {
        alert('Veuillez remplir tous les champs correctement.');
        return;
    }
    
    // Récupération des données
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = window.sanitizeInput(value);
    });
    
    // console.log('Données du formulaire:', data);
    
    // Validation finale
    if (!window.validateFormData(data)) {
        alert('Erreur de validation. Vérifiez vos informations.');
        return;
    }
    
    // Préparation du bouton
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Envoi en cours...';
    
    // Animation du bouton
    submitBtn.style.transform = 'scale(0.95)';
    
    try {
        // Envoi de l'email 
        await window.sendEmail(data);
        // console.log('Email envoyé avec succès');
        
        // Envoi du SMS d'accusé de réception 
        // Le SMS est envoyé en parallèle et ne bloque pas le formulaire en cas d'erreur
        if (window.sendSMS) {
            // Envoi SMS uniquement si consentement
            const consentSMS = document.getElementById('consent-sms');
            if (consentSMS && consentSMS.checked) {
                try {
                    await sendSMS(data);
                    // console.log('SMS envoyé avec consentement');
                } catch (error) {
                    console.warn('Erreur SMS (non bloquant):', error);
                }
            } else {
                // console.log('SMS non envoyé - absence de consentement utilisateur');
            }
        }
        
        // Animation de succès
        submitBtn.innerHTML = '<i class="bi bi-check-circle"></i> Envoyé !';
        submitBtn.style.background = 'linear-gradient(135deg, #48BB78 0%, #38A169 100%)';
        
        setTimeout(() => {
            currentStep++;
            showStep(currentStep);
        }, 800);
    } catch (error) {
        console.error('Erreur envoi email:', error);
        
        // Animation d'erreur
        submitBtn.style.transform = 'scale(1)';
        submitBtn.style.animation = 'shake 0.5s';
        
        alert('Erreur lors de l\'envoi. Veuillez réessayer.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        setTimeout(() => {
            submitBtn.style.animation = '';
        }, 500);
    }
});

// ============================================
// GESTION DES CHAMPS APPARTEMENT
// ============================================
const habitationRadios = document.querySelectorAll('input[name="habitation"]');
const appartementDetails = document.getElementById('appartement-details');

function toggleAppartementDetails() {
    const selectedHabitation = document.querySelector('input[name="habitation"]:checked');
    
    if (selectedHabitation && selectedHabitation.value === 'appartement') {
        appartementDetails.style.display = 'block';
        
        // Rendre les champs requis
        document.getElementById('balcon-terrasse').required = true;
        document.getElementById('etage-appartement').required = true;
        document.getElementById('mur-exterieur').required = true;
        
        // Animation d'apparition
        setTimeout(() => {
            appartementDetails.style.opacity = '1';
            appartementDetails.style.transform = 'translateY(0)';
        }, 50);
    } else {
        appartementDetails.style.display = 'none';
        appartementDetails.style.opacity = '0';
        appartementDetails.style.transform = 'translateY(-10px)';
        
        // Retirer l'obligation des champs
        document.getElementById('balcon-terrasse').required = false;
        document.getElementById('etage-appartement').required = false;
        document.getElementById('mur-exterieur').required = false;
        
        // Réinitialiser les valeurs
        document.getElementById('balcon-terrasse').value = '';
        document.getElementById('etage-appartement').value = '';
        document.getElementById('mur-exterieur').value = '';
    }
    
    // Mettre à jour le bouton
    updateNextButtonState();
}

habitationRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        toggleAppartementDetails();
        // Maintenir le focus sur le formulaire après sélection
        setTimeout(() => lockScrollToCalculator(), 100);
    });
});

toggleAppartementDetails();

// ============================================
// VÉRIFICATION ÉLIGIBILITÉ APPARTEMENT
// ============================================
document.getElementById('balcon-terrasse').addEventListener('change', function() {
    const selectedHabitation = document.querySelector('input[name="habitation"]:checked');
    
    if (selectedHabitation && selectedHabitation.value === 'appartement') {
        const balconTerrasse = this.value;
        const murExterieur = document.getElementById('mur-exterieur').value;
        
        if (balconTerrasse && murExterieur) {
            if (!window.checkAppartementEligibility(balconTerrasse, murExterieur)) {
                setTimeout(() => {
                    alert('Votre profil n\'est pas éligible.\n\nMalheureusement, sans balcon, terrasse ou accès à un mur extérieur, l\'installation d\'une pompe à chaleur n\'est pas possible dans votre appartement.');
                    form.reset();
                    currentStep = 0;
                    showStep(currentStep);
                }, 300);
            }
        }
    }
});

document.getElementById('mur-exterieur').addEventListener('change', function() {
    const selectedHabitation = document.querySelector('input[name="habitation"]:checked');
    
    if (selectedHabitation && selectedHabitation.value === 'appartement') {
        const murExterieur = this.value;
        const balconTerrasse = document.getElementById('balcon-terrasse').value;
        
        if (balconTerrasse && murExterieur) {
            if (!window.checkAppartementEligibility(balconTerrasse, murExterieur)) {
                setTimeout(() => {
                    alert('Votre profil n\'est pas éligible.\n\nMalheureusement, sans balcon, terrasse ou accès à un mur extérieur, l\'installation d\'une pompe à chaleur n\'est pas possible dans votre appartement.');
                    form.reset();
                    currentStep = 0;
                    showStep(currentStep);
                }, 300);
            }
        }
    }
});

// ============================================
// GESTION DU CHAMP "AUTRE CHAUFFAGE"
// ============================================
const chauffageRadios = document.querySelectorAll('input[name="chauffage"]');
const autreChauffageField = document.getElementById('autre-chauffage-field');
const autreChauffageSelect = document.getElementById('autre-chauffage');

function toggleAutreChauffage() {
    const selectedValue = document.querySelector('input[name="chauffage"]:checked')?.value;
    
    if (selectedValue === 'autre') {
        autreChauffageField.style.display = 'block';
        autreChauffageSelect.required = true;
        
        setTimeout(() => {
            autreChauffageField.style.opacity = '1';
            autreChauffageField.style.transform = 'translateY(0)';
            autreChauffageSelect.focus(); // Focus automatique
        }, 10);
    } else {
        autreChauffageField.style.display = 'none';
        autreChauffageSelect.required = false;
        autreChauffageSelect.value = '';
        
        autreChauffageField.style.opacity = '0';
        autreChauffageField.style.transform = 'translateY(-10px)';
    }
    
    updateNextButtonState();
}

chauffageRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        toggleAutreChauffage();
        // Maintenir le focus sur le formulaire après sélection
        setTimeout(() => lockScrollToCalculator(), 100);
    });
});

toggleAutreChauffage();

// ============================================
// BOUTON DE FERMETURE CONFIRMATION
// ============================================
const closeConfirmationBtn = document.getElementById('close-confirmation');

if (closeConfirmationBtn) {
    closeConfirmationBtn.addEventListener('click', () => {
        form.reset();
        currentStep = 0;
        showStep(currentStep);
        
        const submitBtn = form.querySelector('.btn-submit');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-check-circle"></i> Envoyer';
            submitBtn.style.background = '';
        }
        
        document.querySelector('#calculator').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    });
}

// ============================================
// ANIMATIONS HOVER SUR LES CARTES
// ============================================
document.querySelectorAll('.help-card, .advantage-card, .review-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ============================================
// INITIALISATION
// ============================================
// Initialiser le formulaire à la première étape
showStep(currentStep);

// Configurer la validation en temps réel
setupRealtimeValidation();

// Configurer le formatage du téléphone
setupPhoneFormatting();

// Désactiver le bouton Suivant au démarrage si nécessaire
updateNextButtonState();

// ============================================
// GESTION GLOBALE DU SCROLL FORMULAIRE
// ============================================
// Ajouter un écouteur sur tous les inputs du formulaire pour maintenir le scroll
if (form) {
    form.querySelectorAll('input[type="radio"], select').forEach(input => {
        input.addEventListener('change', () => {
            // Petit délai pour laisser le DOM se mettre à jour
            setTimeout(() => {
                lockScrollToCalculator();
            }, 150);
        });
    });
    
    // Pour les options cliquables (labels)
    form.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', () => {
            setTimeout(() => {
                lockScrollToCalculator();
            }, 200);
        });
    });
}

// Ajouter les animations CSS nécessaires
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .form-step {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    #appartement-details {
        transition: opacity 0.3s ease, transform 0.3s ease;
        opacity: 0;
        transform: translateY(-10px);
    }
    
    .nav-next {
        transition: opacity 0.3s ease, transform 0.2s ease, background 0.3s ease !important;
    }
    
    .nav-next:not(:disabled):active {
        transform: scale(0.95) !important;
    }
`;
document.head.appendChild(style);

// console.log('Formulaire optimisé chargé avec succès');