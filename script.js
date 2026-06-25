(() => {
  const body = document.body;
  const header = document.getElementById('siteHeader');
  const menuBtn = document.querySelector('.mobileMenuBtn');
  const nav = document.querySelector('.nav');
  const soundToggle = document.getElementById('soundToggle');
  const audio = document.getElementById('backgroundAudio');
  const heroVid = document.querySelector('.heroVid');
  const tooltip = document.getElementById('tooltip');
  const tooltipTitle = document.getElementById('tooltipTitle');
  const tooltipText = document.getElementById('tooltipText');
  const previewLabel = document.getElementById('previewLabel');
  const previewPulse = document.querySelector('.previewPulse');
  const year = document.getElementById('year');

  if (year) year.textContent = new Date().getFullYear();

  menuBtn?.addEventListener('click', () => {
    const isOpen = body.classList.toggle('nav-open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  nav?.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      body.classList.remove('nav-open');
      menuBtn?.setAttribute('aria-expanded', 'false');
    }
  });

  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header?.classList.toggle('is-scrolled', y > 24);
    header?.classList.toggle('is-hidden', y > lastY && y > 280 && !body.classList.contains('nav-open'));
    lastY = y;
  }, { passive: true });

  let soundOn = false;
  soundToggle?.addEventListener('click', () => {
    soundOn = !soundOn;
    soundToggle.setAttribute('aria-pressed', String(soundOn));
    if (heroVid) heroVid.muted = true;

    const label = soundToggle.querySelector('.iconText');
    if (label) label.textContent = soundOn ? 'Sound: On' : 'Sound: Off';
    document.documentElement.style.setProperty('--accent', soundOn ? 'var(--accentOn)' : 'var(--accentOff)');

    if (soundOn) {
      if (audio) {
        audio.volume = 1;
        audio.play().catch(() => {
          soundOn = false;
          soundToggle.setAttribute('aria-pressed', 'false');
          if (label) label.textContent = 'Sound: Off';
          document.documentElement.style.setProperty('--accent', 'var(--accentOff)');
        });
      }
    } else if (audio) {
      audio.pause();
      audio.volume = 0;
    }
  });

  const serviceCopy = {
    Commercial: 'Launch videos, ads, social cutdowns, product stories.',
    Fashion: 'Editorial energy, runway speed, clean direction.',
    Music: 'Videos, live sessions, promos that feel alive.',
    Documentary: 'Truth with texture. Story with restraint.',
    Narrative: 'Short films, branded narratives, cinematic beats.',
    Post: 'Edit rhythm, color taste, sound polish.'
  };

  function moveTooltip(event) {
    if (!tooltip) return;
    tooltip.style.left = Math.min(event.clientX + 14, window.innerWidth - 270) + 'px';
    tooltip.style.top = Math.min(event.clientY + 14, window.innerHeight - 120) + 'px';
  }

  function showService(name, desc, event) {
    document.documentElement.style.setProperty('--accent', 'var(--accentOn)');
    if (previewLabel) previewLabel.textContent = name + ': ' + desc;
    previewPulse?.classList.add('on');
    if (tooltip && tooltipTitle && tooltipText && event) {
      tooltipTitle.textContent = name;
      tooltipText.textContent = desc;
      tooltip.style.opacity = '1';
      tooltip.setAttribute('aria-hidden', 'false');
      moveTooltip(event);
    }
  }

  function hideService() {
    document.documentElement.style.setProperty('--accent', 'var(--accentOff)');
    if (previewLabel) previewLabel.textContent = 'Hover a service';
    previewPulse?.classList.remove('on');
    if (tooltip) {
      tooltip.style.opacity = '0';
      tooltip.setAttribute('aria-hidden', 'true');
    }
  }

  document.querySelectorAll('.serviceTile').forEach((tile) => {
    const name = tile.getAttribute('data-service') || 'Service';
    const desc = serviceCopy[name] || 'Preview';
    tile.addEventListener('mouseenter', (event) => showService(name, desc, event));
    tile.addEventListener('mousemove', moveTooltip);
    tile.addEventListener('mouseleave', hideService);
    tile.addEventListener('focus', () => showService(name, desc));
    tile.addEventListener('blur', hideService);
  });

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

  window.addEventListener('load', () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reel = document.querySelector('.reel');
    const reelInner = document.getElementById('reelInner');
    const smallScreen = window.matchMedia('(max-width: 720px)').matches;

    if (reduce || !window.gsap || !window.ScrollTrigger || smallScreen || !reel || !reelInner) {
      reel?.classList.add('is-unlocked');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    gsap.fromTo('.hero-reveal-item', { y: 54, opacity: 0 }, {
      y: 0,
      opacity: 1,
      duration: 0.85,
      ease: 'power3.out',
      stagger: 0.11,
      scrollTrigger: { trigger: '#hero-content-reveal', start: 'top 70%' }
    });

    gsap.to('.heroVid', {
      scale: 1.06,
      yPercent: 6,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    gsap.to('.marqueeTrack', {
      xPercent: -18,
      ease: 'none',
      scrollTrigger: { trigger: '.interrupt', start: 'top bottom', end: 'bottom top', scrub: true }
    });

    gsap.utils.toArray('.sectionHead, .statementGrid, .serviceGrid, .aboutGrid, .contactCard').forEach((el) => {
      gsap.fromTo(el, { y: 42, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 80%' }
      });
    });

    const amount = () => Math.max(0, reelInner.scrollWidth - reel.clientWidth);
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.reel',
        start: 'center center',
        end: () => '+=' + amount(),
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    timeline.to(reelInner, { x: () => -amount(), ease: 'none' }, 0);
    gsap.set('.reelBgText span', { autoAlpha: 0, y: 50, scale: 0.9 });
    gsap.utils.toArray('.reelBgText span').forEach((span, index) => {
      timeline.to(span, {
        autoAlpha: 0.25,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out'
      }, index * 0.15);
    });

    gsap.fromTo('.turdGroup', { y: 50, opacity: 0 }, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.contact', start: 'bottom bottom' }
    });

    gsap.fromTo('.comicBubble', { y: 20, opacity: 0 }, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
      delay: 0.3,
      scrollTrigger: { trigger: '.contact', start: 'bottom bottom' }
    });
  });
})();
