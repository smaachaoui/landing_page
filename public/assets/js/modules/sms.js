// ENVOI DES SMS VIA MAKE.COM + BREVO

// J'ai créé ce module pour gérer l'envoi automatique de SMS d'accusé de réception
// via le webhook Make.com qui est connecté à l'API Brevo pour l'envoi de SMS
// Les SMS sont envoyés en parallèle des emails, sans bloquer le formulaire


// CONFIGURATION DU WEBHOOK
// J'ai centralisé ici toutes les informations de connexion au système SMS

const SMS_CONFIG = {
    // J'ai configuré l'URL du webhook Make.com
    webhookURL: 'https://hook.eu1.make.com/g3wux52p3qbyxtrh94g0ey88espxeiag',
    
    // Clé API pour sécuriser le webhook (configurée dans Make.com)
    apiKey: 'Hs2026SecretWebhook!PAC-Marseille',
    
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
    return `${civilite} ${nom}, votre simulation PAC a bien été enregistrée. Un conseiller Haut Sommet vous contactera sous 48h. STOP au 36111`;
       
}


// FONCTION D'ENVOI SMS PRINCIPALE

// J'ai créé cette fonction asynchrone pour envoyer le SMS d'accusé de réception
// Elle est appelée automatiquement après l'envoi de l'email dans form.js
async function sendSMS(formData) {
    // Je vérifie d'abord si les SMS sont activés dans la configuration
    if (!SMS_CONFIG.enabled) {
        return { success: true, skipped: true };
    }
    
    // Je vérifie que l'URL webhook a bien été configurée
    if (!SMS_CONFIG.webhookURL || SMS_CONFIG.webhookURL.includes('VOTRE_URL')) {
        console.warn('URL webhook Make.com non configurée - SMS non envoyé');
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
            telephone: phoneFormatted,
            message: message,
            metadata: {
                prenom: formData.prenom,
                nom: formData.nom,
                date: new Date().toISOString(),
                source: 'Formulaire Landing Page Haut Sommet'
            }
        };
        
        // J'envoie la requête POST au webhook Make.com avec la clé API sécurisée
        const response = await fetch(SMS_CONFIG.webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-make-apikey': SMS_CONFIG.apiKey  // Header d'authentification Make.com
            },
            body: JSON.stringify(webhookData)
        });
        
        // Je vérifie la réponse du serveur
        if (response.ok) {
            return { success: true };
        } else {
            return { success: false, error: `Erreur HTTP ${response.status}` };
        }
        
    } catch (error) {
        console.error('Erreur lors de l\'envoi du SMS:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// EXPORT DE LA FONCTION
// ============================================
window.sendSMS = sendSMS;