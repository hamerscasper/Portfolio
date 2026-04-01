  // Nav scroll
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  });

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  function closeMobile() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  function navigateTo(e, target) {
    e.preventDefault();
    const wasOpen = mobileMenu.classList.contains('open');
    closeMobile();
    const delay = wasOpen ? 150 : 0;
    setTimeout(() => {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, delay);
  }

  // Project accordion
  function toggleProject(id) {
    const card = document.getElementById(id);
    const wasExpanded = card.classList.contains('expanded');

    // Close all
    document.querySelectorAll('.project-card').forEach(c => c.classList.remove('expanded'));

    // Toggle clicked
    if (!wasExpanded) {
      card.classList.add('expanded');
      initCarousel(card);
      // Scroll to expanded card
      setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      // When closing, scroll back to the card header
      setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  // Carousel
  function initCarousel(card) {
    const carousel = card.querySelector('[data-carousel]');
    if (!carousel) return;
    const track = carousel.querySelector('.carousel-track');
    const slides = track.querySelectorAll('.carousel-slide');
    const dotsContainer = card.querySelector('[data-dots]');

    // Build dots
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.onclick = () => goToSlide(carousel, i);
      dotsContainer.appendChild(dot);
    });
  }

  function carouselNav(btn, dir) {
    const carousel = btn.closest('.carousel');
    const track = carousel.querySelector('.carousel-track');
    const slides = track.querySelectorAll('.carousel-slide');
    const card = carousel.closest('.project-card');
    const dots = card.querySelectorAll('.dot');

    let current = Math.round(track.scrollLeft / carousel.offsetWidth) || 0;
    // Use transform-based tracking
    const transform = track.style.transform;
    if (transform) {
      const match = transform.match(/translateX\(-(\d+)%\)/);
      if (match) current = parseInt(match[1]) / 100;
    }

    let next = current + dir;
    if (next < 0) next = slides.length - 1;
    if (next >= slides.length) next = 0;

    goToSlide(carousel, next);
  }

  function goToSlide(carousel, index) {
    const track = carousel.querySelector('.carousel-track');
    const card = carousel.closest('.project-card');
    const dots = card.querySelectorAll('.dot');

    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  // Fade-in on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));