(() => {
  const finalFixes = document.createElement('link');
  finalFixes.rel = 'stylesheet';
  finalFixes.href = 'final-fixes.css';
  document.head.appendChild(finalFixes);

  document.querySelectorAll('.project-card, .motion-card, .still-card').forEach((card) => {
    card.addEventListener('click', () => {
      const parent = card.parentElement;
      parent?.querySelectorAll('.project-card, .motion-card, .still-card').forEach((item) => item.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  document.querySelectorAll('[data-drag-scroll]').forEach((scroller) => {
    let active = false;
    let start = 0;
    let left = 0;

    scroller.addEventListener('mousedown', (event) => {
      active = true;
      start = event.pageX;
      left = scroller.scrollLeft;
      scroller.classList.add('is-dragging');
    });

    window.addEventListener('mouseup', () => {
      active = false;
      scroller.classList.remove('is-dragging');
    });

    scroller.addEventListener('mousemove', (event) => {
      if (!active) return;
      event.preventDefault();
      scroller.scrollLeft = left - (event.pageX - start);
    });
  });

  const lightbox = document.getElementById('lightbox');
  const image = document.getElementById('lightboxImage');
  const caption = document.getElementById('lightboxCaption');
  const close = document.querySelector('.lightbox__close');

  document.querySelectorAll('.still-card').forEach((card) => {
    card.addEventListener('click', () => {
      if (!lightbox || !image || !caption) return;
      const img = card.querySelector('img');
      image.src = card.dataset.lightboxSrc || img?.src || '';
      caption.textContent = card.dataset.lightboxCaption || card.querySelector('span')?.textContent || '';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });

  function closeLightbox() {
    lightbox?.classList.remove('is-open');
    lightbox?.setAttribute('aria-hidden', 'true');
  }

  close?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLightbox();
  });
})();
