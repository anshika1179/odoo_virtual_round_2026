import { useState, useEffect } from 'react';
import { searchCities, searchActivities } from '../../services/api';
import { Search, MapPin, Filter, DollarSign, Clock, Star, Globe } from 'lucide-react';

export default function CitySearch() {
  const [mode, setMode] = useState('cities');
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [filters, setFilters] = useState({ country: '', region: '', type: '', max_cost: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (mode === 'cities') {
      searchCities({ q: query, country: filters.country, region: filters.region })
        .then(r => setCities(r.data)).catch(() => {}).finally(() => setLoading(false));
    } else {
      searchActivities({ q: query, type: filters.type, max_cost: filters.max_cost || undefined })
        .then(r => setActivities(r.data)).catch(() => {}).finally(() => setLoading(false));
    }
  }, [query, mode, filters]);

  const regions = ['Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania', 'Middle East', 'Caribbean'];
  const actTypes = ['SIGHTSEEING', 'FOOD', 'ADVENTURE', 'CULTURE', 'SHOPPING', 'NIGHTLIFE', 'NATURE', 'WELLNESS'];

  return (
    <div className="pt-20 pb-12 max-w-6xl mx-auto px-4">
      <div className="animate-fadeInUp">
        <h1 className="text-3xl font-bold text-white mb-2">Explore</h1>
        <p className="text-slate-400 mb-8">Discover cities and activities for your next trip</p>

        {/* Mode Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setMode('cities')}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${mode === 'cities' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Globe size={16} className="inline mr-2" />Cities
          </button>
          <button onClick={() => setMode('activities')}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${mode === 'activities' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Star size={16} className="inline mr-2" />Activities
          </button>
        </div>

        {/* Search + Filters */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input className="input-glass pl-10" placeholder={mode === 'cities' ? 'Search cities...' : 'Search activities...'}
                value={query} onChange={e => setQuery(e.target.value)} />
            </div>
            {mode === 'cities' ? (
              <select className="input-glass max-w-[200px]" value={filters.region} onChange={e => setFilters({...filters, region: e.target.value})}>
                <option value="">All Regions</option>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            ) : (
              <>
                <select className="input-glass max-w-[180px]" value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})}>
                  <option value="">All Types</option>
                  {actTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <input type="number" className="input-glass max-w-[150px]" placeholder="Max cost $"
                  value={filters.max_cost} onChange={e => setFilters({...filters, max_cost: e.target.value})} />
              </>
            )}
          </div>
        </div>

        {/* Results */}
        {mode === 'cities' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city, i) => (
              <div key={city.id} className="trip-card animate-fadeInUp" style={{animationDelay: `${i * 0.05}s`}}>
                <div className="h-44 relative overflow-hidden">
                  <img src={city.image_url} alt={city.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    onError={e => { e.target.src = `https://via.placeholder.com/400x300/1e293b/6366f1?text=${city.name}`; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-white font-bold text-lg">{city.name}</h3>
                    <p className="text-slate-300 text-sm">{city.country} • {city.region}</p>
                  </div>
                  <div className="absolute top-3 right-3 badge badge-upcoming">Score: {city.popularity_score}</div>
                </div>
                <div className="p-4">
                  <p className="text-slate-400 text-sm line-clamp-2 mb-3">{city.description}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1"><DollarSign size={12} /> Cost Index: {city.cost_index}x</span>
                    <span className="flex items-center gap-1"><Star size={12} className="text-amber-400" /> Popular</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((act, i) => (
              <div key={act.id} className="glass rounded-xl p-5 glass-hover flex items-center gap-4 animate-fadeInUp" style={{animationDelay: `${i * 0.03}s`}}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center shrink-0">
                  <Star size={20} className="text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold">{act.name}</h3>
                  <p className="text-slate-400 text-sm">{act.description}</p>
                  <div className="flex gap-4 mt-1 text-xs text-slate-500">
                    {act.city_name && <span className="flex items-center gap-1"><MapPin size={12} /> {act.city_name}</span>}
                    <span className="flex items-center gap-1"><Clock size={12} /> {act.duration_hours}h</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="badge badge-ongoing">{act.type}</span>
                  <p className="text-green-400 font-semibold mt-2">${act.estimated_cost}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && ((mode === 'cities' && cities.length === 0) || (mode === 'activities' && activities.length === 0)) && (
          <div className="text-center py-16 text-slate-500">No results found. Try adjusting your search or filters.</div>
        )}
      </div>
    </div>
  );
}
