// ========================================
// ENVOI EMAIL EMAILJS
// ========================================

async function sendEmail(formData) {
    const config = window.EMAILJS_CONFIG;
    
    const templateParams = {
        to_email: config.emailDestination,
        subject: 'Client à recontacter',
        
        // Données du client
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        
        // Données du projet
        type_habitation: formData.habitation === 'maison' ? 'Maison' : 'Appartement',
        statut: formData.statut === 'proprietaire' ? 'Propriétaire' : 'Locataire',
        type_chauffage: formData.chauffage.charAt(0).toUpperCase() + formData.chauffage.slice(1),
        departement: formData.departement,
        
        // Date
        date_soumission: new Date().toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    return emailjs.send(
        config.serviceID,
        config.templateID,
        templateParams,
        config.publicKey
    );
}

// Exporter pour utilisation dans d'autres fichiers
window.sendEmail = sendEmail;