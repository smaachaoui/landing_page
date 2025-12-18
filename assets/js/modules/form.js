// ========================================
// FORMULAIRE MULTI-ÉTAPES
// ========================================

const formSteps = document.querySelectorAll('.form-step');
const prevButtons = document.querySelectorAll('.nav-prev');
const nextButtons = document.querySelectorAll('.nav-next');
const form = document.querySelector('.form-calculator');

let currentStep = 0;

// Afficher une étape spécifique
function showStep(stepIndex) {
    formSteps.forEach(step => step.classList.remove('active'));
    
    if (formSteps[stepIndex]) {
        formSteps[stepIndex].classList.add('active');
    }
    
    // Mettre à jour les indicateurs (1/5, 2/5, etc.)
    document.querySelectorAll('.current-step').forEach(span => {
        span.textContent = currentStep + 1;
    });
}

// Valider l'étape courante
function validateCurrentStep() {
    const currentStepElement = formSteps[currentStep];
    const requiredInputs = currentStepElement.querySelectorAll('input[required]');
    
    const radioGroups = {};
    const textInputs = [];
    
    requiredInputs.forEach(input => {
        if (input.type === 'radio') {
            radioGroups[input.name] = radioGroups[input.name] || false;
            if (input.checked) radioGroups[input.name] = true;
        } else {
            textInputs.push(input);
        }
    });
    
    const radioValid = Object.keys(radioGroups).length === 0 || 
                      Object.values(radioGroups).every(checked => checked);
    
    const textValid = textInputs.every(input => 
        input.value.trim() !== '' && window.validateInput(input)
    );
    
    return radioValid && textValid;
}

// Navigation précédente
prevButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });
});

// Navigation suivante
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

// Auto-avancer après sélection radio (sauf si champ texte présent)
document.querySelectorAll('.option input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
        const hasTextField = formSteps[currentStep].querySelector(
            'input[type="text"], input[type="tel"], input[type="email"]'
        );
        
        if (!hasTextField && currentStep < formSteps.length - 1) {
            setTimeout(() => {
                currentStep++;
                showStep(currentStep);
            }, 300);
        }
    });
});

// Soumission du formulaire
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
        alert('Veuillez remplir tous les champs correctement.');
        return;
    }
    
    // Récupérer et sanitiser les données
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = window.sanitizeInput(value);
    });
    
    console.log('Données du formulaire:', data);
    
    // Validation finale
    if (!window.validateFormData(data)) {
        alert('Erreur de validation. Vérifiez vos informations.');
        return;
    }
    
    // Envoyer l'email via EmailJS
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Envoi en cours...';
    
    try {
        await window.sendEmail(data);
        
        // Passer à l'étape de confirmation
        currentStep++;
        showStep(currentStep);
    } catch (error) {
        console.error('Erreur envoi email:', error);
        alert('Erreur lors de l\'envoi. Veuillez réessayer.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
});

// Initialiser le formulaire à la première étape
showStep(currentStep);