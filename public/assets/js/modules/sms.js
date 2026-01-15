// ENVOI DES SMS VIA MAKE.COM + BREVO

// J'ai créé ce module pour gérer l'envoi automatique de SMS d'accusé de réception
// via le webhook Make.com qui est connecté à l'API Brevo pour l'envoi de SMS
// Les SMS sont envoyés en parallèle des emails, sans bloquer le formulaire


// CONFIGURATION DU WEBHOOK
// J'ai centralisé ici toutes les informations de connexion au système SMS

// IMPORTANT : Je dois remplacer l'URL webhook par celle que j'ai récupérée sur Make.com
const SMS_CONFIG = {
    // J'ai configuré l'URL du webhook Make.com
    // Cette URL est fournie par Make.com lors de la création du module Webhooks
    webhookURL: 'https://hook.eu1.make.com/g3wux52p3qbyxtrh94g0ey88espxeiag',
    
    // J'ai défini le nom de l'expéditeur qui apparaîtra sur le téléphone du client
    // Maximum 11 caractères, pas d'espaces, alphanumériques uniquement
    sender: 'HautSommet',
    
    // J'ai activé l'envoi de SMS par défaut
    // Je peux mettre "false" pour désactiver temporairement les SMS
    enabled: true
};

// J'exporte la configuration pour qu'elle soit accessible dans les autres modules si besoin
window.SMS_CONFIG = SMS_CONFIG;


// FORMATAGE DU NUMÉRO DE TÉLÉPHONE

// J'ai créé cette fonction pour formater automatiquement le numéro au format international
// Car Brevo nécessite le format +33... pour envoyer les SMS en France
function formatPhoneNumber(phone) {
    // Je supprime tous les espaces, tirets, parenthèses et autres caractères
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');
    
    // Si le numéro commence par 0 (format français), je le remplace par +33
    if (cleaned.startsWith('0')) {
        cleaned = '+33' + cleaned.substring(1);
    }
    
    // Si le numéro ne commence pas par +, j'ajoute le préfixe français +33
    if (!cleaned.startsWith('+')) {
        cleaned = '+33' + cleaned;
    }
    
    // Je log le numéro formaté pour vérifier qu'il est correct dans la console
    console.log('Numéro formaté:', cleaned);
    return cleaned;
}

// ============================================
// CRÉATION DU MESSAGE SMS PERSONNALISÉ
// ============================================
// J'ai créé cette fonction pour générer un message personnalisé avec la civilité et le nom du client
// Le message doit rester court (max 160 caractères pour 1 SMS = 1 crédit)
function createSMSMessage(formData) {
    const civilite = formData.civilite === 'mr' ? 'M.' : 'Mme';
    const nom = formData.nom;
    
    // Message avec droit d'opposition (160 caractères max)
    return `${civilite} ${nom}, votre demande PAC est enregistrée. Expert vous contactera sous 48h. STOP au 36111. - Haut Sommet`;
       
}


// FONCTION D'ENVOI SMS PRINCIPALE

// J'ai créé cette fonction asynchrone pour envoyer le SMS d'accusé de réception
// Elle est appelée automatiquement après l'envoi de l'email dans form.js
async function sendSMS(formData) {
    // Je vérifie d'abord si les SMS sont activés dans la configuration
    if (!SMS_CONFIG.enabled) {
        console.log('SMS désactivé dans la configuration');
        // Je retourne un objet indiquant que le SMS a été sauté volontairement
        return { success: true, skipped: true };
    }
    
    // Je vérifie que l'URL webhook a bien été configurée
    // Si elle contient encore "VOTRE_URL", c'est que l'utilisateur ne l'a pas remplacée
    if (!SMS_CONFIG.webhookURL || SMS_CONFIG.webhookURL.includes('VOTRE_URL')) {
        console.warn('URL webhook Make.com non configurée - SMS non envoyé');
        console.warn('→ Veuillez configurer l\'URL dans sms.js ligne 15');
        // Je retourne une erreur mais je ne bloque pas le formulaire
        return { success: false, error: 'Webhook non configuré' };
    }
    
    // Je vérifie que le formulaire contient bien un numéro de téléphone
    if (!formData.telephone) {
        console.error('Pas de numéro de téléphone fourni');
        return { success: false, error: 'Numéro manquant' };
    }
    
    try {
        // Je formate le numéro de téléphone au format international
        const phoneFormatted = formatPhoneNumber(formData.telephone);
        
        // Je crée le message personnalisé avec la civilité et le nom du client
        const message = createSMSMessage(formData);
        
        // Je prépare les données à envoyer au webhook Make.com
        const webhookData = {
            // J'envoie le numéro formaté
            telephone: phoneFormatted,
            
            // J'envoie le message personnalisé
            message: message,
            
            // J'ajoute des métadonnées pour le suivi et le débogage
            metadata: {
                prenom: formData.prenom,
                nom: formData.nom,
                date: new Date().toISOString(),
                source: 'Formulaire Landing Page Haut Sommet'
            }
        };
        
        // Je log les informations d'envoi pour le débogage (sans afficher le numéro complet)
        console.log('Envoi du SMS vers Make.com...', {
            telephone: phoneFormatted.substring(0, 7) + '...',
            messageLength: message.length
        });
        
        // J'envoie la requête POST au webhook Make.com
        const response = await fetch(SMS_CONFIG.webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(webhookData)
        });
        
        // Je vérifie la réponse du serveur
        if (response.ok) {
            console.log('SMS envoyé avec succès !');
            return { success: true };
        } else {
            // J'ai reçu une erreur HTTP du serveur
            console.error('Erreur lors de l\'envoi du SMS:', response.status, response.statusText);
            return { success: false, error: `Erreur HTTP ${response.status}` };
        }
        
    } catch (error) {
        // J'ai intercepté une erreur (réseau, timeout, etc.)
        console.error('Erreur lors de l\'envoi du SMS:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// EXPORT DE LA FONCTION
// ============================================
// J'exporte la fonction sendSMS
window.sendSMS = sendSMS;

// ============================================
// INITIALISATION ET LOGS
// ============================================
// Je log le chargement du module avec les informations de configuration
console.log('📱 Module SMS chargé avec succès');
console.log('Configuration SMS:', {
    enabled: SMS_CONFIG.enabled,
    webhookConfigured: !SMS_CONFIG.webhookURL.includes('VOTRE_URL'),
    sender: SMS_CONFIG.sender
});

// J'affiche un avertissement si le webhook n'est pas configuré
if (SMS_CONFIG.webhookURL.includes('VOTRE_URL')) {
    console.warn('ATTENTION : URL webhook non configurée !');
    console.warn('→ Modifiez la ligne 15 de sms.js avec votre URL Make.com');
    console.warn('→ Consultez GUIDE_VISUEL.md pour les instructions');
}