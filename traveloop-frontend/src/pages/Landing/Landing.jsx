import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPopularCities, getTrips } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Search, MapPin, Plane, Calendar, TrendingUp, ChevronRight, Globe, Sparkles, DollarSign, CheckSquare, Users, StickyNote } from 'lucide-react';

export default function Landing() {
  const { user } = useAuth();
  const [cities, setCities] = useState([]);
  const [prevTrips, setPrevTrips] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getPopularCities().then(r => setCities(r.data)).catch(() => {});
    if (user) getTrips({ status: 'COMPLETED' }).then(r => setPrevTrips(r.data.slice(0, 4))).catch(() => {});
  }, [user]);

  const features = [
    { icon: <Plane size={24} />, title: 'Smart Itineraries', desc: 'Build day-by-day travel plans with city search and drag & drop stops.', color: 'from-amber-700 to-amber-900' },
    { icon: <DollarSign size={24} />, title: 'Budget Tracking', desc: 'Track expenses by category with visual charts and invoice exports.', color: 'from-emerald-500 to-green-600' },
    { icon: <CheckSquare size={24} />, title: 'Packing Checklists', desc: 'Category-based packing lists with progress tracking. Never forget essentials.', color: 'from-orange-600 to-yellow-600' },
    { icon: <Users size={24} />, title: 'Community Hub', desc: 'Share travel stories, get inspired, and connect with fellow travelers.', color: 'from-amber-600 to-orange-700' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden flex items-center justify-center" style={{ minHeight: '80vh', paddingTop: '80px', paddingBottom: '120px' }}>
        {/* Minimalist Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-gradient-to-br from-amber-100/40 via-orange-50/20 to-transparent rounded-full blur-3xl opacity-60" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-gradient-to-tr from-orange-100/30 via-yellow-50/10 to-transparent rounded-full blur-3xl opacity-50" />
        </div>

        <div className="mx-auto w-full relative z-10" style={{ maxWidth: '1440px', padding: '0 64px' }}>
          <div className="flex flex-col lg:flex-row items-center justify-between" style={{ gap: '80px' }}>
            
            {/* Left — Text Content */}
            <div className="flex flex-col justify-center animate-fadeInUp" style={{ width: '48%', maxWidth: '520px' }}>
              <h1 className="text-amber-950" style={{ fontSize: '72px', lineHeight: 1.1, fontWeight: 700, marginBottom: '32px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <span className="text-amber-700 font-serif italic" style={{ fontSize: '64px', fontWeight: 400 }}>Travel beautifully.</span>
                </div>
                Plan simply.
              </h1>
              
              <p className="text-amber-900" style={{ fontSize: '20px', lineHeight: 1.8, marginBottom: '40px', opacity: 0.85 }}>
                Curate stunning itineraries, manage your budgets, and explore the world with an elegant platform designed for modern wanderers.
              </p>

              <div className="flex items-center" style={{ gap: '18px', marginTop: '12px' }}>
                <div className="relative">
                  <Search size={20} strokeWidth={1.5} className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-900/40" />
                  <input className="input-glass outline-none transition-colors" placeholder="Search destinations..."
                    style={{ height: '58px', width: '360px', borderRadius: '18px', padding: '0 22px 0 52px', border: '1px solid rgba(120,90,60,0.12)', fontSize: '16px' }}
                    value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <Link to="/trips/new" className="btn-primary flex items-center justify-center shrink-0" 
                  style={{ height: '58px', padding: '0 32px', borderRadius: '18px', fontSize: '18px', fontWeight: 600, gap: '8px' }}>
                  <Plane size={18} strokeWidth={2} /> Start Planning
                </Link>
              </div>
            </div>

            {/* Right — Hero Visual */}
            <div className="hidden lg:flex justify-end items-center animate-fadeInUp" style={{ width: '52%', animationDelay: '0.2s' }}>
              <div className="relative group" 
                   style={{ width: '620px', height: '440px', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(80,50,20,0.12)', transform: 'translateY(0)', transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
                   onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 30px 70px rgba(80,50,20,0.18)'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(80,50,20,0.12)'; }}>
                
                <img src="https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=800" alt="Amalfi Coast" 
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

                {/* Card Header Overlay */}
                <div className="absolute top-0 left-0 w-full flex justify-between items-start" style={{ padding: '24px 28px' }}>
                  <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-white/50">
                    <h3 className="text-amber-950 font-bold text-lg">Amalfi Coast</h3>
                    <p className="text-amber-900/70 text-xs font-medium">Italy</p>
                  </div>
                  <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white/50 flex items-center gap-1.5">
                    <Calendar size={14} className="text-amber-700" />
                    <span className="text-amber-950 text-xs font-bold">7 Days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="mx-auto" style={{ maxWidth: '1440px', padding: '0 64px', marginTop: '140px' }}>
        <div className="text-left animate-fadeInUp" style={{ marginBottom: '48px' }}>
          <h2 className="text-amber-950 font-bold" style={{ fontSize: '32px' }}>Travel Smart</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
          {features.map((f, i) => (
            <div key={i} className="bg-white/60 backdrop-blur-xl border border-amber-900/5 group transition-all duration-300 animate-fadeInUp" 
                 style={{ padding: '32px', borderRadius: '28px', minHeight: '240px', boxShadow: '0 8px 30px rgba(120,90,60,0.06)', animationDelay: `${i * 0.15}s` }}
                 onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(120,90,60,0.12)'; }}
                 onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(120,90,60,0.06)'; }}>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-6 shadow-sm group-hover:-translate-y-1 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="text-amber-950 font-bold text-xl mb-3">{f.title}</h3>
              <p className="text-amber-900/70 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Regional Selections */}
      <section className="mx-auto" style={{ maxWidth: '1440px', padding: '0 64px', marginTop: '120px' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">

          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-amber-900">Top Destinations</h2>
            <p className="text-amber-700 mt-1 text-sm md:text-base">Popular places loved by travelers worldwide</p>
          </div>
          <Link to="/search/cities" className="btn-secondary text-sm">
            View All <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {cities.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase())).slice(0, 12).map((city, i) => (
            <Link to={`/search/cities`} key={city.id}
              className="trip-card group cursor-pointer" style={{animationDelay: `${i * 0.05}s`}}>
              <div className="aspect-[4/3] relative overflow-hidden">
                <img src={city.image_url} alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => { e.target.src = `https://via.placeholder.com/400x300/1e293b/6366f1?text=${city.name}`; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
                <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3">
                  <h3 className="text-amber-900 font-semibold text-xs md:text-sm">{city.name}</h3>
                  <p className="text-amber-700 text-xs">{city.country}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Previous Trips */}
      {prevTrips.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-amber-900 mb-2">Previous Trips</h2>
          <p className="text-amber-700 mb-6 md:mb-8 text-sm md:text-base">Revisit your past adventures</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {prevTrips.map(trip => (
              <Link to={`/trips/${trip.id}/view`} key={trip.id} className="trip-card p-4 md:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={14} className="text-amber-700" />
                  <span className="text-xs text-amber-600">{new Date(trip.start_date).toLocaleDateString()}</span>
                </div>
                <h3 className="text-amber-900 font-semibold mb-1 text-sm md:text-base">{trip.title}</h3>
                <p className="text-amber-700 text-xs md:text-sm line-clamp-2">{trip.description || 'No description'}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="badge badge-completed text-xs">Completed</span>
                  <span className="text-amber-700 text-xs font-medium">View →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 mb-6 md:mb-8">
        <div className="glass rounded-2xl md:rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-700/5 to-orange-600/5" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">Ready to Plan Your Next Trip?</h2>
            <p className="text-amber-700 text-base md:text-lg mb-6 md:mb-8 max-w-md mx-auto">Create detailed itineraries, manage budgets, and share your adventures with the community.</p>
            <Link to="/trips/new" className="btn-primary text-base md:text-lg py-3 md:py-4 px-8 md:px-10">
              <Plane size={18} /> Start Planning Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
