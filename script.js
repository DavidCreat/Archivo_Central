/*
██████╗░░█████╗░██╗░░░██╗██╗██████╗░  ░█████╗░██████╗░███████╗░█████╗░████████╗
██╔══██╗██╔══██╗██║░░░██║██║██╔══██╗  ██╔══██╗██╔══██╗██╔════╝██╔══██╗╚══██╔══╝
██║░░██║███████║╚██╗░██╔╝██║██║░░██║  ██║░░╚═╝██████╔╝█████╗░░███████║░░░██║░░░
██║░░██║██╔══██║░╚████╔╝░██║██║░░██║  ██║░░██╗██╔══██╗██╔══╝░░██╔══██║░░░██║░░░
██████╔╝██║░░██║░░╚██╔╝░░██║██████╔╝  ╚█████╔╝██║░░██║███████╗██║░░██║░░░██║░░░
╚═════╝░╚═╝░░╚═╝░░░╚═╝░░░╚═╝╚═════╝░  ░╚════╝░╚═╝░░╚═╝╚══════╝╚═╝░░╚═╝░░░╚═╝░░░
David Fonseca "DavidCreat" https://github.com/DavidCreat
  Copyright © 2024 David Fonseca "DavidCreat"
  Todos los derechos reservados.
  Este script está protegido por derechos de autor y no puede ser copiado, modificado ni distribuido sin permiso del autor.
  https://github.com/DavidCreat
*/

// Inicialización de GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Animación de revelación de texto
const revealTexts = document.querySelectorAll('.reveal-text');
revealTexts.forEach(text => {
    gsap.to(text, {
        scrollTrigger: {
            trigger: text,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
    });
});

// Animación de las tarjetas de características
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach(card => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power2.out"
    });
});

// Efecto de paralaje en secciones
const parallaxSections = document.querySelectorAll('.parallax-section');
parallaxSections.forEach(section => {
    gsap.to(section, {
        backgroundPosition: `50% ${innerHeight / 2}px`,
        ease: "none",
        scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
});

// Inicialización de VanillaTilt para las tarjetas de características
VanillaTilt.init(document.querySelectorAll(".feature-card"), {
    max: 25,
    speed: 400,
    glare: true,
    "max-glare": 0.5,
});

// Manejo del tema oscuro/claro
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

themeToggle.addEventListener('click', () => {
    htmlElement.classList.toggle('dark');
});

// Cursor personalizado
const cursor = document.getElementById('cursor');
const cursorBlur = document.getElementById('cursor-blur');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursorBlur.style.left = e.clientX - 200 + 'px';
    cursorBlur.style.top = e.clientY - 200 + 'px';
});

// Efecto hover para elementos interactivos
const interactiveElements = document.querySelectorAll('a, button, .upload-area');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursorBlur.style.transform = 'scale(1.2)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursorBlur.style.transform = 'scale(1)';
    });
});

// Simulación de carga de archivos
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadProgress = document.getElementById('uploadProgress');
const progressBar = uploadProgress.querySelector('.progress');

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    handleFiles(files);
});

fileInput.addEventListener('change', () => {
    const files = fileInput.files;
    handleFiles(files);
});

function handleFiles(files) {
    if (files.length > 0) {
        uploadProgress.hidden = false;
        simulateUpload();
    }
}

function simulateUpload() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        progressBar.style.width = `${progress}%`;
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                uploadProgress.hidden = true;
                progressBar.style.width = '0%';
                alert('Archivo subido exitosamente!');
            }, 500);
        }
    }, 200);
}

// Formulario de contacto
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    alert('Mensaje enviado exitosamente!');
    contactForm.reset();
});

// Carrusel de testimonios
const testimonialCarousel = document.querySelector('.testimonial-carousel');
let isDown = false;
let startX;
let scrollLeft;

testimonialCarousel.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - testimonialCarousel.offsetLeft;
    scrollLeft = testimonialCarousel.scrollLeft;
});

testimonialCarousel.addEventListener('mouseleave', () => {
    isDown = false;
});

testimonialCarousel.addEventListener('mouseup', () => {
    isDown = false;
});

testimonialCarousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - testimonialCarousel.offsetLeft;
    const walk = (x - startX) * 3;
    testimonialCarousel.scrollLeft = scrollLeft - walk;
});

// Menú hamburguesa para móviles
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

/*
██████╗░░█████╗░██╗░░░██╗██╗██████╗░  ░█████╗░██████╗░███████╗░█████╗░████████╗
██╔══██╗██╔══██╗██║░░░██║██║██╔══██╗  ██╔══██╗██╔══██╗██╔════╝██╔══██╗╚══██╔══╝
██║░░██║███████║╚██╗░██╔╝██║██║░░██║  ██║░░╚═╝██████╔╝█████╗░░███████║░░░██║░░░
██║░░██║██╔══██║░╚████╔╝░██║██║░░██║  ██║░░██╗██╔══██╗██╔══╝░░██╔══██║░░░██║░░░
██████╔╝██║░░██║░░╚██╔╝░░██║██████╔╝  ╚█████╔╝██║░░██║███████╗██║░░██║░░░██║░░░
╚═════╝░╚═╝░░╚═╝░░░╚═╝░░░╚═╝╚═════╝░  ░╚════╝░╚═╝░░╚═╝╚══════╝╚═╝░░╚═╝░░░╚═╝░░░
David Fonseca "DavidCreat" https://github.com/DavidCreat
  Copyright © 2024 David Fonseca "DavidCreat"
  Todos los derechos reservados.
  Este script está protegido por derechos de autor y no puede ser copiado, modificado ni distribuido sin permiso del autor.
  https://github.com/DavidCreat
*/