// ============================================================
// MARIANA ART — Landing Page JavaScript
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Footer Year ──────────────────────────────────────────
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Navbar Scroll Effect ─────────────────────────────────
  const navbar = document.getElementById('navbar');
  let ticking = false;

  function updateNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  });

  // ── Mobile Menu ──────────────────────────────────────────
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobilePanel = document.getElementById('mobile-panel');

  if (mobileBtn && mobilePanel) {
    mobileBtn.addEventListener('click', () => {
      mobileBtn.classList.toggle('active');
      mobilePanel.classList.toggle('open');
    });

    // Close on link click
    mobilePanel.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileBtn.classList.remove('active');
        mobilePanel.classList.remove('open');
      });
    });
  }

  // ── Scroll Reveal Animations ────────────────────────────
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ── FAQ Accordion ───────────────────────────────────────
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq__answer').style.maxHeight = null;
      });

      // Open clicked (if not already open)
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ── Contact Form (Web3Forms) ─────────────────────────────
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('.contact__submit');
      const originalText = btn.textContent;

      btn.textContent = 'שולח...';
      btn.disabled = true;

      try {
        const formData = new FormData(form);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (result.success) {
          btn.textContent = '✓ ההודעה נשלחה בהצלחה';
          btn.classList.add('contact__submit--success');
          form.reset();

          setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
            btn.classList.remove('contact__submit--success');
          }, 4000);
        } else {
          throw new Error(result.message || 'שגיאה בשליחה');
        }
      } catch (error) {
        btn.textContent = '✗ שגיאה — נסו שוב';
        btn.style.background = '#dc2626';

        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.background = '';
        }, 3000);
      }
    });
  }

  // ── Gallery Lightbox ────────────────────────────────────
  const galleryItems = document.querySelectorAll('.gallery__item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  if (lightbox) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // ── Smooth nav link active state ────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => sectionObserver.observe(section));
});
