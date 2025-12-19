// Formulaire multi-étapes
// J'ai créé un système de navigation entre 5 étapes de formulaire
const formSteps = document.querySelectorAll('.form-step');
const prevButtons = document.querySelectorAll('.nav-prev');
const nextButtons = document.querySelectorAll('.nav-next');
const form = document.querySelector('.form-calculator');

let currentStep = 0;

// J'affiche l'étape demandée et je masque les autres
function showStep(stepIndex) {
    formSteps.forEach(step => step.classList.remove('active'));
    
    if (formSteps[stepIndex]) {
        formSteps[stepIndex].classList.add('active');
    }
    
    // Je mets à jour l'indicateur de progression
    document.querySelectorAll('.current-step').forEach(span => {
        span.textContent = currentStep + 1;
    });
}

// Je vérifie que l'étape actuelle est correctement remplie
function validateCurrentStep() {
    const currentStepElement = formSteps[currentStep];
    const requiredInputs = currentStepElement.querySelectorAll('input[required]');
    
    const radioGroups = {};
    const textInputs = [];
    
    // Je sépare les boutons radio des champs texte
    requiredInputs.forEach(input => {
        if (input.type === 'radio') {
            radioGroups[input.name] = radioGroups[input.name] || false;
            if (input.checked) radioGroups[input.name] = true;
        } else {
            textInputs.push(input);
        }
    });
    
    // Je vérifie que tous les groupes radio ont une sélection
    const radioValid = Object.keys(radioGroups).length === 0 || 
                      Object.values(radioGroups).every(checked => checked);
    
    // Je vérifie que tous les champs texte sont remplis et valides
    const textValid = textInputs.every(input => 
        input.value.trim() !== '' && window.validateInput(input)
    );
    
    return radioValid && textValid;
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
        // Je vérifie s'il y a des champs texte dans l'étape actuelle
        const hasTextField = formSteps[currentStep].querySelector(
            'input[type="text"], input[type="tel"], input[type="email"]'
        );
        
        // Si pas de champs texte, j'avance automatiquement
        if (!hasTextField && currentStep < formSteps.length - 1) {
            setTimeout(() => {
                currentStep++;
                showStep(currentStep);
            }, 300);
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


// Gestion du champ conditionnel "Autre type de chauffage"
// J'affiche ce champ uniquement si l'utilisateur sélectionne "Autre"
const chauffageRadios = document.querySelectorAll('input[name="chauffage"]');
const autreChauffageField = document.getElementById('autre-chauffage-field');
const autreChauffageInput = document.getElementById('autre-chauffage');

// Je gère l'affichage du champ "Autre"
function toggleAutreChauffage() {
    const selectedValue = document.querySelector('input[name="chauffage"]:checked')?.value;
    
    if (selectedValue === 'autre') {
        // J'affiche le champ avec une animation
        autreChauffageField.style.display = 'block';
        autreChauffageInput.required = true;
        
        setTimeout(() => {
            autreChauffageField.style.opacity = '1';
            autreChauffageField.style.transform = 'translateY(0)';
        }, 10);
    } else {
        // Je masque et réinitialise le champ
        autreChauffageField.style.display = 'none';
        autreChauffageInput.required = false;
        autreChauffageInput.value = '';
        
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
        document.querySelector('#section2').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    });
}