const body = document.body;
const menu = document.querySelector('.mega-menu');
const openBtn = document.querySelector('.menu-toggle');
const closeBtn = document.querySelector('.menu-close');
const header = document.querySelector('.site-header');
const revealEls = document.querySelectorAll('.reveal');

function setMenu(open) {
  body.classList.toggle('menu-open', open);
  menu.classList.toggle('is-active', open);
  menu.setAttribute('aria-hidden', String(!open));
  openBtn.setAttribute('aria-expanded', String(open));
}

openBtn.addEventListener('click', () => setMenu(true));
closeBtn.addEventListener('click', () => setMenu(false));
menu.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (link) setMenu(false);
});
window.addEventListener('keydown', event => {
  if (event.key === 'Escape') setMenu(false);
});

let lastY = window.scrollY;
window.addEventListener('scroll', () => {
  const currentY = window.scrollY;
  const shouldHide = currentY > lastY && currentY > 160;
  header.classList.toggle('is-hidden', shouldHide);
  lastY = currentY;
}, { passive: true });

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

revealEls.forEach(el => observer.observe(el));

const cards = document.querySelectorAll('.project-card, .menu-card');
cards.forEach(card => {
  card.addEventListener('pointermove', event => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
    card.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
  });
  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});

window.addEventListener('load', () => {
  document.querySelector('.loader')?.classList.add('is-loaded');
});
