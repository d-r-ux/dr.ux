/* =============================================
   UX Portfolio — dr.ux — Interactive JS
   ============================================= */

(function () {
  'use strict';

  /* ── DOM Helpers ── */
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

  /* ─────────────────────────────────────────────
     1. Custom Cursor
  ───────────────────────────────────────────── */
  const cursor       = $('#cursor');
  const cursorFollow = $('#cursor-follower');
  let mouseX = 0, mouseY = 0;
  let followX = 0, followY = 0;

  if (cursor && cursorFollow) {
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    (function animateFollower() {
      followX += (mouseX - followX) * 0.12;
      followY += (mouseY - followY) * 0.12;
      cursorFollow.style.left = followX + 'px';
      cursorFollow.style.top  = followY + 'px';
      requestAnimationFrame(animateFollower);
    })();

    const hoverTargets = 'a, button, .project-card, .skill-tag, .filter-btn, .social-link';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverTargets)) {
        cursor.classList.add('hovering');
        cursorFollow.classList.add('hovering');
      }
    });

    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverTargets)) {
        cursor.classList.remove('hovering');
        cursorFollow.classList.remove('hovering');
      }
    });
  }

  /* ─────────────────────────────────────────────
     2. Scroll Progress Bar
  ───────────────────────────────────────────── */
  const progressBar = $('#scroll-progress');

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }

  /* ─────────────────────────────────────────────
     3. Navigation — Scroll Behaviour
  ───────────────────────────────────────────── */
  const nav = $('#nav');

  function updateNav() {
    if (!nav) return;
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  /* ─────────────────────────────────────────────
     4. Mobile Menu Toggle
  ───────────────────────────────────────────── */
  const menuToggle = $('#menu-toggle');
  const mobileMenu = $('#mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    $$('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuToggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ─────────────────────────────────────────────
     5. Dark / Light Mode Toggle
  ───────────────────────────────────────────── */
  const themeToggle = $('#theme-toggle');
  const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.body.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.body.setAttribute('data-theme', next);
      localStorage.setItem('portfolio-theme', next);
    });
  }

  /* ─────────────────────────────────────────────
     6. Hero Typing Effect
  ───────────────────────────────────────────── */
  const heroSub = $('#hero-sub');
  const phrases = [
    'Turning research into intuitive products.',
    'Human-centered. Data-informed. Intentional.',
    'From wireframe to working product.',
    'Designing systems people actually enjoy using.'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingTimer;

  function typeText() {
    if (!heroSub) return;

    const currentPhrase = phrases[phraseIndex];
    const displayText = isDeleting
      ? currentPhrase.slice(0, charIndex - 1)
      : currentPhrase.slice(0, charIndex + 1);

    heroSub.innerHTML = displayText + '<span class="cursor-blink"></span>';

    if (!isDeleting) {
      charIndex++;
      if (charIndex > currentPhrase.length) {
        isDeleting = true;
        typingTimer = setTimeout(typeText, 2200);
        return;
      }
    } else {
      charIndex--;
      if (charIndex < 0) {
        isDeleting = false;
        charIndex = 0;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingTimer = setTimeout(typeText, 400);
        return;
      }
    }

    const speed = isDeleting ? 40 : 60;
    typingTimer = setTimeout(typeText, speed);
  }

  setTimeout(typeText, 1400);

  /* ─────────────────────────────────────────────
     7. Scroll-Triggered Reveal Animations
  ───────────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger children within the same parent
          const siblings = $$('.reveal', entry.target.parentElement);
          const index = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 80);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  $$('.reveal').forEach(el => revealObserver.observe(el));

  /* ─────────────────────────────────────────────
     8. Animated Stat Counters
  ───────────────────────────────────────────── */
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );

  const statsSection = $('.hero-stats');
  if (statsSection) statsObserver.observe(statsSection);

  function animateCounters() {
    $$('.stat-num').forEach(el => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const duration = 1800;
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
    });
  }

  /* ─────────────────────────────────────────────
     9. Project Filter
  ───────────────────────────────────────────── */
  const filterBtns = $$('.filter-btn');
  const projectCards = $$('.project-card');
  const grid = $('#projects-grid');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      let visibleCount = 0;

      projectCards.forEach(card => {
        const cats = card.getAttribute('data-category') || '';
        const matches = filter === 'all' || cats.split(' ').includes(filter);

        if (matches) {
          card.classList.remove('hidden');
          card.style.position = '';
          card.style.visibility = '';
          visibleCount++;
        } else {
          card.classList.add('hidden');
        }
      });

      // Re-trigger reveal for newly shown cards
      setTimeout(() => {
        projectCards.forEach(card => {
          if (!card.classList.contains('hidden') && !card.classList.contains('visible')) {
            card.classList.add('visible');
          }
        });
      }, 50);
    });
  });

  /* ─────────────────────────────────────────────
     10. Testimonials Carousel
  ───────────────────────────────────────────── */
  const testimonials = $$('.testimonial');
  const tDots = $$('.t-dot');
  const tPrev = $('#t-prev');
  const tNext = $('#t-next');
  let tIndex = 0;
  let tAutoplay;

  function goToTestimonial(index) {
    testimonials[tIndex].classList.remove('active');
    tDots[tIndex].classList.remove('active');
    tIndex = (index + testimonials.length) % testimonials.length;
    testimonials[tIndex].classList.add('active');
    tDots[tIndex].classList.add('active');
  }

  function startAutoplay() {
    tAutoplay = setInterval(() => goToTestimonial(tIndex + 1), 5000);
  }

  function resetAutoplay() {
    clearInterval(tAutoplay);
    startAutoplay();
  }

  if (tNext) tNext.addEventListener('click', () => { goToTestimonial(tIndex + 1); resetAutoplay(); });
  if (tPrev) tPrev.addEventListener('click', () => { goToTestimonial(tIndex - 1); resetAutoplay(); });

  tDots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goToTestimonial(i); resetAutoplay(); });
  });

  if (testimonials.length > 0) startAutoplay();

  /* ─────────────────────────────────────────────
     11. Contact Form
  ───────────────────────────────────────────── */
  const form        = $('#contact-form');
  const submitBtn   = $('#submit-btn');
  const formSuccess = $('#form-success');
  const messageArea = $('#message');
  const charCount   = $('#char-count');

  if (messageArea && charCount) {
    messageArea.addEventListener('input', () => {
      const len = messageArea.value.length;
      charCount.textContent = len + ' / 500';
      charCount.style.color = len > 450 ? '#EF4444' : '';
    });
  }

  function validateField(input, errorId, validator) {
    const error = $('#' + errorId);
    if (!input || !error) return true;
    const msg = validator(input.value.trim());
    error.textContent = msg;
    input.classList.toggle('error', !!msg);
    return !msg;
  }

  function validateAll() {
    const nameOk = validateField(
      $('#name'), 'name-error',
      v => v.length < 2 ? 'Please enter your name.' : ''
    );
    const emailOk = validateField(
      $('#email'), 'email-error',
      v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email.'
    );
    const msgOk = validateField(
      $('#message'), 'message-error',
      v => v.length < 10 ? 'Message must be at least 10 characters.' : ''
    );
    return nameOk && emailOk && msgOk;
  }

  // Live validation
  ['#name', '#email', '#message'].forEach(sel => {
    const el = $(sel);
    if (el) el.addEventListener('blur', validateAll);
  });

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!validateAll()) return;

      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      // Simulate async send (replace with real endpoint)
      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        form.reset();
        if (charCount) charCount.textContent = '0 / 500';
        if (formSuccess) formSuccess.classList.add('show');
        setTimeout(() => formSuccess && formSuccess.classList.remove('show'), 6000);
      }, 1800);
    });
  }

  /* ─────────────────────────────────────────────
     12. Smooth Anchor Scroll
  ───────────────────────────────────────────── */
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = $(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '72', 10);
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ─────────────────────────────────────────────
     13. Back to Top
  ───────────────────────────────────────────── */
  const backToTop = $('#back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─────────────────────────────────────────────
     14. Active Nav Link Highlighting
  ───────────────────────────────────────────── */
  const sections  = $$('section[id]');
  const navLinks  = $$('.nav-link');
  const navH = 80;

  function updateActiveNav() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - navH - 10) {
        current = sec.id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').slice(1);
      link.style.color = href === current ? 'var(--text)' : '';
    });
  }

  /* ─────────────────────────────────────────────
     15. Scroll Event (throttled)
  ───────────────────────────────────────────── */
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      updateProgress();
      updateNav();
      updateActiveNav();
      ticking = false;
    });
    ticking = true;
  }, { passive: true });

  // Initial call
  updateNav();
  updateActiveNav();
  updateProgress();

  /* ─────────────────────────────────────────────
     16. Keyboard Navigation Support
  ───────────────────────────────────────────── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      if (menuToggle) menuToggle.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ─────────────────────────────────────────────
     17. Reduced Motion Respect
  ───────────────────────────────────────────── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    clearTimeout(typingTimer);
    if (heroSub) heroSub.textContent = phrases[0];
    $$('.reveal').forEach(el => el.classList.add('visible'));
    animateCounters();
  }

})();
