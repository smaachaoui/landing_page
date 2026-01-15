// ============================================
// VALIDATION DES CHAMPS DU FORMULAIRE
// ============================================
// J'ai mis en place un système de validation complet pour sécuriser toutes les saisies
// et protéger contre les injections XSS, SQL et autres attaques

// ============================================
// VALIDATION PRINCIPALE
// ============================================
// Je valide chaque champ selon son type et son nom
function validateInput(input) {
    const value = input.value.trim();
    const name = input.name || input.id.replace('-', '_');
    
    // Je vérifie d'abord que le champ n'est pas vide
    if (value === '') {
        showError(input, 'Ce champ est requis');
        return false;
    }
    
    // J'associe chaque champ à sa fonction de validation spécifique
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
    
    // J'exécute la validation appropriée ou je retourne true par défaut
    return validators[name] ? validators[name]() : true;
}

// ============================================
// VALIDATION DES NOMS ET PRÉNOMS
// ============================================
// Je valide le format des noms et prénoms avec protection XSS
function validateName(input, value) {
    // Je vérifie la longueur minimale
    if (value.length < 2) {
        showError(input, 'Minimum 2 caractères');
        return false;
    }
    
    // Je vérifie la longueur maximale
    if (value.length > 50) {
        showError(input, 'Maximum 50 caractères');
        return false;
    }
    
    // Je protège contre les injections XSS - SÉCURITÉ CRITIQUE
    if (/<|>|script|javascript|onerror|onload|onclick|eval|alert/gi.test(value)) {
        showError(input, 'Caractères non autorisés');
        console.warn(`Tentative d'injection détectée dans le champ ${input.name}: ${value}`);
        return false;
    }
    
    // J'autorise uniquement les lettres, espaces, tirets et apostrophes
    if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(value)) {
        showError(input, 'Lettres, espaces, tirets et apostrophes uniquement');
        return false;
    }
    
    // Je nettoie et valide le contenu
    clearError(input);
    return true;
}

// ============================================
// VALIDATION DE L'EMAIL
// ============================================
// Je valide le format de l'adresse email avec protection XSS
function validateEmail(input, value) {
    // Je vérifie la longueur maximale
    if (value.length > 100) {
        showError(input, 'Email trop long');
        return false;
    }
    
    // Je vérifie le format standard d'email RFC 5322 simplifié
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        showError(input, 'Format email invalide');
        return false;
    }
    
    // Je protège contre les injections XSS dans l'email - SÉCURITÉ CRITIQUE
    if (/<|>|script|javascript|onerror|onload|onclick|eval|alert/gi.test(value)) {
        showError(input, 'Caractères non autorisés');
        console.warn(`Tentative d'injection détectée dans l'email: ${value}`);
        return false;
    }
    
    // Je vérifie qu'il n'y a pas de caractères dangereux
    if (/[<>'"`;()\[\]{}|\\]/g.test(value)) {
        showError(input, 'Caractères spéciaux non autorisés');
        return false;
    }
    
    clearError(input);
    return true;
}

// ============================================
// VALIDATION DU TÉLÉPHONE
// ============================================
// Je valide le numéro de téléphone mobile français
function validatePhone(input, value) {
    // Je retire les espaces, tirets et points
    const cleanPhone = value.replace(/[\s\-\.]/g, '');
    
    // Je vérifie qu'il y a exactement 10 chiffres
    if (!/^\d{10}$/.test(cleanPhone)) {
        showError(input, 'Numéro à 10 chiffres requis');
        return false;
    }
    
    // Je vérifie que c'est un numéro mobile français (commence par 06 ou 07)
    if (!cleanPhone.startsWith('06') && !cleanPhone.startsWith('07')) {
        showError(input, 'Doit commencer par 06 ou 07');
        return false;
    }
    
    // Je protège contre les injections dans le numéro
    if (/[^0-9\s\-\.]/g.test(value)) {
        showError(input, 'Format invalide');
        return false;
    }
    
    // Je nettoie le numéro avant de le sauvegarder
    input.value = cleanPhone;
    clearError(input);
    return true;
}

// ============================================
// VALIDATION DU DÉPARTEMENT
// ============================================
// Je valide le numéro de département français
function validateDepartement(input, value) {
    // Je vérifie que le format correspond aux départements français valides
    // Départements métropolitains: 01-95 (sauf 20)
    // Départements corses: 2A, 2B
    // Départements d'outre-mer: 971-976
    const validFormats = /^([0][1-9]|[1-8][0-9]|9[0-5]|2[AB]|97[1-6])$/;
    
    if (!validFormats.test(value)) {
        showError(input, 'Département invalide');
        return false;
    }
    
    // Je protège contre les injections
    if (/[^0-9AB]/g.test(value)) {
        showError(input, 'Format invalide');
        return false;
    }
    
    clearError(input);
    return true;
}

// ============================================
// VALIDATION DES CHAMPS SELECT
// ============================================
// Je valide les champs SELECT (liste déroulante)
function validateSelect(input, value, fieldName) {
    // Je vérifie qu'une option valide a été sélectionnée
    if (!value || value === '') {
        showError(input, `Veuillez sélectionner ${fieldName}`);
        return false;
    }
    
    // Je protège contre les injections XSS - SÉCURITÉ CRITIQUE
    if (/<|>|script|javascript|onerror|onload|onclick|eval|alert/gi.test(value)) {
        showError(input, 'Valeur non autorisée');
        console.warn(`Tentative d'injection détectée dans le select ${fieldName}: ${value}`);
        return false;
    }
    
    // Je vérifie que la valeur correspond à une option existante du select
    const options = Array.from(input.options).map(opt => opt.value);
    if (!options.includes(value)) {
        showError(input, 'Option invalide');
        console.warn(`Valeur non autorisée dans le select ${fieldName}: ${value}`);
        return false;
    }
    
    clearError(input);
    return true;
}

// ============================================
// VÉRIFICATION ÉLIGIBILITÉ APPARTEMENT
// ============================================
// Je vérifie l'éligibilité pour l'installation d'une PAC en appartement
function checkAppartementEligibility(balconTerrasse, murExterieur) {
    // Conditions d'installation PAC en appartement :
    // ✅ POSSIBLE si : Balcon OU Terrasse OU Accès mur extérieur
    // ❌ IMPOSSIBLE si : PAS de balcon/terrasse ET PAS d'accès mur extérieur
    
    // Je vérifie d'abord que les valeurs sont sécurisées
    const safeBalcon = sanitizeInput(balconTerrasse);
    const safeMur = sanitizeInput(murExterieur);
    
    if (safeBalcon === 'non' && safeMur === 'non') {
        console.error('Appartement non éligible : pas de balcon/terrasse et pas d\'accès mur extérieur');
        return false;
    }
    
    return true;
}

// ============================================
// VALIDATION COMPLÈTE AVANT ENVOI
// ============================================
// Je valide toutes les données du formulaire avant l'envoi
function validateFormData(data) {
    // J'ai défini la liste des champs obligatoires de base
    const requiredFields = ['habitation', 'statut', 'chauffage', 'departement', 
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
        
        // Je vérifie l'éligibilité pour l'installation d'une PAC
        if (!checkAppartementEligibility(data.balcon_terrasse, data.mur_exterieur)) {
            console.error('Appartement non éligible pour installation PAC');
            return false;
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
    
    // Je vérifie la liste blanche des valeurs acceptées pour les radios - SÉCURITÉ CRITIQUE
    const validHabitation = ['maison', 'appartement'];
    const validStatut = ['proprietaire', 'locataire'];
    const validChauffage = ['gaz', 'fioul', 'electrique', 'bois', 'autre'];
    
    validations.push(validHabitation.includes(data.habitation));
    validations.push(validStatut.includes(data.statut));
    validations.push(validChauffage.includes(data.chauffage));
    
    // Si appartement, je valide aussi les champs spécifiques avec liste blanche
    if (data.habitation === 'appartement') {
        const validBalconTerrasse = ['balcon', 'terrasse', 'balcon-terrasse', 'non'];
        const validEtage = ['rdc', '1', '2', '3', '4', '5', '6-plus', 'dernier'];
        const validMurExterieur = ['oui', 'non', 'ne-sais-pas'];
        
        validations.push(validBalconTerrasse.includes(data.balcon_terrasse));
        validations.push(validEtage.includes(data.etage_appartement));
        validations.push(validMurExterieur.includes(data.mur_exterieur));
    }
    
    // Si "autre" chauffage, je valide le select avec liste blanche
    if (data.chauffage === 'autre') {
        const validAutreChauffage = [
            'pompe-chaleur-existante',
            'chauffage-collectif',
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
    
    // Je vérifie qu'aucune donnée ne contient de code malveillant - SÉCURITÉ CRITIQUE
    for (let key in data) {
        if (typeof data[key] === 'string') {
            if (/<|>|script|javascript|onerror|onload|onclick|eval|alert/gi.test(data[key])) {
                console.error(`Tentative d'injection XSS détectée dans le champ ${key}`);
                return false;
            }
        }
    }
    
    // Je retourne true uniquement si toutes les validations sont passées
    return validations.every(v => v === true);
}

// ============================================
// AFFICHAGE DES ERREURS
// ============================================
// J'affiche un message d'erreur sous le champ invalide
function showError(input, message) {
    // Je retire d'abord toute erreur existante
    clearError(input);
    
    // J'ajoute la classe d'erreur au champ
    input.classList.add('input-error');
    
    // Je crée et affiche le message d'erreur
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    input.parentElement.appendChild(errorDiv);
    
    // J'anime l'apparition du message
    errorDiv.style.animation = 'fadeIn 0.2s ease-out';
}

// Je supprime le message d'erreur
function clearError(input) {
    input.classList.remove('input-error');
    const errorMsg = input.parentElement.querySelector('.error-message');
    if (errorMsg) errorMsg.remove();
}

// ============================================
// NETTOYAGE DES DONNÉES (SANITIZATION)
// ============================================
// Je nettoie les données pour éviter les failles XSS - SÉCURITÉ CRITIQUE
function sanitizeInput(value) {
    // Je vérifie d'abord que c'est une chaîne de caractères
    if (typeof value !== 'string') {
        return '';
    }
    
    // Je crée un élément div temporaire pour encoder les caractères HTML
    const div = document.createElement('div');
    div.textContent = value;
    
    // Je récupère la version encodée (protection XSS)
    let sanitized = div.innerHTML;
    
    // Je supprime les scripts et autres balises dangereuses
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/onerror=/gi, '');
    sanitized = sanitized.replace(/onload=/gi, '');
    sanitized = sanitized.replace(/onclick=/gi, '');
    sanitized = sanitized.replace(/eval\(/gi, '');
    sanitized = sanitized.replace(/alert\(/gi, '');
    
    return sanitized;
}

// ============================================
// VALIDATION EN TEMPS RÉEL
// ============================================
// J'active la validation en temps réel sur tous les champs texte
document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]').forEach(input => {
    // Je valide quand l'utilisateur quitte le champ
    input.addEventListener('blur', () => {
        if (input.value.trim() !== '') {
            validateInput(input);
        }
    });
    
    // Je supprime l'erreur quand l'utilisateur commence à corriger
    input.addEventListener('input', () => {
        if (input.classList.contains('input-error')) {
            clearError(input);
        }
    });
});

// J'active la validation en temps réel sur tous les champs SELECT
document.querySelectorAll('select[required]').forEach(select => {
    // Je valide quand l'utilisateur sélectionne une option
    select.addEventListener('change', () => {
        if (select.value !== '') {
            validateInput(select);
        }
    });
    
    // Je supprime l'erreur quand l'utilisateur change sa sélection
    select.addEventListener('focus', () => {
        if (select.classList.contains('input-error')) {
            clearError(select);
        }
    });
});

// ============================================
// EXPORT DES FONCTIONS
// ============================================
// J'exporte les fonctions pour les utiliser dans les autres modules
window.validateInput = validateInput;
window.validateFormData = validateFormData;
window.sanitizeInput = sanitizeInput;
window.checkAppartementEligibility = checkAppartementEligibility;

// console.log('Module de validation chargé avec succès. Protection XSS activée.');