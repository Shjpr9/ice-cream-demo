import { categories, flavors, products, findById } from './data/catalog.js';
import {
  buildOrder, productOrder, putItem, updateQuantity, cartCount, money, number,
  demoPhone, demoCode, verifyDemoPhone, verifyDemoCode, prototypeStorage,
} from './utils/ordering.js';
import { initialSelection, renderBuilder } from './builder.js';
import { quickMenu, discoveryMenu, productDetails } from './menu.js';
import { methods, payments, renderCart, renderCheckout, renderConfirmation } from './checkout.js';
import { icon } from './ui.js';

const prototypes = { a: 'منومحور', b: 'کشف طعم‌ها', c: 'بستنی‌ساز', d: 'دستخط', e: 'شناور' };
const views = ['menu', 'builder', 'cart', 'checkout', 'confirmation'];
const createCheckout = () => ({ step: 0, method: 'here', payment: 'online', notes: '' });

export function start(mode) {
  const main = document.querySelector('main');
  const header = document.querySelector('.site-header');
  const dialog = document.querySelector('dialog');
  const message = document.querySelector('#status');
  const storage = prototypeStorage(mode);
  const saved = storage.load();
  const defaultView = mode === 'c' ? 'builder' : 'menu';

  let selection = buildOrder(saved.selection) ? saved.selection : initialSelection();
  let category = findById(categories, saved.category) ? saved.category : 'all';
  let activeScoop = Number.isInteger(saved.activeScoop) && saved.activeScoop >= 0 && saved.activeScoop < selection.scoops.length
    ? saved.activeScoop : 0;
  let step = Number.isInteger(saved.step) && saved.step >= 0 && saved.step <= 4 ? saved.step : 0;
  let cart = (Array.isArray(saved.cart) ? saved.cart : []).reduce((available, row) => {
    const item = row.config ? buildOrder(row.config) : productOrder(row.productId, row.variantId);
    if (item && Number.isSafeInteger(row.quantity) && row.quantity > 0) available.push({ ...item, quantity: row.quantity });
    return available;
  }, []);
  let order = saved.order ?? null;
  let hideDemo = saved.hideDemo ?? false;
  let editId = cart.some(row => row.id === saved.editId) ? saved.editId : undefined;
  let checkout = createCheckout();
  let detailProduct;
  let view = readView();
  let toastTimer;

  function readView() {
    const requested = new URL(location.href).searchParams.get('view');
    return views.includes(requested) ? requested : defaultView;
  }

  function save() {
    storage.save({ selection, category, activeScoop, step, cart, order, hideDemo, editId });
  }

  function renderHeader() {
    const previous = document.activeElement?.getAttribute('href');
    const inHeader = header.contains(document.activeElement);
    const count = number(cartCount(cart));
    const brand = `<a class="brand" href="?view=${defaultView}" data-view="${defaultView}">${icon('cone')}<span>بستنی نون</span></a>`;
    const links = `<a href="?view=menu" data-view="menu" ${view === 'menu' ? 'aria-current="page"' : ''}>${icon('menu')} <span>منو</span></a>
      <a href="?view=builder" data-view="builder" ${view === 'builder' ? 'aria-current="page"' : ''}>${icon('cone')} <span>بستنی‌ساز</span></a>`;
    const cartLink = `<a href="?view=cart" data-view="cart" class="cart-link" aria-label="سبد سفارش، ${count} مورد" ${['cart', 'checkout'].includes(view) ? 'aria-current="page"' : ''}>
      ${icon('bag')} <span>سبد</span><b>${count}</b>
    </a>`;
    const switcher = `<nav class="prototype-switcher" aria-label="مقایسهٔ نمونه‌ها">
      <a class="review-home" href="../">مقایسهٔ طرح‌ها</a>
      ${Object.entries(prototypes).map(([key, title]) => `<a class="switcher-link" href="../prototype-${key}/?view=${view}"
        ${key === mode ? 'aria-current="page"' : ''}><b lang="en">${key.toUpperCase()}</b><span>${title}</span></a>`).join('')}
    </nav>`;

    header.innerHTML = mode === 'e'
      ? `<div class="header-inner">
          ${brand}
          <button class="icon-button navigation-toggle" type="button" data-action="open-navigation" aria-label="باز کردن فهرست" aria-haspopup="dialog" aria-controls="navigation-drawer">${icon('hamburger')}</button>
        </div>
        <nav class="site-links floating-dock" aria-label="ناوبری فروشگاه">${links}${cartLink}</nav>
        <dialog class="navigation-drawer" id="navigation-drawer" aria-labelledby="navigation-title">
          <div class="drawer-content">
            <div class="drawer-heading">
              <h2 id="navigation-title">دسته‌بندی‌ها</h2>
              <button class="icon-button" type="button" data-action="close-navigation" aria-label="بستن فهرست" autofocus>${icon('close')}</button>
            </div>
            <nav class="drawer-categories" aria-label="دسته‌بندی منو">
              ${[{ id: 'all', name: 'همهٔ محصولات' }, ...categories].map(item => `<button type="button" data-category="${item.id}" aria-pressed="${item.id === category}">${item.name}${icon('left')}</button>`).join('')}
            </nav>
            ${switcher}
          </div>
        </dialog>`
      : `<div class="header-inner">
          ${brand}
          <nav class="site-links" aria-label="ناوبری فروشگاه">${links}</nav>
          ${cartLink}
        </div>
        ${switcher}`;
    if (inHeader && previous) Array.from(header.querySelectorAll('a')).find(link => link.getAttribute('href') === previous)?.focus({ preventScroll: true });
  }

  function render() {
    main.dataset.view = view;
    const demo = document.querySelector('.demo-label');
    demo.hidden = hideDemo;
    switch (view) {
      case 'builder': main.innerHTML = renderBuilder({ selection, activeScoop, step, editId }, mode); break;
      case 'cart': main.innerHTML = renderCart(cart); break;
      case 'checkout':
        main.innerHTML = renderCheckout(cart, checkout);
        if (checkout.step === 0 && cart.length) main.querySelector('#notes').value = checkout.notes;
        break;
      case 'confirmation': main.innerHTML = renderConfirmation(order); break;
      default: main.innerHTML = mode === 'b' ? discoveryMenu(category) : quickMenu(category, mode === 'c');
    }
    renderHeader();
  }

  function go(next, replace = false) {
    if (next !== view || replace) {
      history[replace ? 'replaceState' : 'pushState'](null, '', '?view=' + next);
      view = next;
    }
    render();
    window.scrollTo(0, 0);
    document.querySelector('#view-title')?.focus({ preventScroll: true });
  }

  function toast(text) {
    message.textContent = text;
    message.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      message.classList.remove('visible');
      message.textContent = '';
    }, 2400);
  }

  function refreshControl(control, key, value) {
    save();
    const matching = Array.from(main.querySelectorAll('[data-' + key + ']')).find(candidate => (
      candidate.dataset[key] === value && candidate.dataset.delta === control.dataset.delta
    ));
    matching?.focus({ preventScroll: true });
  }

  function rerenderControl(control, key, value) {
    render();
    refreshControl(control, key, value);
  }

  function changeBuilder(control) {
    const { container, count, scoop, flavor, topping, step: target } = control.dataset;
    if (target !== undefined) {
      step = Number(target);
      save();
      render();
      document.querySelector('#step-title').focus();
      return;
    }
    if (container) selection.container = container;
    if (count) {
      const defaultFlavor = initialSelection().scoops[0];
      selection.scoops = Array.from({ length: Number(count) }, (_, index) => selection.scoops[index] ?? defaultFlavor);
      activeScoop = Math.min(activeScoop, selection.scoops.length - 1);
    }
    if (scoop !== undefined) activeScoop = Number(scoop);
    if (flavor && findById(flavors, flavor)?.available) selection.scoops[activeScoop] = flavor;
    if (topping) selection.toppings = selection.toppings.includes(topping)
      ? selection.toppings.filter(id => id !== topping)
      : [...selection.toppings, topping];

    const [key] = Object.keys(control.dataset);
    rerenderControl(control, key, control.dataset[key]);
  }

  dialog.addEventListener('change', event => {
    if (event.target.name !== 'variant') return;
    const variant = findById(detailProduct.variants, event.target.value);
    dialog.querySelector('.primary').textContent = 'افزودن به سبد · ' + money(detailProduct.price + variant.extra);
  });

  document.addEventListener('click', event => {
    if (event.target.matches('.navigation-drawer[open]')) {
      event.target.close();
      return;
    }
    const control = event.target.closest('button, a');
    if (!control || control.disabled) return;
    const data = control.dataset;
    if (data.view && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      go(data.view);
    } else if (data.category) {
      category = data.category;
      const drawer = control.closest('.navigation-drawer');
      if (drawer) {
        drawer.close();
        save();
        go('menu');
        main.querySelector('#menu-list-title').focus();
      } else {
        rerenderControl(control, 'category', category);
        document.activeElement.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    } else if (data.product) {
      detailProduct = findById(products, data.product);
      dialog.querySelector('form').innerHTML = productDetails(detailProduct, detailProduct.variants[0]);
      dialog.showModal();
    } else if (data.fill) {
      const input = document.getElementById(data.fill);
      input.value = data.fill === 'phone' ? demoPhone : demoCode;
      input.focus();
    } else if (control.classList.contains('builder-choice') || data.step !== undefined) {
      changeBuilder(control);
    } else if (data.edit !== undefined) {
      const row = cart[Number(data.edit)];
      selection = structuredClone(row.config);
      activeScoop = 0;
      step = 0;
      editId = row.id;
      save();
      go('builder');
    } else if (data.quantity !== undefined || data.remove !== undefined) {
      const row = cart[Number(data.quantity ?? data.remove)];
      const quantity = data.remove === undefined ? row.quantity + Number(data.delta) : 0;
      cart = updateQuantity(cart, row.id, quantity);
      if (!cart.length) checkout = createCheckout();
      if (quantity < 1 && row.id === editId) editId = undefined;
      save();
      render();
      if (quantity < 1) document.querySelector('#view-title').focus({ preventScroll: true });
      else refreshControl(control, 'quantity', data.quantity);
    } else if (data.action === 'save-builder') {
      const item = buildOrder(selection);
      if (!item) return;
      cart = putItem(cart, item, editId);
      editId = undefined;
      save();
      go('cart');
      toast('بستنی سفارشی در سبد ذخیره شد.');
    } else if (data.action === 'cancel-edit') {
      editId = undefined;
      selection = initialSelection();
      activeScoop = 0;
      step = 0;
      save();
      go('cart');
    } else if (data.action === 'checkout-back') {
      checkout.step -= 1;
      render();
      document.querySelector('#checkout-step-title').focus();
    } else if (data.action === 'open-navigation') {
      header.querySelector('.navigation-drawer').showModal();
    } else if (data.action === 'close-navigation') {
      control.closest('dialog').close();
    } else if (data.action === 'close-detail') {
      dialog.close();
    } else if (data.action === 'dismiss-demo') {
      hideDemo = true;
      save();
      control.closest('.demo-label').hidden = true;
      header.querySelector('.navigation-toggle, .review-home').focus();
    }
  });

  main.addEventListener('toggle', event => {
    const chapter = event.target.dataset.chapter;
    if (chapter === undefined || !event.target.open || Number(chapter) === step) return;
    step = Number(chapter);
    main.querySelectorAll('details[open]').forEach(details => {
      if (details !== event.target) details.open = false;
    });
    save();
  }, true);

  document.addEventListener('submit', event => {
    const form = event.target;
    if (!['product-form', 'checkout-form'].includes(form.id)) return;
    event.preventDefault();
    const fields = new FormData(form);
    if (form.id === 'product-form') {
      const item = productOrder(detailProduct.id, fields.get('variant'));
      if (!item) return;
      cart = putItem(cart, item);
      save();
      dialog.close();
      renderHeader();
      toast(item.name + ' به سبد اضافه شد.');
      return;
    }
    if (!cart.length) return;
    if (checkout.step === 0) {
      if (!verifyDemoPhone(fields.get('phone'))) {
        document.querySelector('#checkout-error').textContent = 'شمارهٔ ساختگی نوشته‌شده در همین صفحه را وارد کن.';
        form.elements.phone.focus();
        return;
      }
      if (!methods.some(([id]) => id === fields.get('method'))) return;
      checkout.method = fields.get('method');
      checkout.notes = fields.get('notes').trim();
    } else if (checkout.step === 1) {
      if (!verifyDemoCode(fields.get('code'))) {
        document.querySelector('#checkout-error').textContent = 'کد آزمایشی درست نیست.';
        form.elements.code.focus();
        return;
      }
    } else {
      if (!payments.some(([id]) => id === fields.get('payment'))) return;
      order = { id: (order?.id ?? 1000) + 1, method: checkout.method, payment: fields.get('payment'), notes: checkout.notes, items: cart };
      cart = [];
      editId = undefined;
      checkout = createCheckout();
      save();
      go('confirmation', true);
      return;
    }
    checkout.step += 1;
    render();
    document.querySelector('#checkout-step-title').focus();
  });

  document.addEventListener('error', event => {
    if (event.target instanceof HTMLImageElement) event.target.hidden = true;
  }, true);

  window.addEventListener('popstate', () => {
    view = readView();
    render();
  });
  render();
}
