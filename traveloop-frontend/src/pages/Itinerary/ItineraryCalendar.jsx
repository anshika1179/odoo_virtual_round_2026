import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Plus, Loader2 } from 'lucide-react';
import { getStopActivities } from '../../services/api';

// Itinerary dates are calendar days, not instants. Keep the stored day in every timezone.
const dateKey = value => value ? value.slice(0, 10) : '';
const localDate = key => {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
};
const keyFor = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export default function ItineraryCalendar({ trip, stops, onAddDate }) {
  const initialDay = dateKey(trip?.start_date) || keyFor(new Date());
  const [month, setMonth] = useState(() => localDate(initialDay));
  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const stopIds = stops.map(s => s.id).join(',');

  useEffect(() => {
    let cancelled = false;
    const ids = stopIds ? stopIds.split(',').map(Number) : [];
    Promise.resolve().then(() => {
      if (!cancelled) { setLoading(true); setError(false); }
      return Promise.all(ids.map(stopId => getStopActivities(stopId).then(r => r.data)));
    })
      .then(results => { if (!cancelled) setActivities(results.flat()); })
      .catch(() => { if (!cancelled) { setActivities([]); setError(true); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [stopIds, retry]);

  const entriesFor = day => {
    const sections = stops.filter(stop => {
      const start = dateKey(stop.arrival_date || stop.departure_date);
      const end = dateKey(stop.departure_date || stop.arrival_date);
      return start && day >= start && day <= (end < start ? start : end);
    }).map(stop => ({ key: `stop-${stop.id}`, title: stop.section_title, detail: stop.city_name || stop.description, type: 'Section' }));
    const plans = activities.filter(activity => dateKey(activity.planned_date) === day)
      .map(activity => ({ key: `activity-${activity.id}`, title: activity.custom_name || activity.activity_name || 'Activity', detail: stops.find(s => s.id === activity.trip_stop_id)?.section_title, time: activity.planned_time, type: 'Activity' }));
    return [...sections, ...plans];
  };

  const start = new Date(month.getFullYear(), month.getMonth(), 1);
  const gridStart = new Date(start);
  gridStart.setDate(1 - start.getDay());
  const cellCount = Math.ceil((start.getDay() + new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()) / 7) * 7;
  const days = Array.from({ length: cellCount }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(date.getDate() + index);
    return date;
  });
  const unscheduled = [
    ...stops.filter(s => !s.arrival_date && !s.departure_date).map(s => ({ key: `stop-${s.id}`, title: s.section_title })),
    ...activities.filter(a => !a.planned_date).map(a => ({ key: `activity-${a.id}`, title: a.custom_name || a.activity_name || 'Activity' })),
  ];
  const selectedEntries = entriesFor(selectedDay);
  const changeMonth = offset => setMonth(new Date(month.getFullYear(), month.getMonth() + offset, 1));

  return (
    <section style={{ padding: "20px", borderRadius: "24px" }} className="glass border border-amber-900/10" aria-label="Itinerary calendar">
      <div style={{ marginBottom: "16px" }} className="flex items-center justify-between gap-2">
        <h2 className="font-bold text-lg sm:text-xl text-amber-950 flex items-center gap-2">
          <Calendar size={20} className="shrink-0" />{month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-1">
          <button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month" className="p-2 rounded-xl text-amber-700 hover:bg-amber-100"><ChevronLeft size={20} /></button>
          <button type="button" onClick={() => changeMonth(1)} aria-label="Next month" className="p-2 rounded-xl text-amber-700 hover:bg-amber-100"><ChevronRight size={20} /></button>
        </div>
      </div>
      <p style={{ marginBottom: "16px" }} className="text-xs text-amber-900/60">Sections span arrival through departure. Activities appear on their planned dates. Select a day to see its plan.</p>
      {loading && <p role="status" className="flex gap-2 items-center text-sm text-amber-700 mb-3"><Loader2 size={16} className="animate-spin" />Loading activities...</p>}
      {error && <p role="alert" className="text-sm text-red-600 mb-3">Activities could not be loaded. Sections are still shown. <button onClick={() => setRetry(r => r + 1)} className="underline">Retry</button></p>}
      <div className="overflow-x-auto">
        <div>
          <div style={{ marginBottom: "8px" }} className="grid grid-cols-7 text-center text-[10px] sm:text-xs font-semibold text-amber-900/60">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
          </div>
          <div style={{ gap: "4px" }} className="grid grid-cols-7">
            {days.map(date => {
              const key = keyFor(date);
              const entries = entriesFor(key);
              const inMonth = date.getMonth() === month.getMonth();
              return (
                <button key={key} type="button" onClick={() => setSelectedDay(key)} aria-pressed={selectedDay === key}
                  aria-label={`${date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}, ${entries.length} planned items`}
                  data-date={key}
                  style={{ padding: "4px", minWidth: 0 }}
                  className={`min-h-24 sm:min-h-28 p-1.5 sm:p-2 rounded-xl border text-left flex flex-col gap-1 focus-visible:outline-2 focus-visible:outline-amber-700 ${selectedDay === key ? 'border-amber-600 bg-amber-100/80' : 'border-amber-900/10 hover:bg-amber-50'} ${inMonth ? 'text-amber-950' : 'text-amber-900/40 bg-white/20'}`}>
                  <span className="text-xs font-bold">{date.getDate()}</span>
                  {entries.slice(0, 2).map(entry => <span key={entry.key} title={entry.title} className={`hidden sm:block w-full truncate rounded px-1 py-0.5 text-xs ${entry.type === 'Activity' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>{entry.title}</span>)}
                  {entries.length > 0 && <span className="sm:hidden self-center rounded-full bg-amber-100 text-[10px] font-semibold text-amber-700" title={`${entries.length} planned items`}>{entries.length}</span>}
                  {entries.length > 2 && <span className="hidden sm:block text-[10px] text-amber-700">+{entries.length - 2} more</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ marginTop: "20px", paddingTop: "16px" }} className="border-t border-amber-900/10">
        <div style={{ marginBottom: "12px" }} className="flex flex-wrap justify-between items-center gap-3">
          <h3 className="font-semibold text-amber-950">{localDate(selectedDay).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</h3>
          {onAddDate && <button onClick={() => onAddDate(selectedDay)} className="flex items-center gap-1 text-sm text-amber-700 font-semibold hover:underline"><Plus size={16} />Add section for this day</button>}
        </div>
        {!selectedEntries.length && <p className="text-sm text-amber-900/60">No plan for this day yet.</p>}
        <div className="space-y-2">
          {selectedEntries.map(entry => <div key={entry.key} style={{ padding: "12px", marginTop: "8px" }} className="rounded-xl bg-white/40 text-sm">
            <div className="flex flex-wrap gap-2 items-center"><span className="text-xs text-amber-700">{entry.type}</span><span className="font-semibold text-amber-950">{entry.title}</span>{entry.time && <span className="flex items-center gap-1 text-amber-700"><Clock size={12} />{entry.time}</span>}</div>
            {entry.detail && <p className="text-amber-900/60 mt-1">{entry.detail}</p>}
          </div>)}
        </div>
      </div>
      {unscheduled.length > 0 && <div style={{ marginTop: "16px" }} className="text-sm text-amber-900/60"><h3 className="font-semibold text-amber-950 mb-1">No date set</h3><ul style={{ paddingLeft: "20px" }} className="list-disc">{unscheduled.map(entry => <li key={entry.key}>{entry.title}</li>)}</ul></div>}
    </section>
  );
}
