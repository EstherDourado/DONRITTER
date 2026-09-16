/**
 * ==========================================
 * CONFIGURAÇÕES DA PIZZARIA (Edite aqui)
 * ==========================================
 */
const CONFIG = {
    // Número do WhatsApp (somente números, inclua DDI 55 e DDD)
    whatsappNumber: "554599632098", 
    
    // Mensagem padrão ao abrir o WhatsApp
    whatsappMessage: "Olá! Gostaria de fazer um pedido.",
    
    // Link do sistema de pedidos online (MenuDino, Goomer, iFood, etc)
    linkPedidosOnline: "https://donritterdelivery.saipos.com/home",
    
    // Link para o PDF do cardápio completo
    linkCardapioPdf: "/assets/cardapio-don-ritter.pdf",
    
    // Link do Instagram
    linkInstagram: "https://www.instagram.com/donritterpizzaria/"
};

/**
 * ==========================================
 * INICIALIZAÇÃO E LÓGICA DE INTERFACE
 * ==========================================
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Aplicar Configurações nos Links
    const wpUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;
    
    document.querySelectorAll('.btn-whatsapp').forEach(btn => btn.href = wpUrl);
    document.querySelectorAll('.btn-pedir').forEach(btn => {
        btn.href = CONFIG.linkPedidosOnline;
        btn.target = "_blank";
    });
    
    const btnPdf = document.getElementById('btn-cardapio-pdf');
    if(btnPdf) btnPdf.href = CONFIG.linkCardapioPdf;
    
    document.getElementById('link-instagram-text').href = CONFIG.linkInstagram;
    document.getElementById('link-instagram-footer').href = CONFIG.linkInstagram;
    
    // Setar ano atual no footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // 2. Experiência de Abertura (Loader Cinematográfico)
    const loader = document.getElementById('loader');
    const loaderLogo = document.getElementById('loader-logo');
    
    // Respeitar prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        // Sequência de animação
        setTimeout(() => {
            loaderLogo.classList.remove('opacity-0');
            loaderLogo.classList.add('opacity-100');
        }, 300); // Logo aparece

        setTimeout(() => {
            loader.classList.remove('opacity-100');
            loader.classList.add('opacity-0');
            loader.style.pointerEvents = 'none'; // Permitir cliques embaixo
        }, 2000); // Tela começa a sumir

        setTimeout(() => {
            loader.remove(); // Remove do DOM para liberar memória
        }, 3000);
    } else {
        loader.remove();
    }

    // 3. Menu Mobile Toggle
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        const isOpen = mobileMenu.classList.contains('opacity-100');
        if (isOpen) {
            mobileMenu.classList.remove('opacity-100');
            mobileMenu.classList.add('opacity-0', 'pointer-events-none');
            document.body.style.overflow = ''; // Retorna scroll
        } else {
            mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
            mobileMenu.classList.add('opacity-100');
            document.body.style.overflow = 'hidden'; // Trava scroll
        }
    }

    menuBtn.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));

    // 4. Esconder/Mostrar Navbar no Scroll
    let lastScroll = 0;
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll <= 0) {
            navbar.classList.remove('-translate-y-full');
            navbar.classList.remove('shadow-lg');
            return;
        }
        
        if (currentScroll > lastScroll && !mobileMenu.classList.contains('opacity-100')) {
            // Scroll Down - esconde
            navbar.classList.add('-translate-y-full');
        } else {
            // Scroll Up - mostra com sombra
            navbar.classList.remove('-translate-y-full');
            navbar.classList.add('shadow-lg');
        }
        lastScroll = currentScroll;
    });

    // 5. Scroll Reveal Animation (Intersection Observer)
    if (!prefersReducedMotion) {
        const revealElements = document.querySelectorAll('.reveal');
        
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Anima apenas uma vez
                }
            });
        }, {
            root: null,
            threshold: 0.15, // Aciona quando 15% do elemento está visível
            rootMargin: "0px 0px -50px 0px"
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // 6. Esteira (Carrossel Auto-scroll)
    const carousel = document.getElementById('pizza-carousel');
    if (carousel && !prefersReducedMotion) {
        // Duplicar os itens para criar o loop infinito visual
        const items = [...carousel.children];
        items.forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true'); // Ocultar do leitor de tela
            carousel.appendChild(clone);
        });

        let isScrolling = true;
        const scrollSpeed = 1; // Velocidade da esteira (pixels por frame)
        
        function autoScrollCarousel() {
            if (isScrolling) {
                carousel.scrollLeft += scrollSpeed;
                
                // Quando rolar além da metade (onde os itens originais terminam), 
                // reseta a rolagem para o início para dar a ilusão de esteira infinita.
                if (carousel.scrollLeft >= (carousel.scrollWidth / 2)) {
                    carousel.scrollLeft = 0;
                }
            }
            requestAnimationFrame(autoScrollCarousel);
        }

        // Pausar na interação (toque ou mouse) para o usuário olhar com calma
        carousel.addEventListener('mouseenter', () => isScrolling = false);
        carousel.addEventListener('mouseleave', () => isScrolling = true);
        
        carousel.addEventListener('touchstart', () => isScrolling = false, {passive: true});
        carousel.addEventListener('touchend', () => {
            setTimeout(() => { isScrolling = true; }, 1500); // Retoma após 1.5s
        });

        // Iniciar esteira
        autoScrollCarousel();
    }
});