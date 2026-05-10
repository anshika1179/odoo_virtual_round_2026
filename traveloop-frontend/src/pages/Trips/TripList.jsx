import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTrips, deleteTrip } from '../../services/api';
import { Search, Plus, Calendar, DollarSign, MapPin, Plane, Globe, Trash2, Edit, AlertTriangle } from 'lucide-react';
import { CardSkeleton } from '../../components/common/Skeletons';

export default function TripList() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadTrips = () => {
    const params = {};
    if (filter) params.status = filter;
    if (search) params.search = search;
    getTrips(params).then(r => { 
      const enrichedTrips = r.data.map((t, i) => ({
        ...t,
        price: t.total_budget || Math.floor(Math.random() * 2000) + 500,
        rating: t.rating || parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
        popularity: t.popularity || 100 - i
      }));
      setTrips(enrichedTrips); 
      setLoading(false); 
    }).catch(() => setLoading(false));
  };

  useEffect(() => { loadTrips(); }, [filter, search]);

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      await deleteTrip(deleteModal.id);
      setDeleteModal(null);
      loadTrips();
    } catch (e) {
      console.error('Delete failed', e);
    } finally {
      setDeleting(false);
    }
  };

  const sortedTrips = [...trips].sort((a, b) => {
    switch(sortBy) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "rating-high": return b.rating - a.rating;
      case "rating-low": return a.rating - b.rating;
      case "popular": return b.popularity - a.popularity;
      default: return 0;
    }
  });

  const tabs = [
    { key: '', label: 'All' },
    { key: 'ONGOING', label: 'Ongoing' },
    { key: 'UPCOMING', label: 'Upcoming' },
    { key: 'COMPLETED', label: 'Completed' },
  ];

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-amber-950 font-bold" style={{ fontSize: '36px' }}>My Trips</h1>
        <p className="text-amber-900/70 mt-1">Manage all your travel plans</p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between" style={{ marginBottom: '72px' }}>
        <div className="relative shrink-0 flex items-center justify-start" style={{ width: '380px' }}>
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-900/40" />
          <input className="input-glass outline-none transition-colors w-full" placeholder="Search trips..." value={search} onChange={e => setSearch(e.target.value)} 
            style={{ height: '56px', borderRadius: '18px', padding: '0 20px 0 44px', border: '1px solid rgba(120,90,60,0.12)', fontSize: '15px' }} />
        </div>
        
        <div className="flex items-center justify-center flex-1" style={{ gap: '8px' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setFilter(t.key)}
              className={`px-5 py-3 rounded-2xl text-sm font-medium transition-all ${filter === t.key ? 'bg-amber-900/10 text-amber-950' : 'text-amber-900/60 hover:text-amber-950 hover:bg-amber-900/5'}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-end shrink-0" style={{ width: '380px' }}>
          <Link to="/trips/new" className="btn-primary flex items-center justify-center gap-2" style={{ height: '56px', padding: '0 28px', borderRadius: '18px', fontSize: '16px', fontWeight: 600 }}>
            <Plus size={18} /> New Trip
          </Link>
        </div>
      </div>

      {loading ? (
        <CardSkeleton count={6} />
      ) : trips.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center animate-fadeInUp" style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '120px' }}>
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-amber-100 to-orange-50 flex items-center justify-center mb-8 shadow-sm border border-amber-900/5">
            <Globe size={48} className="text-amber-700/50" />
          </div>
          <h3 className="text-amber-950 font-bold" style={{ fontSize: '28px', marginBottom: '16px' }}>Your adventure awaits</h3>
          <p className="text-amber-900/70" style={{ fontSize: '16px', lineHeight: 1.6, marginBottom: '8px' }}>You haven't planned any trips yet. Start by exploring popular destinations like Paris, Tokyo, or Bali.</p>
          <p className="text-amber-900/50 text-sm mb-8">Build itineraries, track budgets, and pack smarter.</p>
          <Link to="/trips/new" className="btn-primary flex items-center gap-2" style={{ height: '56px', padding: '0 32px', borderRadius: '18px', fontSize: '16px', fontWeight: 600 }}>
            <Plane size={18} /> Plan Your First Trip
          </Link>
        </div>
      ) : (
        <>
          <div className="filters-bar animate-fadeInUp">
            <div className="text-amber-950 font-bold text-lg">{sortedTrips.length} Trips</div>
            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="">Sort By</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating-high">Rating: High to Low</option>
              <option value="rating-low">Rating: Low to High</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '32px' }}>
            {sortedTrips.map((trip, i) => (
              <div key={trip.id} className="glass group hover:-translate-y-1 hover:shadow-soft transition-all duration-300 animate-fadeInUp relative" 
                    style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(120,90,60,0.08)', animationDelay: `${i * 0.05}s` }}>
                
                {/* Edit & Delete overlay buttons */}
                <div className="absolute top-4 left-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => navigate(`/trips/${trip.id}/builder`)}
                    className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm text-amber-700 hover:text-amber-950 hover:bg-white flex items-center justify-center shadow-sm border border-amber-900/10 transition-all"
                    title="Edit Trip"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => setDeleteModal(trip)}
                    className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center justify-center shadow-sm border border-red-200/50 transition-all"
                    title="Delete Trip"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <Link to={`/trips/${trip.id}/view`} className="block">
                  <div className="h-48 relative overflow-hidden">
                    {trip.cover_photo_url ? <img src={trip.cover_photo_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" /> : (
                      <div className="flex items-center justify-center h-full bg-amber-50/50"><MapPin size={40} className="text-amber-900/20" /></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${trip.status === 'ONGOING' ? 'bg-amber-100 text-amber-800' : trip.status === 'UPCOMING' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>
                        {trip.status}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '24px' }}>
                    <h3 className="text-amber-950 font-bold text-lg mb-2">{trip.title}</h3>
                    <p className="text-amber-900/60 text-sm line-clamp-2 mb-4 leading-relaxed">{trip.description || 'No description provided.'}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-amber-900/10">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-amber-900/70"><Calendar size={14} /> {new Date(trip.start_date).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5 text-xs font-bold text-amber-900"><DollarSign size={14} /> ${trip.price}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeInUp" onClick={() => setDeleteModal(null)}>
          <div className="glass shadow-soft w-full max-w-sm mx-4" style={{ borderRadius: '32px', padding: '40px', border: '1px solid rgba(120,90,60,0.08)' }} onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
                <AlertTriangle size={32} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-amber-950 mb-2">Delete Trip?</h3>
              <p className="text-amber-900/60 text-sm mb-8">
                Are you sure you want to delete "<strong>{deleteModal.title}</strong>"? This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button onClick={() => setDeleteModal(null)} className="btn-secondary flex-1" style={{ height: '48px', borderRadius: '14px', fontWeight: 600 }}>
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={deleting} className="flex-1 flex items-center justify-center gap-2 text-white font-semibold" 
                  style={{ height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #ef4444, #dc2626)', border: 'none', cursor: 'pointer' }}>
                  {deleting ? '...' : <><Trash2 size={18} /> Delete</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
