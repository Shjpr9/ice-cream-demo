import { containers, flavors, toppings, findById } from './data/catalog.js';
import { buildOrder, money, number } from './utils/ordering.js';
import { allergenList, icon, photo } from './ui.js';

export function initialSelection() {
  const first = flavors.find(flavor => flavor.available);
  return { container: 'cup', scoops: first ? [first.id] : [], toppings: [] };
}
export const steps = ['ظرف', 'تعداد اسکوپ', 'طعم‌ها', 'تاپینگ', 'مرور'];

const containersArt = {
  cup: '<path d="M77 198l10 71q2 13 16 13h34q14 0 16-13l10-71Z" fill="#e9a499" stroke="#a95c50"/><path d="M76 198h88" stroke="#a95c50" stroke-width="6" stroke-linecap="round"/><path d="M102 239h36m-26 10h15" stroke="#a95c50" stroke-width="4" stroke-linecap="round"/>',
  cone: '<path d="M79 198h82l-38 95q-3 8-6 0Z" fill="#daa060" stroke="#9c633e"/><path d="m89 220 55 21m-44 4 36 14m-24 10 16 6m-25-21 46-29m-36 59 19-12m-39-47 42-26" fill="none" stroke="#a76b42" opacity=".6"/>',
  bowl: '<path d="M55 199h130c-5 46-30 62-65 62s-60-16-65-62Z" fill="#adc79c" stroke="#678454"/><path d="M53 198h134m-84 63h34" stroke="#678454" stroke-width="6" stroke-linecap="round"/><path d="M72 220q13 25 36 28" fill="none" stroke="#e3e9d2" stroke-width="4" stroke-linecap="round"/>',
};
const scoopPositions = [
  [[120, 162]], [[94, 163], [146, 160]],
  [[91, 161], [148, 160], [121, 111]],
  [[87, 162], [149, 162], [118, 114], [120, 68]],
];

// Last drawn preview, so only scoops/toppings that just changed play the drop animation.
let drawn = { scoops: [], toppings: [] };

function preview(config) {
  const positions = scoopPositions[config.scoops.length - 1];
  const sortedToppings = [...config.toppings].sort();
  const fresh = { scoops: config.scoops.map((id, index) => drawn.scoops[index] !== id), toppings: config.toppings.filter(id => !drawn.toppings.includes(id)) };
  drawn = { scoops: [...config.scoops], toppings: [...config.toppings] };
  return `<svg class="ice-preview" viewBox="0 20 240 290" role="img" aria-label="پیش‌نمایش بستنی">
    <ellipse cx="120" cy="292" rx="61" ry="9" fill="#284530" opacity=".09"/>
    ${config.scoops.map((id, index) => {
      const [x, y] = positions[index];
      return `<g transform="translate(${x} ${y})"><g class="${fresh.scoops[index] ? 'scoop-new' : ''}" style="--d:${index * 70}ms">
        <path d="M-37 26c-7 0-11-5-9-10 1-4 5-8 6-14 4-25 20-39 42-39 20 0 37 15 40 37 1 8 8 12 7 18-1 5-7 8-14 8-13 0-15 5-28 5-12 0-18-5-27-3-8 2-12-2-17-2Z" fill="${findById(flavors, id).color}" stroke="#684537" stroke-opacity=".28"/>
        <path d="M-24-5q8-19 25-20m-23 35q9-5 16-4m17-15q8 2 12 10" fill="none" stroke="#fff" stroke-width="3" stroke-opacity=".31" stroke-linecap="round"/>
      </g></g>`;
    }).join('')}
    ${containersArt[config.container]}
    ${sortedToppings.map((id, index) => {
      const [x, y] = positions.at(-1);
      const color = findById(toppings, id).color;
      const offset = index * 10;
      return `<g class="${fresh.toppings.includes(id) ? 'topping-new' : ''}">` + (['chocolate', 'caramel'].includes(id)
        ? `<path d="M${x - 24} ${y - 23 + index * 4}q10-6 15 3t16-1 18 6" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>`
        : `<g fill="${color}" transform="translate(${x - 24 + offset} ${y - 25 + (index % 2) * 9})"><circle r="4"/><circle cx="7" cy="5" r="2.5"/><circle cx="5" cy="-8" r="2.5"/></g>`) + '</g>';
    }).join('')}
  </svg>`;
}

function choice(field, value, label, active, extra = '', disabled = false) {
  return `<button type="button" class="builder-choice" data-${field}="${value}" aria-pressed="${active}" ${disabled ? 'disabled' : ''}>${label}${extra}</button>`;
}

function containerChoices(config) {
  return `<div class="container-choices choices">${containers.map(item => choice(
    'container', item.id, icon(item.id) + '<strong>' + item.name + '</strong>',
    item.id === config.container, `<small>${item.price ? '+ ' + money(item.price) : 'بدون هزینه'}</small>`,
  )).join('')}</div>`;
}

function countChoices(config) {
  return `<div class="count-choices choices">${[1, 2, 3, 4].map(count => choice('count', count, number(count), count === config.scoops.length)).join('')}</div>`;
}

function flavorChoices(config, activeScoop) {
  return `<div class="scoop-tabs choices" aria-label="انتخاب اسکوپ">${config.scoops.map((id, index) => choice('scoop', index, 'اسکوپ ' + number(index + 1),
    index === activeScoop, `<small>${findById(flavors, id).name}</small>`,
  )).join('')}</div>
  <div class="flavor-choices choices" aria-label="طعم اسکوپ ${number(activeScoop + 1)}">${flavors.map(item => choice(
    'flavor', item.id, `<i class="flavor-swatch" style="--swatch:${item.color}"></i><strong>${item.name}</strong>`,
    config.scoops[activeScoop] === item.id,
    '<small>' + (item.available ? (item.special ? 'ویژهٔ بستنی‌ساز · ' : '') + money(item.price) : 'فعلاً ناموجود') + '</small>',
    !item.available,
  )).join('')}</div>`;
}

function toppingChoices(config) {
  return `<div class="topping-choices choices">${toppings.map(item => choice(
    'topping', item.id, `<strong>${item.name}</strong>`,
    config.toppings.includes(item.id), `<small>+ ${money(item.price)}</small>`,
  )).join('')}</div>`;
}

function review(item, config) {
  return `<p class="summary-selection">${number(config.scoops.length)} اسکوپ · ${item.description}</p>
    <h3>ترکیبات</h3><p>${item.ingredients.join('، ')}</p>
    <h3>حساسیت‌زاها</h3>${allergenList(item.allergens)}`;
}

export function renderBuilder({ selection, activeScoop, step, editId }, mode) {
  const item = buildOrder(selection);
  if (!item) return `<div class="empty-state"><h1 id="view-title" tabindex="-1">فعلاً طعم موجودی برای ساخت بستنی نداریم</h1>
    <a class="primary" href="?view=menu" data-view="menu">دیدن منو</a></div>`;
  const groups = [
    containerChoices(selection), countChoices(selection), flavorChoices(selection, activeScoop),
    toppingChoices(selection), review(item, selection),
  ];
  const controls = mode === 'c'
    ? `<ol class="builder-steps" aria-label="مراحل ساخت بستنی">${steps.map((name, index) => `<li>
        <button type="button" data-step="${index}" ${step === index ? 'aria-current="step"' : ''}><span>${number(index + 1)}</span>${name}</button></li>`).join('')}</ol>
      <section class="builder-group"><h2 id="step-title" tabindex="-1">${steps[step]}</h2>${groups[step]}</section>
      <div class="step-actions">
        ${step > 0 ? `<button type="button" class="secondary" data-step="${step - 1}">${icon('right')} قبلی</button>` : ''}
        ${step < 4 ? `<button type="button" class="primary" data-step="${step + 1}">ادامه ${icon('left')}</button>` : ''}
      </div>`
    : groups.map((content, index) => mode === 'b'
      ? `<details class="builder-group" data-chapter="${index}" ${step === index ? 'open' : ''}>
          <summary><span>${number(index + 1)}</span>${steps[index]}</summary><div>${content}</div></details>`
      : `<section class="builder-group"><h2><span>${number(index + 1)}</span> ${steps[index]}</h2>${content}</section>`).join('');

  return `<header class="builder-intro">
    <div><p class="eyebrow">${mode === 'c' ? 'کارگاه بستنی نون' : 'بستنی سفارشی'}</p>
    <h1 id="view-title" tabindex="-1">${editId ? 'ویرایش بستنی' : 'بستنی خودت رو بساز'}</h1>
    <p>${mode === 'c' ? 'ظرف، اسکوپ و تاپینگ رو انتخاب کن و نتیجه رو همون‌جا ببین.' : 'از ظرف شروع کن و طعم هر اسکوپ رو جدا انتخاب کن.'}</p></div>
    ${mode === 'b' ? photo('cone', 'قیف بستنی دو اسکوپی') : ''}
  </header>
  <div class="builder-layout">
    <aside class="builder-preview" aria-label="پیش‌نمایش و قیمت">
      <div class="preview-art">${preview(selection)}</div>
      <div class="preview-info">
        <span>قیمت بستنی</span><strong aria-live="polite">${money(item.price)}</strong>
        <p>${item.description}</p>
        ${mode === 'c' && step !== 4 ? '' : `<button type="button" class="primary full" data-action="save-builder">${icon('bag')} ${editId ? 'ذخیرهٔ تغییرات' : 'افزودن به سبد'}</button>`}
        ${editId ? '<button type="button" class="text-button" data-action="cancel-edit">انصراف از ویرایش</button>' : ''}
      </div>
    </aside>
    <div class="builder-controls">${controls}</div>
  </div>`;
}
