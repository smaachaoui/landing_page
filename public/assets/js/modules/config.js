// CONFIGURATION EMAILJS


// J'ai centralisé ici toutes les informations de connexion à EmailJS
// Cela permet de gérer facilement les identifiants en un seul endroit

const EMAILJS_CONFIG = {
    // J'ai configuré l'ID du service EmailJS
    serviceID: 'service_64807va',
    
    // J'ai défini l'ID du template d'email
    templateID: 'template_qu1cjou',
    
    // J'ai ajouté la clé publique pour l'authentification
    publicKey: 'jKNqo-W9zXWuv8Rs5',
    
    // J'ai configuré l'email de destination
    emailDestination: 'contact.hautsommet@gmail.com'
};

// J'exporte la configuration pour qu'elle soit accessible dans les autres modules
window.EMAILJS_CONFIG = EMAILJS_CONFIG;

console.log('Configuration EmailJS chargée avec succès');