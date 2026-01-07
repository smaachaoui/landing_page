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
        'autre_chauffage': () => validateSelect(input, value, 'type de chauffage'),
        'balcon_terrasse': () => validateSelect(input, value, 'balcon/terrasse'),
        'etage_appartement': () => validateSelect(input, value, 'étage'),
        'mur_exterieur': () => validateSelect(input, value, 'accès mur extérieur')
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
    // Je vérifie que le format correspond aux départements français valides
    const validFormats = /^([0][1-9]|[1-8][0-9]|9[0-5]|2[AB]|97[1-6])$/;
    
    if (!validFormats.test(value)) {
        showError(input, 'Département invalide');
        return false;
    }
    
    clearError(input);
    return true;
}

// Je valide les champs SELECT (liste déroulante)
function validateSelect(input, value, fieldName) {
    // Je vérifie qu'une option valide a été sélectionnée
    if (!value || value === '') {
        showError(input, `Veuillez sélectionner ${fieldName}`);
        return false;
    }
    
    // Je protège contre les injections XSS
    if (/<|>|script|javascript/gi.test(value)) {
        showError(input, 'Valeur non autorisée');
        return false;
    }
    
    // Je vérifie que la valeur correspond à une option existante du select
    const options = Array.from(input.options).map(opt => opt.value);
    if (!options.includes(value)) {
        showError(input, 'Option invalide');
        return false;
    }
    
    clearError(input);
    return true;
}

// Je valide toutes les données du formulaire avant envoi
function validateFormData(data) {
    // J'ai défini la liste des champs obligatoires de base
    const requiredFields = ['habitation', 'statut', 'chauffage', 'departement', 'civilite',
                           'nom', 'prenom', 'email', 'telephone'];
    
    // Je vérifie que tous les champs requis sont présents
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            console.error(`Champ manquant: ${field}`);
            return false;
        }
    }
    
    // VALIDATION CONDITIONNELLE : Si appartement est sélectionné
    if (data.habitation === 'appartement') {
        const appartementFields = ['balcon_terrasse', 'etage_appartement', 'mur_exterieur'];
        
        for (let field of appartementFields) {
            if (!data[field] || data[field].trim() === '') {
                console.error(`Champ appartement manquant: ${field}`);
                return false;
            }
        }
    }
    
    // VALIDATION CONDITIONNELLE : Si "autre" type de chauffage est sélectionné
    if (data.chauffage === 'autre') {
        if (!data.autre_chauffage || data.autre_chauffage.trim() === '') {
            console.error('Champ autre_chauffage manquant');
            return false;
        }
    }
    
    // Je vérifie une dernière fois tous les formats des champs de base
    const validations = [
        data.nom.length >= 2 && data.nom.length <= 50,
        data.prenom.length >= 2 && data.prenom.length <= 50,
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email),
        /^\d{10}$/.test(data.telephone),
        /^([0][1-9]|[1-8][0-9]|9[0-5]|2[AB]|97[1-6])$/.test(data.departement)
    ];
    
    // Je vérifie la liste blanche des valeurs acceptées pour les radios
    const validHabitation = ['maison', 'appartement'];
    const validStatut = ['proprietaire', 'locataire'];
    const validChauffage = ['gaz', 'fioul', 'electrique', 'bois', 'autre'];
    const validCivilite = ['mr', 'mme'];
    
    validations.push(validHabitation.includes(data.habitation));
    validations.push(validStatut.includes(data.statut));
    validations.push(validChauffage.includes(data.chauffage));
    validations.push(validCivilite.includes(data.civilite));
    
    // Si appartement, je valide aussi les champs spécifiques
    if (data.habitation === 'appartement') {
        const validBalconTerrasse = ['balcon', 'terrasse', 'balcon-terrasse', 'non'];
        const validEtage = ['rdc', '1', '2', '3', '4', '5', '6-plus', 'dernier'];
        const validMurExterieur = ['oui', 'non', 'ne-sais-pas'];
        
        validations.push(validBalconTerrasse.includes(data.balcon_terrasse));
        validations.push(validEtage.includes(data.etage_appartement));
        validations.push(validMurExterieur.includes(data.mur_exterieur));
    }
    
    // Si "autre" chauffage, je valide le select
    if (data.chauffage === 'autre') {
        const validAutreChauffage = [
            'pompe-chaleur-existante',
            'chauffage-solaire',
            'chauffage-au-sol',
            'radiateurs-eau',
            'poele-granules',
            'insert-cheminee',
            'climatisation-reversible',
            'chauffage-mixte',
            'aucun-chauffage',
            'autre-non-liste'
        ];
        
        validations.push(validAutreChauffage.includes(data.autre_chauffage));
    }
    
    // Je retourne true uniquement si toutes les validations sont passées
    return validations.every(v => v === true);
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
    if (typeof value !== 'string') {
        return '';
    }
    
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
}

// J'active la validation en temps réel sur tous les champs texte
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

// J'active la validation en temps réel sur tous les champs SELECT
document.querySelectorAll('select[required]').forEach(select => {
    // Je valide quand l'utilisateur sélectionne une option
    select.addEventListener('change', () => {
        if (select.value !== '') validateInput(select);
    });
    
    // Je supprime l'erreur quand l'utilisateur change sa sélection
    select.addEventListener('focus', () => {
        if (select.classList.contains('input-error')) clearError(select);
    });
});

// J'exporte les fonctions pour les utiliser dans les autres modules
window.validateInput = validateInput;
window.validateFormData = validateFormData;
window.sanitizeInput = sanitizeInput;