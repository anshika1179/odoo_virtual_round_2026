import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTrips } from '../../services/api';
import { Search, Plus, Calendar, DollarSign, MapPin, Filter, Plane, Globe } from 'lucide-react';
import { CardSkeleton } from '../../components/common/Skeletons';

export default function TripList() {
  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = {};
    if (filter) params.status = filter;
    if (search) params.search = search;
    getTrips(params).then(r => { setTrips(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [filter, search]);

  const tabs = [
    { key: '', label: 'All' },
    { key: 'ONGOING', label: 'Ongoing' },
    { key: 'UPCOMING', label: 'Upcoming' },
    { key: 'COMPLETED', label: 'Completed' },
  ];

  const badgeClass = (s) => s === 'ONGOING' ? 'badge-ongoing' : s === 'UPCOMING' ? 'badge-upcoming' : 'badge-completed';

  return (
    <div className="pt-20 pb-12 max-w-6xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">My Trips</h1>
          <p className="text-slate-400">Manage all your travel plans</p>
        </div>
        <Link to="/trips/new" className="btn-primary"><Plus size={18} /> New Trip</Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input className="input-glass pl-10" placeholder="Search trips..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setFilter(t.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === t.key ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <CardSkeleton count={6} />
      ) : trips.length === 0 ? (
        <div className="text-center py-20 animate-fadeInUp">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6">
            <Globe size={40} className="text-indigo-400/60" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Your adventure awaits!</h3>
          <p className="text-slate-400 mb-2 max-w-md mx-auto">You haven't planned any trips yet. Start by exploring popular destinations like Paris, Tokyo, or Bali.</p>
          <p className="text-slate-500 text-sm mb-6">Build itineraries, track budgets, and pack smarter.</p>
          <Link to="/trips/new" className="btn-primary text-lg py-3 px-8"><Plane size={20} /> Plan Your First Trip</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip, i) => (
            <Link to={`/trips/${trip.id}/view`} key={trip.id} className="trip-card animate-fadeInUp" style={{animationDelay: `${i * 0.05}s`}}>
              <div className="h-40 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 relative">
                {trip.cover_photo_url ? <img src={trip.cover_photo_url} className="w-full h-full object-cover" alt="" /> : (
                  <div className="flex items-center justify-center h-full"><MapPin size={40} className="text-indigo-400/30" /></div>
                )}
                <div className="absolute top-3 right-3"><span className={`badge ${badgeClass(trip.status)}`}>{trip.status}</span></div>
              </div>
              <div className="p-5">
                <h3 className="text-white font-semibold text-lg mb-1">{trip.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-3">{trip.description || 'No description'}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(trip.start_date).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><DollarSign size={12} /> ${trip.total_budget}</span>
                </div>
                <div className="mt-3 text-xs text-slate-500">{trip.stops?.length || 0} stops</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
