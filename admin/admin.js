import { categories, products, flavors, findById } from '../shared/data/catalog.js';
import { money, number } from '../shared/utils/ordering.js';
import { icon, photo, escapeHtml } from '../shared/ui.js';

const KEY = 'bastani-noon:admin';
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const prototypes = ['a', 'b', 'c', 'd', 'e'];
const statuses = [
  ['new', 'جدید', 'sparkle'],
  ['prep', 'در حال آماده‌سازی', 'cone', 'شروع آماده‌سازی'],
  ['ready', 'آماده تحویل', 'bag', 'آماده شد'],
  ['done', 'تحویل‌شده', 'check', 'تحویل شد'],
];
const methods = { here: 'داخل مجموعه', takeaway: 'بیرون‌بر', delivery: 'ارسال با پیک' };
const sections = [
  ['dashboard', 'داشبورد', 'menu'],
  ['orders', 'سفارش‌ها', 'bag'],
  ['products', 'محصولات', 'cone'],
  ['flavors', 'طعم‌های بستنی‌ساز', 'sparkle'],
];
// Sales of the six previous days (toman). shortcut: fixed demo history, replace with server reports.
const history = [8_240_000, 9_610_000, 7_380_000, 11_350_000, 12_820_000, 10_140_000];

const main = document.querySelector('#admin-main');
const nav = document.querySelector('.admin-nav');
const title = document.querySelector('#admin-title');
const status = document.querySelector('#admin-status');
const liveToggle = document.querySelector('#live-toggle');

// ---------- state ----------
function seeded(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const digits = value => String(value).replace(/\d/g, digit => '۰۱۲۳۴۵۶۷۸۹'[digit]);
const sellable = products.filter(product => product.available);

function mockOrder(id, at, state, random = Math.random) {
  const lines = 1 + Math.floor(random() * 3);
  const items = Array.from({ length: lines }, () => {
    const product = sellable[Math.floor(random() * sellable.length)];
    return { productId: product.id, name: product.name, qty: 1 + Math.floor(random() * 2), price: product.price };
  });
  const method = ['here', 'here', 'takeaway', 'delivery'][Math.floor(random() * 4)];
  const customer = method === 'here' ? 'میز ' + number(1 + Math.floor(random() * 12)) : '⁦۰۹۱۲•••' + digits(1000 + Math.floor(random() * 8999)) + '⁩'; // LTR isolate keeps the masked phone in order inside RTL text
  return { id, at, status: state, method, customer, items, notes: '' };
}

function freshState() {
  const random = seeded(7);
  const now = Date.now();
  const plan = ['done', 'done', 'done', 'done', 'done', 'done', 'done', 'done', 'done', 'done', 'ready', 'ready', 'prep', 'prep', 'new', 'new'];
  const orders = plan.map((state, index) => mockOrder(1201 + index, now - (plan.length - index) * 17 * 60_000, state, random));
  return {
    seq: 1201 + plan.length,
    orders,
    imported: {},
    products: Object.fromEntries(products.map(product => [product.id, { price: product.price, available: product.available }])),
    flavors: Object.fromEntries(flavors.map(flavor => [flavor.id, flavor.available])),
  };
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && Array.isArray(saved.orders)) return saved;
  } catch { /* fall through to a fresh demo */ }
  return freshState();
}
let state = load();
const save = () => {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* demo keeps working in memory */ }
};

// Latest receipt of each customer prototype shows up as a real incoming order.
function importPrototypeOrders() {
  for (const key of prototypes) {
    let order;
    try { order = JSON.parse(localStorage.getItem('bastani-noon:' + key))?.order; } catch { continue; }
    if (!order || !Array.isArray(order.items)) continue;
    const ref = key + '-' + order.id;
    if (state.imported[ref]) continue;
    state.imported[ref] = true;
    state.orders.push({
      id: state.seq++, at: Date.now(), status: 'new', method: methods[order.method] ? order.method : 'here',
      customer: 'دموی طرح ' + key.toUpperCase(), source: key.toUpperCase(), notes: String(order.notes ?? ''),
      items: order.items.map(item => ({ name: String(item.name), qty: Number(item.quantity) || 1, price: Number(item.price) || 0 })),
      fresh: true,
    });
  }
  save();
}

// ---------- helpers ----------
const total = order => order.items.reduce((sum, item) => sum + item.qty * item.price, 0);
const rtf = new Intl.RelativeTimeFormat('fa', { numeric: 'auto' });
function ago(at) {
  const minutes = Math.round((Date.now() - at) / 60_000);
  if (minutes < 1) return 'همین حالا';
  if (minutes < 60) return rtf.format(-minutes, 'minute');
  return rtf.format(-Math.round(minutes / 60), 'hour');
}
const asciiDigits = value => value.replace(/[۰-۹]/g, digit => '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)).replace(/[٠-٩]/g, digit => '٠١٢٣٤٥٦٧٨٩'.indexOf(digit));
let toastTimer;
function toast(text) {
  status.textContent = text;
  status.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => status.classList.remove('visible'), 2600);
}
function countUp(root) {
  root.querySelectorAll('[data-count]').forEach(el => {
    const target = Number(el.dataset.count);
    const format = el.dataset.money ? money : number;
    if (reduced.matches) { el.textContent = format(target); return; }
    const start = performance.now();
    const step = time => {
      const t = Math.min((time - start) / 900, 1);
      el.textContent = format(Math.round(target * (1 - (1 - t) ** 3)));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

// ---------- views ----------
function kpi(label, value, iconName, tone, isMoney = false) {
  return `<article class="kpi kpi--${tone}">
    <span class="kpi-icon">${icon(iconName)}</span>
    <p>${label}</p>
    <strong data-count="${value}" ${isMoney ? 'data-money="1"' : ''}>${isMoney ? money(value) : number(value)}</strong>
  </article>`;
}

function salesChart(values) {
  const width = 600;
  const height = 220;
  const pad = 14;
  const max = Math.max(...values) * 1.15;
  const x = index => pad + index * (width - pad * 2) / (values.length - 1);
  const y = value => height - pad - value / max * (height - pad * 2);
  const points = values.map((value, index) => [x(index), y(value)]);
  const line = points.slice(0, -1).map(([px, py], index) => (index ? 'L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1)).join(' ');
  const [lx, ly] = points.at(-1);
  const [px, py] = points.at(-2);
  const area = `${line} L${px.toFixed(1)} ${height - pad} L${pad} ${height - pad}Z`;
  const day = new Intl.DateTimeFormat('fa-IR', { weekday: 'long' });
  const labels = values.map((_, index) => index === values.length - 1 ? 'امروز' : day.format(Date.now() - (values.length - 1 - index) * 86_400_000));
  const grid = [0.25, 0.5, 0.75, 1].map(f => `<line x1="${pad}" x2="${width - pad}" y1="${y(max * f / 1.15).toFixed(1)}" y2="${y(max * f / 1.15).toFixed(1)}"/>`).join('');
  return `<div class="chart" data-values="${values.join(',')}" data-labels="${labels.join(',')}">
    <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" role="img" aria-label="نمودار فروش هفت روز اخیر">
      <defs><linearGradient id="sales-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b5174f" stop-opacity=".28"/><stop offset="1" stop-color="#b5174f" stop-opacity="0"/></linearGradient></defs>
      <g class="chart-grid">${grid}</g>
      <path class="chart-area" d="${area}" fill="url(#sales-fill)"/>
      <path class="chart-line" d="${line}" pathLength="1"/>
      <path class="chart-today" d="M${px.toFixed(1)} ${py.toFixed(1)} L${lx.toFixed(1)} ${ly.toFixed(1)}"/>
      <line class="chart-cross" x1="0" x2="0" y1="${pad}" y2="${height - pad}"/>
    </svg>
    <span class="chart-dot" aria-hidden="true"></span>
    <div class="chart-tip" role="presentation"></div>
    <div class="chart-x" aria-hidden="true">${labels.map((label, index) => `<span style="left:${(x(index) / width * 100).toFixed(2)}%">${label}</span>`).join('')}</div>
    <table class="visually-hidden"><caption>فروش روزانه</caption><tbody>${values.map((value, index) => `<tr><th>${labels[index]}</th><td>${money(value)}</td></tr>`).join('')}</tbody></table>
  </div>`;
}

function topProducts() {
  const sold = {};
  for (const order of state.orders) for (const item of order.items) sold[item.name] = (sold[item.name] ?? 0) + item.qty;
  const rows = Object.entries(sold).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const max = rows[0]?.[1] ?? 1;
  return rows.length
    ? `<ol class="bars">${rows.map(([name, count], index) => `<li style="--w:${(count / max * 100).toFixed(1)}%; --i:${index}">
        <span class="bar-name">${escapeHtml(name)}</span><span class="bar-track"><i></i></span><span class="bar-value">${number(count)} عدد</span></li>`).join('')}</ol>`
    : '<p class="muted">هنوز فروشی ثبت نشده.</p>';
}

function dashboard() {
  const revenue = state.orders.reduce((sum, order) => sum + total(order), 0);
  const count = state.orders.length;
  const queue = state.orders.filter(order => order.status === 'new' || order.status === 'prep').length;
  const recent = [...state.orders].sort((a, b) => b.at - a.at).slice(0, 5);
  return `<section class="kpis" aria-label="خلاصهٔ امروز">
      ${kpi('فروش امروز', revenue, 'tag', 'berry', true)}
      ${kpi('سفارش‌های امروز', count, 'bag', 'mango')}
      ${kpi('میانگین هر سفارش', count ? Math.round(revenue / count) : 0, 'sparkle', 'pistachio', true)}
      ${kpi('در صف آماده‌سازی', queue, 'cone', 'lilac')}
    </section>
    <div class="dash-grid">
      <section class="panel panel--chart" aria-labelledby="sales-title">
        <header class="panel-head"><h2 id="sales-title">فروش هفت روز اخیر</h2><span class="muted">امروز تا این لحظه</span></header>
        ${salesChart([...history, revenue])}
      </section>
      <section class="panel" aria-labelledby="top-title">
        <header class="panel-head"><h2 id="top-title">پرفروش‌های امروز</h2></header>
        ${topProducts()}
      </section>
      <section class="panel panel--wide" aria-labelledby="recent-title">
        <header class="panel-head"><h2 id="recent-title">آخرین سفارش‌ها</h2><a class="text-button" href="#orders">همهٔ سفارش‌ها ${icon('left')}</a></header>
        <ul class="recent">${recent.map(order => `<li>
          <span class="recent-id">#${digits(order.id)}</span>
          <span class="recent-who">${escapeHtml(order.customer)}<small>${ago(order.at)}</small></span>
          ${statusChip(order.status)}
          <strong>${money(total(order))}</strong></li>`).join('')}</ul>
      </section>
    </div>`;
}

function statusChip(id) {
  const [, label, iconName] = statuses.find(([key]) => key === id);
  return `<span class="chip chip--${id}">${icon(iconName)}${label}</span>`;
}

function orderCard(order) {
  const index = statuses.findIndex(([key]) => key === order.status);
  const next = statuses[index + 1];
  return `<article class="order-card ${order.fresh ? 'is-fresh' : ''}" data-order="${order.id}">
    <header><strong>#${digits(order.id)}</strong>${order.source ? `<span class="chip chip--source">طرح ${order.source}</span>` : ''}<small>${ago(order.at)}</small></header>
    <p class="order-who">${icon(order.method === 'delivery' ? 'bag' : order.method === 'takeaway' ? 'cup' : 'menu')} ${escapeHtml(order.customer)} · ${methods[order.method]}</p>
    <ul>${order.items.map(item => `<li><span>${number(item.qty)} × ${escapeHtml(item.name)}</span></li>`).join('')}</ul>
    ${order.notes ? `<p class="order-notes">${escapeHtml(order.notes)}</p>` : ''}
    <footer><strong>${money(total(order))}</strong>
      ${next ? `<button type="button" class="primary" data-advance="${order.id}">${next[3]} ${icon('left')}</button>` : `<span class="chip chip--done">${icon('check')}تمام</span>`}
    </footer>
  </article>`;
}

function ordersView() {
  return `<div class="board">${statuses.map(([id, label, iconName], index) => {
    const list = state.orders.filter(order => order.status === id).sort((a, b) => b.at - a.at);
    return `<section class="column column--${id}" style="--i:${index}" aria-labelledby="col-${id}">
      <header><span class="column-icon">${icon(iconName)}</span><h2 id="col-${id}">${label}</h2><b>${number(list.length)}</b></header>
      <div class="column-list">${list.length ? list.map(orderCard).join('') : '<p class="column-empty">فعلاً خالیه</p>'}</div>
    </section>`;
  }).join('')}</div>`;
}

let productFilter = 'all';
let productQuery = '';
function productsView() {
  const list = products.filter(product => (productFilter === 'all' || product.category === productFilter) && product.name.includes(productQuery));
  return `<div class="filters">
      <label class="search">${icon('menu')}<input type="search" id="product-search" placeholder="جستجوی محصول" value="${escapeHtml(productQuery)}" aria-label="جستجوی محصول"></label>
      <div class="filter-chips">${[{ id: 'all', name: 'همه' }, ...categories].map(item => `<button type="button" data-filter="${item.id}" aria-pressed="${productFilter === item.id}">${item.name}</button>`).join('')}</div>
    </div>
    <div class="product-grid">${list.map((product, index) => {
      const setting = state.products[product.id];
      return `<article class="product-admin ${setting.available ? '' : 'is-off'}" style="--i:${index}">
        ${photo(product.id, '')}
        <div class="product-admin-copy">
          <h2>${product.name}</h2>
          <p class="muted">${findById(categories, product.category).name}</p>
          <label class="price-field"><span>قیمت (تومان)</span><input inputmode="numeric" data-price="${product.id}" value="${number(setting.price).replace(/٬/g, '')}" aria-label="قیمت ${product.name}"></label>
          <label class="switch-row"><input type="checkbox" role="switch" data-available="${product.id}" ${setting.available ? 'checked' : ''}><span class="switch" aria-hidden="true"></span><span>${setting.available ? 'موجود' : 'ناموجود'}</span></label>
        </div>
      </article>`;
    }).join('') || '<p class="muted">محصولی پیدا نشد.</p>'}</div>`;
}

function flavorsView() {
  return `<p class="muted view-note">طعم‌های خاموش در بستنی‌ساز مشتری غیرفعال نمایش داده می‌شوند.</p>
    <div class="flavor-admin">${flavors.map((flavor, index) => `<label class="flavor-tile ${state.flavors[flavor.id] ? '' : 'is-off'}" style="--swatch:${flavor.color}; --i:${index}">
      <span class="scoop" aria-hidden="true"></span>
      <strong>${flavor.name}</strong>
      ${flavor.special ? '<span class="chip chip--special">ویژه</span>' : ''}
      <small>${money(flavor.price)}</small>
      <span class="switch-row"><input type="checkbox" role="switch" data-flavor="${flavor.id}" ${state.flavors[flavor.id] ? 'checked' : ''} aria-label="${flavor.name}"><span class="switch" aria-hidden="true"></span></span>
    </label>`).join('')}</div>`;
}

const views = { dashboard, orders: ordersView, products: productsView, flavors: flavorsView };

// ---------- render ----------
let current;
function renderNav() {
  const waiting = state.orders.filter(order => order.status === 'new').length;
  nav.innerHTML = sections.map(([id, label, iconName]) => `<a href="#${id}" ${id === current ? 'aria-current="page"' : ''}>
    ${icon(iconName)}<span>${label}</span>${id === 'orders' && waiting ? `<b class="nav-badge">${number(waiting)}</b>` : ''}</a>`).join('');
}

function render(animate = true) {
  const requested = location.hash.slice(1);
  const changed = requested !== current;
  current = views[requested] ? requested : 'dashboard';
  const [, label] = sections.find(([id]) => id === current);
  title.textContent = label;
  document.title = 'بستنی نون | ' + label;
  const scroll = main.querySelector('.board')?.scrollLeft;
  main.innerHTML = views[current]();
  main.dataset.view = current;
  if (animate && changed) {
    main.classList.remove('view-in');
    void main.offsetWidth;
    main.classList.add('view-in');
    countUp(main);
  } else if (scroll) main.querySelector('.board').scrollLeft = scroll;
  renderNav();
  for (const order of state.orders) delete order.fresh;
}

// ---------- interactions ----------
addEventListener('hashchange', () => {
  render();
  title.focus({ preventScroll: true });
  scrollTo({ top: 0, behavior: reduced.matches ? 'auto' : 'smooth' });
});

document.addEventListener('click', event => {
  const control = event.target.closest('button');
  if (!control) return;
  if (control.dataset.advance) {
    const order = state.orders.find(item => item.id === Number(control.dataset.advance));
    const index = statuses.findIndex(([key]) => key === order.status);
    order.status = statuses[index + 1][0];
    order.fresh = true;
    save();
    render(false);
    toast(`سفارش #${digits(order.id)} → ${statuses[index + 1][1]}`);
    main.querySelector(`[data-order="${order.id}"] button, [data-order="${order.id}"]`)?.focus?.({ preventScroll: true });
  } else if (control.dataset.filter) {
    productFilter = control.dataset.filter;
    render(false);
    main.querySelector(`[data-filter="${productFilter}"]`).focus();
  } else if (control.dataset.action === 'reset') {
    state = freshState();
    importPrototypeOrders();
    save();
    render(false);
    toast('دمو به حالت اول برگشت.');
  }
});

document.addEventListener('input', event => {
  if (event.target.id !== 'product-search') return;
  productQuery = event.target.value.trim();
  const caret = event.target.selectionStart;
  render(false);
  const input = main.querySelector('#product-search');
  input.focus();
  input.setSelectionRange(caret, caret);
});

document.addEventListener('change', event => {
  const target = event.target;
  if (target.dataset.available) {
    state.products[target.dataset.available].available = target.checked;
    save();
    target.closest('.product-admin').classList.toggle('is-off', !target.checked);
    target.nextElementSibling.nextElementSibling.textContent = target.checked ? 'موجود' : 'ناموجود';
    toast(findById(products, target.dataset.available).name + (target.checked ? ' موجود شد.' : ' ناموجود شد.'));
  } else if (target.dataset.flavor) {
    state.flavors[target.dataset.flavor] = target.checked;
    save();
    target.closest('.flavor-tile').classList.toggle('is-off', !target.checked);
    toast('طعم ' + findById(flavors, target.dataset.flavor).name + (target.checked ? ' روشن شد.' : ' خاموش شد.'));
  } else if (target.dataset.price) {
    const value = Number(asciiDigits(target.value).replace(/[^\d]/g, ''));
    const setting = state.products[target.dataset.price];
    if (!Number.isSafeInteger(value) || value < 1000 || value > 10_000_000) {
      target.value = number(setting.price).replace(/٬/g, '');
      toast('قیمت باید بین ۱٬۰۰۰ تا ۱۰٬۰۰۰٬۰۰۰ تومان باشد.');
      return;
    }
    setting.price = value;
    save();
    target.value = number(value).replace(/٬/g, '');
    target.closest('.price-field').classList.remove('saved');
    void target.offsetWidth;
    target.closest('.price-field').classList.add('saved');
    toast('قیمت ' + findById(products, target.dataset.price).name + ' شد ' + money(value));
  }
});

// Chart hover: crosshair, dot and tooltip on the nearest day.
main.addEventListener('pointermove', event => {
  const chart = event.target.closest('.chart');
  if (!chart) return;
  const values = chart.dataset.values.split(',').map(Number);
  const labels = chart.dataset.labels.split(',');
  const rect = chart.querySelector('svg').getBoundingClientRect();
  const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
  const pad = 14 / 600;
  const index = Math.round((ratio - pad) / (1 - pad * 2) * (values.length - 1));
  const i = Math.min(Math.max(index, 0), values.length - 1);
  const max = Math.max(...values) * 1.15;
  const xr = pad + i * (1 - pad * 2) / (values.length - 1);
  const yr = 1 - (14 + values[i] / max * (220 - 28)) / 220;
  chart.style.setProperty('--hx', (xr * 100).toFixed(2) + '%');
  chart.style.setProperty('--hy', (yr * 220).toFixed(1) + 'px');
  chart.querySelector('.chart-cross').setAttribute('x1', xr * 600);
  chart.querySelector('.chart-cross').setAttribute('x2', xr * 600);
  chart.querySelector('.chart-tip').innerHTML = `<small>${labels[i]}</small><strong>${money(values[i])}</strong>`;
  chart.classList.add('is-hover');
});
main.addEventListener('pointerout', event => {
  const chart = event.target.closest('.chart');
  if (chart && !chart.contains(event.relatedTarget)) chart.classList.remove('is-hover');
});

// Simulated live orders.
let liveTimer;
function scheduleLive() {
  clearTimeout(liveTimer);
  if (!liveToggle.checked) return;
  liveTimer = setTimeout(() => {
    const order = mockOrder(state.seq++, Date.now(), 'new');
    order.fresh = true;
    state.orders.push(order);
    save();
    if (current === 'orders' || current === 'dashboard') render(false);
    else renderNav();
    toast(`سفارش جدید #${digits(order.id)} · ${money(total(order))}`);
    nav.querySelector('.nav-badge')?.classList.add('bump');
    scheduleLive();
  }, 14_000 + Math.random() * 8_000);
}
liveToggle.addEventListener('change', () => {
  scheduleLive();
  toast(liveToggle.checked ? 'شبیه‌سازی سفارش زنده روشن شد.' : 'شبیه‌سازی سفارش زنده خاموش شد.');
});
addEventListener('storage', event => {
  if (event.key?.startsWith('bastani-noon:') && event.key !== KEY) {
    importPrototypeOrders();
    render(false);
  }
});

document.querySelector('.admin-date').textContent = new Intl.DateTimeFormat('fa-IR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
importPrototypeOrders();
render();
scheduleLive();
