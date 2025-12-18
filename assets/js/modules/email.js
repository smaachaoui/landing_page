// Envoi des emails via EmailJS
// J'utilise le service EmailJS pour transmettre les demandes par email
async function sendEmail(formData) {
    // Je récupère la configuration EmailJS
    const config = window.EMAILJS_CONFIG;
    
    // Je détermine le type de chauffage à afficher dans l'email
    let typeChauffage;
    if (formData.chauffage === 'autre' && formData.autre_chauffage) {
        // Si l'utilisateur a sélectionné "Autre", j'utilise sa saisie personnalisée
        typeChauffage = formData.autre_chauffage;
    } else {
        // Sinon, je mets la première lettre en majuscule
        typeChauffage = formData.chauffage.charAt(0).toUpperCase() + formData.chauffage.slice(1);
    }
    
    // Je prépare tous les paramètres pour le template email
    const templateParams = {
        to_email: config.emailDestination,
        subject: 'Client à recontacter',
        
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