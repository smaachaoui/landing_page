// Formulaire multi-étapes
// J'ai créé un système de navigation entre 5 étapes de formulaire
const formSteps = document.querySelectorAll('.form-step');
const prevButtons = document.querySelectorAll('.nav-prev');
const nextButtons = document.querySelectorAll('.nav-next');
const form = document.querySelector('.form-calculator');
const progressBar = document.getElementById('progressBar');

let currentStep = 0;
const totalSteps = 4; // Nombre d'étapes (sans compter la confirmation)

// Mise à jour de la barre de progression
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

// J'affiche l'étape demandée et je masque les autres
function showStep(stepIndex) {
    formSteps.forEach(step => step.classList.remove('active'));
    
    if (formSteps[stepIndex]) {
        formSteps[stepIndex].classList.add('active');
    }
    
    // Je mets à jour l'indicateur de progression
    document.querySelectorAll('.current-step').forEach(span => {
        span.textContent = Math.min(stepIndex + 1, totalSteps);
    });
    
    // Mise à jour de la barre de progression
    updateProgressBar();
}

// Je vérifie que l'étape actuelle est correctement remplie
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

// Je gère le bouton Précédent
prevButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });
});

// Je gère le bouton Suivant
nextButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (validateCurrentStep()) {
            if (currentStep < formSteps.length - 1) {
                currentStep++;
                showStep(currentStep);
            }
        } else {
            alert('Veuillez remplir tous les champs requis.');
        }
    });
});

// J'avance automatiquement après une sélection radio
document.querySelectorAll('.option input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
        // MODIFICATION : Si "Appartement" est sélectionné, ne pas avancer automatiquement
        // On doit laisser l'utilisateur remplir les champs supplémentaires
        if (radio.name === 'habitation' && radio.value === 'appartement') {
            // Les champs vont apparaître via toggleAppartementDetails()
            // mais on ne passe PAS à l'étape suivante automatiquement
            return;
        }
        
        // Vérification spéciale pour le locataire - Non éligible
        if (radio.name === 'statut' && radio.value === 'locataire') {
            // Afficher le message d'inéligibilité
            setTimeout(() => {
                alert('Votre profil n\'est pas éligible.\n\nMalheureusement vous n\'êtes pas éligible aux aides pour l\'installation d\'une pompe à chaleur.');
                // Réinitialiser le formulaire
                form.reset();
                currentStep = 0;
                showStep(currentStep);
            }, 300);
            return;
        }

        
        // Si c'est l'étape du chauffage et que "Autre" est sélectionné, ne pas avancer
        if (radio.name === 'chauffage' && radio.value === 'autre') {
            return; // On attend que l'utilisateur sélectionne une option dans le select
        }
        
        // Je vérifie s'il y a des champs texte requis dans l'étape actuelle
        const hasTextField = formSteps[currentStep].querySelector(
            'input[type="text"][required], input[type="tel"][required], input[type="email"][required], select[required]'
        );
        
        // Si pas de champs texte requis, j'avance automatiquement
        if (!hasTextField && currentStep < formSteps.length - 1) {
            setTimeout(() => {
                currentStep++;
                showStep(currentStep);
            }, 300);
        }
    });
});

// Je m'assure que les clics sur les labels fonctionnent bien
document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', function(e) {
        // Si le clic est directement sur l'input, ne rien faire (géré par l'event change ci-dessus)
        if (e.target.tagName === 'INPUT') return;
        
        // Sinon, je déclenche le clic sur l'input radio
        const radio = this.querySelector('input[type="radio"]');
        if (radio) {
            radio.checked = true;
            // Je déclenche manuellement l'événement change
            radio.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
});

// Je gère la soumission du formulaire
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Je vérifie une dernière fois la validation
    if (!validateCurrentStep()) {
        alert('Veuillez remplir tous les champs correctement.');
        return;
    }
    
    // Je récupère toutes les données du formulaire
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = window.sanitizeInput(value);
    });
    
    console.log('Données du formulaire:', data);
    
    // Je valide toutes les données une dernière fois
    if (!window.validateFormData(data)) {
        alert('Erreur de validation. Vérifiez vos informations.');
        return;
    }
    
    // Je prépare le bouton pour l'envoi
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Envoi en cours...';
    
    // J'envoie l'email via EmailJS
    try {
        await window.sendEmail(data);
        
        // Je passe à la page de confirmation
        currentStep++;
        showStep(currentStep);
    } catch (error) {
        console.error('Erreur envoi email:', error);
        alert('Erreur lors de l\'envoi. Veuillez réessayer.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
});

// J'initialise le formulaire à la première étape
showStep(currentStep);


// ============================================
// GESTION DES CHAMPS SUPPLÉMENTAIRES POUR APPARTEMENT
// ============================================
const habitationRadios = document.querySelectorAll('input[name="habitation"]');
const appartementDetails = document.getElementById('appartement-details');

// Fonction pour afficher/masquer les détails de l'appartement
function toggleAppartementDetails() {
    const selectedHabitation = document.querySelector('input[name="habitation"]:checked');
    
    if (selectedHabitation && selectedHabitation.value === 'appartement') {
        appartementDetails.style.display = 'block';
        
        // Rendre les champs requis
        document.getElementById('balcon-terrasse').required = true;
        document.getElementById('etage-appartement').required = true;
        document.getElementById('mur-exterieur').required = true;
    } else {
        appartementDetails.style.display = 'none';
        
        // Retirer l'obligation des champs
        document.getElementById('balcon-terrasse').required = false;
        document.getElementById('etage-appartement').required = false;
        document.getElementById('mur-exterieur').required = false;
        
        // Réinitialiser les valeurs
        document.getElementById('balcon-terrasse').value = '';
        document.getElementById('etage-appartement').value = '';
        document.getElementById('mur-exterieur').value = '';
    }
}

// Écouter les changements sur le type d'habitation
habitationRadios.forEach(radio => {
    radio.addEventListener('change', toggleAppartementDetails);
});

// Vérifier à l'initialisation
toggleAppartementDetails();


// ============================================
// GESTION DU CHAMP "AUTRE TYPE DE CHAUFFAGE"
// ============================================
// MODIFICATION : Le champ est maintenant un SELECT au lieu d'un INPUT TEXT
const chauffageRadios = document.querySelectorAll('input[name="chauffage"]');
const autreChauffageField = document.getElementById('autre-chauffage-field');
const autreChauffageSelect = document.getElementById('autre-chauffage');

// Je gère l'affichage du champ "Autre"
function toggleAutreChauffage() {
    const selectedValue = document.querySelector('input[name="chauffage"]:checked')?.value;
    
    if (selectedValue === 'autre') {
        // J'affiche le champ avec une animation
        autreChauffageField.style.display = 'block';
        autreChauffageSelect.required = true;
        
        setTimeout(() => {
            autreChauffageField.style.opacity = '1';
            autreChauffageField.style.transform = 'translateY(0)';
        }, 10);
    } else {
        // Je masque et réinitialise le champ
        autreChauffageField.style.display = 'none';
        autreChauffageSelect.required = false;
        autreChauffageSelect.value = '';
        
        autreChauffageField.style.opacity = '0';
        autreChauffageField.style.transform = 'translateY(-10px)';
    }
}

// J'écoute les changements sur les boutons radio
chauffageRadios.forEach(radio => {
    radio.addEventListener('change', toggleAutreChauffage);
});

// J'initialise l'état du champ au chargement
toggleAutreChauffage();


// Bouton de fermeture de la page de confirmation
// Je permets à l'utilisateur de fermer la confirmation et recommencer
const closeConfirmationBtn = document.getElementById('close-confirmation');

if (closeConfirmationBtn) {
    closeConfirmationBtn.addEventListener('click', () => {
        // Je réinitialise complètement le formulaire
        form.reset();
        
        // Je retourne à la première étape
        currentStep = 0;
        showStep(currentStep);
        
        // Je réactive le bouton d'envoi
        const submitBtn = form.querySelector('.btn-submit');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-check-circle"></i>Envoyer';
        }
        
        // Je scroll vers le formulaire
        document.querySelector('#calculator').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    });
}

// ============================================
// ANIMATIONS AU HOVER SUR LES CARTES
// ============================================
document.querySelectorAll('.help-card, .argument, .review').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});