const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const site = 'https://preview.invalid/ice-cream-demo/';
const project = path.resolve(__dirname, '..');
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript',
  '.css': 'text/css', '.webp': 'image/webp', '.woff2': 'font/woff2',
};

async function checkAssets(page, font) {
  const assets = await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(image => {
      image.loading = 'eager';
      return image.decode();
    }));
    return {
      fonts: Array.from(document.fonts).filter(face => face.status === 'loaded').map(face => face.family),
      overflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  assert.equal(assets.overflow, false, await page.title());
  assert.ok(assets.fonts.includes(font), assets.fonts.join(', '));
}

async function orderInPrototype(page, mode) {
  await page.goto(site + 'prototype-' + mode + '/?view=menu');
  await page.locator('[data-category="traditional"]').click();
  await page.locator('button[data-product="saffron"]').first().click();
  const dialog = page.locator('dialog[open]');
  await dialog.locator('[value="large"]').check();
  await dialog.getByRole('button', { name: /افزودن به سبد/ }).click();
  assert.equal(await page.locator('.cart-link b').innerText(), '۱');
  await page.locator('.site-links [data-view="builder"]').click();

  async function step(index) {
    if (mode === 'b') await page.locator(`[data-chapter="${index}"] summary`).click();
    if (mode === 'c') await page.locator(`.builder-steps [data-step="${index}"]`).click();
  }

  await page.locator('[data-container="cone"]').click();
  await step(1);
  await page.locator('[data-count="2"]').click();
  await step(2);
  await page.locator('[data-flavor="pistachio"]').click();
  await page.locator('[data-scoop="1"]').click();
  await page.locator('[data-flavor="strawberry"]').click();
  assert.ok(await page.locator('[data-flavor="mango"]').isDisabled());
  await step(3);
  await page.locator('[data-topping="pistachio"]').click();
  await step(4);
  assert.match(await page.locator('.preview-info').innerText(), /۱۶۰٬۰۰۰/);
  assert.match(await page.locator('.builder-group:visible').last().innerText(), /گلوتن/);
  await page.locator('[data-action="save-builder"]').click();
  assert.equal(await page.locator('.cart-line').count(), 2);

  await page.locator('[data-edit]').click();
  await page.locator('[data-container="bowl"]').click();
  await step(4);
  await page.locator('[data-action="save-builder"]').click();
  assert.match(await page.locator('.cart-line').last().innerText(), /کاسه/);
  await page.locator('[data-quantity][data-delta="1"]').last().click();
  assert.match(await page.locator('.order-total').innerText(), /۴۶۶٬۰۰۰/);
  await page.reload();
  assert.equal(await page.locator('.cart-link b').innerText(), '۳');

  await page.locator('main [data-view="checkout"]').click();
  await page.locator('[value="takeaway"]').check();
  await page.locator('#notes').fill('سس جداگانه');
  await page.locator('#phone').fill('09121234567');
  await page.locator('#checkout-form .primary').click();
  await page.locator('.field-error').waitFor();
  await page.locator('[data-fill="phone"]').click();
  await page.locator('#checkout-form .primary').click();
  await page.locator('#code').fill('0000');
  await page.locator('#checkout-form .primary').click();
  await page.locator('.field-error').waitFor();
  await page.locator('[data-fill="code"]').click();
  await page.locator('#checkout-form .primary').click();
  await page.locator('[value="cash"]').check();
  await page.locator('#checkout-form .primary').click();
  await page.waitForURL('**/?view=confirmation');
  assert.match(await page.locator('main').innerText(), /بیرون‌بر/);
  assert.match(await page.locator('main').innerText(), /پرداخت نقدی/);
  assert.match(await page.locator('main').innerText(), /سس جداگانه/);
  assert.equal(await page.locator('.cart-link b').innerText(), '۰');
  await page.reload();
  assert.match(await page.locator('main').innerText(), /۱۰۰۱/);
  console.log('Ordering verified in prototype ' + mode.toUpperCase());
}

async function checkoutResetsAfterEmptyCart(page) {
  await page.goto(site + 'prototype-a/?view=menu');
  await page.locator('[data-product="saffron"]').first().click();
  await page.locator('#product-form .primary').click();
  await page.getByRole('link', { name: /سبد سفارش/ }).click();
  await page.locator('main [data-view="checkout"]').click();
  await page.locator('[value="delivery"]').check();
  await page.locator('#notes').fill('یادداشت سفارش اول');
  await page.locator('[data-fill="phone"]').click();
  await page.locator('#checkout-form .primary').click();
  await page.locator('[data-fill="code"]').click();
  await page.locator('#checkout-form .primary').click();
  await page.locator('[value="cash"]').waitFor();
  await page.locator('main [data-view="cart"]').click();
  await page.locator('[data-remove]').click();
  await page.locator('main [data-view="menu"]').click();
  await page.locator('[data-product="sandwich"]').first().click();
  await page.locator('#product-form .primary').click();
  await page.getByRole('link', { name: /سبد سفارش/ }).click();
  await page.locator('main [data-view="checkout"]').click();
  await page.locator('#phone').waitFor();
  assert.ok(await page.locator('[value="here"]').isChecked());
  assert.equal(await page.locator('#notes').inputValue(), '');
}

async function run() {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(5000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', async route => {
      const url = route.request().url();
      if (!url.startsWith(site) || route.request().method() !== 'GET') {
        errors.push('Unexpected network request: ' + url);
        return route.abort();
      }
      const relative = new URL(url).pathname.slice(new URL(site).pathname.length);
      const file = path.join(project, relative && !relative.endsWith('/') ? relative : relative + 'index.html');
      try { await route.fulfill({ path: file, contentType: types[path.extname(file)] }); }
      catch (error) { errors.push(error.message); await route.abort(); }
    });
    const fonts = { a: 'Vazirmatn', b: 'Noto Naskh Arabic', c: 'Noto Kufi Arabic', d: 'Dastkhat' };
    for (const width of [320, 390, 768, 1366]) {
      await page.setViewportSize({ width, height: 850 });
      await page.goto(site);
      await checkAssets(page, 'Vazirmatn');
      for (const [mode, font] of Object.entries(fonts)) {
        await page.goto(site + 'prototype-' + mode + '/');
        await checkAssets(page, font);
      }
      console.log('Assets and horizontal layout verified at ' + width + 'px');
    }
    await page.setViewportSize({ width: 390, height: 850 });
    await page.goto(site + 'prototype-a/?view=builder');
    await page.locator('[data-container="bowl"]').click();
    await page.locator('.switcher-link[href*="prototype-b"]').click();
    assert.equal(new URL(page.url()).searchParams.get('view'), 'builder');
    assert.equal(await page.locator('[data-container="cup"]').getAttribute('aria-pressed'), 'true');
    await page.locator('.switcher-link[href*="prototype-c"]').click();
    assert.equal(new URL(page.url()).searchParams.get('view'), 'builder');
    await page.locator('.switcher-link[href*="prototype-d"]').click();
    assert.equal(new URL(page.url()).searchParams.get('view'), 'builder');
    assert.equal(await page.locator('[data-container="cup"]').getAttribute('aria-pressed'), 'true');
    await page.locator('.switcher-link[href*="prototype-a"]').click();
    assert.equal(await page.locator('[data-container="bowl"]').getAttribute('aria-pressed'), 'true');
    await page.evaluate(() => localStorage.clear());
    for (const mode of Object.keys(fonts)) await orderInPrototype(page, mode);
    await checkoutResetsAfterEmptyCart(page);
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
