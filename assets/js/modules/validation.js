// ========================================
// VALIDATION DES CHAMPS
// ========================================

// Validation principale
function validateInput(input) {
    const value = input.value.trim();
    const name = input.name;
    
    if (value === '') {
        showError(input, 'Ce champ est requis');
        return false;
    }
    
    const validators = {
        'nom': () => validateName(input, value),
        'prenom': () => validateName(input, value),
        'email': () => validateEmail(input, value),
        'telephone': () => validatePhone(input, value),
        'departement': () => validateDepartement(input, value)
    };
    
    return validators[name] ? validators[name]() : true;
}

// Validation nom/prénom
function validateName(input, value) {
    if (value.length < 2) {
        showError(input, 'Minimum 2 caractères');
        return false;
    }
    
    if (value.length > 50) {
        showError(input, 'Maximum 50 caractères');
        return false;
    }
    
    if (/<|>|script|javascript/gi.test(value)) {
        showError(input, 'Caractères non autorisés');
        return false;
    }
    
    if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(value)) {
        showError(input, 'Lettres, espaces, tirets et apostrophes uniquement');
        return false;
    }
    
    clearError(input);
    return true;
}

// Validation email
function validateEmail(input, value) {
    if (value.length > 100) {
        showError(input, 'Email trop long');
        return false;
    }
    
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        showError(input, 'Format email invalide');
        return false;
    }
    
    if (/<|>|script|javascript/gi.test(value)) {
        showError(input, 'Caractères non autorisés');
        return false;
    }
    
    clearError(input);
    return true;
}

// Validation téléphone
function validatePhone(input, value) {
    const cleanPhone = value.replace(/[\s\-\.]/g, '');
    
    if (!/^\d{10}$/.test(cleanPhone)) {
        showError(input, 'Numéro à 10 chiffres requis');
        return false;
    }
    
    if (!cleanPhone.startsWith('06') && !cleanPhone.startsWith('07')) {
        showError(input, 'Doit commencer par 06 ou 07');
        return false;
    }
    
    input.value = cleanPhone;
    clearError(input);
    return true;
}

// Validation département
function validateDepartement(input, value) {
    if (!/^\d{2,3}$/.test(value)) {
        showError(input, '2 ou 3 chiffres requis');
        return false;
    }
    
    const dept = parseInt(value);
    const validDepts = [971, 972, 973, 974, 975, 976];
    
    if (value.length === 2 && (dept < 1 || dept > 95)) {
        showError(input, 'Département invalide');
        return false;
    }
    
    if (value.length === 3 && !validDepts.includes(dept)) {
        showError(input, 'Département DOM-TOM invalide');
        return false;
    }
    
    clearError(input);
    return true;
}

// Validation finale des données
function validateFormData(data) {
    const requiredFields = ['habitation', 'statut', 'chauffage', 'departement', 
                           'nom', 'prenom', 'email', 'telephone'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            console.error(`Champ manquant: ${field}`);
            return false;
        }
    }
    
    return data.nom.length >= 2 && data.nom.length <= 50 &&
           data.prenom.length >= 2 && data.prenom.length <= 50 &&
           /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email) &&
           /^\d{10}$/.test(data.telephone) &&
           /^\d{2,3}$/.test(data.departement);
}

// Gestion des messages d'erreur
function showError(input, message) {
    clearError(input);
    input.classList.add('input-error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    input.parentElement.appendChild(errorDiv);
}

function clearError(input) {
    input.classList.remove('input-error');
    const errorMsg = input.parentElement.querySelector('.error-message');
    if (errorMsg) errorMsg.remove();
}

// Sanitisation des données
function sanitizeInput(value) {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
}

// Validation en temps réel
document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]').forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() !== '') validateInput(input);
    });
    
    input.addEventListener('input', () => {
        if (input.classList.contains('input-error')) clearError(input);
    });
});

// Exporter les fonctions pour les autres fichiers
window.validateInput = validateInput;
window.validateFormData = validateFormData;
window.sanitizeInput = sanitizeInput;