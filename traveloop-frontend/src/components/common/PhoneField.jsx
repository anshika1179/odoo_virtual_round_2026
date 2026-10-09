import { useState } from 'react';
import { DIAL_CODES, splitPhone, digitsFor, isoFor } from '../../utils/countries';

// value is a full phone string like "+919876543210"; onChange gets the same shape.
export default function PhoneField({ value, onChange, className = 'input-glass', style }) {
  const parsed = splitPhone(value);
  // The chosen code is remembered while the number box is empty; otherwise it comes from the value.
  const [picked, setPicked] = useState('+91');
  const code = value ? parsed.code : picked;
  const number = value ? parsed.number : '';
  const max = digitsFor(code);
  const emit = (c, n) => onChange(n ? `${c}${n}` : '');
  const seen = new Set();
  return (
    <div className="phone-field">
      <select aria-label="Country code" className={`${className} phone-code`} style={style} value={code}
        onChange={e => { setPicked(e.target.value); emit(e.target.value, number.slice(0, digitsFor(e.target.value))); }}>
        {DIAL_CODES.filter(d => !seen.has(d.code) && seen.add(d.code)).map(d => (
          <option key={d.code} value={d.code}>{d.code} {isoFor(d.country)}</option>
        ))}
      </select>
      <input type="tel" inputMode="numeric" aria-label="Phone number" className={`${className} phone-number`} style={style}
        placeholder={'9'.repeat(max)} value={number}
        onChange={e => emit(code, e.target.value.replace(/\D/g, '').slice(0, max))} />
    </div>
  );
}
