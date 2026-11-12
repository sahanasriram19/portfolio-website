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
  const currentFile = document.body.dataset.parent || window.location.pathname.split('/').pop() || 'index.html';
  navAnchors.forEach(a => {
    const href = a.getAttribute('href');
    const targetFile = href.split('#')[0] || 'index.html';
    if (targetFile === currentFile && !href.includes('#')) {
      a.classList.add('active');
    }
  });

  /* ---------- Screen lightbox (case study page) ---------- */
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lbImg = document.getElementById('lightboxImg');
    const lbCap = document.getElementById('lightboxCap');
    const lbClose = lightbox.querySelector('.lightbox-close');
    let lastTrigger = null;

    const openLb = (btn) => {
      lastTrigger = btn;
      lbImg.src = btn.dataset.lightbox;
      lbImg.alt = btn.querySelector('img') ? btn.querySelector('img').alt : '';
      lbCap.textContent = btn.dataset.caption || '';
      lightbox.classList.remove('zoomed');
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      lbClose.focus();
    };
    const closeLb = () => {
      lightbox.hidden = true;
      lbImg.removeAttribute('src');
      document.body.style.overflow = '';
      if (lastTrigger) lastTrigger.focus();
    };

    document.querySelectorAll('[data-lightbox]').forEach(btn => {
      btn.addEventListener('click', () => openLb(btn));
    });
    lbImg.addEventListener('click', (e) => {
      e.stopPropagation();
      lightbox.classList.toggle('zoomed');
    });
    lbClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-stage')) closeLb();
    });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.hidden && e.key === 'Escape') closeLb();
    });
  }

  /* ---------- Contact form: opens the visitor's email app ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const note = document.getElementById('formNote');
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const f = contactForm.elements;
      const name = f.name.value.trim();
      const email = f.email.value.trim();
      const message = f.message.value.trim();
      let ok = true;
      [f.name, f.email, f.message].forEach(el => el.classList.remove('invalid'));
      if (!name) { f.name.classList.add('invalid'); ok = false; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { f.email.classList.add('invalid'); ok = false; }
      if (!message) { f.message.classList.add('invalid'); ok = false; }
      if (!ok) { note.textContent = 'Please fill in your name, a valid email and a message.'; return; }
      const subject = f.subject.value.trim() || 'Message from your portfolio';
      const body = message + '\n\n' + name + '\n' + email;
      note.textContent = 'Opening your email app. If nothing opens, email sahanasriram19@gmail.com directly.';
      window.location.href = 'mailto:sahanasriram19@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }

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