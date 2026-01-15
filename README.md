# Un site web Landing Page pour la société Haut Sommet basé à Marseille.

## A propos du projet

Ce projet consistait à réaliser une landing page pour la société Haut Sommet, basée à Marseille. Développée à la demande du client, cette page a pour objectif de permettre aux visiteurs de vérifier leur éligibilité aux aides financières de l’État pour l’installation d’une pompe à chaleur.

Le site propose un formulaire en plusieurs étapes permettant aux prospects de renseigner leurs informations afin d’évaluer leur éligibilité aux dispositifs d’aide en vigueur. Une fois le formulaire complété, les données sont transmises directement à l’adresse e-mail de contact de la société Haut Sommet, facilitant ainsi la prise de contact et le suivi des demandes.

## Vue d'ensemble

Cette landing page au format one-page est conçue pour générer des leads qualifiés en proposant un simulateur d'aides MaPrimeRénov et CEE. Le formulaire intelligent s'adapte au type de logement (maison ou appartement) et vérifie automatiquement l'éligibilité du prospect.

## Fonctionnalités principales

### Formulaire multi-étapes intelligent

J'ai créé un formulaire en 5 étapes qui guide l'utilisateur progressivement :
- Étape 1 : Type de logement (maison ou appartement)
- Étape 2 : Statut d'occupation (propriétaire ou locataire)
- Étape 3 : Type de chauffage actuel
- Étape 4 : Coordonnées du prospect
- Étape 5 : Message de confirmation

Le formulaire adapte dynamiquement les questions selon les réponses. Par exemple, si l'utilisateur sélectionne "Appartement", j'affiche des champs supplémentaires pour vérifier l'éligibilité technique (balcon, terrasse, accès mur extérieur).

### Système de notifications automatiques

J'ai mis en place un double système de notification :

**Notifications email**
J'envoie un email formaté professionnellement à l'équipe commerciale avec toutes les informations du prospect. J'ai choisi EmailJS pour sa simplicité d'intégration et sa fiabilité.

**Notifications SMS**
J'envoie un SMS d'accusé de réception au prospect pour le rassurer et confirmer la prise en compte de sa demande. J'ai mis en place une architecture Make.com + Brevo pour garantir l'envoi des SMS.

### Validation et sécurité

J'ai implémenté une validation complète sur tous les champs :
- Validation en temps réel pendant la saisie
- Protection contre les injections XSS
- Vérification des formats (email, téléphone, département)
- Listes blanches pour les champs à choix multiples

### Design responsive

J'ai structuré le CSS en 3 fichiers séparés pour optimiser le chargement selon l'appareil :
- style.css : Styles de base et desktop
- tablet.css : Adaptations tablette (768px - 1023px)
- mobile.css : Adaptations mobile (< 768px)

## Technologies utilisées

### Frontend

**HTML5**
J'ai structuré le HTML de manière sémantique avec les balises appropriées (header, main, section, article, footer) pour améliorer le référencement et l'accessibilité.

**CSS3**
J'ai utilisé CSS Grid et Flexbox pour créer des layouts flexibles et responsive. J'ai également implémenté des variables CSS pour faciliter la maintenance des couleurs et espacements.

**JavaScript Vanilla**
J'ai choisi JavaScript pur sans framework pour garantir des performances optimales. J'ai organisé le code en modules pour améliorer la maintenabilité.

### Services tiers

**EmailJS**
J'ai choisi EmailJS pour l'envoi d'emails car :
- Pas besoin de backend serveur
- API simple et bien documentée
- Plan gratuit suffisant (200 emails/mois)
- Templates HTML personnalisables
- Fiabilité éprouvée

**Make.com (anciennement Integromat)**
J'ai utilisé Make.com comme middleware entre le formulaire et Brevo car :
- Interface visuelle pour créer des workflows
- Connexion native avec Brevo
- Gestion des erreurs et retry automatique
- Logs détaillés pour le debugging
- Plan gratuit généreux (1000 opérations/mois)

**Brevo (anciennement Sendinblue)**
J'ai sélectionné Brevo pour l'envoi de SMS car :
- API SMS robuste et fiable
- Tarif compétitif (0,046€/SMS)
- Plan gratuit avec 20 SMS/jour pour les tests
- Infrastructure française (RGPD compliant)
- Documentation complète

## Structure du projet

```
landing_page/
├── public/
│   ├── index.html              # Page principale
│   ├── assets/
│   │   ├── css/
│   │   │   ├── style.css       # Styles principaux
│   │   │   ├── mobile.css      # Responsive mobile
│   │   │   └── tablet.css      # Responsive tablette
│   │   ├── js/
│   │   │   ├── main.js         # Point d'entrée JavaScript
│   │   │   └── modules/
│   │   │       ├── config.js   # Configuration EmailJS
│   │   │       ├── validation.js  # Validation formulaire
│   │   │       ├── email.js    # Gestion emails
│   │   │       ├── sms.js      # Gestion SMS
│   │   │       ├── form.js     # Logique formulaire
│   │   │       ├── menu.js     # Navigation mobile
│   │   │       └── faq.js      # Accordéon FAQ
│   │   └── img/
│   │       └── [images du site]
│   └── mentions_legales.html   # Page mentions légales
└── docs/
    ├── README.md               # Ce fichier
    ├── DOCUMENTATION_TECHNIQUE.md  # Documentation détaillée
    └── MANUEL_UTILISATION.md   # Guide d'utilisation
```

## Prérequis

Pour faire fonctionner ce site, j'ai besoin de :

### Comptes services tiers

- Compte EmailJS (gratuit)
- Compte Make.com (gratuit)
- Compte Brevo avec crédits SMS (20/jour gratuits)

### Identifiants à configurer

Dans le fichier `assets/js/modules/config.js` :
- Service ID EmailJS
- Template ID EmailJS
- Clé publique EmailJS
- Email de destination

Dans le fichier `assets/js/modules/sms.js` :
- URL du webhook Make.com

## Installation rapide

### Étape 1 : Configuration EmailJS

1. Je crée un compte sur https://www.emailjs.com
2. Je crée un nouveau service Email
3. Je crée un template avec les variables du formulaire
4. Je note le Service ID, Template ID et la clé publique
5. Je configure ces identifiants dans `config.js`

### Étape 2 : Configuration Make.com + Brevo

1. Je crée un compte sur https://www.make.com
2. Je crée un compte sur https://www.brevo.com
3. Je crée un nouveau scénario Make.com :
   - Module Webhooks (pour recevoir les données)
   - Module Brevo (pour envoyer le SMS)
4. Je récupère l'URL du webhook
5. Je configure cette URL dans `sms.js`

### Étape 3 : Déploiement

1. Je copie tous les fichiers sur mon serveur web
2. Je teste le formulaire sur un environnement de test
3. Je vérifie la réception des emails et SMS
4. Je mets en production

## Configuration

### Personnalisation des couleurs

J'ai centralisé toutes les couleurs dans les variables CSS au début de `style.css`. Pour changer la charte graphique, je modifie simplement ces variables :

```css
:root {
    --primary-blue: #0066CC;
    --secondary-orange: #FF6B35;
    --accent-green: #00B894;
}
```

### Personnalisation du message SMS

Je modifie le message SMS dans `sms.js` ligne 58-66. Je veille à rester sous 160 caractères pour éviter la facturation de plusieurs SMS.

### Personnalisation du template email

Je me connecte au dashboard EmailJS et je modifie le template HTML directement dans l'interface.

## Performances

### Optimisations implémentées

**CSS optimisé**
J'ai décomposé le CSS en 3 fichiers avec media queries pour que chaque appareil ne charge que le CSS nécessaire.

**JavaScript modulaire**
J'ai organisé le code en modules pour un chargement et une exécution optimisés.

**Images**
Je recommande de convertir toutes les images en WebP et d'implémenter le lazy loading.

### Métriques cibles

- First Contentful Paint : < 1.8s
- Time to Interactive : < 3.8s
- Cumulative Layout Shift : < 0.1

## Sécurité

### Mesures implémentées

**Validation côté client**
J'ai mis en place une validation complète de tous les champs avec protection XSS.

**Sanitization des données**
Toutes les données sont nettoyées avant traitement pour éviter les injections.

**Listes blanches**
J'utilise des listes blanches pour les champs à choix multiples au lieu de faire confiance aux valeurs soumises.

### Recommandations additionnelles

Pour une sécurité maximale, je recommande :
- Implémenter un token CSRF
- Ajouter un rate limiting côté serveur
- Mettre en place un système de détection de spam

## SEO

### Optimisations implémentées

**Métadonnées complètes**
J'ai ajouté toutes les métadonnées essentielles :
- Title et description optimisés
- Open Graph pour les réseaux sociaux
- Twitter Cards
- Balises géolocalisées

**Schema.org**
J'ai implémenté deux schémas :
- LocalBusiness pour l'entreprise
- FAQPage pour les questions fréquentes

**Structure sémantique**
J'ai utilisé les bonnes balises HTML5 et une hiérarchie de titres logique.

## Accessibilité

J'ai respecté les bonnes pratiques WCAG :
- Contraste des couleurs suffisant
- Navigation au clavier possible
- Attributs aria-hidden sur les éléments décoratifs
- Labels associés aux champs de formulaire

## Navigateurs supportés

J'ai testé et validé le fonctionnement sur :
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Chrome Mobile
- Safari iOS

## Licence

Ce projet est développé pour Haut Sommet Marseille. Tous droits réservés.

## Support

Pour toute question ou problème :
1. Je consulte la DOCUMENTATION_TECHNIQUE.md
2. Je consulte le MANUEL_UTILISATION.md
3. Je vérifie les logs dans la console navigateur (F12)

## Évolutions futures possibles

- Intégration d'un système de prise de rendez-vous en ligne
- Ajout d'un chatbot pour répondre aux questions
- Création d'un espace client
- Intégration avec un CRM
- Ajout de Google Analytics pour le suivi des conversions
- Implémentation d'un système de A/B testing

## Credits

J'ai utilisé les bibliothèques et services suivants :
- EmailJS pour l'envoi d'emails
- Make.com pour l'orchestration
- Brevo pour l'envoi de SMS
- Bootstrap Icons pour les icônes
- Google Fonts pour la typographie

## Auteur

Landing page développé par Seifeddine Maachaoui, pour la société Haut Sommet dans le cadre d'un stage d'entreprise.
