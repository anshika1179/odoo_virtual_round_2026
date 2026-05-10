import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTrip, searchCities } from '../../services/api';
import { Calendar, MapPin, DollarSign, Plane, Loader2, Sparkles, Image } from 'lucide-react';

export default function CreateTrip() {
  const [form, setForm] = useState({ title: '', description: '', start_date: '', end_date: '', total_budget: '', cover_photo_url: '' });
  const [cities, setCities] = useState([]);
  const [citySearch, setCitySearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (citySearch.length > 1) {
      searchCities({ q: citySearch }).then(r => setCities(r.data)).catch(() => {});
    }
  }, [citySearch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.start_date || !form.end_date) { setError('Please fill required fields'); return; }
    setLoading(true);
    try {
      const res = await createTrip({
        ...form,
        start_date: new Date(form.start_date).toISOString(),
        end_date: new Date(form.end_date).toISOString(),
        total_budget: parseFloat(form.total_budget) || 0,
      });
      navigate(`/trips/${res.data.id}/builder`);
    } catch (err) { setError(err.response?.data?.detail || 'Failed to create trip'); }
    finally { setLoading(false); }
  };

  const set = (key) => (e) => setForm({...form, [key]: e.target.value});

  const suggestions = [
    { name: 'Paris', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200', desc: 'City of Light' },
    { name: 'Tokyo', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=200', desc: 'Modern & Traditional' },
    { name: 'Bali', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=200', desc: 'Tropical Paradise' },
    { name: 'New York', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=200', desc: 'The Big Apple' },
    { name: 'Dubai', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=200', desc: 'Future City' },
    { name: 'Rome', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=200', desc: 'Eternal City' },
  ];

  return (
    <div className="page-container">
      <div className="animate-fadeInUp">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center">
            <Plane size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-amber-900">Plan a New Trip</h1>
            <p className="text-amber-700">Fill in the details and start building your itinerary</p>
          </div>
        </div>

        <div className="trip-layout">
          <div className="trip-form">
            <div className="glass rounded-2xl p-8">
              {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-amber-800 mb-2">Trip Title *</label>
                  <input className="input-glass" placeholder="e.g., European Summer Adventure" value={form.title} onChange={set('title')} required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-800 mb-2">Description</label>
                  <textarea className="input-glass" rows={3} placeholder="What's this trip about?" value={form.description} onChange={set('description')} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-800 mb-2">Search a Place</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600" />
                    <input className="input-glass pl-10" placeholder="Search cities..." value={citySearch} onChange={e => setCitySearch(e.target.value)} />
                  </div>
                  {cities.length > 0 && citySearch && (
                    <div className="mt-2 glass rounded-xl p-2 max-h-40 overflow-y-auto">
                      {cities.slice(0, 5).map(c => (
                        <button key={c.id} type="button" onClick={() => { setForm({...form, title: form.title || `Trip to ${c.name}`}); setCitySearch(''); setCities([]); }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-amber-800 flex items-center gap-2">
                          <MapPin size={14} className="text-amber-700" /> {c.name}, {c.country}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2"><Calendar size={14} className="inline mr-1" />Start Date *</label>
                    <input type="date" className="input-glass" value={form.start_date} onChange={set('start_date')} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2"><Calendar size={14} className="inline mr-1" />End Date *</label>
                    <input type="date" className="input-glass" value={form.end_date} onChange={set('end_date')} required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-800 mb-2"><DollarSign size={14} className="inline mr-1" />Total Budget (USD)</label>
                  <input type="number" className="input-glass" placeholder="5000" value={form.total_budget} onChange={set('total_budget')} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-800 mb-2"><Image size={14} className="inline mr-1" />Cover Photo URL</label>
                  <input className="input-glass" placeholder="https://images.unsplash.com/..." value={form.cover_photo_url} onChange={set('cover_photo_url')} />
                  {form.cover_photo_url && (
                    <img src={form.cover_photo_url} alt="Cover preview" className="mt-2 w-full h-32 object-cover rounded-xl border border-amber-200"
                      onError={e => { e.target.style.display = 'none'; }} />
                  )}
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <><Plane size={20} /> Create & Build Itinerary</>}
                </button>
              </form>
            </div>
          </div>

          {/* Suggestion Cards */}
          <div className="trip-suggestions">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-amber-400" />
              <h3 className="text-lg font-semibold text-amber-900">Suggestions</h3>
            </div>
            <div className="space-y-3">
              {suggestions.map(s => (
                <button key={s.name} onClick={() => setForm({...form, title: `Trip to ${s.name}`})}
                  className="trip-card w-full flex items-center gap-3 p-3 text-left">
                  <img src={s.img} alt={s.name} className="w-14 h-14 rounded-lg object-cover" />
                  <div>
                    <h4 className="text-amber-900 font-medium text-sm">{s.name}</h4>
                    <p className="text-amber-700 text-xs">{s.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
