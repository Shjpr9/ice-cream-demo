import { hero, heroSlides } from './hero.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const sprinkleColors = ['#ff8fab', '#ffb347', '#c5e29b', '#8fd3ff', '#e9d7ff', '#b5174f', '#fff1c9'];
const pick = list => list[Math.floor(Math.random() * list.length)];
const center = rect => [rect.left + rect.width / 2, rect.top + rect.height / 2];

function layer() {
  let el = document.querySelector('.fx-layer');
  if (!el) {
    el = document.createElement('div');
    el.className = 'fx-layer';
    el.setAttribute('aria-hidden', 'true');
    document.body.append(el);
  }
  return el;
}

/** Sprinkles shooting out from a point. */
export function burst(x, y, count = 18) {
  if (reduced.matches) return;
  for (let i = 0; i < count; i++) {
    const bit = document.createElement('i');
    bit.className = 'sprinkle';
    bit.style.background = pick(sprinkleColors);
    bit.style.left = x + 'px';
    bit.style.top = y + 'px';
    layer().append(bit);
    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 60;
    const spin = Math.random() * 540 - 270;
    bit.animate([
      { transform: 'translate(-50%, -50%) rotate(0) scale(1)', opacity: 1 },
      { transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance + 30}px)) rotate(${spin}deg) scale(.4)`, opacity: 0 },
    ], { duration: 700 + Math.random() * 400, easing: 'cubic-bezier(.16,.84,.3,1)' }).onfinish = () => bit.remove();
  }
}

/** Confetti rain for a finished order. */
function rain() {
  if (reduced.matches) return;
  for (let i = 0; i < 90; i++) {
    const bit = document.createElement('i');
    bit.className = 'sprinkle sprinkle--rain';
    bit.style.background = pick(sprinkleColors);
    bit.style.left = Math.random() * 100 + 'vw';
    layer().append(bit);
    const drift = Math.random() * 160 - 80;
    bit.animate([
      { transform: 'translate(0, -5vh) rotate(0)', opacity: 1 },
      { transform: `translate(${drift}px, 105vh) rotate(${Math.random() * 900}deg)`, opacity: .9 },
    ], { duration: 1800 + Math.random() * 1600, delay: Math.random() * 600, easing: 'cubic-bezier(.3,.1,.6,1)' }).onfinish = () => bit.remove();
  }
}

/** The product photo arcs from the dialog into the visible cart link. */
function flyToCart(image) {
  const from = image.getBoundingClientRect();
  requestAnimationFrame(() => {
    const cart = [...document.querySelectorAll('.cart-link')].find(link => link.getClientRects().length);
    if (!cart || reduced.matches) return;
    const to = cart.getBoundingClientRect();
    const [fx, fy] = center(from);
    const [tx, ty] = center(to);
    const size = Math.min(from.width, 180);
    const ghost = document.createElement('div');
    ghost.className = 'fly-ghost';
    ghost.style.cssText = `width:${size}px;height:${size}px;left:${fx - size / 2}px;top:${fy - size / 2}px;background-image:url("${image.currentSrc || image.src}")`;
    layer().append(ghost);
    const dx = tx - fx;
    const dy = ty - fy;
    ghost.animate([
      { transform: 'translate(0, 0) scale(1) rotate(0)', opacity: 1 },
      { transform: `translate(${dx * .45}px, ${dy * .45 - 120}px) scale(.55) rotate(-25deg)`, opacity: 1, offset: .5 },
      { transform: `translate(${dx}px, ${dy}px) scale(.12) rotate(-60deg)`, opacity: .6 },
    ], { duration: 750, easing: 'cubic-bezier(.45,.05,.55,.95)' }).onfinish = () => {
      ghost.remove();
      burst(tx, ty, 16);
      cart.querySelector('b')?.classList.remove('bump');
      void cart.offsetWidth;
      cart.querySelector('b')?.classList.add('bump');
    };
  });
}

export function initMotion(main) {
  const root = document.documentElement;
  if (!reduced.matches) root.classList.add('js-motion');

  // Scroll progress bar + compact header once the page moves.
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.append(bar);
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const max = root.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
      root.classList.toggle('is-scrolled', scrollY > 12);
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reveal blocks as they enter the viewport; main is re-rendered often, so rescan on every change.
  const revealable = ':is([data-reveal], .section-heading, .editorial-category > h2):not(.revealed)';
  const io = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('revealed');
    io.unobserve(entry.target);
  }), { rootMargin: '0px 0px -6% 0px' });
  const scan = () => {
    io.disconnect();
    main.querySelectorAll(revealable).forEach(el => io.observe(el));
  };
  let celebrated = null;
  new MutationObserver(() => {
    scan();
    const receipt = main.querySelector('.confirmation');
    if (receipt && receipt !== celebrated) rain();
    celebrated = receipt;
  }).observe(main, { childList: true });
  scan();

  // Hero carousel.
  const showSlide = next => {
    const section = main.querySelector('.hero');
    if (!section) return;
    const previous = hero.index;
    hero.index = (next + heroSlides.length) % heroSlides.length;
    if (previous === hero.index) return;
    section.style.setProperty('--plate', heroSlides[hero.index][1]);
    section.dataset.direction = next > previous ? 'next' : 'prev';
    section.querySelectorAll('[data-slide]').forEach(slide => {
      const index = Number(slide.dataset.slide);
      slide.toggleAttribute('data-active', index === hero.index);
      slide.toggleAttribute('data-leaving', index === previous);
      slide.setAttribute('aria-hidden', String(index !== hero.index));
    });
    section.querySelectorAll('[data-caption]').forEach(caption => caption.toggleAttribute('data-active', Number(caption.dataset.caption) === hero.index));
    section.querySelectorAll('[data-hero-go]').forEach(dot => {
      if (Number(dot.dataset.heroGo) === hero.index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  };
  // Autoplay is driven by the active dot's CSS progress animation, so hover/focus/pause just pause that animation.
  main.addEventListener('animationend', event => {
    if (event.animationName === 'dot-progress') showSlide(hero.index + 1);
  });
  main.addEventListener('keydown', event => {
    if (!event.target.matches?.('.hero-stage')) return;
    if (event.key === 'ArrowLeft') showSlide(hero.index + 1);
    if (event.key === 'ArrowRight') showSlide(hero.index - 1);
  });
  let swipeX = null;
  main.addEventListener('pointerdown', event => { swipeX = event.target.closest('.hero-circle') ? event.clientX : null; });
  main.addEventListener('pointerup', event => {
    if (swipeX === null) return;
    const dx = event.clientX - swipeX;
    swipeX = null;
    if (Math.abs(dx) > 40) showSlide(hero.index + (dx > 0 ? 1 : -1)); // RTL: swiping right brings the next item
  });

  document.addEventListener('click', event => {
    const control = event.target.closest('button');
    if (!control) return;
    const data = control.dataset;
    if (data.heroStep) showSlide(hero.index + Number(data.heroStep));
    else if (data.heroGo) showSlide(Number(data.heroGo));
    else if (data.heroPause !== undefined) {
      hero.paused = !hero.paused;
      control.setAttribute('aria-pressed', String(hero.paused));
      control.closest('.hero').classList.toggle('is-paused', hero.paused);
    } else if (data.jump) {
      main.querySelector(`:is(.category-nav, .discovery-categories) [data-category="${data.jump}"]`)?.click();
      main.querySelector('#menu-start, #flavor-guide')?.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth', block: 'start' });
    }
  });

  // Ripple on press.
  document.addEventListener('pointerdown', event => {
    const target = event.target.closest('.primary, .secondary, .builder-choice, .bubble, .hero-arrow, .category-buttons button, .discovery-categories button, .card-foot .icon-button');
    if (!target || reduced.matches || target.disabled) return;
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = event.clientX - rect.left + 'px';
    ripple.style.top = event.clientY - rect.top + 'px';
    target.append(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });

  // Pointer parallax in the hero and on product photos (mouse/pen only).
  let frame;
  document.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || reduced.matches) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const heroSection = event.target.closest?.('.hero');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        heroSection.style.setProperty('--px', ((event.clientX - rect.left) / rect.width - .5).toFixed(3));
        heroSection.style.setProperty('--py', ((event.clientY - rect.top) / rect.height - .5).toFixed(3));
      }
      const card = event.target.closest?.('.card-image');
      if (card) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--ix', ((event.clientX - rect.left) / rect.width - .5).toFixed(3));
        card.style.setProperty('--iy', ((event.clientY - rect.top) / rect.height - .5).toFixed(3));
      }
    });
  });

  // Add-to-cart from the detail dialog: grab the photo before the dialog closes.
  document.addEventListener('submit', event => {
    if (event.target.id !== 'product-form') return;
    const image = event.target.querySelector('.detail-grid img');
    if (image) flyToCart(image);
  }, true);
}
