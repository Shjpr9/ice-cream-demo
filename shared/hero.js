import { categories, products, findById } from './data/catalog.js';
import { money, number } from './utils/ordering.js';
import { icon, photo } from './ui.js';

// [productId, plate color behind the circle]
export const heroSlides = [
  ['saffron', '#ffe7a8'], ['strawberry', '#ffd0db'], ['pistachio', '#d9eebe'],
  ['gianduja', '#ecd3c2'], ['berry-shake', '#ffcfe0'], ['falooda', '#efdcff'],
];
export const hero = { index: 0, entered: false, paused: false };

const features = {
  start: [
    ['sparkle', 'طعم‌های ویژه فقط در بستنی‌ساز'],
    ['leaf', 'زعفران، پسته و میوهٔ تازه'],
    ['tag', 'قیمت روشن، بدون هزینهٔ پنهان'],
  ],
  end: [
    ['info', 'ترکیبات و حساسیت‌زای هر طعم'],
    ['bag', 'داخل مجموعه، بیرون‌بر یا پیک'],
    ['cone', 'بستنی‌ات رو خودت بساز', 'builder'],
  ],
};

const doodles = {
  loop: '<path d="M8 40c18-30 44-30 40-8-3 18-30 14-22-4 8-17 34-20 46 4" />',
  zig: '<path d="M6 30l12-18 12 18 12-18 12 18" />',
  smile: '<path d="M10 22c10 14 30 14 40 0M18 8v6M42 8v6" />',
  arc: '<path d="M8 44c6-22 22-34 44-36M20 50c4-14 14-24 30-26" />',
};
const doodle = (name, cls) => `<svg class="doodle ${cls}" viewBox="0 0 60 60" aria-hidden="true">${doodles[name]}</svg>`;

function feature([name, text, view], index) {
  const body = `<span class="feature-icon">${icon(name)}</span><span>${text}</span>`;
  const style = `style="--i:${index}"`;
  return view
    ? `<li ${style}><a class="feature feature-link" href="?view=${view}" data-view="${view}">${body}${icon('left')}</a></li>`
    : `<li ${style}><span class="feature">${body}</span></li>`;
}

function slide([id, plate], index) {
  const product = findById(products, id);
  const active = index === hero.index;
  return `<figure class="hero-slide" data-slide="${index}" style="--plate:${plate}" ${active ? 'data-active' : ''} aria-hidden="${!active}">
    ${photo(id, product.name, { eager: index === 0 })}
  </figure>`;
}

function caption([id], index) {
  const product = findById(products, id);
  const active = index === hero.index;
  return `<div class="hero-caption" data-caption="${index}" ${active ? 'data-active' : ''}>
    <span class="hero-taste">${product.taste}</span>
    <strong>${product.name}</strong>
    <span class="hero-price">${money(product.price)}</span>
    <button type="button" class="primary hero-order" data-hero-product="${id}">${icon('plus')} سفارش</button>
  </div>`;
}

function categoryBubble(category, index) {
  const sample = products.find(product => product.category === category.id);
  return `<li style="--i:${index}" data-reveal>
    <button type="button" class="bubble" data-jump="${category.id}">
      <span class="bubble-photo">${photo(sample.id)}</span>
      <span class="bubble-name">${category.name}</span>
    </button>
  </li>`;
}

const flavorNames = ['زعفرانی', 'پسته‌ای', 'توت‌فرنگی', 'شکلات تلخ', 'فالودهٔ شیرازی', 'شیک موز', 'گل‌محمدی', 'هل و عسل', 'چیزکیک', 'کوکی'];

/** Hero showcase shared by the menu views. lines = the two halves of the headline around the circle. */
export function heroShowcase({ eyebrow, lines, target }) {
  const intro = hero.entered ? '' : 'hero--intro';
  hero.entered = true;
  const ticker = flavorNames.map(name => `<span>${name}</span>${icon('sparkle')}`).join('');
  return `<section class="hero ${intro} ${hero.paused ? 'is-paused' : ''}" aria-labelledby="view-title" style="--plate:${heroSlides[hero.index][1]}">
    <p class="eyebrow hero-eyebrow">${eyebrow}</p>
    <h1 id="view-title" tabindex="-1" class="hero-title"><span>${lines[0]}</span> <span>${lines[1]}</span></h1>
    <ul class="hero-features hero-features--start">${features.start.map(feature).join('')}</ul>
    <div class="hero-stage" aria-roledescription="carousel" aria-label="پیشنهادهای امروز" tabindex="0">
      <div class="hero-blob" aria-hidden="true"></div>
      <div class="hero-ring" aria-hidden="true"></div>
      <div class="hero-orbit" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
      <div class="hero-circle">${heroSlides.map(slide).join('')}</div>
      <button type="button" class="hero-arrow hero-arrow--prev" data-hero-step="-1" aria-label="پیشنهاد قبلی">${icon('right')}</button>
      <button type="button" class="hero-arrow hero-arrow--next" data-hero-step="1" aria-label="پیشنهاد بعدی">${icon('left')}</button>
      ${doodle('loop', 'd1')}${doodle('zig', 'd2')}${doodle('smile', 'd3')}${doodle('arc', 'd4')}
    </div>
    <ul class="hero-features hero-features--end">${features.end.map(feature).join('')}</ul>
    <div class="hero-footer">
      <div class="hero-captions" aria-live="polite">${heroSlides.map(caption).join('')}</div>
      <div class="hero-dots" role="group" aria-label="انتخاب پیشنهاد">
        ${heroSlides.map(([id], index) => `<button type="button" data-hero-go="${index}" aria-label="${findById(products, id).name}" ${index === hero.index ? 'aria-current="true"' : ''}><i></i></button>`).join('')}
        <button type="button" class="hero-pause" data-hero-pause aria-pressed="${hero.paused}" aria-label="توقف نمایش خودکار"><span aria-hidden="true"></span></button>
      </div>
    </div>
    <a class="scroll-cue" href="#${target}"><span>${number(products.length)} طعم و دسر منتظرته</span><i aria-hidden="true"></i></a>
  </section>
  <section class="category-band" aria-label="دسته‌بندی‌ها">
    <ul>${categories.map(categoryBubble).join('')}</ul>
  </section>
  <div class="ticker" aria-hidden="true"><div>${ticker}${ticker}</div></div>`;
}
