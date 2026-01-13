# Documentation Technique - Landing Page Haut Sommet

## Architecture générale

J'ai conçu cette landing page avec une architecture simple et performante basée sur trois piliers :

1. Un frontend statique en HTML/CSS/JavaScript
2. Des services tiers pour les fonctionnalités backend
3. Une organisation modulaire du code JavaScript

### Schéma d'architecture

```
[Navigateur utilisateur]
        |
        | Soumet formulaire
        v
[JavaScript frontend]
        |
        +---> [EmailJS] ---> [Gmail] ---> Équipe commerciale
        |
        +---> [Make.com] ---> [Brevo API] ---> SMS au prospect
```

## Choix techniques et justifications

### Pourquoi j'ai choisi une architecture sans backend

J'ai opté pour une solution 100% frontend avec services tiers car :

**Simplicité de déploiement**
Je peux héberger le site sur n'importe quel serveur web statique (Apache, Nginx, GitHub Pages, Netlify). Je n'ai pas besoin de gérer un serveur Node.js ou PHP.

**Coûts réduits**
Les services gratuits suffisent pour démarrer (200 emails/mois, 20 SMS/jour). Je n'ai pas de frais de serveur backend.

**Maintenance minimale**
Je n'ai pas de serveur à maintenir, pas de dépendances à mettre à jour côté serveur, pas de failles de sécurité serveur à surveiller.

**Performance**
Un site statique se charge très rapidement. Je bénéficie du cache navigateur optimal.

### Pourquoi j'ai choisi EmailJS plutôt qu'un formulaire PHP

**Sans EmailJS (solution traditionnelle PHP)**
```php
<?php
mail($to, $subject, $message, $headers);
?>
```

Problèmes avec cette approche :
- Je dois gérer la configuration SMTP
- Je dois gérer les erreurs d'envoi
- Je dois implémenter la sécurité anti-spam
- Je dois héberger sur un serveur PHP

**Avec EmailJS**
```javascript
emailjs.send(serviceID, templateID, templateParams)
```

Avantages :
- Je délègue la complexité d'envoi d'email
- Je bénéficie d'un système anti-spam intégré
- Je peux personnaliser mes templates visuellement
- Je garde un site 100% statique

### Pourquoi j'ai choisi Make.com comme middleware SMS

J'aurais pu envoyer les SMS directement depuis le JavaScript vers l'API Brevo, mais j'ai choisi Make.com car :

**Sécurité de la clé API**
```javascript
// Mauvaise pratique : Clé API exposée dans le code
fetch('https://api.brevo.com/v3/transactionalSMS/sms', {
    headers: { 'api-key': 'ma_cle_secrete_visible_dans_le_code' }
})
```

Avec Make.com, je masque la clé API Brevo. Le frontend appelle uniquement une URL webhook publique sans authentification sensible.

**Gestion des erreurs**
Make.com gère automatiquement les retry en cas d'échec. Si Brevo est temporairement indisponible, Make.com réessaie automatiquement.

**Logs et monitoring**
J'ai accès à un historique visuel de toutes les exécutions dans l'interface Make.com. Je peux voir exactement quel SMS a été envoyé quand et à qui.

**Flexibilité future**
Si je veux changer de provider SMS demain, je modifie juste le scénario Make.com sans toucher au code frontend.

### Pourquoi j'ai choisi Brevo pour les SMS

J'ai évalué plusieurs solutions :

**Twilio**
- Très populaire mais plus cher (0,06€/SMS en France)
- Documentation complexe
- Nécessite une vérification d'identité lourde

**OVH SMS**
- Prix compétitif (0,04€/SMS)
- Mais API moins intuitive
- Moins de documentation

**Brevo (choix final)**
- Prix excellent (0,046€/SMS)
- Plan gratuit 20 SMS/jour pour tester
- API simple et documentée
- Interface française
- RGPD compliant (serveurs en France)
- Intégration native avec Make.com

## Structure des fichiers JavaScript

### Organisation modulaire

J'ai structuré le JavaScript en modules indépendants pour :
- Faciliter la maintenance
- Permettre le travail en équipe
- Isoler les responsabilités
- Simplifier le debugging

### Module config.js

```javascript
const EMAILJS_CONFIG = {
    serviceID: 'service_64807va',
    templateID: 'template_wt7uqyk',
    publicKey: 'NMJm1o0Uk4AvGz4hb',
    emailDestination: 'contact.hautsommet@gmail.com'
};
```

**Rôle**
Je centralise toute la configuration EmailJS. Si je dois changer de compte EmailJS, je modifie uniquement ce fichier.

**Export**
J'exporte la configuration via `window.EMAILJS_CONFIG` pour la rendre accessible aux autres modules.

### Module validation.js

**Rôle**
Je gère toute la logique de validation et sécurité des données.

**Fonctions principales**

`validateInput(input)`
Je valide un champ individuel selon son type (nom, email, téléphone, etc.).

`validateFormData(data)`
Je valide l'ensemble des données avant soumission. Je vérifie que tous les champs requis sont présents et au bon format.

`sanitizeInput(value)`
Je nettoie les données pour éliminer tout code malveillant (XSS).

`checkAppartementEligibility(balcon, mur)`
Je vérifie si l'appartement est éligible pour l'installation d'une PAC.

**Sécurité implémentée**

Protection XSS multi-couches :
```javascript
// Couche 1 : Détection de patterns dangereux
if (/<|>|script|javascript|onerror|onload/.test(value)) {
    return false;
}

// Couche 2 : Encodage HTML
const div = document.createElement('div');
div.textContent = value;
const encoded = div.innerHTML;

// Couche 3 : Listes blanches
const validOptions = ['maison', 'appartement'];
if (!validOptions.includes(value)) {
    return false;
}
```

### Module email.js

**Rôle**
Je gère l'envoi des emails via EmailJS.

**Fonction principale**

```javascript
async function sendEmail(formData) {
    const templateParams = {
        to_email: EMAILJS_CONFIG.emailDestination,
        civilite: formData.civilite,
        prenom: formData.prenom,
        nom: formData.nom,
        // ... autres champs
    };
    
    return emailjs.send(
        EMAILJS_CONFIG.serviceID,
        EMAILJS_CONFIG.templateID,
        templateParams,
        EMAILJS_CONFIG.publicKey
    );
}
```

**Gestion d'erreurs**
Je capture les erreurs et je les log pour faciliter le debugging :
```javascript
try {
    await emailjs.send(...);
    console.log('Email envoyé avec succès');
} catch (error) {
    console.error('Erreur envoi email:', error);
    throw error;
}
```

### Module sms.js

**Rôle**
Je gère l'envoi des SMS via Make.com et Brevo.

**Fonction principale**

```javascript
async function sendSMS(formData) {
    // Formatage du numéro
    const phoneFormatted = formatPhoneNumber(formData.telephone);
    
    // Création du message personnalisé
    const message = createSMSMessage(formData);
    
    // Envoi au webhook
    const response = await fetch(SMS_CONFIG.webhookURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            telephone: phoneFormatted,
            message: message
        })
    });
}
```

**Formatage du numéro**
Je convertis les numéros français au format international :
```javascript
function formatPhoneNumber(phone) {
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');
    
    if (cleaned.startsWith('0')) {
        cleaned = '+33' + cleaned.substring(1);
    }
    
    return cleaned;
}
```

**Personnalisation du message**
Je crée un message avec civilité et nom :
```javascript
function createSMSMessage(formData) {
    const civilite = formData.civilite === 'mr' ? 'Monsieur' : 'Madame';
    const nom = formData.nom;
    
    return `Bonjour ${civilite} ${nom}, votre demande d'aide à l'installation d'une pompe à chaleur a bien été reçue. Un expert Haut-Sommet vous contactera sous 48h. Merci ! - Haut Sommet`;
}
```

Je limite à 160 caractères pour éviter la facturation de plusieurs SMS.

### Module form.js

**Rôle**
Je gère toute la logique du formulaire multi-étapes.

**Variables d'état**
```javascript
let currentStep = 1;
const totalSteps = 5;
```

**Navigation entre étapes**

J'ai implémenté un système de navigation fluide :
```javascript
function showStep(stepNumber) {
    // Je cache toutes les étapes
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // J'affiche l'étape courante
    const currentStepElement = document.getElementById(`step${stepNumber}`);
    currentStepElement.classList.add('active');
    
    // Je mets à jour la barre de progression
    const progress = (stepNumber / totalSteps) * 100;
    progressBar.style.width = `${progress}%`;
}
```

**Validation avant avancement**

Je valide chaque étape avant de permettre l'avancement :
```javascript
function validateCurrentStep() {
    const currentStepElement = document.querySelector('.form-step.active');
    const requiredInputs = currentStepElement.querySelectorAll('[required]');
    
    for (let input of requiredInputs) {
        if (!validateInput(input)) {
            return false;
        }
    }
    
    return true;
}
```

**Soumission du formulaire**

Au submit, je gère l'envoi email et SMS en séquence :
```javascript
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 1. Validation finale
    if (!validateFormData(data)) {
        return;
    }
    
    // 2. Envoi email
    await sendEmail(data);
    console.log('Email envoyé');
    
    // 3. Envoi SMS (non bloquant)
    try {
        await sendSMS(data);
        console.log('SMS envoyé');
    } catch (error) {
        console.warn('Erreur SMS (non bloquant):', error);
    }
    
    // 4. Affichage confirmation
    showStep(currentStep + 1);
});
```

J'envoie le SMS de manière non-bloquante pour que l'utilisateur voie la confirmation même si le SMS échoue.

### Module menu.js

**Rôle**
Je gère le menu burger mobile et la navigation.

**Fonctionnalités**
```javascript
burgerMenu.addEventListener('click', () => {
    burgerMenu.classList.toggle('active');
    navbar.classList.toggle('active');
});

// Fermeture au clic sur un lien
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        burgerMenu.classList.remove('active');
        navbar.classList.remove('active');
    });
});
```

### Module faq.js

**Rôle**
Je gère l'accordéon des questions fréquentes.

**Fonctionnalité**
```javascript
faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Je ferme toutes les autres questions
        faqItems.forEach(item => item.classList.remove('active'));
        
        // Je toggle la question cliquée
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});
```

## Système de validation

### Architecture de la validation

J'ai implémenté une validation en trois couches :

**Couche 1 : Validation HTML5**
```html
<input type="email" required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$">
```

**Couche 2 : Validation JavaScript temps réel**
```javascript
input.addEventListener('blur', () => {
    validateInput(input);
});
```

**Couche 3 : Validation pré-soumission**
```javascript
form.addEventListener('submit', (e) => {
    if (!validateFormData(data)) {
        e.preventDefault();
    }
});
```

### Validation par type de champ

**Noms et prénoms**
```javascript
// Min 2 caractères, max 50
// Lettres, espaces, tirets, apostrophes uniquement
const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']{2,50}$/;
```

**Email**
```javascript
// Format RFC 5322 simplifié
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
```

**Téléphone**
```javascript
// 10 chiffres commençant par 06 ou 07
const phoneRegex = /^(06|07)\d{8}$/;
```

**Département**
```javascript
// 01-95 (sauf 20), 2A, 2B, 971-976
const deptRegex = /^([0][1-9]|[1-8][0-9]|9[0-5]|2[AB]|97[1-6])$/;
```

### Protection XSS

J'ai implémenté plusieurs niveaux de protection :

**Détection de patterns dangereux**
```javascript
const dangerousPatterns = /<|>|script|javascript|onerror|onload|onclick|eval|alert/gi;

if (dangerousPatterns.test(value)) {
    console.warn('Tentative d\'injection détectée');
    return false;
}
```

**Sanitization HTML**
```javascript
function sanitizeInput(value) {
    const div = document.createElement('div');
    div.textContent = value;
    let sanitized = div.innerHTML;
    
    // Suppression des scripts et iframes
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
    
    return sanitized;
}
```

**Listes blanches**
```javascript
const validHabitation = ['maison', 'appartement'];
const validStatut = ['proprietaire', 'locataire'];

if (!validHabitation.includes(data.habitation)) {
    console.error('Valeur habitation non autorisée');
    return false;
}
```

## Système d'envoi des notifications

### Flow complet d'une soumission

```
1. Utilisateur remplit formulaire
    - Validation temps réel à chaque champ

2. Utilisateur clique "Envoyer"
    - Validation finale de toutes les données
       - Si il y a une  erreur : affichage message + stop
       - Si OK : continue

3. Envoi email via EmailJS
    - Construction templateParams
    - Appel API EmailJS
       - Si il y a une erreur : affichage message + stop
       - Si OK : continue

4. Envoi SMS via Make.com
   - Formatage numéro (+33...)
   - Création message personnalisé
   - Appel webhook Make.com
       - Make.com reçoit les données
       - Make.com appelle API Brevo
           - Brevo envoie le SMS
       - Si il y a une erreur : log mais ne bloque pas
       - Si OK : log succès

5. Affichage page confirmation
```

### Gestion des erreurs

J'ai implémenté une gestion d'erreurs granulaire :

**Erreur email (bloquante)**
```javascript
try {
    await sendEmail(data);
} catch (error) {
    console.error('Erreur email:', error);
    alert('Erreur lors de l\'envoi. Veuillez réessayer.');
    // Je réactive le bouton submit
    submitBtn.disabled = false;
    return; // Je stoppe le processus
}
```

**Erreur SMS (non bloquante)**
```javascript
try {
    await sendSMS(data);
    console.log('SMS envoyé');
} catch (error) {
    console.warn('Erreur SMS (non bloquant):', error);
    // Je continue quand même vers la confirmation
}
```

Je traite l'erreur SMS comme non bloquante car l'email est la notification principale. Le SMS est un bonus pour améliorer l'expérience utilisateur.

### Format des données envoyées

**Vers EmailJS**
```javascript
{
    to_email: "contact.hautsommet@gmail.com",
    civilite: "Madame",
    prenom: "Marie",
    nom: "Dupont",
    telephone: "0612345678",
    email: "marie.dupont@email.com",
    departement: "13",
    type_habitation: "Maison",
    statut: "Propriétaire",
    type_chauffage: "Gaz",
    date_soumission: "2026-01-13 10:30:15"
}
```

**Vers Make.com/Brevo**
```javascript
{
    telephone: "+33612345678",
    message: "Bonjour Madame Dupont, votre demande...",
    metadata: {
        prenom: "Marie",
        nom: "Dupont",
        date: "2026-01-13T10:30:15.000Z",
        source: "Formulaire Landing Page Haut Sommet"
    }
}
```

Les métadonnées permettent le tracking et le debugging dans Make.com.

## Architecture CSS

### Principe du CSS mobile-first

J'ai adopté une approche mobile-first car :
- 60% du trafic web est mobile
- Google indexe d'abord la version mobile
- Plus facile d'enrichir que de simplifier

### Structure des fichiers

**style.css (base + desktop)**
Je définis d'abord les styles de base et desktop car ce sont les plus complets.

**tablet.css (768px - 1023px)**
Je surcharge uniquement ce qui diffère sur tablette (grilles en 2 colonnes au lieu de 3).

**mobile.css (< 768px)**
Je surcharge uniquement ce qui diffère sur mobile (grilles en 1 colonne, tailles de police réduites).

### Variables CSS

J'utilise les custom properties CSS pour faciliter la maintenance :
```css
:root {
    --primary-blue: #0066CC;
    --spacing-sm: 1rem;
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --transition-base: 0.3s ease;
}
```

Avantages :
- Je change une couleur à un seul endroit
- Je garde une cohérence visuelle
- Je facilite les thèmes alternatifs futurs

### Animations

J'ai créé plusieurs animations CSS :

**Apparition des éléments**
```css
@keyframes fadeInSlide {
    from {
        opacity: 0;
        transform: translateX(20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
```

**Pulsation des badges**
```css
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
}
```

**Shake en cas d'erreur**
```css
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}
```

## Performance

### Optimisations implémentées

**Chargement CSS conditionnel**
```html
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="tablet.css" media="(min-width: 768px) and (max-width: 1023px)">
<link rel="stylesheet" href="mobile.css" media="(max-width: 767px)">
```

Le navigateur ne télécharge que le CSS nécessaire selon la taille d'écran.

**JavaScript defer**
```html
<script defer src="assets/js/main.js"></script>
```

Je charge le JavaScript après le HTML pour ne pas bloquer le rendu.

**Preconnect pour CDN**
```html
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
```

Je préconnecte aux CDN pour réduire la latence.

### Métriques de performance

J'ai optimisé pour respecter les Core Web Vitals :

**LCP (Largest Contentful Paint)**
Cible : < 2.5s
Je charge le hero en priorité avec le CSS inline critique.

**FID (First Input Delay)**
Cible : < 100ms
J'utilise JavaScript natif léger sans framework lourd.

**CLS (Cumulative Layout Shift)**
Cible : < 0.1
Je définis les dimensions des images et je pré-alloue l'espace des éléments dynamiques.

## Sécurité

### Attaques couvertes

**XSS (Cross-Site Scripting)**
Je protège contre :
- Injection dans les champs texte
- Injection dans les attributs HTML
- Injection de scripts via les URLs

**CSRF (Cross-Site Request Forgery)**
Protection partielle :
- Validation de l'origine (referer)
- Tokens recommandés pour production

**Injection SQL**
Non applicable (pas de base de données).

**Spam et bots**
Protection basique :
- Validation stricte des formats
- Rate limiting recommandé
- Honeypot field possible

### Recommandations de sécurité

Pour une mise en production sécurisée, je recommande :

1. Implémenter un token CSRF
2. Ajouter un rate limiting côté serveur
3. Mettre en place un captcha (reCAPTCHA)
4. Logger les tentatives d'injection
5. Monitorer les soumissions anormales

## Monitoring et debugging

### Logs implémentés

J'ai ajouté des logs à chaque étape critique :

```javascript
console.log('Module SMS chargé');
console.log('Numéro formaté:', phoneFormatted);
console.log('Message SMS créé:', message);
console.log('Email envoyé avec succès');
console.log('SMS envoyé avec succès');
```

### Debugging dans la console

En cas de problème, je consulte la console (F12) pour voir :
- Quel module a été chargé
- Quelles données ont été validées
- Quel appel API a échoué
- Quel message d'erreur exact

### Monitoring Make.com

Dans Make.com, j'accède à :
- Historique des exécutions
- Détail de chaque appel webhook
- Données reçues et envoyées
- Erreurs éventuelles

## Tests

### Tests manuels à effectuer

**Test formulaire maison**
1. Je sélectionne "Maison"
2. Je remplis tous les champs
3. Je vérifie la réception email
4. Je vérifie la réception SMS

**Test formulaire appartement éligible**
1. Je sélectionne "Appartement"
2. Je sélectionne "Balcon"
3. Je remplis les autres champs
4. Je vérifie la réception

**Test appartement non éligible**
1. Je sélectionne "Appartement"
2. Je sélectionne "Pas de balcon/terrasse"
3. Je sélectionne "Pas d'accès mur"
4. Je vérifie le message d'erreur

**Test validation**
1. Je teste chaque champ avec des données invalides
2. Je vérifie les messages d'erreur
3. Je teste les injections XSS

### Tests de sécurité

Je teste les payloads XSS courants :
```
<script>alert('XSS')</script>
javascript:alert(1)
<img src=x onerror=alert(1)>
' OR '1'='1
```

Tous doivent être bloqués avec un message "Caractères non autorisés".

## Maintenance

### Tâches de maintenance régulières

**Quotidienne**
- Je vérifie l'historique Make.com
- Je contrôle les crédits SMS Brevo
- Je surveille les emails reçus

**Hebdomadaire**
- Je consulte les statistiques EmailJS
- Je vérifie les logs d'erreurs
- Je teste le formulaire

**Mensuelle**
- Je mets à jour les dépendances (Bootstrap Icons)
- Je révise les quotas des services
- Je sauvegarde la configuration

### Évolutions futures

**Court terme **
- Ajouter Google Analytics
- Implémenter un captcha
- Optimiser les images en WebP

**Moyen terme**
- Intégrer un système de prise de rendez-vous
- Créer un espace client
- Ajouter un chatbot

**Long terme **
- Intégration CRM
- A/B testing
- Espace de suivi de dossier

## Conclusion

J'ai conçu cette landing page avec une approche pragmatique :
- Simplicité d'architecture
- Services tiers fiables
- Code maintenable et documenté
- Sécurité renforcée
- Performance optimisée

L'objectif est de générer des leads qualifiés de manière fiable et sécurisée tout en minimisant les coûts d'infrastructure et de maintenance.
