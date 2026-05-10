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
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-700/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl" style={{animation: 'float 4s ease-in-out infinite'}} />
          <div className="absolute top-40 right-1/3 w-64 h-64 bg-yellow-600/10 rounded-full blur-3xl" style={{animation: 'float 5s ease-in-out infinite'}} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left — Text Content */}
            <div className="animate-fadeInUp">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-700/10 border border-amber-700/20 text-amber-800 text-sm font-medium mb-6">
                <Sparkles size={16} /> Your Journey Starts Here
              </div>
              <h1 className="text-5xl sm:text-7xl font-black leading-tight mb-6">
                <span className="gradient-text">Plan, Explore</span>
                <br />
                <span className="text-white">& Travel</span>
                <br />
                <span className="text-amber-700">Together</span>
              </h1>
              <p className="text-xl text-amber-700 mb-8 max-w-xl">
                Build itineraries, track budgets, share experiences — all in one beautiful platform designed for modern travelers.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1 max-w-md">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600" />
                  <input className="input-glass pl-12 py-4 text-lg" placeholder="Where do you want to go?"
                    value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <Link to="/trips/new" className="btn-primary py-4 px-8 text-lg">
                  <Plane size={20} /> Plan a Trip
                </Link>
              </div>

              <div className="flex items-center gap-8 text-amber-600 text-sm">
                <div className="flex items-center gap-2"><Globe size={16} className="text-amber-700" /> 50+ Cities</div>
                <div className="flex items-center gap-2"><MapPin size={16} className="text-orange-600" /> 75+ Activities</div>
                <div className="flex items-center gap-2"><TrendingUp size={16} className="text-yellow-600" /> Budget Tracking</div>
              </div>
            </div>

            {/* Right — Hero Visual */}
            <div className="hidden md:flex justify-center items-center animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              <div className="relative w-full max-w-md">
                {/* Floating Cards */}
                <div className="absolute -top-4 -left-4 glass rounded-2xl p-4 animate-float z-10 shadow-xl" style={{animationDelay: '0s'}}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center">
                      <Plane size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-amber-900 font-semibold text-sm">Trip to Paris</p>
                      <p className="text-amber-600 text-xs">5 days • $2,400</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 glass rounded-2xl p-4 animate-float z-10 shadow-xl" style={{animationDelay: '1s'}}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                      <DollarSign size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-amber-900 font-semibold text-sm">Budget: On Track</p>
                      <p className="text-green-400 text-xs">$1,200 remaining</p>
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/2 -right-8 glass rounded-2xl p-3 animate-float z-10 shadow-xl" style={{animationDelay: '0.5s'}}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <CheckSquare size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-amber-900 text-xs font-medium">Packed 12/15</p>
                      <div className="w-20 h-1.5 rounded-full bg-amber-200 mt-1">
                        <div className="w-4/5 h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center Globe/Map Visual */}
                <div className="glass rounded-3xl p-8 border border-amber-700/20">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-amber-700/10 via-orange-600/5 to-yellow-600/10 flex items-center justify-center relative overflow-hidden">
                    {/* Animated rings */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 rounded-full border border-amber-700/20 absolute" style={{animation: 'pulse-glow 3s ease-in-out infinite'}} />
                      <div className="w-32 h-32 rounded-full border border-orange-600/30 absolute" style={{animation: 'pulse-glow 3s ease-in-out infinite 1s'}} />
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center absolute shadow-xl shadow-amber-700/30">
                        <Globe size={32} className="text-white" />
                      </div>
                    </div>
                    {/* Route dots */}
                    <div className="absolute top-8 left-12 w-3 h-3 rounded-full bg-amber-600 animate-float" style={{animationDelay: '0s'}} />
                    <div className="absolute top-16 right-10 w-2 h-2 rounded-full bg-orange-600 animate-float" style={{animationDelay: '0.3s'}} />
                    <div className="absolute bottom-12 left-8 w-2.5 h-2.5 rounded-full bg-yellow-600 animate-float" style={{animationDelay: '0.6s'}} />
                    <div className="absolute bottom-8 right-16 w-2 h-2 rounded-full bg-green-400 animate-float" style={{animationDelay: '0.9s'}} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-amber-900 mb-3">Everything You Need to Travel Smart</h2>
          <p className="text-amber-700 max-w-2xl mx-auto">Traveloop brings together all the tools modern travelers need — from planning to budgeting to sharing.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="glass rounded-2xl p-6 glass-hover group animate-fadeInUp" style={{animationDelay: `${i * 0.1}s`}}>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="text-amber-900 font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-amber-700 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Regional Selections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-amber-900">Top Destinations</h2>
            <p className="text-amber-700 mt-1">Popular places loved by travelers worldwide</p>
          </div>
          <Link to="/search/cities" className="btn-secondary text-sm">
            View All <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {cities.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase())).slice(0, 12).map((city, i) => (
            <Link to={`/search/cities`} key={city.id}
              className="trip-card group cursor-pointer" style={{animationDelay: `${i * 0.05}s`}}>
              <div className="aspect-[4/3] relative overflow-hidden">
                <img src={city.image_url} alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => { e.target.src = `https://via.placeholder.com/400x300/1e293b/6366f1?text=${city.name}`; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
                <div className="absolute bottom-3 left-3">
                  <h3 className="text-amber-900 font-semibold text-sm">{city.name}</h3>
                  <p className="text-amber-700 text-xs">{city.country}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Previous Trips */}
      {prevTrips.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-3xl font-bold text-amber-900 mb-2">Previous Trips</h2>
          <p className="text-amber-700 mb-8">Revisit your past adventures</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {prevTrips.map(trip => (
              <Link to={`/trips/${trip.id}/view`} key={trip.id} className="trip-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={16} className="text-amber-700" />
                  <span className="text-xs text-amber-600">{new Date(trip.start_date).toLocaleDateString()}</span>
                </div>
                <h3 className="text-amber-900 font-semibold mb-1">{trip.title}</h3>
                <p className="text-amber-700 text-sm line-clamp-2">{trip.description || 'No description'}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="badge badge-completed">Completed</span>
                  <span className="text-amber-700 text-xs font-medium">View →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 mb-8">
        <div className="glass rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-700/5 to-orange-600/5" />
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-amber-900 mb-4">Ready to Plan Your Next Trip?</h2>
            <p className="text-amber-700 text-lg mb-8 max-w-md mx-auto">Create detailed itineraries, manage budgets, and share your adventures with the community.</p>
            <Link to="/trips/new" className="btn-primary text-lg py-4 px-10">
              <Plane size={22} /> Start Planning Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
