// Dial codes for the phone country picker.
export const DIAL_CODES = [
  ['India', '+91', 10], ['United States', '+1', 10], ['Canada', '+1', 10], ['United Kingdom', '+44', 10],
  ['Australia', '+61', 9], ['United Arab Emirates', '+971', 9], ['Singapore', '+65', 8], ['Germany', '+49', 10],
  ['France', '+33', 9], ['Italy', '+39', 10], ['Spain', '+34', 9], ['Netherlands', '+31', 9], ['Japan', '+81', 10],
  ['China', '+86', 11], ['Thailand', '+66', 9], ['Indonesia', '+62', 10], ['Malaysia', '+60', 9], ['South Korea', '+82', 10],
  ['Switzerland', '+41', 9], ['New Zealand', '+64', 9], ['Sri Lanka', '+94', 9], ['Nepal', '+977', 10], ['Pakistan', '+92', 10],
  ['Bangladesh', '+880', 10], ['South Africa', '+27', 9], ['Brazil', '+55', 11], ['Mexico', '+52', 10], ['Turkey', '+90', 10],
  ['Saudi Arabia', '+966', 9], ['Egypt', '+20', 10], ['Russia', '+7', 10],
].map(([country, code, digits]) => ({ country, code, digits }));
const byLongest = [...DIAL_CODES].sort((a, b) => b.code.length - a.code.length);
export function splitPhone(phone) {
  const p = (phone || '').replace(/[\s\-()]/g, '');
  if (!p.startsWith('+')) return { code: '+91', number: p.replace(/\D/g, '') };
  const hit = byLongest.find(d => p.startsWith(d.code));
  return hit ? { code: hit.code, number: p.slice(hit.code.length).replace(/\D/g, '') } : { code: '+91', number: p.replace(/\D/g, '') };
}
const ISO = { India: 'IN', 'United States': 'US', Canada: 'CA', 'United Kingdom': 'UK', Australia: 'AU', 'United Arab Emirates': 'AE', Singapore: 'SG', Germany: 'DE', France: 'FR', Italy: 'IT', Spain: 'ES', Netherlands: 'NL', Japan: 'JP', China: 'CN', Thailand: 'TH', Indonesia: 'ID', Malaysia: 'MY', 'South Korea': 'KR', Switzerland: 'CH', 'New Zealand': 'NZ', 'Sri Lanka': 'LK', Nepal: 'NP', Pakistan: 'PK', Bangladesh: 'BD', 'South Africa': 'ZA', Brazil: 'BR', Mexico: 'MX', Turkey: 'TR', 'Saudi Arabia': 'SA', Egypt: 'EG', Russia: 'RU' };
export const isoFor = country => ISO[country] || country;
export const digitsFor = code => (DIAL_CODES.find(d => d.code === code) || { digits: 10 }).digits;
