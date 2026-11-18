import assert from 'node:assert/strict';
import test from 'node:test';

test('the catalog covers seven categories and every product has ingredients', async () => {
  const { categories, products } = await import('../shared/data/catalog.js');
  assert.equal(categories.length, 7);
  for (const category of categories) {
    const items = products.filter(product => product.category === category.id);
    assert.ok(items.length >= 2, category.id);
    for (const item of items) {
      assert.ok(item.ingredients.length);
      assert.ok(Array.isArray(item.allergens));
      assert.ok(item.variants.length);
    }
  }
});

test('builder prices repeated scoops and toppings and rejects unavailable selections', async () => {
  const { buildOrder } = await import('../shared/utils/ordering.js');
  const selection = { container: 'cone', scoops: ['vanilla', 'vanilla'], toppings: ['pistachio'] };
  const item = buildOrder(selection);
  assert.equal(item.price, 147000);
  assert.deepEqual(item.allergens.sort(), ['dairy', 'gluten', 'nuts']);
  assert.equal(buildOrder({ ...selection, scoops: ['mango'] }), null);
  assert.equal(buildOrder({ ...selection, scoops: [] }), null);
  assert.equal(buildOrder({ ...selection, toppings: ['pistachio', 'pistachio'] }), null);
});

test('cart merges identical items, keeps custom edits at their quantity and removes zero quantities', async () => {
  const { putItem, updateQuantity, buildOrder, cartTotal } = await import('../shared/utils/ordering.js');
  const first = buildOrder({ container: 'cup', scoops: ['vanilla'], toppings: [] });
  const changed = buildOrder({ container: 'bowl', scoops: ['vanilla'], toppings: [] });
  let cart = putItem([], first);
  cart = putItem(cart, first);
  assert.equal(cart.length, 1);
  assert.equal(cartTotal(cart), 110000);
  cart = putItem(cart, changed, first.id);
  assert.equal(cart[0].quantity, 2);
  assert.equal(cartTotal(cart), 130000);
  assert.deepEqual(updateQuantity(cart, changed.id, 0), []);
});

test('only the fictional phone is accepted, including Persian and Arabic digits', async () => {
  const { verifyDemoPhone, verifyDemoCode } = await import('../shared/utils/ordering.js');
  assert.ok(verifyDemoPhone('۰۹۰۰۱۲۳۴۵۶۷'));
  assert.ok(verifyDemoCode('١٢٣٤'));
  assert.equal(verifyDemoPhone('09121234567'), false);
  assert.equal(verifyDemoCode('0000'), false);
});

test('catalog variants determine price and unavailable products cannot be ordered', async () => {
  const { productOrder } = await import('../shared/utils/ordering.js');
  assert.equal(productOrder('saffron', 'large').price, 150000);
  assert.equal(productOrder('saffron', 'missing'), null);
  assert.equal(productOrder('mango', 'regular'), null);
});

test('every referenced product, preview photo and Persian font is checked in', async () => {
  const { readFile } = await import('node:fs/promises');
  const { products, productImage } = await import('../shared/data/catalog.js');
  for (const id of [...products.map(product => product.id), 'cone', 'trio']) {
    const image = await readFile(new URL(productImage(id)));
    assert.equal(image.toString('ascii', 8, 12), 'WEBP', id);
  }
  for (const mode of ['a', 'b', 'c', 'd']) {
    const css = new URL('../prototype-' + mode + '/style.css', import.meta.url);
    const stylesheet = await readFile(css, 'utf8');
    const fonts = [...stylesheet.matchAll(/url\("([^"]+\.woff2)"\)/g)];
    assert.equal(fonts.length, mode === 'd' ? 1 : 2);
    for (const [, path] of fonts) {
      const font = await readFile(new URL(path, css));
      assert.equal(font.toString('ascii', 0, 4), 'wOF2', path);
    }
  }
});

test('every prototype renders the selected available builder configuration', async () => {
  const { renderBuilder } = await import('../shared/builder.js');
  const selection = { container: 'cone', scoops: ['vanilla', 'pistachio'], toppings: ['almond'] };
  for (const mode of ['a', 'b', 'c', 'd']) {
    const rendered = renderBuilder({ selection, activeScoop: 1, step: 4 }, mode);
    assert.match(rendered, /بستنی خودت رو بساز/);
    assert.match(rendered, /۱۵۴٬۰۰۰ تومان/);
    assert.match(rendered, /گلوتن/);
    assert.match(rendered, /وانیلی، پسته‌ای/);
    assert.match(rendered, /<svg class="ice-preview"/);
    assert.match(rendered, /data-action="save-builder"/);
  }
});

test('the builder defaults to an available flavor and handles an out-of-stock catalog', async () => {
  const { flavors } = await import('../shared/data/catalog.js');
  const { initialSelection, renderBuilder } = await import('../shared/builder.js');
  const availability = flavors.map(flavor => flavor.available);
  try {
    flavors[0].available = false;
    assert.deepEqual(initialSelection().scoops, ['chocolate']);
    flavors.forEach(flavor => { flavor.available = false; });
    const rendered = renderBuilder({ selection: initialSelection(), activeScoop: 0, step: 0 }, 'c');
    assert.match(rendered, /فعلاً طعم موجودی برای ساخت بستنی نداریم/);
    assert.doesNotMatch(rendered, /data-action="save-builder"/);
  } finally {
    flavors.forEach((flavor, index) => { flavor.available = availability[index]; });
  }
});
