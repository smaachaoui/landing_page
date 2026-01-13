# Manuel d'Utilisation - Landing Page Haut Sommet

## Introduction

Ce manuel explique comment utiliser, configurer et maintenir la landing page Haut Sommet. J'ai rédigé ce guide pour que toute personne de l'équipe puisse gérer le site sans compétences techniques approfondies.

## Public cible

J'ai conçu ce manuel pour :
- Les commerciaux qui reçoivent les leads
- Les responsables marketing qui gèrent les campagnes
- Les administrateurs qui maintiennent le site
- Les développeurs qui font évoluer le site

## Accès et connexions

### Accès au site web

**URL de production**
J'accède au site via l'URL : [à définir]

**Hébergement**
Le site est hébergé sur : [à définir]

### Accès aux services tiers

**EmailJS**
J'accède au dashboard EmailJS via : https://dashboard.emailjs.com
Identifiants : [conservés de manière sécurisée]

**Make.com**
J'accède à Make.com via : https://www.make.com
Identifiants : [conservés de manière sécurisée]

**Brevo**
J'accède à Brevo via : https://app.brevo.com
Identifiants : [conservés de manière sécurisée]

## Fonctionnement du formulaire

### Parcours utilisateur

**Étape 1 - Type de logement**
L'utilisateur choisit entre "Maison" ou "Appartement".

Si l'utilisateur sélectionne "Maison" :
- Le formulaire passe directement à l'étape suivante

Si l'utilisateur sélectionne "Appartement" :
- Le formulaire affiche des questions supplémentaires pour vérifier l'éligibilité technique
- Je demande si l'utilisateur a un balcon/terrasse ou un accès au mur extérieur
- Si l'utilisateur n'a ni l'un ni l'autre, je l'informe qu'il n'est malheureusement pas éligible

**Étape 2 - Statut d'occupation**
L'utilisateur indique s'il est "Propriétaire" ou "Locataire".

J'accepte les deux statuts car :
- Les propriétaires sont éligibles aux aides MaPrimeRénov
- Les locataires peuvent être intéressés pour faire installer une PAC avec accord du propriétaire

**Étape 3 - Type de chauffage actuel**
L'utilisateur sélectionne son système de chauffage actuel parmi :
- Gaz
- Fioul
- Électrique
- Bois/Granulés
- Charbon
- Autre

Si l'utilisateur sélectionne "Autre", je lui demande de préciser via un champ texte libre.

**Étape 4 - Coordonnées**
L'utilisateur remplit ses informations personnelles :
- Civilité (Monsieur/Madame)
- Prénom
- Nom
- Téléphone (format 06 ou 07)
- Email
- Département (code postal sur 2 chiffres)

Je valide chaque champ en temps réel pour guider l'utilisateur.

**Étape 5 - Confirmation**
J'affiche un message de confirmation avec :
- Une icône de succès
- Un message de remerciement
- Une indication du délai de contact (sous 48h)

### Validation des données

**Validation téléphone**
J'accepte uniquement les numéros mobiles français :
- Commençant par 06 ou 07
- Contenant exactement 10 chiffres
- Je nettoie automatiquement les espaces et tirets

Exemples acceptés :
- 0612345678
- 06 12 34 56 78
- 06-12-34-56-78

**Validation email**
J'accepte les formats email standards :
- prenom.nom@domaine.fr
- prenom_nom@domaine.com
- prenom-nom123@sous-domaine.domaine.fr

Je refuse :
- Les emails sans @ ou sans point
- Les emails avec caractères spéciaux dangereux

**Validation département**
J'accepte les codes département français :
- 01 à 95 (sauf 20)
- 2A et 2B pour la Corse
- 971 à 976 pour les DOM

**Validation nom et prénom**
J'accepte :
- 2 à 50 caractères
- Lettres avec accents
- Espaces, tirets et apostrophes

Je refuse :
- Les chiffres
- Les caractères spéciaux
- Les noms trop courts ou trop longs

### Messages d'erreur

**Champ vide**
"Ce champ est obligatoire"

**Format email invalide**
"Veuillez saisir une adresse email valide"

**Format téléphone invalide**
"Le numéro doit commencer par 06 ou 07 et contenir 10 chiffres"

**Format département invalide**
"Veuillez saisir un code département valide (ex: 13, 75, 2A)"

**Caractères non autorisés**
"Ce champ contient des caractères non autorisés"

## Réception des leads

### Email commercial

**Destinataire**
L'email est envoyé à : contact.hautsommet@gmail.com

**Format de l'email**
J'envoie un email HTML formaté contenant :

```
Objet: Nouvelle demande pompe à chaleur - [Prénom Nom]

Corps:
Nouvelle demande de renseignement

Informations du prospect
- Civilité: Madame
- Prénom: Marie
- Nom: Dupont
- Téléphone: 06 12 34 56 78
- Email: marie.dupont@email.com
- Département: 13

Informations logement
- Type habitation: Maison
- Statut: Propriétaire
- Chauffage actuel: Gaz

Détails supplémentaires
- Date de soumission: 13/01/2026 à 10:30
- Source: Formulaire Landing Page
```

**Que faire à la réception**
1. Je consulte l'email dans ma boîte de réception
2. Je vérifie que toutes les informations sont présentes
3. Je contacte le prospect sous 48h comme promis
4. Je note le lead dans mon CRM

### SMS prospect

**Destinataire**
Le SMS est envoyé directement au numéro de téléphone du prospect.

**Contenu du SMS**
```
Bonjour Madame Dupont, votre demande d'aide à l'installation d'une pompe à chaleur a bien été reçue. Un expert Haut-Sommet vous contactera sous 48h. Merci ! - Haut Sommet
```

**Objectif du SMS**
J'ai ajouté ce SMS pour :
- Rassurer immédiatement le prospect
- Confirmer la bonne réception de sa demande
- Réduire l'anxiété d'attente
- Professionnaliser l'image de l'entreprise

## Configuration EmailJS

### Accès au dashboard

Je me connecte sur https://dashboard.emailjs.com avec mes identifiants.

### Modification du template email

**Étape 1 : Accéder aux templates**
1. Je clique sur "Email Templates" dans le menu
2. Je sélectionne le template "template_wt7uqyk"

**Étape 2 : Modifier le contenu**
Je peux modifier :
- L'objet de l'email
- Le design HTML
- Les variables utilisées

**Variables disponibles**
J'utilise ces variables dans le template :
- {{to_email}} : Email de destination
- {{civilite}} : Monsieur ou Madame
- {{prenom}} : Prénom du prospect
- {{nom}} : Nom du prospect
- {{telephone}} : Numéro de téléphone
- {{email}} : Email du prospect
- {{departement}} : Code département
- {{type_habitation}} : Maison ou Appartement
- {{statut}} : Propriétaire ou Locataire
- {{type_chauffage}} : Type de chauffage actuel
- {{date_soumission}} : Date et heure de soumission

**Étape 3 : Tester le template**
1. Je clique sur "Test it"
2. Je remplis des données de test
3. Je vérifie la réception dans ma boîte email

**Étape 4 : Sauvegarder**
Je clique sur "Save" pour enregistrer mes modifications.

### Modification de l'email de destination

**Option 1 : Dans le template EmailJS**
Je peux définir l'email directement dans le template EmailJS dans le champ "To email".

**Option 2 : Dans le code**
Je peux modifier le fichier config.js ligne 5 :
```javascript
emailDestination: 'nouveau-email@exemple.com'
```

### Consultation des statistiques

**Accès aux statistiques**
Je clique sur "Stats" dans le menu EmailJS.

**Informations disponibles**
Je peux consulter :
- Nombre d'emails envoyés ce mois
- Taux de succès
- Quota restant (200/mois sur le plan gratuit)
- Historique des envois

**Alertes quota**
Si j'approche des 200 emails/mois, je dois :
- Soit passer au plan payant (5€/mois pour 500 emails)
- Soit créer un nouveau compte gratuit
- Soit basculer sur une solution SMTP classique

## Configuration Make.com

### Accès au scénario

Je me connecte sur https://www.make.com et je sélectionne le scénario "Envoi SMS Haut Sommet".

### Architecture du scénario

**Module 1 : Webhooks**
Je reçois les données du formulaire via une requête HTTP POST.

**Module 2 : Brevo Send SMS**
J'envoie le SMS via l'API Brevo avec les données reçues.

### Consultation de l'historique

**Accès à l'historique**
1. Je clique sur le scénario
2. Je clique sur "History" en haut à droite

**Informations disponibles**
Pour chaque exécution, je vois :
- Date et heure
- Statut (Success/Error)
- Données reçues du webhook
- Données envoyées à Brevo
- Durée d'exécution
- Erreurs éventuelles

**Analyse des erreurs**
Si j'ai une erreur, je clique dessus pour voir :
- Le message d'erreur exact
- À quelle étape l'erreur s'est produite
- Les données qui ont causé l'erreur

### Modification du message SMS

**Étape 1 : Éditer le scénario**
Je clique sur "Edit scenario".

**Étape 2 : Ouvrir le module Brevo**
Je clique sur le module "Brevo - Send SMS".

**Étape 3 : Modifier le message**
Je modifie le champ "Message" en respectant :
- Maximum 160 caractères pour 1 SMS (sinon facturé double)
- Variables disponibles : {{civilite}}, {{nom}}, {{prenom}}
- Signature obligatoire pour être conforme SMS marketing

**Étape 4 : Tester**
1. Je clique sur "Run once"
2. Je soumets le formulaire sur le site
3. Je vérifie la réception du SMS

**Étape 5 : Activer**
Je clique sur "On" pour activer le scénario.

### Gestion des quotas

**Quota Make.com gratuit**
1000 opérations/mois

**Consommation par soumission**
Chaque soumission consomme 2 opérations :
- 1 pour la réception webhook
- 1 pour l'envoi SMS

**Calcul du quota**
1000 opérations / 2 = 500 soumissions/mois maximum

**Dépassement du quota**
Si je dépasse 1000 opérations/mois :
- Le scénario s'arrête automatiquement
- Je reçois un email d'alerte
- Je dois passer au plan payant (9€/mois pour 10 000 opérations)

## Configuration Brevo

### Accès au dashboard

Je me connecte sur https://app.brevo.com avec mes identifiants.

### Consultation du solde SMS

**Étape 1 : Accéder aux SMS**
Je clique sur "SMS" dans le menu principal.

**Étape 2 : Consulter le solde**
En haut à droite, je vois mon solde SMS actuel.

**Plan gratuit**
- 20 SMS/jour maximum
- Réinitialisation à minuit

**Plan payant**
- Achat de crédits SMS
- 0,046€ par SMS en France
- Packs disponibles : 100, 500, 1000 SMS

### Achat de crédits SMS

**Étape 1 : Acheter des crédits**
1. Je clique sur "Acheter des crédits"
2. Je sélectionne le montant
3. Je paie par carte bancaire

**Étape 2 : Vérifier le crédit**
Le crédit apparaît immédiatement dans mon solde.

**Tarification France**
- 0,046€ par SMS
- Exemple : 100€ = environ 2 170 SMS

### Consultation de l'historique SMS

**Accès à l'historique**
1. Je clique sur "SMS" > "Historique"
2. Je sélectionne la période

**Informations disponibles**
Pour chaque SMS, je vois :
- Date et heure d'envoi
- Numéro destinataire
- Message envoyé
- Statut (Délivré/Échec)
- Coût

**Filtres disponibles**
Je peux filtrer par :
- Période
- Statut
- Numéro destinataire

### Gestion des échecs

**Causes d'échec courantes**
- Numéro incorrect ou invalide
- Téléphone éteint ou hors réseau
- Numéro sur liste rouge (anti-spam)

**Que faire en cas d'échec**
1. Je vérifie le format du numéro
2. Je vérifie que le numéro est un mobile (06/07)
3. J'attends quelques heures et je réessaie
4. Si échec persistant, je contacte le prospect par email

## Maintenance quotidienne

### Checklist matin

**Vérification EmailJS**
1. Je consulte ma boîte email
2. Je vérifie que j'ai reçu les leads de la veille
3. Si aucun lead alors que le site a eu du trafic, je vérifie EmailJS

**Vérification Make.com**
1. Je me connecte à Make.com
2. Je consulte l'historique des dernières 24h
3. Je vérifie qu'il n'y a pas d'erreurs

**Vérification Brevo**
1. Je consulte mon solde SMS
2. Je vérifie que j'ai assez de crédits
3. Si solde < 50 SMS, j'achète des crédits

### Actions hebdomadaires

**Lundi matin**
Je compile les statistiques de la semaine :
- Nombre de soumissions
- Nombre d'emails envoyés
- Nombre de SMS envoyés
- Taux de conversion leads > clients

**Mercredi**
Je vérifie les quotas :
- Quota EmailJS : X/200 utilisés
- Quota Make.com : X/1000 utilisés
- Crédits SMS Brevo : X restants

**Vendredi**
Je fais un test complet du formulaire :
1. Je remplis le formulaire avec des données de test
2. Je vérifie la réception de l'email
3. Je vérifie la réception du SMS
4. Je note tout dysfonctionnement

### Actions mensuelles

**Premier du mois**
Je génère un rapport mensuel :
- Total leads générés
- Coût total SMS (nombre × 0,046€)
- Taux de transformation leads > devis
- Taux de transformation devis > clients

**Mi-mois**
Je vérifie les renouvellements :
- Quotas EmailJS : si > 150/200, envisager upgrade
- Crédits Brevo : si utilisation croissante, acheter pack

## Résolution des problèmes

### Problème : Je ne reçois pas les emails

**Diagnostic 1 : Vérifier EmailJS**
1. Je me connecte à EmailJS
2. Je consulte l'historique des envois
3. Je vérifie le statut du dernier envoi

Si statut = "Failed" :
- Je consulte le message d'erreur
- Je vérifie la configuration du service email
- Je teste l'envoi manuellement depuis EmailJS

Si statut = "Sent" :
- Le problème vient de la réception
- Je vérifie mes spams
- Je vérifie que l'email de destination est correct

**Diagnostic 2 : Vérifier le formulaire**
1. J'ouvre la console du navigateur (F12)
2. Je soumets le formulaire
3. Je cherche les messages "Email envoyé avec succès"

Si erreur JavaScript :
- Je note le message d'erreur exact
- Je vérifie que EmailJS est bien chargé
- Je vérifie la configuration dans config.js

**Solution temporaire**
Si le problème persiste, je demande au prospect de me contacter directement par téléphone ou email manuel.

### Problème : Les SMS ne sont pas envoyés

**Diagnostic 1 : Vérifier Make.com**
1. Je consulte l'historique Make.com
2. Je vérifie si le webhook a été appelé

Si webhook non appelé :
- Le problème vient du formulaire
- Je vérifie la console JavaScript
- Je vérifie que l'URL webhook est correcte dans sms.js

Si webhook appelé mais échec :
- Je clique sur l'exécution en erreur
- Je lis le message d'erreur de Brevo
- Je vérifie le format du numéro de téléphone

**Diagnostic 2 : Vérifier Brevo**
1. Je vérifie mon solde SMS
2. Je consulte l'historique des SMS

Si solde = 0 :
- J'achète des crédits SMS immédiatement
- Je relance le scénario Make.com

Si SMS en échec :
- Je vérifie que le numéro est correct
- Je vérifie que c'est un numéro mobile français

**Solution temporaire**
Les SMS sont un bonus. Si le système SMS est en panne, l'email fonctionne toujours et c'est le plus important.

### Problème : Le formulaire ne s'affiche pas

**Diagnostic : Console navigateur**
1. J'ouvre la console (F12)
2. Je regarde les erreurs

Erreurs possibles :
- Fichier JavaScript non trouvé (404)
- Erreur de syntaxe JavaScript
- Conflit avec autre script

**Solution**
1. Je vérifie que tous les fichiers sont bien présents sur le serveur
2. Je vérifie les chemins des fichiers dans index.html
3. Je vide le cache du navigateur (Ctrl+F5)

### Problème : Les données ne sont pas validées

**Diagnostic : Module validation.js**
1. J'ouvre la console (F12)
2. Je vérifie si le module validation.js est chargé

Si module non chargé :
- Je vérifie le chemin du fichier
- Je vérifie qu'il n'y a pas d'erreur de syntaxe

**Solution**
Je vide le cache et je recharge la page.

### Problème : Le formulaire est lent

**Cause possible 1 : Images trop lourdes**
Je compresse les images avec un outil comme TinyPNG.

**Cause possible 2 : Serveur lent**
Je teste la vitesse du serveur avec Google PageSpeed Insights.

**Cause possible 3 : JavaScript bloquant**
Je vérifie que tous les scripts ont l'attribut defer.

## Modification du contenu

### Changer le titre principal

**Fichier : index.html**
Je cherche la balise h1 dans la section "section-accueil" et je modifie le texte.

**Avant**
```html
<h1>Bénéficiez jusqu'à 14 000€ d'aides pour l'installation de votre pompe à chaleur</h1>
```

**Après**
```html
<h1>Mon nouveau titre</h1>
```

### Changer les montants d'aides

**Fichier : index.html**
Je cherche les cartes d'aides et je modifie les montants.

**Exemple**
```html
<h2>9 000€</h2>
<p>MaPrimeRénov</p>
```

### Ajouter une question dans la FAQ

**Fichier : index.html**
Je cherche la section FAQ et j'ajoute un nouvel item :

```html
<div class="faq-item">
    <button class="faq-question">
        Ma nouvelle question ?
        <i class="bi bi-chevron-down"></i>
    </button>
    <div class="faq-answer">
        <p>Ma réponse ici.</p>
    </div>
</div>
```

Le JavaScript gère automatiquement l'ouverture/fermeture.


### Changer les couleurs du site

**Fichier : assets/css/style.css**
Je modifie les variables CSS au début du fichier :

```css
:root {
    --primary-blue: #0066CC;        /* Couleur principale */
    --secondary-orange: #FF6B35;    /* Couleur secondaire */
    --accent-green: #00B894;        /* Couleur accent */
}
```

Les couleurs s'appliqueront automatiquement sur tout le site.

## Optimisation du taux de conversion

### Bonnes pratiques implémentées

**Formulaire court**
J'ai limité le formulaire à 5 étapes pour ne pas décourager l'utilisateur.

**Validation temps réel**
J'affiche les erreurs immédiatement pour que l'utilisateur puisse corriger sans frustration.

**Barre de progression**
Je montre l'avancement pour encourager la complétion.

**Message de confirmation immédiat**
J'affiche une confirmation dès la soumission pour rassurer.

**SMS de confirmation**
J'envoie un SMS dans la minute qui suit pour professer l'image.

### Améliorations possibles

**Ajouter un chat en direct**
J'installe un widget de chat (Crisp, Intercom) pour répondre aux questions en temps réel.

**Ajouter des preuves sociales**
J'affiche le nombre de personnes aidées ce mois-ci en temps réel.

**Optimiser le mobile**
Je teste sur différents appareils et j'ajuste les tailles de boutons.

**A/B Testing**
Je teste différentes versions du titre ou du CTA pour voir ce qui convertit le mieux.

**Simplifier davantage**
Je pourrais réduire à 3 étapes au lieu de 5 si le taux de complétion est faible.

## Support utilisateur

### Questions fréquentes utilisateurs

**Question : Combien de temps avant d'être contacté ?**
Réponse : Un expert vous contactera sous 48h ouvrées.

**Question : L'estimation est-elle gratuite ?**
Réponse : Oui, l'estimation et l'étude de faisabilité sont entièrement gratuites.

**Question : Les aides sont-elles garanties ?**
Réponse : Les montants sont indicatifs. L'éligibilité finale sera confirmée lors de l'étude.

**Question : Je n'ai pas reçu le SMS**
Réponse : Le SMS est envoyé automatiquement. Vérifiez vos messages. Si toujours rien, contactez-nous par email ou téléphone.

**Question : Puis-je modifier ma demande ?**
Réponse : Oui, contactez-nous directement pour modifier votre demande.

### Contact support technique

Pour les problèmes techniques que je ne peux pas résoudre :
1. Je note l'erreur exacte
2. Je prends une capture d'écran
3. Je note les étapes pour reproduire le problème
4. Je contacte le développeur avec ces informations

## Sauvegardes et sécurité

### Sauvegarde des données

**Configuration EmailJS**
Je sauvegarde régulièrement :
- Le template email (copie HTML)
- Les identifiants du service
- La configuration du compte

**Configuration Make.com**
Je fais des captures d'écran :
- Du scénario complet
- De chaque module
- Des paramètres Brevo

**Configuration Brevo**
Je sauvegarde :
- La clé API
- Les paramètres du compte

### Sécurité des accès

**Mots de passe**
J'utilise des mots de passe différents et complexes pour chaque service :
- Minimum 12 caractères
- Lettres, chiffres et symboles
- Je les stocke dans un gestionnaire de mots de passe

**Double authentification**
J'active la 2FA sur tous les services qui le proposent.

**Accès restreints**
Je ne partage les identifiants qu'avec les personnes qui en ont besoin.

## Mises à jour

### Quand mettre à jour

**Mise à jour obligatoire**
- Faille de sécurité découverte
- Service tiers change son API
- Bug bloquant pour les utilisateurs

**Mise à jour recommandée**
- Nouvelle fonctionnalité utile
- Amélioration des performances
- Optimisation du taux de conversion

**Mise à jour optionnelle**
- Changements esthétiques
- Fonctionnalités supplémentaires
- Refonte du design

### Procédure de mise à jour

**Étape 1 : Sauvegarde**
Je fais une copie complète du site actuel.

**Étape 2 : Environnement de test**
Je crée une copie du site sur un sous-domaine de test.

**Étape 3 : Application des changements**
Je modifie les fichiers sur l'environnement de test.

**Étape 4 : Tests**
Je teste toutes les fonctionnalités sur l'environnement de test.

**Étape 5 : Déploiement**
Si tout fonctionne, je mets à jour le site de production.

**Étape 6 : Vérification**
Je vérifie que tout fonctionne en production.

## Conclusion

J'ai conçu cette landing page pour être simple à maintenir et à faire évoluer. En suivant ce manuel, toute personne de l'équipe peut gérer le site au quotidien.

Pour toute question non couverte dans ce manuel, je consulte :
- La DOCUMENTATION_TECHNIQUE.md pour les détails techniques
- Le README.md pour la vue d'ensemble du projet
- Les supports des services tiers (EmailJS, Make.com, Brevo)

La clé du succès est de :
- Vérifier régulièrement que tout fonctionne
- Répondre rapidement aux leads
- Optimiser continuellement le taux de conversion
- Maintenir le site à jour
