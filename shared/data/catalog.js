export const categories = [
  { id: 'traditional', name: 'بستنی سنتی', intro: 'زعفران، گلاب و تکه‌های خامهٔ یخ‌زده' },
  { id: 'scoops', name: 'بستنی اسکوپی', intro: 'اسکوپ‌های دست‌ساز با طعم‌های آشنا' },
  { id: 'gelato', name: 'بستنی ایتالیایی', intro: 'بافت نرم و طعم‌های پررنگ' },
  { id: 'shakes', name: 'شیک', intro: 'بستنی و شیر، هم‌زده و خنک' },
  { id: 'juice', name: 'آبمیوه', intro: 'از میوهٔ تازه، به سفارش شما' },
  { id: 'cake', name: 'کیک', intro: 'یک برش در کنار بستنی' },
  { id: 'dessert', name: 'کوکی و دسر', intro: 'از کوکی شکلاتی تا فالودهٔ شیرازی' },
];

export const allergens = {
  dairy: 'شیر و لبنیات', nuts: 'مغزها', gluten: 'گلوتن', eggs: 'تخم‌مرغ',
};
const variant = (id, name, extra = 0) => ({ id, name, extra });
const bowlSizes = [variant('regular', 'کاسهٔ کوچک'), variant('large', 'کاسهٔ بزرگ', 52000)];
const scoopSizes = [variant('one', 'یک اسکوپ'), variant('two', 'دو اسکوپ', 55000)];
const glassSizes = [variant('regular', '۳۰۰ میلی‌لیتر'), variant('large', '۴۵۰ میلی‌لیتر', 42000)];

function product(id, category, name, price, taste, description, ingredients, allergens, variants, available = true) {
  return { id, category, name, price, taste, description, ingredients, allergens, variants, available };
}

export const products = [
  product('saffron', 'traditional', 'سنتی زعفرانی', 98000, 'معطر و خامه‌ای', 'بستنی کش‌دار با عطر گلاب، زعفران و تکه‌های خامهٔ یخ‌زده، با خلال پسته روی آن.', ['شیر', 'خامه', 'زعفران', 'گلاب', 'شکر', 'ثعلب', 'پسته'], ['dairy', 'nuts'], bowlSizes),
  product('sandwich', 'traditional', 'بستنی نانی', 72000, 'ترد و زعفرانی', 'بستنی زعفرانی با تکه‌های پسته میان دو ورقه نان ویفری ترد.', ['شیر', 'خامه', 'زعفران', 'گلاب', 'شکر', 'آرد گندم', 'پسته'], ['dairy', 'gluten', 'nuts'], [variant('one', 'یک عدد'), variant('two', 'دو عدد', 72000)]),
  product('chocolate', 'scoops', 'شکلات تلخ', 55000, 'کاکائویی و کم‌شیرین', 'شکلات تلخ با کمی شیرینی و پایان مزهٔ کاکائوی برشته.', ['شیر', 'خامه', 'کاکائو', 'شکلات تلخ', 'شکر'], ['dairy'], scoopSizes),
  product('pistachio', 'scoops', 'پسته‌ای', 68000, 'آجیلی و ملایم', 'اسکوپ خامه‌ای با خمیر پستهٔ برشته و تکه‌های ریز پسته.', ['شیر', 'خامه', 'پسته', 'شکر'], ['dairy', 'nuts'], [variant('one', 'یک اسکوپ'), variant('two', 'دو اسکوپ', 68000)]),
  product('strawberry', 'gelato', 'جلاتوی توت‌فرنگی', 95000, 'میوه‌ای و کمی ترش', 'جلاتوی نرم با پورهٔ توت‌فرنگی و کمی آب‌لیمو، در قیف ویفری.', ['توت‌فرنگی', 'شیر', 'شکر', 'آب‌لیمو', 'آرد گندم'], ['dairy', 'gluten'], scoopSizes),
  product('gianduja', 'gelato', 'جلاتوی شکلات و فندق', 112000, 'شکلاتی و برشته', 'جلاتوی غلیظ با شکلات تلخ و فندق برشتهٔ آسیاب‌شده.', ['شیر', 'خامه', 'شکلات', 'فندق', 'شکر'], ['dairy', 'nuts'], [variant('one', 'تک‌اسکوپ'), variant('two', 'دواسکوپ', 80000)]),
  product('berry-shake', 'shakes', 'شیک توت‌فرنگی', 142000, 'خنک و میوه‌ای', 'ترکیب توت‌فرنگی، شیر سرد و بستنی وانیلی با بافتی نرم و غلیظ.', ['توت‌فرنگی', 'شیر', 'بستنی وانیلی', 'خامه'], ['dairy'], glassSizes),
  product('banana-shake', 'shakes', 'شیک موز و شکلات', 158000, 'شیرین و کاکائویی', 'موز رسیده و بستنی شکلاتی، با رگه‌ای از سس شکلات.', ['موز', 'شیر', 'بستنی شکلاتی', 'سس شکلات'], ['dairy'], glassSizes),
  product('orange', 'juice', 'آب پرتقال تازه', 92000, 'ترش و شیرین', 'پرتقال تازه که به سفارش شما آب گرفته می‌شود.', ['پرتقال'], [], glassSizes),
  product('mango', 'juice', 'نکتار انبه', 118000, 'غلیظ و گرمسیری', 'انبهٔ رسیده با چند قطره آب‌لیمو، بدون لبنیات.', ['انبه', 'آب', 'آب‌لیمو'], [], glassSizes, false),
  product('cheesecake', 'cake', 'چیزکیک وانیلی', 135000, 'نرم و کمی ترش', 'چیزکیک پخته با پایهٔ بیسکویتی و رویهٔ توت قرمز.', ['پنیر خامه‌ای', 'تخم‌مرغ', 'بیسکویت گندمی', 'وانیل', 'توت قرمز'], ['dairy', 'eggs', 'gluten'], [variant('slice', 'یک برش')]),
  product('chocolate-cake', 'cake', 'کیک شکلاتی', 129000, 'مرطوب و شکلاتی', 'کیک کاکائویی چندلایه با گاناش شکلات تلخ.', ['آرد گندم', 'تخم‌مرغ', 'خامه', 'کره', 'کاکائو', 'شکر'], ['dairy', 'eggs', 'gluten'], [variant('slice', 'یک برش')]),
  product('cookie', 'dessert', 'کوکی شکلات چیپسی', 55000, 'لبهٔ ترد، مغز نرم', 'کوکی کره‌ای با تکه‌های درشت شکلات تلخ و کمی نمک.', ['آرد گندم', 'کره', 'تخم‌مرغ', 'شکلات تلخ', 'شکر قهوه‌ای'], ['dairy', 'eggs', 'gluten'], [variant('one', 'یک عدد'), variant('two', 'دو عدد', 55000)]),
  product('falooda', 'dessert', 'فالودهٔ شیرازی', 79000, 'خنک و گلابی', 'رشته‌های یخی در شربت گلاب با آب‌لیموی تازه و خلال پسته.', ['نشاستهٔ ذرت', 'گلاب', 'شکر', 'آب‌لیمو', 'پسته'], ['nuts'], bowlSizes),
];

export const containers = [
  { id: 'cup', name: 'لیوان', price: 0, ingredients: [], allergens: [] },
  { id: 'cone', name: 'قیف', price: 12000, ingredients: ['نان ویفری گندمی'], allergens: ['gluten'] },
  { id: 'bowl', name: 'کاسه', price: 10000, ingredients: [], allergens: [] },
];

function flavor(id, name, color, ingredient, extra = 0, { available = true, special = false, nuts = false } = {}) {
  return {
    id, name, color, price: 55000 + extra, available, special,
    ingredients: ['شیر', 'خامه', 'شکر', ingredient], allergens: nuts ? ['dairy', 'nuts'] : ['dairy'],
  };
}

export const flavors = [
  flavor('vanilla', 'وانیلی', '#f4dfa9', 'وانیل'),
  flavor('chocolate', 'شکلاتی', '#9c634c', 'کاکائو'),
  flavor('pistachio', 'پسته‌ای', '#b9c78b', 'پسته', 13000, { nuts: true }),
  flavor('saffron', 'زعفرانی', '#f6c75d', 'زعفران', 8000),
  flavor('strawberry', 'توت‌فرنگی', '#eea6af', 'توت‌فرنگی'),
  flavor('mango', 'انبه', '#f1b46a', 'انبه', 6000, { available: false }),
  flavor('banana', 'موزی', '#f9dc8e', 'موز'),
  flavor('caramel', 'کاراملی', '#d39a67', 'کارامل'),
  { ...flavor('cookies', 'کوکی و خامه', '#c8b7a8', 'بیسکویت گندمی'), allergens: ['dairy', 'gluten'] },
  flavor('rose', 'گل‌محمدی', '#e8b6c8', 'گلاب', 12000, { special: true }),
  flavor('cardamom', 'هل و عسل', '#d8d4a1', 'هل و عسل', 12000, { special: true }),
];

export const toppings = [
  { id: 'chocolate', name: 'سس شکلات', price: 11000, color: '#704331', ingredients: ['کاکائو', 'شکر'], allergens: [] },
  { id: 'caramel', name: 'سس کارامل', price: 11000, color: '#c27b31', ingredients: ['شکر', 'کره'], allergens: ['dairy'] },
  { id: 'cream', name: 'خامهٔ زده‌شده', price: 16000, color: '#fff7df', ingredients: ['خامه', 'شکر'], allergens: ['dairy'] },
  { id: 'pistachio', name: 'پسته', price: 25000, color: '#849748', ingredients: ['پسته'], allergens: ['nuts'] },
  { id: 'almond', name: 'بادام', price: 19000, color: '#a46d4e', ingredients: ['بادام'], allergens: ['nuts'] },
  { id: 'chips', name: 'چیپس شکلات', price: 13000, color: '#563626', ingredients: ['شکلات تلخ'], allergens: [] },
];

export const findById = (items, id) => items.find(item => item.id === id);
export const productImage = id => new URL('../assets/menu/' + id + '.webp', import.meta.url).href;
