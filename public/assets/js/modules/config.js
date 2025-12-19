// Configuration EmailJS
// J'ai centralisé ici toutes les informations de connexion à EmailJS

const EMAILJS_CONFIG = {
    serviceID: 'service_nxwbnml',
    templateID: 'template_qu1cjou',
    publicKey: 'jKNqo-W9zXWuv8Rs5',
    emailDestination: 'testrenov13014@outlook.com'
};

// J'exporte la configuration pour qu'elle soit accessible dans les autres modules
window.EMAILJS_CONFIG = EMAILJS_CONFIG;