# Guide Complet Pour Débutants - Landing Page Haut Sommet

Ce guide explique comment configurer tous les services nécessaires pour faire fonctionner votre landing page. Je vous guide pas à pas, même si vous n'avez jamais touché à ces outils.

---

## Table des matières

1. EmailJS - Pour recevoir les emails de prospects
2. Brevo - Pour envoyer les SMS de confirmation
3. Make.com - Pour connecter le formulaire et Brevo
4. Cloudflare Pages - Pour héberger votre site gratuitement

---

# 1. EMAILJS - Recevoir les emails de prospects

## Qu'est-ce que c'est ?

EmailJS permet de recevoir automatiquement un email dans votre boîte Gmail chaque fois qu'un prospect remplit le formulaire.

## Coûts EmailJS

### Offre Gratuite (recommandée pour démarrer)
- **Prix : 0€/mois**
- 200 emails/mois maximum
- Parfait pour tester et démarrer
- Aucune carte bancaire requise

### Offre Payante (si vous dépassez 200 emails)
- **Prix : 5€/mois**
- 500 emails/mois
- Support prioritaire
- Pas de limite stricte

**Mon conseil :** Commencez avec l'offre gratuite. 200 emails/mois = environ 7 prospects par jour, ce qui est largement suffisant pour démarrer.

---

## Configuration EmailJS - Étape par étape

### Étape 1 : Créer un compte

1. J'ouvre mon navigateur et je vais sur https://www.emailjs.com
2. Je clique sur le bouton bleu **"Sign Up Free"** (Inscription gratuite)
3. Je remplis le formulaire :
   - Mon email professionnel (contact.hautsommet@gmail.com)
   - Un mot de passe sécurisé (je le note quelque part)
4. Je clique sur **"Sign Up"**
5. Je vérifie ma boîte email et je clique sur le lien de confirmation
6. Mon compte est créé !

### Étape 2 : Connecter Gmail

Une fois connecté à EmailJS, je vois un tableau de bord.

1. Dans le menu de gauche, je clique sur **"Email Services"**
2. Je clique sur le bouton **"Add New Service"**
3. Une fenêtre s'ouvre avec plein de logos
4. Je clique sur le logo **Gmail**
5. EmailJS me demande de me connecter à Google
6. Je clique sur **"Autoriser"**
7. Gmail est maintenant connecté !

**Ce que je vois :**
- Service Name : "gmail" (je peux le renommer si je veux)
- Service ID : quelque chose comme "service_abc123" (je le note !)

### Étape 3 : Créer le template d'email

Le template est le modèle d'email que je vais recevoir à chaque fois qu'un prospect remplit le formulaire.

1. Dans le menu de gauche, je clique sur **"Email Templates"**
2. Je clique sur **"Create New Template"**
3. Je vois un éditeur qui ressemble à un email

**Je configure les champs :**

**Champ "To Email"** (en haut)
```
contact.hautsommet@gmail.com
```
C'est l'adresse qui recevra les emails de prospects.

**Champ "Subject"** (Objet de l'email)
```
Nouvelle demande pompe à chaleur - {{prenom}} {{nom}}
```

**Champ "Content"** (Corps de l'email)

Je copie-colle ce texte dans la zone de contenu :

```html
<h2>Nouvelle demande de renseignement</h2>

<h3>Informations du prospect</h3>
<ul>
    <li><strong>Civilité :</strong> {{civilite}}</li>
    <li><strong>Prénom :</strong> {{prenom}}</li>
    <li><strong>Nom :</strong> {{nom}}</li>
    <li><strong>Téléphone :</strong> {{telephone}}</li>
    <li><strong>Email :</strong> {{email}}</li>
    <li><strong>Département :</strong> {{departement}}</li>
</ul>

<h3>Informations logement</h3>
<ul>
    <li><strong>Type habitation :</strong> {{type_habitation}}</li>
    <li><strong>Statut :</strong> {{statut}}</li>
    <li><strong>Chauffage actuel :</strong> {{type_chauffage}}</li>
</ul>

<h3>Détails supplémentaires</h3>
<p><strong>Date de soumission :</strong> {{date_soumission}}</p>
<p><strong>Source :</strong> Formulaire Landing Page</p>
```

4. Je clique sur **"Save"** en haut à droite
5. Mon template est créé !

**Je note quelque part :**
- Template ID : quelque chose comme "template_xyz789"

### Étape 4 : Récupérer ma clé publique

1. Dans le menu de gauche, je clique sur **"Account"**
2. Je vois une section **"API Keys"**
3. Je copie la **"Public Key"** (elle ressemble à : NMJm1o0Uk4AvGz4hb)
4. Je la note quelque part

### Étape 5 : Tester l'envoi

EmailJS propose un testeur intégré.

1. Je retourne dans **"Email Templates"**
2. Je clique sur mon template
3. Je clique sur **"Test It"** en haut
4. Je remplis les champs de test :
   - civilite : Madame
   - prenom : Marie
   - nom : Test
   - telephone : 0612345678
   - etc.
5. Je clique sur **"Send Test"**
6. Je vérifie ma boîte Gmail : j'ai reçu l'email !

**Si je n'ai rien reçu :**
- Je vérifie mes spams
- Je vérifie que l'email de destination est correct
- J'attends 2-3 minutes (parfois ça prend du temps)

### Étape 6 : Configuration dans le site web

Je dois maintenant mettre mes identifiants EmailJS dans le code du site.

**J'ouvre le fichier :** `/assets/js/modules/config.js`

Je modifie ces lignes avec MES identifiants :

```javascript
const EMAILJS_CONFIG = {
    serviceID: 'service_abc123',        // Mon Service ID
    templateID: 'template_xyz789',      // Mon Template ID
    publicKey: 'NMJm1o0Uk4AvGz4hb',    // Ma Public Key
    emailDestination: 'contact.hautsommet@gmail.com'
};
```

Je sauvegarde le fichier.

**C'est terminé pour EmailJS !**

---

## Suivi et statistiques EmailJS

### Consulter mes statistiques

1. Je me connecte sur https://dashboard.emailjs.com
2. Dans le menu, je clique sur **"Stats"**
3. Je vois :
   - Nombre d'emails envoyés ce mois
   - Quota restant (ex: 45/200)
   - Taux de succès

### Que faire si j'approche des 200 emails ?

**Option 1 : Passer à l'offre payante**
- 5€/mois pour 500 emails
- Je clique sur "Upgrade" et je paie par carte

**Option 2 : Créer un second compte gratuit**
- Je crée un nouveau compte avec un autre email
- Je configure un nouveau service
- Je change les identifiants dans config.js

---

# 2. BREVO - Envoyer les SMS de confirmation

## Qu'est-ce que c'est ?

Brevo permet d'envoyer automatiquement un SMS de confirmation au prospect après qu'il ait rempli le formulaire.

## Coûts Brevo

### Offre Gratuite
- **Prix : 0€/mois**
- **Emails : 300 par jour** (9000/mois)
- **SMS : 0 SMS gratuits** Les SMS sont TOUJOURS payants

### SMS à la carte (Pay-as-you-go)
- **Prix : 0,046€ par SMS** en France
- Achat par packs :
  - 100 SMS = 4,60€
  - 500 SMS = 23€
  - 1000 SMS = 46€
- **Les crédits n'expirent JAMAIS**

**Calcul pour votre activité :**
- 10 prospects/jour = 10 SMS/jour = 300 SMS/mois = **13,80€/mois**
- 20 prospects/jour = 20 SMS/jour = 600 SMS/mois = **27,60€/mois**
- 50 prospects/jour = 50 SMS/jour = 1500 SMS/mois = **69€/mois**

**Mon conseil :** Achetez d'abord un pack de 100 SMS (4,60€) pour tester le système. Si ça fonctionne bien, achetez ensuite des packs plus gros selon votre volume.

---

## Configuration Brevo - Étape par étape

### Étape 1 : Créer un compte

1. Je vais sur https://www.brevo.com
2. Je clique sur **"S'inscrire gratuitement"** en haut à droite
3. Je remplis le formulaire :
   - Mon email professionnel
   - Un mot de passe sécurisé
   - Mon nom et prénom
4. Je clique sur **"Créer mon compte"**
5. Je vérifie mon email et je clique sur le lien de confirmation

### Étape 2 : Compléter mon profil

Brevo me demande des informations pour valider mon compte (c'est pour lutter contre le spam).

1. **Nom de l'entreprise :** Haut Sommet
2. **Adresse :** Mon adresse professionnelle complète
3. **Téléphone :** Mon numéro de téléphone

Je reçois un **code par SMS** que je dois entrer pour valider mon numéro.

4. Je clique sur **"Continuer"**

### Étape 3 : Répondre au questionnaire

Brevo me pose quelques questions :

1. **Secteur d'activité :** Services / Rénovation énergétique
2. **Nombre d'employés :** 1-10
3. **Nombre de contacts :** 0-500
4. **Utilisation principale :** Marketing / Génération de leads

Je clique sur **"Terminer"**

Mon compte est maintenant actif !

### Étape 4 : Acheter des crédits SMS

**Important :** Sans crédits SMS, je ne peux rien envoyer.

1. Dans le menu de gauche, je clique sur **"SMS"**
2. En haut à droite, je clique sur **"Acheter des crédits SMS"**
3. Je choisis mon pack :
   - **100 SMS = 4,60€** (pour commencer et tester)
   - Ou 500 SMS = 23€
   - Ou 1000 SMS = 46€
4. Je sélectionne **"France"** comme pays de destination
5. Je clique sur **"Acheter"**
6. Je paie par carte bancaire
7. Mes crédits apparaissent immédiatement !

**Je vois maintenant :** "Solde SMS : 100 crédits"

### Étape 5 : Récupérer ma clé API

**Attention :** Je n'ai PAS besoin de configurer directement Brevo car je vais passer par Make.com. Mais je garde cette section pour référence.

1. Dans le menu en haut à droite, je clique sur mon nom
2. Je clique sur **"Paramètres"**
3. Dans le menu de gauche, je clique sur **"SMTP & API"**
4. Je vois une section **"Clés API"**
5. Je clique sur **"Créer une nouvelle clé API"**
6. Je donne un nom : "Make.com SMS"
7. Je clique sur **"Générer"**
8. Je copie la clé (elle ressemble à : xkeysib-abcd1234...)
9. **Je la note IMMÉDIATEMENT** car je ne pourrai plus la voir après !

**Cette clé sera utilisée dans Make.com à l'étape suivante.**

### Étape 6 : Tester l'envoi de SMS

Pour vérifier que tout fonctionne, je peux envoyer un SMS de test.

1. Dans le menu de gauche, je clique sur **"SMS"**
2. Je clique sur **"Créer une campagne SMS"**
3. Je donne un nom : "Test"
4. Dans le champ destinataire, je mets MON numéro : +33612345678
   - **Important :** Le numéro doit commencer par +33 (pas de 0)
5. Dans le message, j'écris : "Test SMS Brevo"
6. Je clique sur **"Envoyer"**
7. Je reçois le SMS dans les 10 secondes !

**Si je ne reçois rien :**
- Je vérifie que mon numéro est au bon format (+33...)
- Je vérifie que j'ai des crédits SMS restants
- J'attends 1-2 minutes

**Mon solde a diminué :** "Solde SMS : 99 crédits" (normal, j'en ai consommé 1)

---

## Consulter l'historique des SMS Brevo

### Voir tous les SMS envoyés

1. Dans le menu de gauche, je clique sur **"SMS"**
2. Je clique sur **"Historique"**
3. Je vois la liste de tous mes SMS :
   - Date et heure
   - Numéro destinataire
   - Message envoyé
   - Statut (Délivré / Échec)
   - Coût

### Comprendre les statuts

**Délivré (vert)** = Le SMS est bien arrivé 
**En attente (orange)** = Le SMS est en cours d'envoi
**Échec (rouge)** = Le SMS n'a pas pu être envoyé

**Causes d'échec courantes :**
- Numéro invalide ou incorrect
- Téléphone éteint
- Pas de réseau

---

# 3. MAKE.COM - Connecter le formulaire et Brevo

## Qu'est-ce que c'est ?

Make.com (anciennement Integromat) est un outil qui connecte le formulaire de votre site web à Brevo. Quand quelqu'un remplit le formulaire, Make.com reçoit les données et demande à Brevo d'envoyer le SMS.

**Pourquoi Make.com ?**
Sans Make.com, je devrais mettre ma clé API Brevo directement dans le code du site, ce qui est dangereux (n'importe qui pourrait la voir et l'utiliser). Avec Make.com, ma clé API reste sécurisée.

## Coûts Make.com

### Offre Gratuite (recommandée pour démarrer)
- **Prix : 0€/mois**
- 1000 opérations/mois
- Chaque formulaire soumis = 2 opérations (réception + envoi SMS)
- Donc : **500 prospects/mois maximum**
- Parfait pour commencer !

### Offre Payante (si vous dépassez 1000 opérations)
- **Prix : 9€/mois**
- 10 000 opérations/mois
- Support prioritaire

**Mon conseil :** L'offre gratuite suffit pour 500 prospects/mois (= 16 prospects/jour), ce qui est déjà excellent pour démarrer.

---

## Configuration Make.com - Étape par étape

### Étape 1 : Créer un compte

1. Je vais sur https://www.make.com
2. Je clique sur **"Sign up free"** (Inscription gratuite)
3. Je peux m'inscrire avec :
   - Mon email (je remplis email + mot de passe)
   - Ou mon compte Google (plus rapide)
4. Je clique sur **"Sign up"**
5. Je vérifie mon email et je clique sur le lien de confirmation
6. Mon compte est créé !

### Étape 2 : Créer mon premier scénario

Un "scénario" dans Make.com, c'est une automatisation. Ici, mon scénario sera : "Quand le formulaire est rempli → Envoyer un SMS via Brevo"

1. Je me connecte sur https://www.make.com
2. Je vois un gros bouton **"Create a new scenario"**
3. Je clique dessus
4. Make.com me demande un nom
5. J'écris : "Envoi SMS Haut Sommet"
6. Je clique sur **"Create"**

Je vois maintenant un écran blanc avec un gros **+** au centre.

### Étape 3 : Ajouter le module Webhooks (réception des données)

Le Webhook, c'est l'adresse web que le formulaire va appeler pour envoyer les données.

1. Je clique sur le gros **+** au centre
2. Une fenêtre s'ouvre avec une barre de recherche
3. Je tape "webhooks" dans la recherche
4. Je clique sur **"Webhooks"**
5. Je sélectionne **"Custom webhook"**

**Configuration du webhook :**

1. Make.com me demande de créer un webhook
2. Je clique sur **"Create a webhook"**
3. Je donne un nom : "Formulaire Haut Sommet"
4. Je clique sur **"Save"**

**Je vois maintenant une URL qui ressemble à :**
```
https://hook.eu1.make.com/abc123def456ghi789
```

**SUPER IMPORTANT : Je copie cette URL et je la note quelque part !**

Je vais en avoir besoin pour la mettre dans le code du site.

5. Je clique sur **"OK"** pour fermer la fenêtre

Mon premier module est configuré !

### Étape 4 : Ajouter le module Brevo (envoi SMS)

Maintenant je vais ajouter le module qui envoie le SMS.

1. Je vois mon module Webhooks avec un petit **+** à droite
2. Je clique sur ce **+**
3. La fenêtre de recherche s'ouvre à nouveau
4. Je tape "brevo" dans la recherche
5. Je clique sur **"Brevo"**
6. Je sélectionne **"Send a Transactional SMS"**

**Configuration de la connexion Brevo :**

1. Make.com me demande de me connecter à Brevo
2. Je clique sur **"Add"** (à côté de Connection)
3. Make.com me demande ma **clé API Brevo**
4. Je colle la clé API que j'ai notée à l'étape 5 de Brevo
5. Je donne un nom à la connexion : "Brevo Haut Sommet"
6. Je clique sur **"Save"**

**Configuration du SMS :**

Maintenant je configure le contenu du SMS.

**Champ "Recipient"** (Destinataire)
Je clique dans le champ, et je vois une liste de variables qui viennent du formulaire.
Je clique sur **"telephone"**

**Champ "Content"** (Message)
J'écris le message qui sera envoyé :

```
Bonjour {{civilite}} {{nom}}, votre demande d'aide à l'installation d'une pompe à chaleur a bien été reçue. Un expert Haut-Sommet vous contactera sous 48h. Merci ! - Haut Sommet
```

**Les variables {{civilite}} et {{nom}}** seront automatiquement remplacées par les vraies valeurs.

**Champ "Sender"** (Expéditeur)
Je laisse vide ou j'écris : "Haut Sommet"

7. Je clique sur **"OK"**

Mon scénario est maintenant complet !

### Étape 5 : Tester le scénario

Avant d'activer le scénario en production, je vais le tester.

1. En bas à gauche, je clique sur **"Run once"** (Exécuter une fois)
2. Make.com me dit : "Waiting for data..." (En attente de données)
3. Je laisse cette page ouverte
4. **Dans un autre onglet**, j'ouvre le formulaire de ma landing page
5. Je remplis le formulaire avec MES vraies coordonnées
6. Je soumets le formulaire
7. Je retourne sur Make.com

**Si tout fonctionne :**
- Je vois une bulle verte sur le module Webhooks
- Je vois une bulle verte sur le module Brevo
- Je reçois le SMS sur mon téléphone dans les 10 secondes !

**Si je vois une bulle rouge  :**
- Je clique dessus pour voir l'erreur
- Les erreurs courantes :
  - "Invalid phone number" = Le numéro n'est pas au bon format
  - "Insufficient credits" = Plus de crédits SMS sur Brevo
  - "Invalid API key" = La clé API Brevo n'est pas bonne

### Étape 6 : Activer le scénario

Si le test fonctionne, je peux activer le scénario pour qu'il tourne en permanence.

1. En haut à gauche, je vois un interrupteur **OFF**
2. Je clique dessus pour le passer sur **ON** (vert)
3. Make.com me demande confirmation
4. Je clique sur **"Turn on"**

**Mon scénario est maintenant actif !** 

Chaque fois qu'un prospect remplira le formulaire, il recevra automatiquement un SMS.

### Étape 7 : Mettre l'URL du webhook dans le site

Je dois maintenant dire au site web d'appeler Make.com.

**J'ouvre le fichier :** `/assets/js/modules/sms.js`

À la ligne 15, je modifie l'URL :

```javascript
const SMS_CONFIG = {
    webhookURL: 'https://hook.eu1.make.com/abc123def456ghi789'  // MON URL de webhook
};
```

Je sauvegarde le fichier.

**C'est terminé pour Make.com !**

---

## Consulter l'historique des exécutions Make.com

### Voir ce qui s'est passé

1. Je me connecte sur https://www.make.com
2. Je clique sur mon scénario "Envoi SMS Haut Sommet"
3. En haut à droite, je clique sur **"History"**
4. Je vois la liste de toutes les exécutions :
   - Date et heure
   - Statut (Success ou Error)
   - Durée d'exécution
   - Nombre d'opérations consommées

### Analyser une exécution

Je clique sur une exécution pour voir le détail :

**Données reçues du formulaire :**
```json
{
  "civilite": "Madame",
  "prenom": "Marie",
  "nom": "Dupont",
  "telephone": "0612345678",
  ...
}
```

**Données envoyées à Brevo :**
```json
{
  "recipient": "+33612345678",
  "content": "Bonjour Madame Dupont, votre demande..."
}
```

**Réponse de Brevo :**
```json
{
  "messageId": "abc123",
  "status": "sent"
}
```

Si je vois tout ça, c'est que ça a fonctionné !

### Consulter mes quotas

1. Dans le menu en haut à droite, je clique sur mon nom
2. Je clique sur **"Organization"**
3. Je vois mon quota :
   - Opérations utilisées : 45 / 1000
   - Opérations restantes : 955

Si j'approche des 1000 opérations :
- Soit je passe à l'offre payante (9€/mois)
- Soit j'attends le mois prochain (le quota se réinitialise)

---

# 4. CLOUDFLARE PAGES - Héberger le site gratuitement

## Qu'est-ce que c'est ?

Cloudflare Pages permet d'héberger votre site web gratuitement. Votre site sera rapide, sécurisé (HTTPS automatique) et disponible 24h/24.

## Coûts Cloudflare Pages

### Offre Gratuite (LARGEMENT SUFFISANT)
- **Prix : 0€/mois pour toujours**
- Bande passante illimitée
- 500 déploiements par mois
- SSL/HTTPS gratuit
- CDN mondial (site ultra-rapide partout dans le monde)
- Pas de limite de visiteurs
- **Parfait pour 99% des sites web**

### Offre Payante (seulement pour les très gros sites)
- **Prix : 20$/mois**
- Builds plus rapides
- Support prioritaire
- (Vous n'en aurez probablement jamais besoin)

**Mon conseil :** L'offre gratuite est amplement suffisante, même pour un site professionnel avec beaucoup de trafic.

---

## Configuration Cloudflare Pages - Étape par étape

### Prérequis

Avant de commencer, j'ai besoin de :
1. Tous mes fichiers du site (index.html, CSS, JS, images)
2. Organisés dans un dossier sur mon ordinateur

**Structure de mon dossier :**
```
mon-site/
├── index.html
├── mentions-legales.html
└── assets/
    ├── css/
    │   ├── style.css
    │   ├── mobile.css
    │   └── tablet.css
    ├── js/
    │   ├── main.js
    │   └── modules/
    │       ├── config.js
    │       ├── validation.js
    │       ├── email.js
    │       ├── sms.js
    │       ├── form.js
    │       ├── menu.js
    │       └── faq.js
    └── img/
        └── [toutes mes images]
```

### Étape 1 : Créer un compte Cloudflare

1. Je vais sur https://pages.cloudflare.com
2. Je clique sur **"Sign up"** (S'inscrire)
3. Je peux m'inscrire avec :
   - Mon email (email + mot de passe)
   - Ou mon compte Google (plus rapide)
4. Je clique sur **"Sign up"**
5. Je vérifie mon email et je clique sur le lien de confirmation
6. Mon compte est créé !

### Étape 2 : Créer un nouveau projet

1. Je me connecte sur https://dash.cloudflare.com
2. Dans le menu de gauche, je clique sur **"Workers & Pages"**
3. Je clique sur le bouton bleu **"Create application"**
4. Je clique sur l'onglet **"Pages"**
5. Je vois deux options :
   - **Connect to Git** (si mes fichiers sont sur GitHub)
   - **Upload assets** (si mes fichiers sont sur mon ordinateur)

**Je choisis : Upload assets** (plus simple pour commencer)

### Étape 3 : Créer le projet

1. Je clique sur **"Create a project"**
2. Cloudflare me demande un nom pour mon projet
3. J'écris : **"haut-sommet-marseille"**
   - Le nom doit être en minuscules
   - Sans espaces (utiliser des tirets -)
   - Sans accents
4. Je clique sur **"Create project"**

### Étape 4 : Uploader mes fichiers

Cloudflare me montre maintenant une zone où je peux glisser-déposer mes fichiers.

**Méthode 1 : Glisser-déposer**
1. J'ouvre le dossier de mon site sur mon ordinateur
2. Je sélectionne TOUS les fichiers et dossiers
3. Je les glisse dans la zone sur Cloudflare
4. Cloudflare commence à uploader

**Méthode 2 : Bouton parcourir**
1. Je clique sur **"Select from computer"**
2. Je navigue jusqu'à mon dossier
3. Je sélectionne tous les fichiers
4. Je clique sur **"Ouvrir"**
5. Cloudflare commence à uploader

**Attention :** Je dois uploader TOUS les fichiers en gardant la structure des dossiers !

### Étape 5 : Déployer le site

Une fois que tous les fichiers sont uploadés :

1. Je clique sur le bouton bleu **"Deploy site"**
2. Cloudflare traite les fichiers (ça prend 30 secondes à 1 minute)
3. Je vois un message : "Success! Your site is live!" 🎉

**Mon site est en ligne !**

Cloudflare me donne une URL qui ressemble à :
```
https://haut-sommet-marseille.pages.dev
```

### Étape 6 : Vérifier que tout fonctionne

1. Je clique sur l'URL donnée par Cloudflare
2. Mon site s'ouvre dans un nouvel onglet
3. Je teste :
   - Les pages se chargent correctement
   - Les images s'affichent
   - Le menu fonctionne
   - Le formulaire s'affiche

4. Je remplis le formulaire avec mes vraies coordonnées
5. Je soumets
6. Je vérifie :
   - Email reçu dans Gmail 
   - SMS reçu sur mon téléphone 

**Si tout fonctionne, mon site est opérationnel !**

### Étape 7 : Configurer un nom de domaine personnalisé (optionnel)

Si j'ai acheté un nom de domaine (ex: haut-sommet-marseille.fr), je peux le connecter à Cloudflare.

1. Dans mon projet Cloudflare Pages, je clique sur **"Custom domains"**
2. Je clique sur **"Set up a custom domain"**
3. J'entre mon nom de domaine : haut-sommet-marseille.fr
4. Je clique sur **"Continue"**

Cloudflare me donne des instructions pour configurer mon domaine :

**Si mon domaine est chez OVH, Gandi, etc. :**
1. Je me connecte à mon fournisseur de domaine
2. Je vais dans la gestion DNS
3. J'ajoute un enregistrement CNAME :
   - Type : CNAME
   - Nom : @ (ou www)
   - Valeur : haut-sommet-marseille.pages.dev
4. Je sauvegarde
5. J'attends 5-10 minutes que ça se propage

**Mon site est maintenant accessible sur mon nom de domaine !**

---

## Mettre à jour le site

Quand je veux modifier mon site (changer un texte, une image, etc.) :

### Méthode manuelle (simple)

1. Je modifie mes fichiers sur mon ordinateur
2. Je retourne sur Cloudflare Pages
3. Je clique sur mon projet
4. Je clique sur **"Create a new deployment"**
5. Je ré-uploade mes fichiers modifiés
6. Je clique sur **"Deploy"**
7. Les modifications sont en ligne en 1 minute !

### Méthode automatique avec GitHub (avancé)

Si je sais utiliser Git et GitHub, je peux connecter mon projet :
1. Je mets mes fichiers sur GitHub
2. Je connecte GitHub à Cloudflare Pages
3. À chaque fois que je modifie un fichier sur GitHub, le site se met à jour automatiquement

(Cette méthode est plus technique, je ne la détaille pas ici)

---

## Consulter les statistiques de mon site

### Voir les visiteurs

1. Dans mon projet Cloudflare Pages
2. Je clique sur **"Analytics"**
3. Je vois :
   - Nombre de visiteurs
   - Pages les plus vues
   - Pays des visiteurs
   - Bande passante utilisée

Ces statistiques sont gratuites et automatiques !

---

# RÉCAPITULATIF DES COÛTS TOTAUX

## Scénario 1 : Démarrage (0-10 prospects/jour)

| Service | Offre | Coût |
|---------|-------|------|
| **EmailJS** | Gratuit (200 emails/mois) | **0€/mois** |
| **Brevo** | SMS payant (300 SMS/mois) | **13,80€/mois** |
| **Make.com** | Gratuit (1000 opérations/mois) | **0€/mois** |
| **Cloudflare** | Gratuit | **0€/mois** |
| **TOTAL** | | **13,80€/mois** |

## Scénario 2 : Croissance (10-20 prospects/jour)

| Service | Offre | Coût |
|---------|-------|------|
| **EmailJS** | Payant (500 emails/mois) | **5€/mois** |
| **Brevo** | SMS payant (600 SMS/mois) | **27,60€/mois** |
| **Make.com** | Gratuit (1000 opérations/mois) | **0€/mois** |
| **Cloudflare** | Gratuit | **0€/mois** |
| **TOTAL** | | **32,60€/mois** |

## Scénario 3 : Forte activité (30-50 prospects/jour)

| Service | Offre | Coût |
|---------|-------|------|
| **EmailJS** | Payant (500 emails/mois) | **5€/mois** |
| **Brevo** | SMS payant (1500 SMS/mois) | **69€/mois** |
| **Make.com** | Payant (10 000 opérations/mois) | **9€/mois** |
| **Cloudflare** | Gratuit | **0€/mois** |
| **TOTAL** | | **83€/mois** |

---

# CHECKLIST FINALE - Tout vérifier avant le lancement

## EmailJS 

- [ ] Compte créé
- [ ] Gmail connecté
- [ ] Template créé et testé
- [ ] Service ID noté
- [ ] Template ID noté
- [ ] Public Key notée
- [ ] Identifiants mis dans config.js
- [ ] Email de test reçu

## Brevo 

- [ ] Compte créé et validé
- [ ] Crédits SMS achetés (minimum 100)
- [ ] Clé API créée et notée
- [ ] SMS de test envoyé et reçu
- [ ] Historique consultable

## Make.com 

- [ ] Compte créé
- [ ] Scénario créé
- [ ] Module Webhooks configuré
- [ ] URL webhook notée et mise dans sms.js
- [ ] Module Brevo configuré avec la clé API
- [ ] Message SMS personnalisé
- [ ] Test réalisé avec succès
- [ ] Scénario activé (ON)

## Cloudflare Pages 

- [ ] Compte créé
- [ ] Projet créé
- [ ] Tous les fichiers uploadés
- [ ] Site déployé
- [ ] URL fonctionnelle
- [ ] Formulaire testé en conditions réelles
- [ ] Email reçu après test
- [ ] SMS reçu après test

---

# SUPPORT ET AIDE

## En cas de problème

### EmailJS ne fonctionne pas
1. Je vérifie mes identifiants dans config.js
2. Je consulte l'historique dans le dashboard EmailJS
3. Je vérifie mes spams Gmail
4. Je teste l'envoi manuel dans EmailJS

### Brevo - Pas de SMS reçu
1. Je vérifie mon solde SMS (crédits restants)
2. Je consulte l'historique Brevo
3. Je vérifie le format du numéro (+33...)
4. Je vérifie que Make.com a bien appelé Brevo

### Make.com en erreur
1. Je consulte l'historique des exécutions
2. Je clique sur l'exécution en erreur
3. Je lis le message d'erreur
4. Je vérifie que le scénario est bien ON

### Cloudflare - Site ne s'affiche pas
1. Je vérifie que tous les fichiers sont uploadés
2. Je vérifie la structure des dossiers
3. Je teste l'URL .pages.dev directe
4. Je vide le cache de mon navigateur (Ctrl+F5)

---

## Contacts support

**EmailJS**
- Documentation : https://www.emailjs.com/docs/
- Support : support@emailjs.com

**Brevo**
- Documentation : https://help.brevo.com
- Support : Chat dans le dashboard
- Email : support@brevo.com

**Make.com**
- Documentation : https://www.make.com/en/help
- Support : support@make.com
- Communauté : https://community.make.com

**Cloudflare**
- Documentation : https://developers.cloudflare.com/pages/
- Support : https://community.cloudflare.com
- Chat : Dans le dashboard (plans payants uniquement)

---

# CONSEILS FINAUX

## Sécurité

1. **Ne partagez JAMAIS vos clés API publiquement**
   - Clé API Brevo
   - Public Key EmailJS
   - URL Webhook Make.com

2. **Changez vos mots de passe régulièrement**
   - Tous les 3-6 mois
   - Utilisez des mots de passe différents pour chaque service

3. **Activez la double authentification (2FA)** quand c'est possible
   - Make.com le propose
   - Cloudflare le propose

## Optimisation des coûts

1. **Commencez petit**
   - 100 SMS pour tester (4,60€)
   - Offres gratuites partout ailleurs

2. **Achetez en gros quand vous êtes sûr**
   - 1000 SMS = 46€ au lieu de 10x100 SMS = 46€
   - Les crédits Brevo n'expirent jamais

3. **Surveillez vos quotas**
   - EmailJS : consultez chaque semaine
   - Make.com : consultez chaque semaine
   - Brevo : vérifiez avant d'être à 0

## Maintenance

1. **Testez le formulaire une fois par semaine**
   - Remplissez avec vos coordonnées
   - Vérifiez email + SMS

2. **Consultez les historiques**
   - EmailJS : pour voir si tout part bien
   - Make.com : pour détecter les erreurs
   - Brevo : pour suivre la consommation

3. **Sauvegardez vos fichiers**
   - Gardez une copie sur votre ordinateur
   - Utilisez Google Drive ou Dropbox
   - En cas de problème, vous pourrez tout remettre

---

** Vous avez maintenant toutes les clés pour gérer votre landing page de A à Z, même sans être développeur ! **

Si vous avez des questions, consultez les sections support de chaque service ou référez-vous au MANUEL_UTILISATION.md pour plus de détails techniques ou bien contacter le développeur aux coordonnées suivantes :

Mr Maachaoui
- Mail : smaachaoui@outlook.com
- Téléphone : 0664692855
