import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Plus, Loader2, Check, X, MapPin } from 'lucide-react';
import { getTrips, getStops, addActivity } from '../../services/api';

export default function AddToTripModal({ activity, onClose }) {
  const [trips, setTrips] = useState(null);
  const [tripId, setTripId] = useState('');
  const [stops, setStops] = useState([]);
  const [stopId, setStopId] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getTrips()
      .then(r => setTrips(r.data))
      .catch(() => { setTrips([]); setError('Could not load your trips. Please log in again.'); });
  }, []);

  useEffect(() => {
    setStops([]);
    setStopId('');
    if (tripId) {
      getStops(tripId).then(r => setStops(r.data)).catch(() => setStops([]));
    }
  }, [tripId]);

  const confirm = async () => {
    if (!stopId) return;
    setSaving(true);
    setError('');
    try {
      await addActivity(stopId, { activity_id: activity.id });
      setDone(true);
      setTimeout(onClose, 1600);
    } catch {
      setError('Could not add activity. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-amber-950/30 backdrop-blur-sm" style={{ padding: '24px' }} onClick={onClose}>
      <div className="glass w-full max-w-md shadow-xl animate-fadeInUp" style={{ borderRadius: '24px', padding: '28px', border: '1px solid rgba(120,90,60,0.08)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4" style={{ marginBottom: '20px' }}>
          <div>
            <h3 className="text-lg font-bold text-amber-950">Add to Trip</h3>
            <p className="text-sm text-amber-900/60 mt-1">{activity.name}{activity.city_name ? ` - ${activity.city_name}` : ''}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-amber-900/40 hover:text-amber-950 hover:bg-amber-900/5 transition-colors shrink-0" title="Close">
            <X size={18} />
          </button>
        </div>

        {done ? (
          <p role="status" className="flex items-center gap-2 text-sm font-semibold text-emerald-700"><Check size={16} /> Added to your trip. You can see it in the itinerary builder.</p>
        ) : trips === null ? (
          <p role="status" className="text-sm text-amber-700 flex items-center gap-2"><Loader2 size={14} className="animate-spin" />Loading your trips...</p>
        ) : trips.length === 0 ? (
          <p className="text-sm text-amber-900/70">
            No trips yet. <Link to="/trips/new" className="font-semibold text-amber-700 hover:underline">Create a trip</Link> first, then add this activity to it.
          </p>
        ) : (
          <>
            <label className="block text-sm font-semibold text-amber-950 mb-2">Trip</label>
            <select className="sort-select w-full" value={tripId} onChange={e => setTripId(e.target.value)}>
              <option value="">Choose a trip...</option>
              {trips.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>

            {tripId && (
              <>
                <label className="block text-sm font-semibold text-amber-950 mb-2 mt-4">Section</label>
                {stops.length === 0 ? (
                  <p className="text-sm text-amber-900/60">This trip has no sections yet. Add a section in the itinerary builder first.</p>
                ) : (
                  <select className="sort-select w-full" value={stopId} onChange={e => setStopId(e.target.value)}>
                    <option value="">Choose a section...</option>
                    {stops.map(s => <option key={s.id} value={s.id}>{s.section_title}{s.city_name ? ` (${s.city_name})` : ''}</option>)}
                  </select>
                )}
              </>
            )}

            {error && <p role="alert" className="text-sm text-red-600 mt-3">{error}</p>}

            <button
              onClick={confirm}
              disabled={!stopId || saving}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-5 disabled:opacity-50"
              style={{ height: '48px', borderRadius: '14px', fontSize: '15px' }}
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Add activity
            </button>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
