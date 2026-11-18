import { categories, products, findById } from './data/catalog.js';
import { money, number } from './utils/ordering.js';
import { allergenList, icon, photo } from './ui.js';

const all = { id: 'all', name: 'همهٔ محصولات' };
const filters = [all, ...categories];
const featured = ['saffron', 'pistachio', 'strawberry'];
const visibleProducts = category => category === 'all' ? products : products.filter(product => product.category === category);

function categoryButton(category, active) {
  const count = visibleProducts(category.id).length;
  return `<button type="button" data-category="${category.id}" aria-pressed="${active === category.id}">
    <span>${category.name}</span><small>${number(count)}</small></button>`;
}

function menuCard(product) {
  return `<article class="menu-card">
    <button class="card-image" type="button" data-product="${product.id}" aria-label="جزئیات ${product.name}">${photo(product.id)}</button>
    <div class="card-copy">
      <h3><button type="button" data-product="${product.id}">${product.name}</button></h3>
      <p>${product.taste}</p>
      <div class="card-foot">
        <strong>${money(product.price)}</strong>
        <button type="button" class="icon-button" data-product="${product.id}" aria-label="انتخاب ${product.name}">${icon(product.available ? 'plus' : 'left')}</button>
      </div>
      ${product.available ? '' : '<span class="unavailable">فعلاً ناموجود</span>'}
    </div>
  </article>`;
}

export function quickMenu(category, compact = false) {
  const current = findById(filters, category) ?? all;
  const items = visibleProducts(current.id);
  return `
    ${compact ? '' : `<section class="menu-intro" aria-labelledby="view-title">
      <div><p class="eyebrow">بستنی‌فروشی نون</p><h1 id="view-title" tabindex="-1">منوی امروز</h1><p>طعم دلخواهت رو پیدا کن و سر میز سفارش بده.</p></div>
      <a href="?view=builder" data-view="builder" class="builder-banner">
        <div>${icon('sparkle')}<strong>بستنی دلخواهت رو بساز</strong><span>از ظرف تا آخرین تاپینگ ${icon('left')}</span></div>
        ${photo('cone')}
      </a>
    </section>`}
    <div class="menu-layout">
      <nav class="category-nav" aria-label="دسته‌بندی منو">
        <h2>دسته‌بندی‌ها</h2>
        <div class="category-buttons">${filters.map(item => categoryButton(item, current.id)).join('')}</div>
      </nav>
      <section class="menu-list" aria-labelledby="${compact ? 'view-title' : 'menu-list-title'}">
        <div class="section-heading">
          <${compact ? 'h1' : 'h2'} id="${compact ? 'view-title' : 'menu-list-title'}" tabindex="-1">${current.name}</${compact ? 'h1' : 'h2'}>
          <span>${number(items.length)} محصول</span>
        </div>
        <div class="menu-grid">${items.map(menuCard).join('')}</div>
      </section>
    </div>`;
}

function editorialProduct(product) {
  return `<article class="editorial-product">
    <button type="button" class="card-image" data-product="${product.id}" aria-label="جزئیات ${product.name}">${photo(product.id)}</button>
    <div class="editorial-copy">
      <p class="eyebrow">${product.taste}</p>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      ${allergenList(product.allergens)}
      <div class="editorial-action">
        <strong>${money(product.price)}</strong>
        <button type="button" class="text-button" data-product="${product.id}">${product.available ? 'مواد و انتخاب' : 'جزئیات · ناموجود'} ${icon('left')}</button>
      </div>
    </div>
  </article>`;
}

export function discoveryMenu(category) {
  const current = findById(filters, category) ?? all;
  const initial = current.id === 'all';
  return `<header class="discovery-intro">
    <div class="discovery-copy">
      <p class="eyebrow">بستنی‌فروشی نون</p>
      <h1 id="view-title" tabindex="-1">هر طعم،<br>یک داستان</h1>
      <p>ترکیبات و مزهٔ هر بستنی رو بخون و با خیال راحت انتخاب کن.</p>
      <a class="text-button" href="#flavor-guide">طعم‌ها رو ببین ${icon('left')}</a>
    </div>
    <figure>${photo('trio', 'سه اسکوپ بستنی توت‌فرنگی، وانیل و پسته', { eager: true })}<figcaption>توت‌فرنگی، وانیل و پسته</figcaption></figure>
  </header>
  <section id="flavor-guide" class="flavor-guide">
    <nav class="discovery-categories" aria-label="دسته‌بندی طعم‌ها">${filters.map(item => categoryButton(item, current.id)).join('')}</nav>
    <div class="section-heading"><div><h2>${initial ? 'از این طعم‌ها شروع کن' : current.name}</h2>${current.intro ? `<p>${current.intro}</p>` : ''}</div></div>
    <div class="editorial-list">${(initial ? featured.map(id => findById(products, id)) : visibleProducts(current.id)).map(editorialProduct).join('')}</div>
    ${initial ? categories.map(item => `<section class="editorial-category"><h2>${item.name}</h2><div class="editorial-list">${visibleProducts(item.id).filter(product => !featured.includes(product.id)).map(editorialProduct).join('')}</div></section>`).join('') : ''}
  </section>
  <a class="discovery-builder" href="?view=builder" data-view="builder">${icon('cone')}<span>طعم‌های دلخواهت رو کنار هم بذار</span>${icon('left')}</a>`;
}

export function productDetails(product, variant) {
  return `<div class="detail-grid">
    ${photo(product.id, product.name, { eager: true })}
    <div class="detail-copy">
      <p class="eyebrow">${product.taste}</p>
      <h2 id="detail-title">${product.name}</h2>
      <p>${product.description}</p>
      <h3>ترکیبات</h3><p>${product.ingredients.join('، ')}</p>
      <h3>حساسیت‌زاها</h3>${allergenList(product.allergens)}
      <fieldset><legend>اندازه یا تعداد</legend>
        ${product.variants.map(option => `<label class="radio-row"><input type="radio" name="variant" value="${option.id}" ${variant === option ? 'checked' : ''} ${product.available ? '' : 'disabled'}><span>${option.name}</span><strong>${money(product.price + option.extra)}</strong></label>`).join('')}
      </fieldset>
      <button class="primary full" form="product-form" ${product.available ? '' : 'disabled'}>${product.available ? 'افزودن به سبد · ' + money(product.price + variant.extra) : 'فعلاً ناموجود'}</button>
    </div>
  </div>`;
}
