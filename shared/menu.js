import { categories, products, findById } from './data/catalog.js';
import { money, number } from './utils/ordering.js';
import { allergenList, icon, photo } from './ui.js';
import { productImage } from './data/catalog.js';
import { heroShowcase } from './hero.js';

const all = { id: 'all', name: 'همهٔ محصولات' };
const filters = [all, ...categories];
const featured = ['saffron', 'pistachio', 'strawberry'];
const badge = product => featured.includes(product.id) ? '<span class="badge">محبوب مشتری‌ها</span>' : '';
const visibleProducts = category => category === 'all' ? products : products.filter(product => product.category === category);

function categoryButton(category, active) {
  const count = visibleProducts(category.id).length;
  return `<button type="button" data-category="${category.id}" aria-pressed="${active === category.id}">
    <span>${category.name}</span><small>${number(count)}</small></button>`;
}

function menuCard(product) {
  return `<article class="menu-card">
    ${badge(product)}
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

export function quickMenu(category, compact = false, rich = false) {
  const current = findById(filters, category) ?? all;
  const items = visibleProducts(current.id);
  return `
    ${compact ? '' : heroShowcase({ eyebrow: 'بستنی‌فروشی نون · منوی امروز', lines: ['شیرین‌ترین بستنی‌ها رو', 'از نون سفارش بده.'], target: 'menu-start' })}
    <div class="menu-layout" id="menu-start">
      <nav class="category-nav" aria-label="دسته‌بندی منو">
        <h2>دسته‌بندی‌ها</h2>
        <div class="category-buttons">${filters.map(item => categoryButton(item, current.id)).join('')}</div>
      </nav>
      <section class="menu-list" aria-labelledby="${compact ? 'view-title' : 'menu-list-title'}">
        <div class="section-heading">
          <${compact ? 'h1' : 'h2'} id="${compact ? 'view-title' : 'menu-list-title'}" tabindex="-1">${current.name}</${compact ? 'h1' : 'h2'}>
          <span>${number(items.length)} محصول</span>
        </div>
        <div class="menu-grid">${items.map(rich ? editorialProduct : menuCard).join('')}</div>
      </section>
    </div>`;
}

function editorialProduct(product) {
  return `<article class="editorial-product">
    ${badge(product)}
    <button type="button" class="card-image" data-product="${product.id}" aria-label="جزئیات ${product.name}">
      ${photo(product.id)}<img class="pop-img" src="${productImage(product.id)}" alt="" width="309" height="309" loading="lazy" aria-hidden="true">
    </button>
    <div class="editorial-copy">
      <p class="eyebrow">${product.taste}</p>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      ${allergenList(product.allergens, 'این طعم حاوی')}
      <div class="editorial-action">
        <strong>${money(product.price)}</strong>
        <button type="button" class="primary quick-add" data-quick-add="${product.id}" ${product.available ? '' : 'disabled'}>${product.available ? icon('plus') + ' سفارش' : 'فعلاً ناموجود'}</button>
      </div>
    </div>
  </article>`;
}

export function discoveryMenu(category) {
  const current = findById(filters, category) ?? all;
  const initial = current.id === 'all';
  return `${heroShowcase({ eyebrow: 'بستنی‌فروشی نون · راهنمای طعم‌ها', lines: ['هر طعم،', 'یک داستان شیرین.'], target: 'flavor-guide' })}
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
