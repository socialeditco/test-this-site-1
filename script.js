(() => {
  const body = document.body;
  const menu = document.querySelector('.mega-menu');
  const openBtn = document.querySelector('.menu-toggle');
  const closeBtn = document.querySelector('.menu-close');
  const header = document.getElementById('site-header');
  const revealEls = document.querySelectorAll('.reveal');
  const audio = document.getElementById('backgroundAudio');
  const soundToggle = document.getElementById('soundToggle');
  const tooltip = document.getElementById('tooltip');
  const tooltipTitle = document.getElementById('tooltipTitle');
  const tooltipText = document.getElementById('tooltipText');
  const year = document.getElementById('year');

  if (year) year.textContent = new Date().getFullYear();

  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    menu?.classList.toggle('is-active', open);
    menu?.setAttribute('aria-hidden', String(!open));
    openBtn?.setAttribute('aria-expanded', String(open));
  }

  openBtn?.addEventListener('click', () => setMenu(true));
  closeBtn?.addEventListener('click', () => setMenu(false));
  menu?.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header?.classList.toggle('is-scrolled', y > 24);
    header?.classList.toggle('is-hidden', y > lastY && y > 180);
    lastY = y;
  }, { passive: true });

  let soundOn = false;
  soundToggle?.addEventListener('click', () => {
    soundOn = !soundOn;
    soundToggle.setAttribute('aria-pressed', String(soundOn));
    const label = soundToggle.querySelector('.iconText');
    if (label) label.textContent = soundOn ? 'Sound: On' : 'Sound: Off';
    document.documentElement.style.setProperty('--accent', soundOn ? 'var(--gold-bright)' : 'var(--gold)');

    if (soundOn && audio) {
      audio.volume = 1;
      audio.play().catch(() => {
        soundOn = false;
        soundToggle.setAttribute('aria-pressed', 'false');
        if (label) label.textContent = 'Sound: Off';
      });
    } else if (audio) {
      audio.pause();
      audio.volume = 0;
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });
  revealEls.forEach((el) => observer.observe(el));

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const serviceCopy = {
    Commercial: 'Launch videos, ads, social cutdowns, product stories.',
    Fashion: 'Editorial energy, runway speed, clean direction.',
    Music: 'Videos, live sessions, promos that feel alive.',
    Documentary: 'Truth with texture. Story with restraint.',
    Narrative: 'Short films, branded narratives, cinematic beats.',
    Post: 'Edit rhythm, color taste, sound polish.'
  };

  function positionTooltip(event) {
    if (!tooltip) return;
    tooltip.style.left = Math.min(event.clientX + 14, window.innerWidth - 270) + 'px';
    tooltip.style.top = Math.min(event.clientY + 14, window.innerHeight - 120) + 'px';
  }

  function showTooltip(tile, event) {
    const name = tile.getAttribute('data-service') || 'Service';
    const desc = serviceCopy[name] || 'Preview';
    if (tooltipTitle) tooltipTitle.textContent = name;
    if (tooltipText) tooltipText.textContent = desc;
    if (tooltip) {
      tooltip.style.opacity = '1';
      tooltip.setAttribute('aria-hidden', 'false');
      if (event) positionTooltip(event);
    }
  }

  function hideTooltip() {
    if (tooltip) {
      tooltip.style.opacity = '0';
      tooltip.setAttribute('aria-hidden', 'true');
    }
  }

  document.querySelectorAll('.serviceTile').forEach((tile) => {
    tile.addEventListener('mouseenter', (event) => showTooltip(tile, event));
    tile.addEventListener('mousemove', positionTooltip);
    tile.addEventListener('mouseleave', hideTooltip);
    tile.addEventListener('focus', () => showTooltip(tile));
    tile.addEventListener('blur', hideTooltip);
  });

  window.addEventListener('load', () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    gsap.to('.heroVid', {
      scale: 1.04,
      yPercent: 3,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    gsap.to('.marqueeTrack', {
      xPercent: -18,
      ease: 'none',
      scrollTrigger: { trigger: '.statement-band', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });
})();
