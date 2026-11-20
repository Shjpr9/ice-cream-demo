import { allergens, productImage } from './data/catalog.js';

const paths = {
  bag: '<path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 10V6a3 3 0 1 1 6 0v4"/>',
  cone: '<path d="m7 13 5 9 5-9M7 13a3 3 0 0 1-.6-5.9 5.6 5.6 0 0 1 11.2 0A3 3 0 0 1 17 13Z"/><path d="m10 15 4 3"/>',
  menu: '<path d="M6 4h12a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm2 5h8m-8 4h8m-8 4h5"/>',
  left: '<path d="M19 12H5m6-6-6 6 6 6"/>',
  right: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  plus: '<path d="M5 12h14m-7-7v14"/>',
  minus: '<path d="M5 12h14"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  warning: '<path d="M12 8v4m0 4h.01M10.3 4.8l-7.1 12A2 2 0 0 0 4.9 20h14.2a2 2 0 0 0 1.7-3.2l-7.1-12a2 2 0 0 0-3.4 0Z"/>',
  sparkle: '<path d="M12 2c0 7-3 10-10 10 7 0 10 3 10 10 0-7 3-10 10-10C15 12 12 9 12 2Z"/>',
  cup: '<path d="M7 7h10l-1.3 14H8.3L7 7Zm-2 0h14M9 3h6"/>',
  bowl: '<path d="M3 9h18a9 9 0 0 1-18 0Zm5 10h8M5 6h14"/>',
  leaf: '<path d="M5 19c0-9 5-14 15-15 0 10-5 15-14 15Zm0 0 8-8"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8L3 12Z"/><path d="M7.5 7.5h.01"/>',
  info: '<path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v6m0-9h.01"/>',
};
export const icon = name => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;

export function photo(id, alt = '', { eager = false } = {}) {
  return `<div class="photo"><img src="${productImage(id)}" alt="${alt}" width="309" height="309" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}></div>`;
}

export function allergenList(ids, label) {
  const list = `<ul class="allergens" aria-label="حساسیت‌زاها">${ids.map(id => `<li>${allergens[id]}</li>`).join('')}</ul>`;
  if (label) {
    return `<div class="contains">${icon('info')}<span>${ids.length ? label : 'بدون لبنیات، مغز، گلوتن و تخم‌مرغ'}</span>${ids.length ? list : ''}</div>`;
  }
  return ids.length ? list : '<p class="muted">در ترکیبات ثبت‌شده موردی ذکر نشده است.</p>';
}

export const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));
