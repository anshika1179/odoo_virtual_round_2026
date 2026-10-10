import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Loader2, MapPin, Clock, X } from 'lucide-react';
import { getStopActivities, addActivity, removeActivity, searchActivities } from '../../services/api';
import useCurrency from '../../utils/useCurrency';

export default function StopActivities({ stop }) {
  const money = useCurrency();
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [thisCityOnly, setThisCityOnly] = useState(true);
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    getStopActivities(stop.id).then(r => setItems(r.data)).catch(() => {});
  }, [stop.id]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!open) return;
    setSearching(true);
    const t = setTimeout(() => {
      const params = { q: query };
      if (thisCityOnly && stop.city_id) params.city_id = stop.city_id;
      searchActivities(params)
        .then(r => setResults(r.data))
        .catch(() => setResults([]))
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(t);
  }, [query, open, thisCityOnly, stop.city_id]);

  const add = async (activity) => {
    setBusy(activity.id);
    setError('');
    try {
      await addActivity(stop.id, { activity_id: activity.id });
      setResults(results.filter(r => r.id !== activity.id));
      load();
    } catch {
      setError('Could not add activity. Please try again.');
    } finally {
      setBusy(0);
    }
  };

  const remove = async (id) => {
    setBusy(id);
    setError('');
    try {
      await removeActivity(id);
      setItems(items.filter(i => i.id !== id));
    } catch {
      setError('Could not remove activity. Please try again.');
    } finally {
      setBusy(0);
    }
  };

  const existingIds = new Set(items.map(i => i.activity_id));
  const visible = results.filter(r => !existingIds.has(r.id));

  return (
    <div className="mt-5 pt-4 border-t border-amber-900/10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-amber-950">Activities {items.length > 0 && <span className="text-amber-900/50 font-medium">({items.length})</span>}</h4>
        <button
          onClick={() => { setOpen(!open); setError(''); }}
          className="flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-900 transition-colors"
        >
          {open ? <X size={15} /> : <Plus size={15} />} {open ? 'Close' : 'Add Activity'}
        </button>
      </div>

      {items.length > 0 && (
        <ul className="mt-3 space-y-2">
          {items.map(a => (
            <li key={a.id} className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-white/40 border border-amber-900/10">
              <span className="text-sm font-medium text-amber-950 truncate">{a.activity_name || a.custom_name}</span>
              <button
                onClick={() => remove(a.id)}
                disabled={busy === a.id}
                className="p-1.5 rounded-lg text-amber-900/40 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                title="Remove activity"
              >
                {busy === a.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p role="alert" className="text-sm text-red-600 mt-2">{error}</p>}

      {open && (
        <div className="mt-3 rounded-2xl bg-white/40 border border-amber-900/10" style={{ padding: '14px' }}>
          <input
            className="input-glass w-full outline-none transition-colors"
            placeholder="Search activities..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ height: '44px', borderRadius: '12px', padding: '0 16px', border: '1px solid rgba(120,90,60,0.12)', fontSize: '14px' }}
          />
          {stop.city_id && (
            <button
              onClick={() => setThisCityOnly(!thisCityOnly)}
              className="mt-2 text-xs font-semibold text-amber-700 hover:underline"
            >
              {thisCityOnly ? `Showing only ${stop.city_name || 'this city'} - search all cities` : 'Showing all cities - back to this city only'}
            </button>
          )}
          <div className="mt-2" style={{ maxHeight: '220px', overflowY: 'auto' }}>
            {searching ? (
              <p role="status" className="text-sm text-amber-700 flex items-center gap-2 py-2"><Loader2 size={14} className="animate-spin" />Searching...</p>
            ) : visible.length === 0 ? (
              <p className="text-sm text-amber-900/50 py-2">No activities found{thisCityOnly && stop.city_id ? ` for ${stop.city_name || 'this city'}` : ''}.</p>
            ) : (
              visible.slice(0, 8).map(a => (
                <div key={a.id} className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-900/5 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-amber-950 truncate">{a.name}</p>
                    <p className="text-xs text-amber-900/60 flex flex-wrap items-center gap-3 mt-0.5">
                      {a.city_name && <span className="flex items-center gap-1"><MapPin size={11} />{a.city_name}</span>}
                      {a.duration_hours != null && <span className="flex items-center gap-1"><Clock size={11} />{a.duration_hours}h</span>}
                      <span>{money.fmt(a.estimated_cost)}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => add(a)}
                    disabled={busy === a.id}
                    className="flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-900 px-3 py-1.5 rounded-lg bg-amber-900/5 hover:bg-amber-900/10 transition-colors shrink-0"
                  >
                    {busy === a.id ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />} Add
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
