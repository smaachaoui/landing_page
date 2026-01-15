// ============================================
// GESTION DU MENU BURGER
// ============================================
// J'ai créé un menu burger responsive avec animations fluides
// et fermeture automatique dans plusieurs cas

// Je récupère les éléments du DOM dont j'ai besoin
const burgerMenu = document.querySelector('.burger-menu');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.navbar a');

// ============================================
// FONCTION DE BASCULEMENT DU MENU
// ============================================
// Je gère l'ouverture et la fermeture du menu burger
function toggleMenu() {
    // Je bascule la classe active sur la navbar
    const isOpen = navbar.classList.toggle('active');
    
    // Je bascule aussi l'animation du burger
    burgerMenu.classList.toggle('active');
    
    // Je mets à jour l'attribut aria pour l'accessibilité
    burgerMenu.setAttribute('aria-expanded', isOpen);
    
    // J'empêche le scroll du body quand le menu est ouvert
    document.body.style.overflow = isOpen ? 'hidden' : '';
    
    //console.log(`Menu ${isOpen ? 'ouvert' : 'fermé'}`);
}

// ============================================
// OUVERTURE/FERMETURE AU CLIC SUR LE BURGER
// ============================================
// J'ouvre ou ferme le menu au clic sur le burger
burgerMenu.addEventListener('click', (e) => {
    e.stopPropagation(); // J'empêche la propagation pour éviter la fermeture immédiate
    toggleMenu();
});

// ============================================
// FERMETURE AU CLIC SUR UN LIEN
// ============================================
// Je ferme le menu quand on clique sur un lien de navigation
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Je vérifie si le menu est ouvert
        if (navbar.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// ============================================
// FERMETURE AU CLIC EN DEHORS DU MENU
// ============================================
// Je ferme le menu si on clique en dehors de celui-ci
document.addEventListener('click', (e) => {
    // Je vérifie si le menu est ouvert
    if (navbar.classList.contains('active')) {
        // Je vérifie si le clic est en dehors du menu et du burger
        if (!navbar.contains(e.target) && !burgerMenu.contains(e.target)) {
            toggleMenu();
        }
    }
});

// ============================================
// FERMETURE AVEC LA TOUCHE ÉCHAP
// ============================================
// Je ferme le menu avec la touche Échap pour l'accessibilité
document.addEventListener('keydown', (e) => {
    // Je vérifie si c'est la touche Échap et que le menu est ouvert
    if (e.key === 'Escape' && navbar.classList.contains('active')) {
        toggleMenu();
    }
});

// ============================================
// FERMETURE AUTOMATIQUE AU RESIZE
// ============================================
// Je ferme le menu automatiquement si la fenêtre est redimensionnée en desktop
let resizeTimer;
window.addEventListener('resize', () => {
    // Je nettoie le timer précédent
    clearTimeout(resizeTimer);
    
    // Je crée un nouveau timer pour éviter trop d'appels
    resizeTimer = setTimeout(() => {
        // Je ferme le menu si on passe en mode desktop (> 1024px)
        if (window.innerWidth > 1024 && navbar.classList.contains('active')) {
            toggleMenu();
            //console.log('Menu fermé automatiquement (passage en mode desktop)');
        }
    }, 250);
});

// ============================================
// DÉFILEMENT FLUIDE VERS LES SECTIONS
// ============================================
// J'ai activé le smooth scroll pour tous les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Je récupère la cible de l'ancre
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        // Je scroll vers la cible si elle existe
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            //console.log(`Scroll vers ${targetId}`);
        }
    });
});

//console.log('Module menu chargé avec succès');