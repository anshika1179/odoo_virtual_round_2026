import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTrip, createStop, updateStop, deleteStop, searchCities } from '../../services/api';
import { Plus, Trash2, GripVertical, MapPin, Calendar, DollarSign, Save, Loader2, ArrowRight } from 'lucide-react';

export default function ItineraryBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [cityResults, setCityResults] = useState([]);
  const [newStop, setNewStop] = useState({ section_title: '', description: '', arrival_date: '', departure_date: '', section_budget: '', city_id: null });

  useEffect(() => {
    getTrip(id).then(r => { setTrip(r.data); setStops(r.data.stops || []); setLoading(false); })
      .catch(() => { navigate('/trips'); });
  }, [id]);

  useEffect(() => {
    if (citySearch.length > 1) searchCities({ q: citySearch }).then(r => setCityResults(r.data)).catch(() => {});
    else setCityResults([]);
  }, [citySearch]);

  const addSection = async () => {
    if (!newStop.section_title) return;
    setSaving(true);
    try {
      const res = await createStop(id, {
        ...newStop,
        arrival_date: newStop.arrival_date ? new Date(newStop.arrival_date).toISOString() : null,
        departure_date: newStop.departure_date ? new Date(newStop.departure_date).toISOString() : null,
        section_budget: parseFloat(newStop.section_budget) || 0,
      });
      setStops([...stops, res.data]);
      setNewStop({ section_title: '', description: '', arrival_date: '', departure_date: '', section_budget: '', city_id: null });
      setCitySearch('');
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const removeStop = async (stopId) => {
    try {
      await deleteStop(stopId);
      setStops(stops.filter(s => s.id !== stopId));
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="pt-20 flex justify-center"><Loader2 size={32} className="animate-spin text-amber-700" /></div>;

  return (
    <div className="pt-20 pb-12 max-w-4xl mx-auto px-4">
      <div className="animate-fadeInUp">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-amber-900">Build Itinerary</h1>
            <p className="text-amber-700">{trip?.title}</p>
          </div>
          <button onClick={() => navigate(`/trips/${id}/view`)} className="btn-primary">
            View Itinerary <ArrowRight size={18} />
          </button>
        </div>

        {/* Existing Sections */}
        <div className="space-y-4 mb-8">
          {stops.map((stop, idx) => (
            <div key={stop.id} className="glass rounded-2xl p-6 glass-hover animate-fadeInUp" style={{animationDelay: `${idx * 0.1}s`}}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-700 to-amber-900 text-amber-900 font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="text-amber-900 font-semibold text-lg">{stop.section_title}</h3>
                    {stop.city_name && <p className="text-amber-700 text-sm flex items-center gap-1"><MapPin size={14} />{stop.city_name}</p>}
                  </div>
                </div>
                <button onClick={() => removeStop(stop.id)} className="p-2 rounded-lg text-amber-700 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <Trash2 size={18} />
                </button>
              </div>

              {stop.description && <p className="text-amber-700 text-sm mt-3 ml-13">{stop.description}</p>}

              <div className="flex flex-wrap gap-4 mt-4 ml-13">
                {stop.arrival_date && (
                  <span className="text-xs text-amber-700 flex items-center gap-1">
                    <Calendar size={12} className="text-amber-700" /> {new Date(stop.arrival_date).toLocaleDateString()} - {stop.departure_date ? new Date(stop.departure_date).toLocaleDateString() : '...'}
                  </span>
                )}
                {stop.section_budget > 0 && (
                  <span className="text-xs text-amber-700 flex items-center gap-1">
                    <DollarSign size={12} className="text-emerald-600" /> ${stop.section_budget}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add New Section */}
        <div className="glass rounded-2xl p-8 border-2 border-dashed border-amber-700/30">
          <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center gap-2">
            <Plus size={20} className="text-amber-700" /> Add Another Section
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-amber-800 mb-1.5">Section Title *</label>
                <input className="input-glass" placeholder="e.g., Day 1-3 in Paris"
                  value={newStop.section_title} onChange={e => setNewStop({...newStop, section_title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-amber-800 mb-1.5">City</label>
                <input className="input-glass" placeholder="Search city..." value={citySearch} onChange={e => setCitySearch(e.target.value)} />
                {cityResults.length > 0 && (
                  <div className="mt-1 glass rounded-lg p-1 max-h-32 overflow-y-auto">
                    {cityResults.slice(0, 4).map(c => (
                      <button key={c.id} onClick={() => { setNewStop({...newStop, city_id: c.id, section_title: newStop.section_title || c.name}); setCitySearch(c.name); setCityResults([]); }}
                        className="w-full text-left px-3 py-1.5 rounded text-sm text-amber-800 hover:bg-white/5">{c.name}, {c.country}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm text-amber-800 mb-1.5">Description</label>
              <textarea className="input-glass" rows={2} placeholder="What will you do here?"
                value={newStop.description} onChange={e => setNewStop({...newStop, description: e.target.value})} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-amber-800 mb-1.5">Arrival</label>
                <input type="date" className="input-glass" value={newStop.arrival_date} onChange={e => setNewStop({...newStop, arrival_date: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-amber-800 mb-1.5">Departure</label>
                <input type="date" className="input-glass" value={newStop.departure_date} onChange={e => setNewStop({...newStop, departure_date: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-amber-800 mb-1.5">Budget ($)</label>
                <input type="number" className="input-glass" placeholder="500" value={newStop.section_budget} onChange={e => setNewStop({...newStop, section_budget: e.target.value})} />
              </div>
            </div>

            <button onClick={addSection} disabled={saving || !newStop.section_title} className="btn-primary">
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />} Add Section
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
