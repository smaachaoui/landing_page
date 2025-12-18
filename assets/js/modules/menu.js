// Menu burger et navigation
// J'ai créé un menu responsive qui s'ouvre et se ferme au clic
const burgerMenu = document.querySelector('.burger-menu');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.navbar a');

// Je gère l'ouverture et la fermeture du menu
function toggleMenu() {
    const isOpen = navbar.classList.toggle('active');
    burgerMenu.classList.toggle('active');
    burgerMenu.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

// J'ouvre ou ferme le menu au clic sur le burger
burgerMenu.addEventListener('click', toggleMenu);

// Je ferme le menu quand on clique sur un lien
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navbar.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// Je ferme le menu si on clique en dehors
document.addEventListener('click', (e) => {
    if (navbar.classList.contains('active') && 
        !navbar.contains(e.target) && 
        !burgerMenu.contains(e.target)) {
        toggleMenu();
    }
});

// Je ferme le menu avec la touche Échap
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navbar.classList.contains('active')) {
        toggleMenu();
    }
});

// Je ferme le menu automatiquement si la fenêtre est redimensionnée en desktop
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768 && navbar.classList.contains('active')) {
            toggleMenu();
        }
    }, 250);
});


// Défilement fluide vers les sections
// J'ai activé le smooth scroll pour tous les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});