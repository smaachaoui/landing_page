// Envoi des emails via EmailJS
// J'utilise le service EmailJS pour transmettre les demandes par email

// Je crée une fonction helper pour formater les valeurs des SELECT en texte lisible
function formatSelectValue(field, value) {
    const formatters = {
        // Formatage pour le champ "autre_chauffage"
        'autre_chauffage': {
            'pompe-chaleur-existante': 'Pompe à chaleur existante',
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
        // Formatage pour le champ "balcon_terrasse"
        'balcon_terrasse': {
            'balcon': 'Oui, balcon',
            'terrasse': 'Oui, terrasse',
            'balcon-terrasse': 'Oui, balcon et terrasse',
            'non': 'Non'
        },
        // Formatage pour le champ "etage_appartement"
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
        // Formatage pour le champ "mur_exterieur"
        'mur_exterieur': {
            'oui': 'Oui',
            'non': 'Non',
            'ne-sais-pas': 'Ne sais pas'
        }
    };
    
    // Je retourne le texte formaté ou la valeur d'origine si pas de formatter
    return formatters[field]?.[value] || value;
}

async function sendEmail(formData) {
    // Je récupère la configuration EmailJS
    const config = window.EMAILJS_CONFIG;
    
    // Je détermine le type de chauffage à afficher dans l'email
    let typeChauffage;
    if (formData.chauffage === 'autre' && formData.autre_chauffage) {
        // Si l'utilisateur a sélectionné "Autre", je formate la valeur du SELECT
        typeChauffage = formatSelectValue('autre_chauffage', formData.autre_chauffage);
    } else {
        // Sinon, je mets la première lettre en majuscule
        typeChauffage = formData.chauffage.charAt(0).toUpperCase() + formData.chauffage.slice(1);
    }
    
    // Je prépare les paramètres de base pour le template email
    const templateParams = {
        to_email: config.emailDestination,
        subject: 'Client à recontacter',

        civilite: formData.civilite === 'mr' ? 'Monsieur' : 'Madame',
        
        // Je formate les données du client
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        
        // Je formate les données du projet
        type_habitation: formData.habitation === 'maison' ? 'Maison' : 'Appartement',
        statut: formData.statut === 'proprietaire' ? 'Propriétaire' : 'Locataire',
        type_chauffage: typeChauffage,
        departement: formData.departement,
        
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
    if (formData.habitation === 'appartement') {
        templateParams.balcon_terrasse = formatSelectValue('balcon_terrasse', formData.balcon_terrasse);
        templateParams.etage_appartement = formatSelectValue('etage_appartement', formData.etage_appartement);
        templateParams.mur_exterieur = formatSelectValue('mur_exterieur', formData.mur_exterieur);
        
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
    
    // J'envoie l'email via EmailJS
    return emailjs.send(
        config.serviceID,
        config.templateID,
        templateParams,
        config.publicKey
    );
}

// J'exporte la fonction pour l'utiliser dans les autres modules
window.sendEmail = sendEmail;