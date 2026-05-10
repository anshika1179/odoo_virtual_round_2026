import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPopularCities, getTrips } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Search, MapPin, Plane, Calendar, TrendingUp, ChevronRight, Globe, Sparkles, DollarSign, CheckSquare, Users, StickyNote, Map } from 'lucide-react';
import WorldMap from '../../components/maps/WorldMap';

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

        <div className="container relative z-10">
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
      <section className="container" style={{ paddingTop: '120px', paddingBottom: '120px' }}>
        <div className="hero-section animate-fadeInUp">
          <h2 className="text-amber-950 font-bold">Travel Smart</h2>
          <p className="text-amber-900/75">
            Build day-by-day itineraries, track your travel expenses, and manage your packing lists all in one beautiful place.
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="group transition-transform duration-400 animate-fadeInUp backdrop-blur-md flex flex-col justify-start" 
                 style={{ 
                   minHeight: '320px', 
                   borderRadius: '32px', 
                   padding: '32px', 
                   backgroundColor: 'rgba(255,255,255,0.58)', 
                   boxShadow: '0 12px 40px rgba(80,50,20,0.08)', 
                   gap: '18px',
                   animationDelay: `${i * 0.1}s` 
                 }}
                 onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; }}
                 onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>
              
              <div className={`w-[58px] h-[58px] rounded-[18px] bg-gradient-to-br ${f.color} flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-105`} style={{ marginBottom: '12px' }}>
                <div style={{ transform: 'scale(1.1)' }}>{f.icon}</div>
              </div>
              
              <h3 className="text-amber-950 font-bold" style={{ fontSize: '28px', lineHeight: 1.3 }}>{f.title}</h3>
              <p className="text-amber-900/75" style={{ fontSize: '17px', lineHeight: 1.8 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Regional Selections */}
      <section className="container" style={{ marginTop: '120px' }}>
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-amber-950 font-bold" style={{ fontSize: '36px' }}>Top Destinations</h2>
            <p className="text-amber-900/60 mt-2" style={{ fontSize: '16px' }}>Explore the world's most sought-after locations</p>
          </div>
          <Link to="/search/cities" className="text-amber-900/70 hover:text-amber-950 font-medium text-sm flex items-center gap-1 transition-colors">
            View All Destinations <ChevronRight size={16} />
          </Link>
        </div>

        <div className="hidden lg:grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '28px' }}>
          {cities.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase())).slice(0, 8).map((city, i) => (
            <Link to={`/search/cities`} key={city.id}
              className="group cursor-pointer rounded-3xl overflow-hidden relative shadow-sm" style={{ height: '260px', animationDelay: `${i * 0.05}s` }}>
              <img src={city.image_url} alt={city.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => { e.target.src = `https://via.placeholder.com/400x300/1e293b/6366f1?text=${city.name}`; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
              <div className="absolute bottom-6 left-6">
                <h3 className="text-white font-bold" style={{ fontSize: '20px', letterSpacing: '0.02em' }}>{city.name}</h3>
                <p className="text-white/80 font-medium text-sm mt-0.5">{city.country}</p>
              </div>
            </Link>
          ))}
        </div>
        {/* Mobile Fallback Grid */}
        <div className="grid lg:hidden grid-cols-2 sm:grid-cols-3 gap-4">
          {cities.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase())).slice(0, 6).map((city, i) => (
            <Link to={`/search/cities`} key={city.id} className="group cursor-pointer rounded-2xl overflow-hidden relative aspect-square shadow-sm">
              <img src={city.image_url} alt={city.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = `https://via.placeholder.com/400x300/1e293b/6366f1?text=${city.name}`; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white font-semibold text-sm">{city.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* World Map Interactive Section */}
      <section className="container" style={{ marginTop: '120px' }}>
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-amber-950 font-bold flex items-center gap-3" style={{ fontSize: '36px' }}>
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm shrink-0">
                <Map size={24} />
              </div>
              Explore The Map
            </h2>
            <p className="text-amber-900/60 mt-2" style={{ fontSize: '16px' }}>Interactive view of popular travel destinations around the world</p>
          </div>
        </div>
        <div style={{ height: '500px' }} className="animate-fadeInUp">
          <WorldMap popularCities={cities} />
        </div>
      </section>

      {/* Previous Trips */}
      {prevTrips.length > 0 && (
        <section className="container" style={{ marginTop: '120px', marginBottom: '40px' }}>
          <div className="glass shadow-soft relative overflow-hidden" style={{ borderRadius: '32px', border: '1px solid rgba(120,90,60,0.08)' }}>
            {/* Section gradient header */}
            <div className="h-2 w-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600 absolute top-0 left-0"></div>
            
            <div style={{ padding: '48px 40px' }}>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <h2 className="text-amber-950 font-bold flex items-center gap-3" style={{ fontSize: '32px' }}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center text-white shadow-md shrink-0">
                      <Globe size={20} />
                    </div>
                    Previous Trips
                  </h2>
                  <p className="text-amber-900/60 mt-2 font-medium" style={{ fontSize: '16px' }}>Revisit your past adventures</p>
                </div>
                <Link to="/trips" className="text-amber-900/70 hover:text-amber-950 font-semibold text-sm flex items-center gap-1 transition-colors">
                  View All <ChevronRight size={16} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {prevTrips.map((trip, i) => (
                  <Link to={`/trips/${trip.id}/view`} key={trip.id}
                    className="group glass rounded-2xl flex flex-col transition-all duration-300 hover:shadow-lg"
                    style={{ border: '1px solid rgba(120,90,60,0.08)', overflow: 'hidden', animationDelay: `${i * 0.1}s` }}>
                    
                    {/* Card top accent */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-green-500"></div>
                    
                    <div style={{ padding: '24px' }} className="flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                          <Calendar size={16} />
                        </div>
                        <span className="text-xs text-amber-900/60 font-semibold">
                          {new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      
                      <h3 className="text-amber-950 font-bold text-lg mb-2 leading-tight group-hover:text-amber-700 transition-colors">{trip.title}</h3>
                      <p className="text-amber-900/50 text-sm line-clamp-2 mb-5 flex-1">{trip.description || 'No description added'}</p>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-amber-900/5">
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide">Completed</span>
                        <span className="text-amber-700 text-sm font-semibold group-hover:text-amber-950 transition-colors flex items-center gap-1">
                          View <ChevronRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}


    </div>
  );
}
