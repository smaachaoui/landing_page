// Validation des champs du formulaire
// Je met en place un système de validation complet pour sécuriser toutes les saisies


// Je valide chaque champ selon son type
function validateInput(input) {
    const value = input.value.trim();
    const name = input.name;
    
    if (value === '') {
        showError(input, 'Ce champ est requis');
        return false;
    }
    
    // J'associe chaque champ à sa fonction de validation
    const validators = {
        'nom': () => validateName(input, value),
        'prenom': () => validateName(input, value),
        'email': () => validateEmail(input, value),
        'telephone': () => validatePhone(input, value),
        'departement': () => validateDepartement(input, value),
        'autre_chauffage': () => validateAutreChauffage(input, value)
    };
    
    return validators[name] ? validators[name]() : true;
}

// Je valide le format des noms et prénoms
function validateName(input, value) {
    if (value.length < 2) {
        showError(input, 'Minimum 2 caractères');
        return false;
    }
    
    if (value.length > 50) {
        showError(input, 'Maximum 50 caractères');
        return false;
    }
    
    // Je protège contre les injections XSS
    if (/<|>|script|javascript/gi.test(value)) {
        showError(input, 'Caractères non autorisés');
        return false;
    }
    
    // J'autorise uniquement les lettres, espaces, tirets et apostrophes
    if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(value)) {
        showError(input, 'Lettres, espaces, tirets et apostrophes uniquement');
        return false;
    }
    
    clearError(input);
    return true;
}

// Je valide le format de l'adresse email
function validateEmail(input, value) {
    if (value.length > 100) {
        showError(input, 'Email trop long');
        return false;
    }
    
    // Je vérifie le format standard d'email
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        showError(input, 'Format email invalide');
        return false;
    }
    
    // Je protège contre les injections XSS
    if (/<|>|script|javascript/gi.test(value)) {
        showError(input, 'Caractères non autorisés');
        return false;
    }
    
    clearError(input);
    return true;
}

// Je valide le numéro de téléphone mobile français
function validatePhone(input, value) {
    // Je retire les espaces, tirets et points
    const cleanPhone = value.replace(/[\s\-\.]/g, '');
    
    // Je vérifie qu'il y a exactement 10 chiffres
    if (!/^\d{10}$/.test(cleanPhone)) {
        showError(input, 'Numéro à 10 chiffres requis');
        return false;
    }
    
    // Je vérifie que c'est un numéro mobile (commence par 06 ou 07)
    if (!cleanPhone.startsWith('06') && !cleanPhone.startsWith('07')) {
        showError(input, 'Doit commencer par 06 ou 07');
        return false;
    }
    
    // Je nettoie le numéro avant de le sauvegarder
    input.value = cleanPhone;
    clearError(input);
    return true;
}

// Je valide le numéro de département
function validateDepartement(input, value) {
    // Je vérifie le format (2 ou 3 chiffres)
    if (!/^\d{2,3}$/.test(value)) {
        showError(input, '2 ou 3 chiffres requis');
        return false;
    }
    
    const dept = parseInt(value);
    const validDepts = [971, 972, 973, 974, 975, 976];
    
    // Je valide les départements métropole (01 à 95)
    if (value.length === 2 && (dept < 1 || dept > 95)) {
        showError(input, 'Département invalide');
        return false;
    }
    
    // Je valide les départements DOM-TOM (971 à 976)
    if (value.length === 3 && !validDepts.includes(dept)) {
        showError(input, 'Département DOM-TOM invalide');
        return false;
    }
    
    clearError(input);
    return true;
}

// Je valide le champ "Autre type de chauffage"
function validateAutreChauffage(input, value) {
    if (value.length < 3) {
        showError(input, 'Minimum 3 caractères');
        return false;
    }
    
    if (value.length > 50) {
        showError(input, 'Maximum 50 caractères');
        return false;
    }
    
    // Je protège contre les injections XSS
    if (/<|>|script|javascript/gi.test(value)) {
        showError(input, 'Caractères non autorisés');
        return false;
    }
    
    // Je vérifie qu'il y a au moins une lettre
    if (!/[a-zA-ZÀ-ÿ]/.test(value)) {
        showError(input, 'Veuillez saisir un type de chauffage valide');
        return false;
    }
    
    clearError(input);
    return true;
}

// Je valide toutes les données du formulaire avant envoi
function validateFormData(data) {
    // J'ai défini la liste des champs obligatoires
    const requiredFields = ['habitation', 'statut', 'chauffage', 'departement', 
                           'nom', 'prenom', 'email', 'telephone'];
    
    // Je vérifie que tous les champs requis sont présents
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            console.error(`Champ manquant: ${field}`);
            return false;
        }
    }
    
    // Je vérifie une dernière fois tous les formats
    return data.nom.length >= 2 && data.nom.length <= 50 &&
           data.prenom.length >= 2 && data.prenom.length <= 50 &&
           /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email) &&
           /^\d{10}$/.test(data.telephone) &&
           /^\d{2,3}$/.test(data.departement);
}

// J'affiche un message d'erreur sous le champ invalide
function showError(input, message) {
    clearError(input);
    input.classList.add('input-error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    input.parentElement.appendChild(errorDiv);
}

// Je supprime le message d'erreur
function clearError(input) {
    input.classList.remove('input-error');
    const errorMsg = input.parentElement.querySelector('.error-message');
    if (errorMsg) errorMsg.remove();
}

// Je nettoie les données pour éviter les failles XSS
function sanitizeInput(value) {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
}

// J'active la validation en temps réel sur tous les champs
document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]').forEach(input => {
    // Je valide quand l'utilisateur quitte le champ
    input.addEventListener('blur', () => {
        if (input.value.trim() !== '') validateInput(input);
    });
    
    // Je supprime l'erreur quand l'utilisateur commence à corriger
    input.addEventListener('input', () => {
        if (input.classList.contains('input-error')) clearError(input);
    });
});

// J'exporte les fonctions pour les utiliser dans les autres modules
window.validateInput = validateInput;
window.validateFormData = validateFormData;
window.sanitizeInput = sanitizeInput;