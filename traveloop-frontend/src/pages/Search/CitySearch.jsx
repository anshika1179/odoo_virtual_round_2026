import { useState, useEffect } from 'react';
import { searchCities, searchActivities } from '../../services/api';
import { Search, MapPin, Filter, DollarSign, Clock, Star, Globe, Plus, Eye } from 'lucide-react';
import { CardSkeleton, RowSkeleton } from '../../components/common/Skeletons';
import { Link } from 'react-router-dom';

export default function CitySearch() {
  const [mode, setMode] = useState('cities');
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [filters, setFilters] = useState({ country: '', region: '', type: '', max_cost: '' });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    setLoading(true);
    if (mode === 'cities') {
      searchCities({ q: query, country: filters.country, region: filters.region })
        .then(r => setCities(r.data.map((c, i) => ({
          ...c,
          price: c.price || c.cost_index * 250 || Math.floor(Math.random() * 1000) + 500,
          rating: c.rating || c.popularity_score || 4.5,
          popularity: c.popularity || c.popularity_score * 10 || (100 - i)
        })))).catch(() => {}).finally(() => setLoading(false));
    } else {
      searchActivities({ q: query, type: filters.type, max_cost: filters.max_cost || undefined })
        .then(r => setActivities(r.data.map((a, i) => ({
          ...a,
          price: a.estimated_cost || 0,
          rating: a.rating || 4.5,
          popularity: a.popularity || 100 - i
        })))).catch(() => {}).finally(() => setLoading(false));
    }
  }, [query, mode, filters]);

  const regions = ['Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania', 'Middle East', 'Caribbean'];
  const actTypes = ['SIGHTSEEING', 'FOOD', 'ADVENTURE', 'CULTURE', 'SHOPPING', 'NIGHTLIFE', 'NATURE', 'WELLNESS'];

  const sortedCities = [...cities].sort((a, b) => {
    switch(sortBy) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "rating-high": return b.rating - a.rating;
      case "rating-low": return a.rating - b.rating;
      case "popular": return b.popularity - a.popularity;
      default: return 0;
    }
  });

  const sortedActivities = [...activities].sort((a, b) => {
    switch(sortBy) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "rating-high": return b.rating - a.rating;
      case "rating-low": return a.rating - b.rating;
      case "popular": return b.popularity - a.popularity;
      default: return 0;
    }
  });

  return (
    <div className="page-container">
      <div className="animate-fadeInUp">
        <h1 className="text-amber-950 font-bold" style={{ fontSize: '36px', marginBottom: '8px' }}>Explore</h1>
        <p className="text-amber-900/70" style={{ marginBottom: '32px' }}>Discover cities and activities for your next trip</p>

        {/* Mode Tabs */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => setMode('cities')}
            className={`px-6 py-3 rounded-2xl text-sm font-medium transition-all ${mode === 'cities' ? 'bg-amber-900/10 text-amber-950 shadow-sm border border-amber-900/10' : 'text-amber-900/60 hover:text-amber-950 hover:bg-amber-900/5'}`}>
            <Globe size={16} className="inline mr-2" />Cities
          </button>
          <button onClick={() => setMode('activities')}
            className={`px-6 py-3 rounded-2xl text-sm font-medium transition-all ${mode === 'activities' ? 'bg-amber-900/10 text-amber-950 shadow-sm border border-amber-900/10' : 'text-amber-900/60 hover:text-amber-950 hover:bg-amber-900/5'}`}>
            <Star size={16} className="inline mr-2" />Activities
          </button>
        </div>

        {/* Search + Filters */}
        <div className="glass shadow-soft" style={{ borderRadius: '24px', padding: '24px', marginBottom: '48px', border: '1px solid rgba(120,90,60,0.08)' }}>
          <div className="filters-container">
            <div className="search-wrapper">
              <Search className="search-icon" />
              <input type="text" placeholder={mode === 'cities' ? 'Search cities...' : 'Search activities...'}
                value={query} onChange={e => setQuery(e.target.value)} />
            </div>
            {mode === 'cities' ? (
              <select className="region-select" 
                      value={filters.region} onChange={e => setFilters({...filters, region: e.target.value})}>
                <option value="">All Regions</option>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            ) : (
              <>
                <select className="region-select" 
                        value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})}>
                  <option value="">All Types</option>
                  {actTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <input type="number" className="region-select" placeholder="Max cost $"
                  value={filters.max_cost} onChange={e => setFilters({...filters, max_cost: e.target.value})} />
              </>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          mode === 'cities' ? <CardSkeleton count={9} /> : <RowSkeleton count={6} />
        ) : (
          <>
            {((mode === 'cities' && cities.length > 0) || (mode === 'activities' && activities.length > 0)) && (
              <div className="filters-bar animate-fadeInUp">
                <div className="text-amber-950 font-bold text-lg">
                  {mode === 'cities' ? sortedCities.length + ' Destinations' : sortedActivities.length + ' Activities'} Found
                </div>
                <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="">Sort By</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating-high">Rating: High to Low</option>
                  <option value="rating-low">Rating: Low to High</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            )}
            
            {mode === 'cities' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '36px' }}>
                {sortedCities.map((city, i) => (
              <div key={city.id} className="glass group hover:-translate-y-1 hover:shadow-soft transition-all duration-300 animate-fadeInUp flex flex-col" 
                   style={{ borderRadius: '28px', overflow: 'hidden', border: '1px solid rgba(120,90,60,0.08)', animationDelay: `${i * 0.05}s` }}>
                <div className="relative overflow-hidden shrink-0" style={{ height: '240px' }}>
                  <img src={city.image_url} alt={city.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={e => { e.target.src = `https://via.placeholder.com/400x300/1e293b/6366f1?text=${city.name}`; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-80" />
                  <div className="absolute bottom-5 left-5">
                    <h3 className="text-white font-bold text-2xl drop-shadow-sm">{city.name}</h3>
                    <p className="text-white/80 font-medium text-sm drop-shadow-sm">{city.country}</p>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-amber-950/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <Link to="/trips/new" className="bg-white text-amber-950 px-6 py-3 rounded-xl font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl flex items-center gap-2 hover:bg-amber-50">
                      <Plus size={16} /> Plan a Trip Here
                    </Link>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between" style={{ padding: '24px' }}>
                  <p className="text-amber-900/60 text-sm line-clamp-3 mb-6 leading-relaxed">{city.description}</p>
                  <div className="flex items-center justify-between text-sm text-amber-900/80 pt-4 border-t border-amber-900/10 mt-auto">
                    <span className="flex items-center gap-1.5 font-medium"><DollarSign size={14} className="text-amber-600" /> Cost Index: {city.cost_index}x</span>
                    <span className="flex items-center gap-1.5 font-medium"><Star size={14} className="text-amber-500" /> Score: {city.popularity_score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedActivities.map((act, i) => (
              <div key={act.id} className="glass group hover:-translate-y-1 transition-all duration-300 animate-fadeInUp flex flex-col sm:flex-row items-start sm:items-center gap-6" 
                   style={{ padding: '28px', borderRadius: '24px', border: '1px solid rgba(120,90,60,0.08)', animationDelay: `${i * 0.03}s` }}>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-50 flex items-center justify-center shrink-0 border border-amber-900/5 group-hover:scale-105 transition-transform">
                  <Star size={24} className="text-amber-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-amber-950 font-bold text-lg mb-1">{act.name}</h3>
                  <p className="text-amber-900/60 text-sm leading-relaxed mb-3">{act.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-amber-900/80 font-medium">
                    {act.city_name && <span className="flex items-center gap-1.5"><MapPin size={14} className="text-amber-600" /> {act.city_name}</span>}
                    <span className="flex items-center gap-1.5"><Clock size={14} className="text-amber-600" /> {act.duration_hours}h</span>
                  </div>
                </div>
                <div className="text-left sm:text-right shrink-0 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-amber-900/10 w-full sm:w-auto">
                  <span className="px-3 py-1.5 rounded-full bg-amber-900/5 text-amber-900 text-xs font-bold uppercase tracking-wider">{act.type}</span>
                  <p className="text-amber-950 font-bold text-lg mt-3">${act.estimated_cost}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        </>
        )}

        {!loading && ((mode === 'cities' && cities.length === 0) || (mode === 'activities' && activities.length === 0)) && (
          <div className="text-center text-amber-900/50" style={{ padding: '80px 0' }}>No results found. Try adjusting your search or filters.</div>
        )}
      </div>
    </div>
  );
}
