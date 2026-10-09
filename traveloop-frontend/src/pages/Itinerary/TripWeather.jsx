import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CloudSun, Loader2, Plus } from 'lucide-react';
import { getChecklist, createChecklistItem } from '../../services/api';
import { getStopForecast, daysForStop, weatherLabel, packingSuggestions } from '../../services/weather';

const dayLabel = day => {
  const [year, month, date] = day.split('-').map(Number);
  return new Date(year, month - 1, date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};
const valueLabel = (value, unit) => value == null ? 'N/A' : `${value}${unit}`;

export default function TripWeather({ tripId, stops }) {
  const [forecasts, setForecasts] = useState({});
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  const [adding, setAdding] = useState('');
  const [message, setMessage] = useState('');
  const locations = JSON.stringify([...new Map(stops.filter(s => s.city_id != null && (s.arrival_date || s.departure_date)).map(s => [s.city_id, { city_id: s.city_id, city_lat: s.city_lat, city_lng: s.city_lng }])).values()]);

  useEffect(() => {
    const controller = new AbortController();
    const cities = JSON.parse(locations);
    Promise.resolve().then(async () => {
      if (controller.signal.aborted) return;
      setLoading(true);
      const results = await Promise.all(cities.map(async city => {
        try { return [city.city_id, await getStopForecast(city, controller.signal)]; }
        catch { return [city.city_id, { error: true }]; }
      }));
      if (!controller.signal.aborted) { setForecasts(Object.fromEntries(results)); setLoading(false); }
    });
    return () => controller.abort();
  }, [locations, retry]);

  const addSuggestion = async item => {
    if (adding) return;
    setAdding(item.item_name);
    setMessage('');
    try {
      const existing = await getChecklist(tripId);
      if (existing.data.some(i => i.item_name.trim().toLowerCase() === item.item_name.toLowerCase())) {
        setMessage(`${item.item_name} is already on your packing checklist.`);
      } else {
        await createChecklistItem(tripId, { item_name: item.item_name, category: item.category });
        setMessage(`${item.item_name} added to your packing checklist.`);
      }
    } catch { setMessage('Could not update the checklist. Please try again.'); }
    finally { setAdding(''); }
  };

  return (
    <section aria-label="Trip weather" className="glass border border-amber-900/10" style={{ padding: '20px', borderRadius: '24px' }}>
      <div className="flex flex-wrap justify-between items-center gap-3" style={{ marginBottom: '16px' }}>
        <h2 className="text-xl font-bold text-amber-950 flex items-center gap-2"><CloudSun size={22} />Weather & packing</h2>
        <Link to={`/trips/${tripId}/checklist`} className="text-sm font-semibold text-amber-700 hover:underline">Open packing checklist</Link>
      </div>
      <p className="text-sm text-amber-900/60" style={{ marginBottom: '16px' }}>Daily forecasts for your stop dates, in each city's timezone. Open-Meteo covers up to 16 days ahead; past and later dates have no forecast here. Temperatures in °C, wind in km/h.</p>
      {loading && <p role="status" className="text-sm flex gap-2 items-center text-amber-700"><Loader2 size={16} className="animate-spin" />Loading forecasts...</p>}
      <p role="status" className="text-sm text-amber-700" style={{ marginBottom: '12px' }}>{message}</p>
      {!stops.length && <p className="text-sm text-amber-900/60">Add a section with a city and dates to see its weather.</p>}
      {stops.map(stop => {
        const forecast = forecasts[stop.city_id];
        const days = daysForStop(stop, forecast);
        const suggestions = packingSuggestions(days);
        const start = (stop.arrival_date || stop.departure_date || '').slice(0, 10);
        const end = (stop.departure_date || stop.arrival_date || '').slice(0, 10);
        const partial = days.length && (days[0].date !== start || days[days.length - 1].date !== end);
        return <article key={stop.id} className="rounded-2xl bg-white/40 border border-amber-900/10" style={{ padding: '16px', marginTop: '12px' }}>
          <h3 className="font-bold text-amber-950">{stop.section_title}</h3>
          {stop.city_name && <p className="text-sm text-amber-700">{stop.city_name}</p>}
          <p className="text-xs text-amber-900/60" style={{ marginTop: '6px' }}>{start ? `${dayLabel(start)} - ${dayLabel(end)}` : 'No dates set'}</p>
          {stop.city_id == null ? <p className="text-sm text-amber-900/60" style={{ marginTop: '8px' }}>Choose a city for this section to see weather.</p>
            : !start ? <p className="text-sm text-amber-900/60" style={{ marginTop: '8px' }}>Add arrival or departure dates to see weather.</p>
            : forecast?.locationError ? <p className="text-sm text-amber-900/60" style={{ marginTop: '8px' }}>No unique weather location found for this city and country. Forecast not shown.</p>
            : forecast?.error ? <p role="alert" className="text-sm text-red-600" style={{ marginTop: '8px' }}>Forecast could not be loaded. <button onClick={() => setRetry(r => r + 1)} className="underline">Retry forecasts</button></p>
            : !loading && !days.length ? <p className="text-sm text-amber-900/60" style={{ marginTop: '8px' }}>These dates are outside the available forecast window. Check again closer to the trip.</p> : null}
          {partial ? <p className="text-xs text-amber-700" style={{ marginTop: '8px' }}>Only part of this stop is within the available forecast window. Suggestions cover the days shown.</p> : null}
          {days.length > 0 && <>
            <p className="text-xs text-amber-900/60" style={{ marginTop: '8px' }}>{forecast.timezone} local dates</p>
            <div className="flex flex-wrap" style={{ gap: '8px', marginTop: '12px' }}>
              {days.map(day => <div key={day.date} data-weather-date={day.date} className="rounded-xl bg-amber-50/80 text-sm" style={{ padding: '12px', flex: '1 1 150px' }}>
                <p className="font-semibold text-amber-950">{dayLabel(day.date)}</p>
                <p className="text-amber-700">{weatherLabel(day.code)}</p>
                <p className="text-amber-950">{valueLabel(day.low, '°')} / {valueLabel(day.high, '°')}</p>
                <p className="text-xs text-amber-900/60">Rain {valueLabel(day.rain, '%')} · Wind {valueLabel(day.wind, ' km/h')}</p>
              </div>)}
            </div>
            <h4 className="font-semibold text-sm text-amber-950" style={{ marginTop: '16px' }}>Packing suggestions</h4>
            {!suggestions.length && <p className="text-sm text-amber-900/60">No extra weather-specific items suggested for these days.</p>}
            {suggestions.map(item => <div key={item.item_name} className="flex flex-wrap items-center justify-between gap-2 text-sm" style={{ marginTop: '10px' }}>
              <div><span className="font-semibold text-amber-950">{item.item_name}</span><p className="text-xs text-amber-900/60">{item.reason}</p></div>
              <button onClick={() => addSuggestion(item)} disabled={!!adding} aria-label={`Add ${item.item_name} to packing checklist`} className="text-amber-700 flex items-center gap-1 hover:underline disabled:opacity-40">{adding === item.item_name ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}Add to checklist</button>
            </div>)}
          </>}
        </article>;
      })}
      <p className="text-xs text-amber-900/60" style={{ marginTop: '16px' }}>Weather data: <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="underline">Open-Meteo</a>. Forecasts can change; packing suggestions are optional.</p>
    </section>
  );
}
