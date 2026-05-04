/**
 * Dr. Gautam Gorityala — Static Site JavaScript
 * All interactivity: dark mode, particles, typewriter, scroll animations, carousel, FAQ, tilt
 */

(function () {
  'use strict';

  /* ============================================
     UTILITIES
     ============================================ */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, evt, fn) => el && el.addEventListener(evt, fn);
  const throttle = (fn, wait) => {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= wait) { last = now; fn(...args); }
    };
  };

  /* ============================================
     PRELOADER
     ============================================ */
  const preloader = $('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => preloader.classList.add('hidden'), 1500);
    });
  }

  /* ============================================
     SCROLL PROGRESS BAR
     ============================================ */
  const progressBar = $('#scrollProgressBar');
  if (progressBar) {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + '%';
    };
    window.addEventListener('scroll', throttle(updateProgress, 50), { passive: true });
  }

  /* ============================================
     NAVIGATION SCROLL EFFECT + CTA PULSE
     ============================================ */
  const nav = $('#nav');
  const navCta = $('.nav-actions .btn-primary');
  if (nav) {
    const updateNav = () => {
      const scrolled = window.scrollY > 100;
      nav.classList.toggle('scrolled', scrolled);
      if (navCta) {
        navCta.classList.toggle('btn-pulse', !scrolled);
      }
    };
    window.addEventListener('scroll', throttle(updateNav, 50), { passive: true });
    updateNav();
  }

  /* ============================================
     MOBILE MENU
     ============================================ */
  const mobileToggle = $('#navMobileToggle');
  const mobileMenu = $('#mobileMenu');
  if (mobileToggle && mobileMenu) {
    on(mobileToggle, 'click', () => {
      const isOpen = mobileMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });
    $$('.mobile-menu-link', mobileMenu).forEach(link => {
      on(link, 'click', () => {
        mobileMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  /* ============================================
     SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    on(anchor, 'click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = $(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ============================================
     DARK MODE
     ============================================ */
  const darkToggle = $('#darkToggle');
  const html = document.documentElement;

  function initDarkMode() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      html.classList.add('dark');
    }
  }
  initDarkMode();

  if (darkToggle) {
    on(darkToggle, 'click', () => {
      html.classList.toggle('dark');
      localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
    });
  }

  /* ============================================
     PARTICLE FIELD (Canvas) — Mouse + Touch Reactive
     ============================================ */
  const canvas = $('#particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let pointer = { x: -9999, y: -9999, active: false };
    let animationId;
    let isActive = true;

    function resizeCanvas() {
      const parent = canvas.parentElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', throttle(resizeCanvas, 200));

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.baseVx = this.vx;
        this.baseVy = this.vy;
        this.radius = Math.random() * 1.5 + 0.8;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.friction = 0.96;
      }
      update() {
        // Base drift
        this.x += this.vx;
        this.y += this.vy;

        // Pointer interaction — strong repulsion + turbulence
        if (pointer.active) {
          const dx = this.x - pointer.x;
          const dy = this.y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const interactRadius = 180;

          if (dist < interactRadius && dist > 0) {
            const force = (interactRadius - dist) / interactRadius;
            const angle = Math.atan2(dy, dx);
            // Push away strongly
            const push = force * 3.5;
            this.vx += Math.cos(angle) * push;
            this.vy += Math.sin(angle) * push;

            // Swirl effect — add tangential velocity
            const swirl = force * 1.2;
            this.vx += Math.sin(angle) * swirl;
            this.vy -= Math.cos(angle) * swirl;
          }
        }

        // Friction / return to base speed
        this.vx *= this.friction;
        this.vy *= this.friction;

        // Keep minimum movement
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed < 0.15) {
          this.vx += (this.baseVx - this.vx) * 0.05;
          this.vy += (this.baseVy - this.vy) * 0.05;
        }

        // Bounce off edges
        if (this.x < 0) { this.x = 0; this.vx *= -0.8; }
        if (this.x > canvas.width) { this.x = canvas.width; this.vx *= -0.8; }
        if (this.y < 0) { this.y = 0; this.vy *= -0.8; }
        if (this.y > canvas.height) { this.y = canvas.height; this.vy *= -0.8; }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        const isDark = html.classList.contains('dark');
        ctx.fillStyle = isDark
          ? `rgba(255, 210, 63, ${this.opacity})`
          : `rgba(20, 184, 166, ${this.opacity})`;
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 6000), 200);
      for (let i = 0; i < count; i++) particles.push(new Particle());
    }
    initParticles();

    function drawConnections() {
      const isDark = html.classList.contains('dark');
      const lineColor = isDark ? '255, 210, 63' : '20, 184, 166';

      // Particle-to-particle connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity = (1 - dist / 130) * 0.18;
            ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Pointer-to-particle connections
      if (pointer.active) {
        particles.forEach(p => {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 220) {
            ctx.beginPath();
            ctx.moveTo(pointer.x, pointer.y);
            ctx.lineTo(p.x, p.y);
            const opacity = (1 - dist / 220) * 0.35;
            ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
      }
    }

    function drawPointerGlow() {
      if (!pointer.active) return;
      const isDark = html.classList.contains('dark');
      const glowColor = isDark ? '255, 210, 63' : '20, 184, 166';

      // Outer soft glow
      const grad = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 120);
      grad.addColorStop(0, `rgba(${glowColor}, 0.15)`);
      grad.addColorStop(0.5, `rgba(${glowColor}, 0.05)`);
      grad.addColorStop(1, `rgba(${glowColor}, 0)`);
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 120, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Inner bright dot
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${glowColor}, 0.9)`;
      ctx.fill();
    }

    function animate() {
      animationId = null;
      if (!isActive) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      drawPointerGlow();
      animationId = requestAnimationFrame(animate);
    }
    animate();

    // Mouse handlers � attached to window so they work even when content overlays canvas
    on(window, 'mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Only activate when cursor is within canvas bounds
      if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
        pointer.x = x;
        pointer.y = y;
        pointer.active = true;
      } else {
        pointer.active = false;
      }
    });

    // Touch handlers � attached to window for full-page touch tracking
    on(window, 'touchstart', (e) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      if (x >= -50 && x <= canvas.width + 50 && y >= -50 && y <= canvas.height + 50) {
        pointer.x = x;
        pointer.y = y;
        pointer.active = true;
      }
    }, { passive: true });

    on(window, 'touchmove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      if (x >= -50 && x <= canvas.width + 50 && y >= -50 && y <= canvas.height + 50) {
        pointer.x = x;
        pointer.y = y;
        pointer.active = true;
      }
    }, { passive: true });

    on(window, 'touchend', () => {
      pointer.active = false;
    });
    on(window, 'touchcancel', () => {
      pointer.active = false;
    });

    // Pause when not visible
    const observer = new IntersectionObserver((entries) => {
      isActive = entries[0].isIntersecting;
      if (isActive && !animationId) animate();
    }, { threshold: 0 });
    observer.observe(canvas);
  }

  /* ============================================
     TYPEWRITER EFFECT
     ============================================ */
  const typewriterEl = $('#typewriterText');
  if (typewriterEl) {
    const words = [
      'Diabetes Management',
      'Hypertension Care',
      'Geriatric Medicine',
      'Infectious Diseases',
      'Thyroid Disorders',
      'General Medicine'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let pauseEnd = 0;

    function typewriter() {
      const current = words[wordIndex];
      const now = Date.now();

      if (isDeleting) {
        if (charIndex > 0) {
          charIndex--;
          typewriterEl.textContent = current.substring(0, charIndex);
          setTimeout(typewriter, 50);
        } else {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(typewriter, 300);
        }
      } else {
        if (charIndex < current.length) {
          charIndex++;
          typewriterEl.textContent = current.substring(0, charIndex);
          setTimeout(typewriter, 100);
        } else {
          pauseEnd = now + 2000;
          setTimeout(() => { isDeleting = true; typewriter(); }, 2000);
        }
      }
    }
    setTimeout(typewriter, 800);
  }

  /* ============================================
     PAGE LOAD HERO ANIMATIONS
     ============================================ */
  function animateHeroOnLoad() {
    const heroEls = $$('.hero .scroll-reveal');
    heroEls.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('revealed');
      }, 300 + i * 120);
    });
  }

  /* ============================================
     SCROLL REVEAL (Intersection Observer)
     ============================================ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      } else {
        entry.target.classList.remove('revealed');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  $$('.scroll-reveal').forEach(el => {
    // Skip hero elements — they're animated on load
    if (!el.closest('.hero')) {
      revealObserver.observe(el);
    }
  });

  // Trigger hero animation after preloader
  setTimeout(animateHeroOnLoad, 1600);

  /* ============================================
     SERVICES TABS
     ============================================ */
  const tabButtons = $$('.services-tab');
  const tabPanels = $$('.services-panel');

  function staggerCards(panel) {
    const cards = $$('.service-card', panel);
    cards.forEach((card, i) => {
      card.classList.remove('revealed');
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px) scale(0.95)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
      }, i * 80);
    });
  }

  tabButtons.forEach(btn => {
    on(btn, 'click', () => {
      const tabId = btn.dataset.tab;
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const panel = $(`#services-panel-${tabId}`);
      if (panel) {
        panel.classList.add('active');
        staggerCards(panel);
      }
    });
  });

  /* ============================================
     3D TILT CARDS
     ============================================ */
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  if (!isTouchDevice) {
    $$('.tilt-card').forEach(card => {
      const inner = card.querySelector('.service-card-inner');
      if (!inner) return;

      on(card, 'mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rx = ((y - cy) / cy) * -8;
        const ry = ((x - cx) / cx) * 8;
        inner.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
      });

      on(card, 'mouseleave', () => {
        inner.style.transform = '';
      });
    });
  }

  /* ============================================
     TESTIMONIALS CAROUSEL (Mobile)
     ============================================ */
  const carousel = $('#testimonialsCarousel');
  const dots = $$('.testimonials-dot');

  if (carousel && dots.length) {
    function updateDots() {
      const scrollLeft = carousel.scrollLeft;
      const child = carousel.firstElementChild;
      if (!child) return;
      const gap = 24;
      const cardWidth = child.offsetWidth + gap;
      const index = Math.round(scrollLeft / cardWidth);
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }

    carousel.addEventListener('scroll', throttle(updateDots, 100), { passive: true });

    dots.forEach(dot => {
      on(dot, 'click', () => {
        const index = parseInt(dot.dataset.index);
        const child = carousel.firstElementChild;
        if (!child) return;
        const gap = 24;
        const cardWidth = child.offsetWidth + gap;
        carousel.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
      });
    });
  }

  /* ============================================
     FAQ ACCORDION
     ============================================ */
  const faqItems = $$('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;
    on(trigger, 'click', () => {
      const isOpen = item.classList.contains('active');
      // Close all others
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherTrigger = other.querySelector('.faq-trigger');
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
      });
      // Toggle current
      if (!isOpen) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ============================================
     CONTACT FORM
     ============================================ */
  const contactForm = $('#contactForm');
  if (contactForm) {
    on(contactForm, 'submit', (e) => {
      e.preventDefault();
      const submitText = $('#submitText');
      if (submitText) submitText.textContent = 'Message Sent!';
      contactForm.reset();
      setTimeout(() => {
        if (submitText) submitText.textContent = 'Send Message';
      }, 3000);
    });
  }

  /* ============================================
     DYNAMIC FOOTER YEAR
     ============================================ */
  const yearEl = $('#footerYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ============================================
     BACK TO TOP
     ============================================ */
  const backToTop = $('#backToTop');
  if (backToTop) {
    on(backToTop, 'click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();


