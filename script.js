document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    const revealElements = document.querySelectorAll('.reveal');

    const syncHeader = () => {
        header.classList.toggle('scrolled', window.scrollY > 18);
    };

    syncHeader();
    window.addEventListener('scroll', syncHeader, { passive: true });

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            document.body.classList.toggle('nav-open', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
            hamburger.querySelector('i').className = isOpen ? 'fas fa-times' : 'fas fa-bars';
        });

        navItems.forEach((link) => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                document.body.classList.remove('nav-open');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.querySelector('i').className = 'fas fa-bars';
            });
        });
    }

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.16 });

    revealElements.forEach((element) => revealObserver.observe(element));
});
