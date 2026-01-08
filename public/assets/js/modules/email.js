// ============================================
// ENVOI DES EMAILS VIA EMAILJS
// ============================================
// J'utilise le service EmailJS pour transmettre les demandes par email
// de manière sécurisée et fiable

// ============================================
// FORMATAGE DES VALEURS
// ============================================
// Je crée une fonction helper pour formater les valeurs des SELECT en texte lisible
function formatSelectValue(field, value) {
    // J'ai créé un dictionnaire de formatage pour chaque champ SELECT
    const formatters = {
        // Je formate le champ "autre_chauffage"
        'autre_chauffage': {
            'pompe-chaleur-existante': 'Pompe à chaleur existante',
            'chauffage-collectif': 'Chauffage collectif',
            'chauffage-solaire': 'Chauffage solaire',
            'chauffage-au-sol': 'Chauffage au sol électrique',
            'radiateurs-eau': 'Radiateurs à eau chaude',
            'poele-granules': 'Poêle à granulés',
            'insert-cheminee': 'Insert de cheminée',
            'climatisation-reversible': 'Climatisation réversible',
            'chauffage-mixte': 'Chauffage mixte',
            'aucun-chauffage': 'Aucun chauffage',
            'autre-non-liste': 'Autre (non listé)'
        },
        // Je formate le champ "balcon_terrasse"
        'balcon_terrasse': {
            'balcon': 'Oui, balcon',
            'terrasse': 'Oui, terrasse',
            'balcon-terrasse': 'Oui, balcon et terrasse',
            'non': 'Non'
        },
        // Je formate le champ "etage_appartement"
        'etage_appartement': {
            'rdc': 'Rez-de-chaussée',
            '1': '1er étage',
            '2': '2ème étage',
            '3': '3ème étage',
            '4': '4ème étage',
            '5': '5ème étage',
            '6-plus': '6ème étage ou plus',
            'dernier': 'Dernier étage'
        },
        // Je formate le champ "mur_exterieur"
        'mur_exterieur': {
            'oui': 'Oui',
            'non': 'Non',
            'ne-sais-pas': 'Ne sais pas'
        }
    };
    
    // Je retourne le texte formaté ou la valeur d'origine si pas de formatter
    return formatters[field]?.[value] || value;
}

// ============================================
// FONCTION D'ENVOI EMAIL
// ============================================
// J'envoie l'email avec toutes les données du formulaire
async function sendEmail(formData) {
    // Je récupère la configuration EmailJS
    const config = window.EMAILJS_CONFIG;
    
    // Je sécurise toutes les données avant l'envoi
    const sanitizedData = {};
    for (let key in formData) {
        sanitizedData[key] = window.sanitizeInput(formData[key]);
    }
    
    // Je détermine le type de chauffage à afficher dans l'email
    let typeChauffage;
    if (sanitizedData.chauffage === 'autre' && sanitizedData.autre_chauffage) {
        // Si l'utilisateur a sélectionné "Autre", je formate la valeur du SELECT
        typeChauffage = formatSelectValue('autre_chauffage', sanitizedData.autre_chauffage);
    } else {
        // Sinon, je mets la première lettre en majuscule
        typeChauffage = sanitizedData.chauffage.charAt(0).toUpperCase() + sanitizedData.chauffage.slice(1);
    }
    
    // Je prépare les paramètres de base pour le template email
    const templateParams = {
        to_email: config.emailDestination,
        subject: 'Client à recontacter',

        // Je formate la civilité
        civilite: sanitizedData.civilite === 'mr' ? 'Monsieur' : 'Madame',
        
        // Je formate les données du client
        nom: sanitizedData.nom,
        prenom: sanitizedData.prenom,
        email: sanitizedData.email,
        telephone: sanitizedData.telephone,
        
        // Je formate les données du projet
        type_habitation: sanitizedData.habitation === 'maison' ? 'Maison' : 'Appartement',
        statut: sanitizedData.statut === 'proprietaire' ? 'Propriétaire' : 'Locataire',
        type_chauffage: typeChauffage,
        departement: sanitizedData.departement,
        
        // J'ajoute la date et l'heure de soumission
        date_soumission: new Date().toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    // J'ajoute les informations spécifiques si c'est un appartement
    if (sanitizedData.habitation === 'appartement') {
        // Je formate chaque champ appartement
        templateParams.balcon_terrasse = formatSelectValue('balcon_terrasse', sanitizedData.balcon_terrasse);
        templateParams.etage_appartement = formatSelectValue('etage_appartement', sanitizedData.etage_appartement);
        templateParams.mur_exterieur = formatSelectValue('mur_exterieur', sanitizedData.mur_exterieur);
        
        // Je crée un résumé formaté des infos appartement pour l'email
        templateParams.infos_appartement = 
        `   Balcon/Terrasse: ${templateParams.balcon_terrasse}
            Étage: ${templateParams.etage_appartement}
            Accès mur extérieur: ${templateParams.mur_exterieur}
        `;
    } else {
        // Si c'est une maison, je n'envoie pas ces champs
        templateParams.infos_appartement = 'Non applicable (Maison individuelle)';
    }
    
    // Je log les données pour le débogage (sans les données sensibles)
    console.log('J\'envoie l\'email avec les paramètres:', {
        ...templateParams,
        email: '***@***.***', // Je masque l'email pour la sécurité
        telephone: '******' // Je masque le téléphone pour la sécurité
    });
    
    try {
        // J'envoie l'email via EmailJS
        const response = await emailjs.send(
            config.serviceID,
            config.templateID,
            templateParams,
            config.publicKey
        );
        
        console.log('Email envoyé avec succès !', response);
        return response;
        
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        throw error;
    }
}

// ============================================
// EXPORT DE LA FONCTION
// ============================================
// J'exporte la fonction pour l'utiliser dans les autres modules
window.sendEmail = sendEmail;

console.log('Module d\'envoi d\'email chargé avec succès');