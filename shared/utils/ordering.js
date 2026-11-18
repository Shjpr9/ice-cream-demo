import { containers, flavors, toppings, products, findById } from '../data/catalog.js';

const numbers = new Intl.NumberFormat('fa-IR');
export const number = value => numbers.format(value);
export const money = value => number(value) + ' تومان';

export function buildOrder(selection) {
  if (!selection || !Array.isArray(selection.scoops) || !Array.isArray(selection.toppings)) return null;
  const container = findById(containers, selection.container);
  const scoops = selection.scoops.map(id => findById(flavors, id));
  const extras = selection.toppings.map(id => findById(toppings, id));
  if (!container || scoops.length < 1 || scoops.length > 4 || scoops.some(scoop => !scoop?.available)
    || extras.some(topping => !topping) || new Set(extras).size !== extras.length) return null;

  const parts = [container, ...scoops, ...extras];
  const config = { container: container.id, scoops: [...selection.scoops], toppings: [...selection.toppings].sort() };
  const details = [container.name, scoops.map(scoop => scoop.name).join('، '), extras.map(topping => topping.name).join('، ')];
  return {
    id: 'custom:' + JSON.stringify(config),
    name: 'بستنی سفارشی',
    description: details.filter(Boolean).join(' · '),
    config,
    price: parts.reduce((sum, part) => sum + part.price, 0),
    ingredients: [...new Set(parts.flatMap(part => part.ingredients))],
    allergens: [...new Set(parts.flatMap(part => part.allergens))],
  };
}

export function productOrder(productId, variantId) {
  const product = findById(products, productId);
  const variant = product && findById(product.variants, variantId);
  if (!product?.available || !variant) return null;
  return {
    id: product.id + ':' + variant.id, productId, variantId,
    name: product.name, description: variant.name, price: product.price + variant.extra,
  };
}

export function putItem(cart, item, previousId) {
  if (!item) return cart;
  const quantity = cart.find(row => row.id === previousId)?.quantity ?? 1;
  const withoutPrevious = cart.filter(row => row.id !== previousId);
  if (withoutPrevious.some(row => row.id === item.id)) {
    return withoutPrevious.map(row => row.id === item.id ? { ...row, quantity: row.quantity + quantity } : row);
  }
  return [...withoutPrevious, { ...item, quantity }];
}

export function updateQuantity(cart, id, quantity) {
  return quantity > 0 ? cart.map(row => row.id === id ? { ...row, quantity } : row) : cart.filter(row => row.id !== id);
}

export const cartTotal = cart => cart.reduce((sum, row) => sum + row.quantity * row.price, 0);
export const cartCount = cart => cart.reduce((sum, row) => sum + row.quantity, 0);

export const demoPhone = '09001234567';
export const demoCode = '1234';
const asciiDigits = value => value.trim().replace(/[۰-۹٠-٩]/g, digit => String(digit.charCodeAt(0) & 15));
export const verifyDemoPhone = value => asciiDigits(value) === demoPhone;
export const verifyDemoCode = value => asciiDigits(value) === demoCode;

export function prototypeStorage(prototype) {
  const key = 'bastani-noon:' + prototype;
  return {
    load() {
      try { return JSON.parse(localStorage.getItem(key)) ?? {}; }
      catch { return {}; }
    },
    save(state) {
      try { localStorage.setItem(key, JSON.stringify(state)); }
      catch { /* Ordering still works with in-memory state. */ }
    },
  };
}
