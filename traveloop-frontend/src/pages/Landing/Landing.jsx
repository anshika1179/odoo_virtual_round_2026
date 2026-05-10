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
      <section className="relative min-h-[85vh] flex items-center pt-20 pb-16 overflow-hidden">
        {/* Minimalist Background Gradients instead of noisy blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-gradient-to-br from-amber-100/40 via-orange-50/20 to-transparent rounded-full blur-3xl opacity-60" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-gradient-to-tr from-orange-100/30 via-yellow-50/10 to-transparent rounded-full blur-3xl opacity-50" />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left — Text Content (5 cols) */}
            <div className="lg:col-span-5 animate-fadeInUp">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-900/5 text-amber-950 text-xs font-semibold tracking-wide uppercase mb-6 shadow-sm border border-amber-900/10">
                <Sparkles size={14} className="text-amber-600" /> Premium Travel Planner
              </div>
              
              <h1 className="text-5xl md:text-[4rem] lg:text-[4.5rem] font-bold tracking-tight leading-[1.1] text-amber-950 mb-6">
                Travel <span className="text-amber-700 font-serif italic font-normal">beautifully.</span>
                <br />
                Plan simply.
              </h1>
              
              <p className="text-lg md:text-xl text-amber-900/70 mb-10 max-w-lg leading-relaxed font-light">
                Curate stunning itineraries, manage your budgets, and explore the world with an elegant platform designed for modern wanderers.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <div className="relative flex-1">
                  <Search size={20} strokeWidth={1.5} className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-900/40" />
                  <input className="input-glass pl-14 py-4 text-base shadow-soft" placeholder="Search destinations..."
                    value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <Link to="/trips/new" className="btn-primary py-4 px-8 text-base shadow-soft shrink-0">
                  <Plane size={18} strokeWidth={1.5} /> Start Planning
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-amber-900/60 text-sm font-medium">
                <div className="flex items-center gap-2"><Globe size={16} strokeWidth={1.5} /> 105+ Cities</div>
                <div className="flex items-center gap-2"><MapPin size={16} strokeWidth={1.5} /> Expert Guides</div>
                <div className="flex items-center gap-2"><TrendingUp size={16} strokeWidth={1.5} /> Smart Budgets</div>
              </div>
            </div>

            {/* Right — Hero Visual (7 cols) */}
            <div className="hidden lg:flex lg:col-span-7 justify-end animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              <div className="relative w-full max-w-2xl">
                {/* Single Elegant Glass Card */}
                <div className="glass rounded-[2rem] p-6 shadow-soft border border-white/60 bg-white/40 backdrop-blur-2xl relative overflow-hidden">
                  
                  {/* Card Header */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-900/5 flex items-center justify-center text-amber-900">
                        <MapPin size={20} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-amber-950 font-semibold text-lg leading-tight">Amalfi Coast Escape</h3>
                        <p className="text-amber-900/60 text-sm">7 Days • Italy</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200/50">
                        <CheckSquare size={12} /> On Track
                      </div>
                      <p className="text-amber-950 font-bold mt-1 text-sm">$3,200 / $4,000</p>
                    </div>
                  </div>

                  {/* Visual Image Area */}
                  <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden relative group">
                    <img src="https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=800" alt="Amalfi Coast" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />
                    
                    {/* Floating mini stats inside image */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <div className="flex gap-2">
                        <div className="bg-white/20 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm">
                          <Calendar size={12} /> Jun 12 - Jun 19
                        </div>
                      </div>
                      <div className="flex -space-x-2">
                        <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://i.pravatar.cc/100?img=1" alt="Traveler" />
                        <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://i.pravatar.cc/100?img=2" alt="Traveler" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Accents */}
                <div className="absolute -z-10 top-1/2 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-amber-900 mb-3">Everything You Need to Travel Smart</h2>
          <p className="text-amber-700 max-w-2xl mx-auto text-sm md:text-base">Traveloop brings together all the tools modern travelers need — from planning to budgeting to sharing.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((f, i) => (
            <div key={i} className="glass rounded-2xl p-4 md:p-6 glass-hover group animate-fadeInUp" style={{animationDelay: `${i * 0.1}s`}}>
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-3 md:mb-4 group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="text-amber-900 font-semibold text-base md:text-lg mb-2">{f.title}</h3>
              <p className="text-amber-700 text-xs md:text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Regional Selections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
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
