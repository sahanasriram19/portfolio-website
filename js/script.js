// ============================================
// Sahana Sriram — Portfolio
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Load shared navbar ---------- */
  const navPlaceholder = document.getElementById('navbar-placeholder');
  if (navPlaceholder) {
    try {
      const res = await fetch('nav.html');
      const html = await res.text();
      navPlaceholder.outerHTML = html;
    } catch (err) {
      console.error('Failed to load navbar:', err);
    }
  }

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navRight = document.querySelector('.nav-right');

  if (navToggle && navRight) {
    navToggle.addEventListener('click', () => {
      const isOpen = navRight.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    navRight.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navRight.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Active nav link (by current page) ---------- */
  const navAnchors = document.querySelectorAll('.navlinks a');
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  navAnchors.forEach(a => {
    const href = a.getAttribute('href');
    const targetFile = href.split('#')[0] || 'index.html';
    if (targetFile === currentFile && !href.includes('#')) {
      a.classList.add('active');
    }
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Back to top ---------- */
  const toTop = document.querySelector('.to-top');
  if (toTop) {
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('show', window.scrollY > 600);
    }, { passive: true });
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Gallery filter ---------- */
  const filterPills = document.querySelectorAll('.filter-pill');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterPills.length && galleryItems.length) {
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const category = pill.dataset.filter;

        galleryItems.forEach(item => {
          const matches = category === 'all' || item.dataset.category === category;
          item.classList.toggle('hide', !matches);
        });
      });
    });
  }
});