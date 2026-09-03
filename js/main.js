/* ===================================================
   TitanDataSolution — Main JavaScript
   Navigation, Form Handling, Back to Top, etc.
   =================================================== */

(function () {
  'use strict';

  // ===== NAVBAR SCROLL EFFECT =====
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScrollY = window.scrollY;

    function updateNavbar() {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 80) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar(); // Initial check
  }

  // ===== MOBILE MENU =====
  function initMobileMenu() {
    const hamburger = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    if (!hamburger || !navMenu) return;

    function toggleMenu() {
      const isOpen = navMenu.classList.toggle('mobile-open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));

      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMenu() {
      navMenu.classList.remove('mobile-open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMenu);

    // Close on nav link click
    navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        closeMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // ===== SMOOTH SCROLL =====
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const navHeight = document.getElementById('navbar')?.offsetHeight || 80;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetTop,
          behavior: 'smooth',
        });
      });
    });
  }

  // ===== ACTIVE NAV LINK ON SCROLL =====
  function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((link) => {
              const href = link.getAttribute('href');
              if (href === `#${id}`) {
                link.style.color = 'var(--color-cyan)';
              } else {
                link.style.color = '';
              }
            });
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-80px 0px 0px 0px',
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // ===== BACK TO TOP =====
  function initBackToTop() {
    const btn = document.getElementById('back-to-top-btn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== CONTACT FORM =====
  function initContactForm() {
    const form = document.getElementById('contact-form');
    const successMsg = document.getElementById('form-success');
    const submitBtn = document.getElementById('contact-submit-btn');
    const btnText = document.getElementById('btn-text');

    if (!form) return;

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(input, message) {
      input.classList.add('error');
      let errorEl = input.parentElement.querySelector('.form-error-msg');
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'form-error-msg';
        errorEl.style.cssText = `
          display: block;
          font-size: 0.75rem;
          color: #ef4444;
          margin-top: 4px;
        `;
        input.parentElement.appendChild(errorEl);
      }
      errorEl.textContent = message;
    }

    function clearError(input) {
      input.classList.remove('error');
      const errorEl = input.parentElement.querySelector('.form-error-msg');
      if (errorEl) errorEl.remove();
    }

    function validateForm() {
      let isValid = true;

      // Name
      const name = form.querySelector('#contact-name');
      if (!name.value.trim()) {
        showError(name, 'El nombre es obligatorio.');
        isValid = false;
      } else {
        clearError(name);
      }

      // Email
      const email = form.querySelector('#contact-email');
      if (!email.value.trim()) {
        showError(email, 'El correo electrónico es obligatorio.');
        isValid = false;
      } else if (!validateEmail(email.value.trim())) {
        showError(email, 'Ingresa un correo electrónico válido.');
        isValid = false;
      } else {
        clearError(email);
      }

      // Service
      const service = form.querySelector('#contact-service');
      if (!service.value) {
        showError(service, 'Por favor selecciona un servicio.');
        isValid = false;
      } else {
        clearError(service);
      }

      // Message
      const message = form.querySelector('#contact-message');
      if (!message.value.trim() || message.value.trim().length < 20) {
        showError(message, 'Por favor describe tu proyecto (mínimo 20 caracteres).');
        isValid = false;
      } else {
        clearError(message);
      }

      return isValid;
    }

    // Real-time validation on blur
    form.querySelectorAll('.form-input').forEach((input) => {
      input.addEventListener('blur', () => {
        if (input.value) {
          clearError(input);
        }
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      // Set loading state
      submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Enviando...';

      try {
        // Simulate API call (replace with actual endpoint)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Success state
        form.style.display = 'none';
        if (successMsg) successMsg.classList.remove('hidden');

        // Analytics event (if GA is set up)
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'form_submit', {
            event_category: 'Contact',
            event_label: form.querySelector('#contact-service')?.value,
          });
        }
      } catch (error) {
        // Error state
        submitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Solicitar Propuesta Gratuita';

        const errorAlert = document.createElement('div');
        errorAlert.style.cssText = `
          padding: 12px 16px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          color: #ef4444;
          font-size: 0.875rem;
          margin-top: 12px;
        `;
        errorAlert.textContent = 'Hubo un error al enviar. Por favor intenta de nuevo o contáctanos directamente.';
        form.appendChild(errorAlert);
        setTimeout(() => errorAlert.remove(), 5000);
      }
    });
  }

  // ===== NAVBAR DROPDOWN ON HOVER (Servicios) =====
  // Future enhancement placeholder

  // ===== KEYBOARD ACCESSIBILITY =====
  function initKeyboardAccessibility() {
    // Skip to main content
    const skipLink = document.createElement('a');
    skipLink.href = '#inicio';
    skipLink.textContent = 'Saltar al contenido principal';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: fixed;
      top: -100px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--color-cyan);
      color: #000;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.875rem;
      z-index: 9999;
      transition: top 0.2s;
    `;

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '20px';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-100px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // ===== LAZY LOAD IMAGES =====
  function initLazyLoad() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    if (!images.length) return;

    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      return;
    }

    // Fallback Intersection Observer
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }

  // ===== SERVICE CARD HOVER TILT =====
  function initCardTilt() {
    const cards = document.querySelectorAll('.service-card, .portfolio-card');

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        const tiltX = y * -4;
        const tiltY = x * 4;

        card.style.transform = `translateY(-4px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        card.style.transition = 'transform 0.1s ease';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'all 0.3s ease';
      });
    });
  }

  // ===== FOOTER YEAR =====
  function updateFooterYear() {
    const yearEl = document.querySelector('.footer-copyright');
    if (yearEl) {
      yearEl.textContent = yearEl.textContent.replace('2025', new Date().getFullYear());
    }
  }

  // ===== INITIALIZE ALL =====
  function init() {
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initActiveNavLinks();
    initBackToTop();
    initContactForm();
    initKeyboardAccessibility();
    initLazyLoad();
    initCardTilt();
    updateFooterYear();

    // Log initialization
    console.log(
      '%cTitanDataSolution 🚀\n%cSitio web cargado correctamente.',
      'color: #00d4ff; font-size: 18px; font-weight: bold; font-family: Space Grotesk;',
      'color: #7c3aed; font-size: 12px;'
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
