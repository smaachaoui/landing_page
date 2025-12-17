// ========================================
// BURGER MENU
// ========================================

const burgerMenu = document.querySelector('.burger-menu');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.navbar a');

// Toggle du menu burger
function toggleMenu() {
    const isOpen = navbar.classList.toggle('active');
    burgerMenu.classList.toggle('active');
    burgerMenu.setAttribute('aria-expanded', isOpen);
    
    // Empêcher le scroll quand le menu est ouvert
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

// Ouvrir/fermer le menu au clic sur le burger
burgerMenu.addEventListener('click', toggleMenu);

// Fermer le menu au clic sur un lien
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navbar.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// Fermer le menu au clic en dehors
document.addEventListener('click', (e) => {
    if (navbar.classList.contains('active') && 
        !navbar.contains(e.target) && 
        !burgerMenu.contains(e.target)) {
        toggleMenu();
    }
});

// Fermer le menu à la touche Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navbar.classList.contains('active')) {
        toggleMenu();
    }
});

// Gérer le redimensionnement de la fenêtre
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Fermer le menu si on passe en desktop
        if (window.innerWidth > 768 && navbar.classList.contains('active')) {
            toggleMenu();
        }
    }, 250);
});


// ========================================
// SMOOTH SCROLL
// ========================================

// Smooth scroll pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


// ========================================
// FORMULAIRE MULTI-ÉTAPES
// ========================================

const formSteps = document.querySelectorAll('.form-step');
const prevButtons = document.querySelectorAll('.nav-prev');
const nextButtons = document.querySelectorAll('.nav-next');
const form = document.querySelector('.form-calculator');

let currentStep = 0;

// Fonction pour afficher une étape spécifique
function showStep(stepIndex) {
    // Masquer toutes les étapes
    formSteps.forEach(step => {
        step.classList.remove('active');
    });
    
    // Afficher l'étape courante
    if (formSteps[stepIndex]) {
        formSteps[stepIndex].classList.add('active');
    }
    
    // Mettre à jour les indicateurs de page
    updatePageIndicators();
}

// Fonction pour mettre à jour les indicateurs de page
function updatePageIndicators() {
    const currentStepSpans = document.querySelectorAll('.current-step');
    currentStepSpans.forEach(span => {
        span.textContent = currentStep + 1;
    });
}

// Fonction pour valider l'étape courante
function validateCurrentStep() {
    const currentStepElement = formSteps[currentStep];
    const requiredInputs = currentStepElement.querySelectorAll('input[required], select[required]');
    
    // Vérifier si au moins un radio est sélectionné dans chaque groupe
    const radioGroups = {};
    const textInputs = [];
    
    requiredInputs.forEach(input => {
        if (input.type === 'radio') {
            if (!radioGroups[input.name]) {
                radioGroups[input.name] = false;
            }
            if (input.checked) {
                radioGroups[input.name] = true;
            }
        } else {
            textInputs.push(input);
        }
    });
    
    // Tous les groupes de radios doivent avoir une sélection
    const radioValid = Object.keys(radioGroups).length === 0 || Object.values(radioGroups).every(isChecked => isChecked);
    
    // Tous les champs texte doivent être remplis et valides
    const textValid = textInputs.every(input => {
        return input.value.trim() !== '' && validateInput(input);
    });
    
    return radioValid && textValid;
}

// ========================================
// VALIDATION ET SÉCURITÉ
// ========================================

// Fonction de validation avancée pour chaque champ
function validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    const name = input.name;
    
    // Protection contre les champs vides
    if (value === '') {
        showError(input, 'Ce champ est requis');
        return false;
    }
    
    // Validation selon le type de champ
    switch(name) {
        case 'nom':
        case 'prenom':
            return validateName(input, value);
        
        case 'email':
            return validateEmail(input, value);
        
        case 'telephone':
            return validatePhone(input, value);
        
        case 'departement':
            return validateDepartement(input, value);
        
        default:
            return true;
    }
}

// Validation du nom et prénom
function validateName(input, value) {
    // 1. Longueur minimale et maximale
    if (value.length < 2) {
        showError(input, 'Le nom doit contenir au moins 2 caractères');
        return false;
    }
    
    if (value.length > 50) {
        showError(input, 'Le nom ne peut pas dépasser 50 caractères');
        return false;
    }
    
    // 2. Protection contre les caractères spéciaux dangereux (XSS)
    const dangerousChars = /<|>|&lt;|&gt;|script|javascript|onclick|onerror/gi;
    if (dangerousChars.test(value)) {
        showError(input, 'Caractères non autorisés détectés');
        return false;
    }
    
    // 3. Ne contenir que des lettres, espaces, tirets et apostrophes
    const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
    if (!nameRegex.test(value)) {
        showError(input, 'Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes');
        return false;
    }
    
    // 4. Pas de chiffres
    if (/\d/.test(value)) {
        showError(input, 'Le nom ne peut pas contenir de chiffres');
        return false;
    }
    
    clearError(input);
    return true;
}

// Validation de l'email
function validateEmail(input, value) {
    // 1. Longueur maximale
    if (value.length > 100) {
        showError(input, 'L\'email ne peut pas dépasser 100 caractères');
        return false;
    }
    
    // 2. Format email valide (RFC 5322 simplifié)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
        showError(input, 'Format d\'email invalide');
        return false;
    }
    
    // 3. Protection contre les caractères dangereux
    const dangerousChars = /<|>|script|javascript/gi;
    if (dangerousChars.test(value)) {
        showError(input, 'Caractères non autorisés détectés');
        return false;
    }
    
    // 4. Vérifier que le domaine n'est pas vide
    const domain = value.split('@')[1];
    if (!domain || domain.length < 3) {
        showError(input, 'Domaine email invalide');
        return false;
    }
    
    clearError(input);
    return true;
}

// Validation du téléphone
function validatePhone(input, value) {
    // 1. Retirer tous les espaces, tirets, points
    const cleanPhone = value.replace(/[\s\-\.]/g, '');
    
    // 2. Doit contenir exactement 10 chiffres
    if (!/^\d{10}$/.test(cleanPhone)) {
        showError(input, 'Le numéro de téléphone doit contenir 10 chiffres (ex: 0612345678)');
        return false;
    }
    
    // 3. Doit commencer par 06 ou 07 (mobile français)
    if (!cleanPhone.startsWith('06') && !cleanPhone.startsWith('07')) {
        showError(input, 'Le numéro mobile doit commencer par 06 ou 07');
        return false;
    }
    
    // 4. Protection contre les injections
    if (/[^0-9\s\-\.]/.test(value)) {
        showError(input, 'Le numéro de téléphone ne peut contenir que des chiffres, espaces, tirets et points');
        return false;
    }
    
    // Mettre à jour la valeur nettoyée dans le champ
    input.value = cleanPhone;
    
    clearError(input);
    return true;
}

// Validation du département
function validateDepartement(input, value) {
    // 1. Doit contenir 2 ou 3 chiffres uniquement
    if (!/^\d{2,3}$/.test(value)) {
        showError(input, 'Le département doit contenir 2 ou 3 chiffres (ex: 75, 13, 974)');
        return false;
    }
    
    // 2. Doit être un département valide (01 à 95 + DOM-TOM)
    const deptNumber = parseInt(value);
    const validDepts = [
        // Métropole : 01 à 95 (sauf 20)
        ...Array.from({length: 95}, (_, i) => i + 1).filter(n => n !== 20),
        // Corse : 2A = 96, 2B = 97
        96, 97,
        // DOM-TOM
        971, 972, 973, 974, 975, 976, 977, 978, 984, 986, 987, 988, 989
    ];
    
    if (value.length === 2 && (deptNumber < 1 || deptNumber > 95)) {
        showError(input, 'Numéro de département invalide');
        return false;
    }
    
    if (value.length === 3 && ![971, 972, 973, 974, 975, 976].includes(deptNumber)) {
        showError(input, 'Numéro de département DOM-TOM invalide');
        return false;
    }
    
    clearError(input);
    return true;
}

// Fonction pour sanitizer les données (protection XSS)
function sanitizeInput(value) {
    // Convertir les caractères HTML dangereux
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
}

// Afficher un message d'erreur
function showError(input, message) {
    // Retirer toute erreur précédente
    clearError(input);
    
    // Ajouter la classe d'erreur
    input.classList.add('input-error');
    
    // Créer le message d'erreur
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Insérer après le champ
    input.parentElement.appendChild(errorDiv);
}

// Effacer le message d'erreur
function clearError(input) {
    input.classList.remove('input-error');
    const errorMsg = input.parentElement.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

// Ajouter la validation en temps réel sur les champs texte
document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]').forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() !== '') {
            validateInput(input);
        }
    });
    
    // Retirer l'erreur quand l'utilisateur commence à taper
    input.addEventListener('input', () => {
        if (input.classList.contains('input-error')) {
            clearError(input);
        }
    });
});

// Navigation : Étape précédente
prevButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });
});

// Navigation : Étape suivante
nextButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (validateCurrentStep()) {
            if (currentStep < formSteps.length - 1) {
                currentStep++;
                showStep(currentStep);
            }
        } else {
            alert('Veuillez sélectionner une option avant de continuer.');
        }
    });
});

// Permettre de passer à l'étape suivante en cliquant sur une option (sauf étape 3)
document.querySelectorAll('.option input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
        // Ne pas auto-avancer à l'étape 3 car elle a un champ texte
        const currentStepElement = formSteps[currentStep];
        const hasTextField = currentStepElement.querySelector('input[type="text"], input[type="tel"], input[type="email"]');
        
        if (!hasTextField && currentStep < formSteps.length - 1) {
            // Attendre un peu avant de passer à l'étape suivante pour que l'utilisateur voie son choix
            setTimeout(() => {
                currentStep++;
                showStep(currentStep);
            }, 300);
        }
    });
});

// Soumission du formulaire
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateCurrentStep()) {
        // Récupérer toutes les données du formulaire
        const formData = new FormData(form);
        const data = {};
        
        // Sanitizer toutes les données
        formData.forEach((value, key) => {
            data[key] = sanitizeInput(value);
        });
        
        console.log('Données du formulaire (sécurisées):', data);
        
        // Vérification finale de sécurité
        if (validateFormData(data)) {
            // Ici, tu peux envoyer les données à un serveur
            // fetch('/api/submit', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });
            
            alert(`Merci ${data.prenom} ${data.nom} ! Vos informations ont été enregistrées. Un conseiller vous contactera au ${data.telephone}.`);
            
            // Optionnel : Réinitialiser le formulaire
            // form.reset();
            // currentStep = 0;
            // showStep(currentStep);
        } else {
            alert('Une erreur s\'est produite. Veuillez vérifier vos informations.');
        }
    } else {
        alert('Veuillez remplir tous les champs correctement avant de soumettre.');
    }
});

// Validation finale de toutes les données avant soumission
function validateFormData(data) {
    // Vérifier que toutes les données requises sont présentes
    const requiredFields = ['habitation', 'statut', 'chauffage', 'departement', 'nom', 'prenom', 'email', 'telephone'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            console.error(`Champ manquant: ${field}`);
            return false;
        }
    }
    
    // Validation finale de chaque champ
    const validations = [
        data.nom.length >= 2 && data.nom.length <= 50,
        data.prenom.length >= 2 && data.prenom.length <= 50,
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email),
        /^\d{10}$/.test(data.telephone),
        /^\d{2,3}$/.test(data.departement)
    ];
    
    return validations.every(v => v === true);
}

// Initialiser le formulaire à la première étape
showStep(currentStep);