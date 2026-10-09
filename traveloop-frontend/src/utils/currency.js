// Amounts are stored in USD. They are shown in the currency of the user's country.
// Rates are fixed approximations (units per 1 USD), not live exchange rates.
const CURRENCIES = {
  india: ['INR', '₹', 83, 'en-IN'], 'united states': ['USD', '$', 1, 'en-US'], usa: ['USD', '$', 1, 'en-US'],
  'united kingdom': ['GBP', '£', 0.79, 'en-GB'], uk: ['GBP', '£', 0.79, 'en-GB'], france: ['EUR', '€', 0.92, 'fr-FR'],
  germany: ['EUR', '€', 0.92, 'de-DE'], italy: ['EUR', '€', 0.92, 'it-IT'], spain: ['EUR', '€', 0.92, 'es-ES'],
  netherlands: ['EUR', '€', 0.92, 'nl-NL'], portugal: ['EUR', '€', 0.92, 'pt-PT'], ireland: ['EUR', '€', 0.92, 'en-IE'],
  japan: ['JPY', '¥', 150, 'ja-JP'], china: ['CNY', '¥', 7.2, 'zh-CN'], australia: ['AUD', 'A$', 1.5, 'en-AU'],
  canada: ['CAD', 'C$', 1.37, 'en-CA'], singapore: ['SGD', 'S$', 1.35, 'en-SG'], 'united arab emirates': ['AED', 'AED ', 3.67, 'en-AE'],
  uae: ['AED', 'AED ', 3.67, 'en-AE'], thailand: ['THB', '฿', 36, 'th-TH'], indonesia: ['IDR', 'Rp ', 15800, 'id-ID'],
  malaysia: ['MYR', 'RM ', 4.7, 'ms-MY'], 'south korea': ['KRW', '₩', 1350, 'ko-KR'], switzerland: ['CHF', 'CHF ', 0.88, 'de-CH'],
  'new zealand': ['NZD', 'NZ$', 1.65, 'en-NZ'], 'sri lanka': ['LKR', 'Rs ', 300, 'si-LK'], nepal: ['NPR', 'Rs ', 133, 'ne-NP'],
  pakistan: ['PKR', 'Rs ', 280, 'en-PK'], bangladesh: ['BDT', '৳', 110, 'bn-BD'], 'south africa': ['ZAR', 'R ', 18.5, 'en-ZA'],
  brazil: ['BRL', 'R$', 5.2, 'pt-BR'], mexico: ['MXN', 'MX$', 18, 'es-MX'], turkey: ['TRY', '₺', 33, 'tr-TR'],
  russia: ['RUB', '₽', 92, 'ru-RU'], egypt: ['EGP', 'E£', 48, 'ar-EG'], 'saudi arabia': ['SAR', 'SAR ', 3.75, 'en-SA'],
};
const USD = ['USD', '$', 1, 'en-US'];
export function currencyFor(country) {
  return CURRENCIES[(country || '').trim().toLowerCase()] || USD;
}
export function makeCurrency(country) {
  const [code, symbol, rate, locale] = currencyFor(country);
  const fmt = (usd, digits) => {
    const n = (Number(usd) || 0) * rate;
    const d = digits ?? (rate >= 100 ? 0 : (Number.isInteger(n) ? 0 : 2));
    return symbol + n.toLocaleString(locale, { minimumFractionDigits: d, maximumFractionDigits: d });
  };
  return { code, symbol: symbol.trim(), rate, fmt, toUsd: v => (parseFloat(v) || 0) / rate, fromUsd: v => Math.round((Number(v) || 0) * rate * 100) / 100 };
}
