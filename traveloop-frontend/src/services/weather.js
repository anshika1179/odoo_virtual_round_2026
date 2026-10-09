import { getCity } from './api.js';

const DAILY = 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max';

export async function getForecast(latitude, longitude, signal) {
  const params = new URLSearchParams({ latitude, longitude, daily: DAILY, timezone: 'auto', forecast_days: '16' });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal });
  if (!response.ok) throw new Error('Forecast unavailable');
  const data = await response.json();
  if (!data.daily?.time?.length) throw new Error('Forecast unavailable');
  return data;
}

export function daysForStop(stop, forecast) {
  const start = (stop.arrival_date || stop.departure_date || '').slice(0, 10);
  const end = (stop.departure_date || stop.arrival_date || '').slice(0, 10);
  if (!start || !forecast?.daily) return [];
  return forecast.daily.time.flatMap((date, index) => date >= start && date <= end ? [{
    date,
    code: forecast.daily.weather_code?.[index],
    high: forecast.daily.temperature_2m_max?.[index],
    low: forecast.daily.temperature_2m_min?.[index],
    rain: forecast.daily.precipitation_probability_max?.[index],
    wind: forecast.daily.wind_speed_10m_max?.[index],
  }] : []);
}

export function weatherLabel(code) {
  if (code === 0) return 'Clear sky';
  if ([1, 2].includes(code)) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if ([45, 48].includes(code)) return 'Fog';
  if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snow';
  if ([95, 96, 99].includes(code)) return 'Thunderstorms';
  return 'Conditions unavailable';
}

// These are packing heuristics, not a safety forecast. Only use returned trip-day values.
export function packingSuggestions(days) {
  const suggestions = [];
  const add = (item_name, category, reason) => suggestions.push({ item_name, category, reason });
  if (days.some(day => day.low != null && day.low < 15)) add('Warm layers', 'CLOTHING', 'Forecast lows below 15°C');
  if (days.some(day => day.low != null && day.low <= 5)) add('Warm coat and gloves', 'CLOTHING', 'Forecast lows at or below 5°C');
  if (days.some(day => (day.rain != null && day.rain >= 40) || ['Rain', 'Drizzle', 'Thunderstorms'].includes(weatherLabel(day.code)))) add('Rain jacket', 'CLOTHING', 'Rain or drizzle forecast, or rain chance at least 40%');
  if (days.some(day => day.high != null && day.high >= 25)) {
    add('Light breathable clothing', 'CLOTHING', 'Forecast highs at or above 25°C');
    add('Reusable water bottle', 'OTHER', 'Warm days forecast');
  }
  if (days.some(day => [0, 1, 2].includes(day.code) || (day.high != null && day.high >= 25))) add('Sunscreen', 'TOILETRIES', 'Clear, partly cloudy or warm days forecast');
  if (days.some(day => day.wind != null && day.wind >= 30)) add('Windproof layer', 'CLOTHING', 'Forecast wind at or above 30 km/h');
  if (days.some(day => weatherLabel(day.code) === 'Snow')) add('Waterproof boots', 'CLOTHING', 'Snow forecast');
  return suggestions;
}

// Seeded cities may have no coordinates. Resolve by both city and country, never the first name match.
export async function getStopForecast(stop, signal) {
  if (stop.city_lat != null && stop.city_lng != null) return getForecast(stop.city_lat, stop.city_lng, signal);
  const { data: city } = await getCity(stop.city_id);
  const params = new URLSearchParams({ name: city.name, count: '100', language: 'en', format: 'json' });
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`, { signal });
  if (!response.ok) throw new Error('Location unavailable');
  const data = await response.json();
  const aliases = { USA: 'United States', UK: 'United Kingdom', 'Czech Republic': 'Czechia' };
  const country = aliases[city.country] || city.country;
  const matches = (data.results || []).filter(result => result.name.toLowerCase() === city.name.toLowerCase() && result.country?.toLowerCase() === country.toLowerCase());
  if (matches.length !== 1) return { locationError: true };
  return getForecast(matches[0].latitude, matches[0].longitude, signal);
}
