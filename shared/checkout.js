import { cartTotal, demoPhone, demoCode, money, number } from './utils/ordering.js';
import { escapeHtml, icon, photo } from './ui.js';

export const methods = [
  ['here', 'داخل مجموعه'], ['takeaway', 'بیرون‌بر'], ['delivery', 'ارسال با پیک'],
];
export const payments = [
  ['online', 'پرداخت آنلاین آزمایشی'], ['cash', 'پرداخت نقدی'],
];

const persianDigits = value => value.replace(/\d/g, digit => '۰۱۲۳۴۵۶۷۸۹'[digit]);
const localizedDigits = value => `<bdi dir="ltr">${persianDigits(value)}</bdi>`;

export function renderCart(cart) {
  return `<div class="page-narrow">
    <h1 id="view-title" tabindex="-1">سبد سفارش</h1>
    ${cart.length ? `<ul class="cart-lines">${cart.map((item, index) => `<li class="cart-line">
      ${photo(item.productId ?? 'cone')}
      <div class="line-copy"><h2>${item.name}</h2><p>${item.description}</p><strong>${money(item.price)} <small>برای هر واحد</small></strong>
      ${item.config ? `<button type="button" class="text-button" data-edit="${index}">ویرایش بستنی</button>` : ''}</div>
      <div class="line-actions">
        <div class="quantity">
          <button type="button" class="icon-button" data-quantity="${index}" data-delta="1" aria-label="افزایش تعداد ${item.name}">${icon('plus')}</button>
          <span aria-label="تعداد ${number(item.quantity)}">${number(item.quantity)}</span>
          <button type="button" class="icon-button" data-quantity="${index}" data-delta="-1" aria-label="کاهش تعداد ${item.name}">${icon('minus')}</button>
        </div>
        <button type="button" class="text-button remove" data-remove="${index}" aria-label="حذف ${item.name}">حذف</button>
      </div>
    </li>`).join('')}</ul>
    <div class="order-total"><span>جمع سفارش</span><strong>${money(cartTotal(cart))}</strong></div>
    <a class="primary full" href="?view=checkout" data-view="checkout">ادامهٔ سفارش ${icon('left')}</a>`
    : `<div class="empty-state">${icon('bag')}<h2>سبد هنوز خالیه</h2><p>از منو یک طعم انتخاب کن یا بستنی خودت رو بساز.</p><a class="primary" href="?view=menu" data-view="menu">دیدن منو ${icon('left')}</a></div>`}
  </div>`;
}

function radios(name, choices, selected) {
  return choices.map(([value, label]) => `<label class="radio-row"><input type="radio" name="${name}" value="${value}" ${value === selected ? 'checked' : ''} required><span>${label}</span></label>`).join('');
}

export function renderCheckout(cart, checkout) {
  if (!cart.length) return renderCart(cart);
  const { step, method, payment } = checkout;
  const title = ['روش سفارش', 'تأیید آزمایشی', 'پرداخت و ثبت'][step];
  return `<div class="page-narrow">
    <a class="text-button" href="?view=cart" data-view="cart">${icon('right')} بازگشت به سبد</a>
    <h1 id="view-title" tabindex="-1">تکمیل سفارش</h1>
    <p class="eyebrow">مرحلهٔ ${number(step + 1)} از ۳</p>
    <form id="checkout-form" class="checkout-form">
      <h2 id="checkout-step-title" tabindex="-1">${title}</h2>
      ${step === 0 ? `<fieldset><legend>سفارش رو چطور تحویل می‌گیری؟</legend>${radios('method', methods, method)}</fieldset>
        <label for="notes">یادداشت سفارش <small>اختیاری</small></label>
        <textarea id="notes" name="notes" rows="2" maxlength="300" placeholder="مثلاً سس جداگانه"></textarea>
        <label for="phone">شمارهٔ آزمایشی</label>
        <p id="phone-help" class="demo-help">از شمارهٔ ساختگی ${localizedDigits(demoPhone)} استفاده کن. <button type="button" class="text-button" data-fill="phone">وارد کردن شماره</button></p>
        <input id="phone" type="text" name="phone" inputmode="numeric" autocomplete="off" dir="ltr" aria-describedby="phone-help checkout-error" maxlength="11" required>`
      : step === 1 ? `<label for="code">کد تأیید</label>
        <p id="code-help" class="demo-help">ارسال پیامک شبیه‌سازی شد. کد آزمایشی ${localizedDigits(demoCode)} است. <button type="button" class="text-button" data-fill="code">وارد کردن کد</button></p>
        <input id="code" type="text" name="code" inputmode="numeric" autocomplete="off" dir="ltr" aria-describedby="code-help checkout-error" maxlength="4" required>`
      : `<p>روش دریافت <strong>${methods.find(([id]) => id === method)[1]}</strong></p>
        <fieldset><legend>روش پرداخت</legend>${radios('payment', payments, payment)}</fieldset>`}
      <p id="checkout-error" class="field-error" role="alert"></p>
      <div class="order-total"><span>جمع سفارش</span><strong>${money(cartTotal(cart))}</strong></div>
      <div class="step-actions">
        ${step > 0 ? '<button type="button" class="secondary" data-action="checkout-back">مرحلهٔ قبل</button>' : ''}
        <button class="primary">${['دریافت کد آزمایشی', 'تأیید کد', 'ثبت سفارش آزمایشی'][step]} ${icon(step === 2 ? 'check' : 'left')}</button>
      </div>
    </form>
  </div>`;
}

export function renderConfirmation(order) {
  if (!order) return `<div class="page-narrow empty-state"><h1 id="view-title" tabindex="-1">هنوز سفارشی ثبت نشده</h1><a class="primary" href="?view=menu" data-view="menu">دیدن منو</a></div>`;
  return `<div class="page-narrow confirmation">
    <div class="confirmation-icon">${icon('check')}</div>
    <h1 id="view-title" tabindex="-1">سفارش آزمایشی ثبت شد</h1>
    <p>شمارهٔ سفارش <strong>${localizedDigits(String(order.id))}</strong></p>
    <dl><div><dt>روش دریافت</dt><dd>${methods.find(([id]) => id === order.method)[1]}</dd></div>
    <div><dt>وضعیت پرداخت</dt><dd>${order.payment === 'online' ? 'پرداخت آزمایشی موفق' : 'پرداخت نقدی هنگام دریافت'}</dd></div></dl>
    ${order.notes ? `<p class="order-note">یادداشت سفارش: ${escapeHtml(order.notes)}</p>` : ''}
    <ul class="receipt-lines">${order.items.map(item => `<li><span>${number(item.quantity)} × ${item.name}<small>${item.description}</small></span><strong>${money(item.quantity * item.price)}</strong></li>`).join('')}</ul>
    <div class="order-total"><span>جمع سفارش</span><strong>${money(cartTotal(order.items))}</strong></div>
    <a class="primary full" href="?view=menu" data-view="menu">بازگشت به منو</a>
  </div>`;
}
