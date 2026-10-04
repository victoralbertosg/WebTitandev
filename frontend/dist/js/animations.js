/* ===================================================
   TitanDataSolution — Scroll Animations & Effects
   Intersection Observer + Counter animations
   =================================================== */

(function () {
  'use strict';

  // ===== SCROLL REVEAL =====
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            // Don't unobserve so reconnected elements re-trigger
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  // ===== COUNTER ANIMATION =====
  function animateCounter(element, target, duration) {
    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (target - startValue) * eased);

      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  function initCounters() {
    const counterElements = document.querySelectorAll('[data-target]');
    if (!counterElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target, 10);
            animateCounter(entry.target, target, 1800);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counterElements.forEach((el) => observer.observe(el));
  }

  // ===== SCROLL PROGRESS BAR =====
  function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-label', 'Progreso de lectura');
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }, { passive: true });
  }

  // ===== PROCESS STEPS REVEAL =====
  function initProcessReveal() {
    const processSteps = document.querySelector('.process-steps');
    if (!processSteps) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(processSteps);
  }

  // ===== TECH ITEMS STAGGER =====
  function initTechReveal() {
    const techCategories = document.querySelectorAll('.tech-category');
    if (!techCategories.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    techCategories.forEach((cat) => observer.observe(cat));
  }

  // ===== PORTFOLIO FILTER =====
  function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    if (!filterBtns.length || !portfolioCards.length) return;

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        portfolioCards.forEach((card) => {
          const category = card.dataset.category;

          if (filter === 'all' || category === filter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  // ===== PARALLAX EFFECT FOR HERO GLOWS =====
  function initParallax() {
    const glows = document.querySelectorAll('.hero-glow');
    if (!glows.length) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          glows.forEach((glow, index) => {
            const speed = 0.1 + index * 0.05;
            glow.style.transform = `translateY(${scrollY * speed}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ===== BUTTON RIPPLE EFFECT =====
  function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
        `;

        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  // ===== INITIALIZE ALL =====
  function init() {
    initScrollReveal();
    initCounters();
    initScrollProgress();
    initProcessReveal();
    initTechReveal();
    initPortfolioFilter();
    initParallax();
    initRippleEffect();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
