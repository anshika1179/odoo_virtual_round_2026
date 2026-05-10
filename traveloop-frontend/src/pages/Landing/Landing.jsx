import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPopularCities, getTrips } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Search, MapPin, Plane, Calendar, TrendingUp, ChevronRight, Globe, Sparkles } from 'lucide-react';

export default function Landing() {
  const { user } = useAuth();
  const [cities, setCities] = useState([]);
  const [prevTrips, setPrevTrips] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getPopularCities().then(r => setCities(r.data)).catch(() => {});
    if (user) getTrips({ status: 'COMPLETED' }).then(r => setPrevTrips(r.data.slice(0, 4))).catch(() => {});
  }, [user]);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl" style={{animation: 'float 4s ease-in-out infinite'}} />
          <div className="absolute top-40 right-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" style={{animation: 'float 5s ease-in-out infinite'}} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10">
          <div className="max-w-3xl animate-fadeInUp">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6">
              <Sparkles size={16} /> Your Journey Starts Here
            </div>
            <h1 className="text-5xl sm:text-7xl font-black leading-tight mb-6">
              <span className="gradient-text">Plan, Explore</span>
              <br />
              <span className="text-white">& Travel</span>
              <br />
              <span className="text-slate-400">Together</span>
            </h1>
            <p className="text-xl text-slate-400 mb-8 max-w-xl">
              Build itineraries, track budgets, share experiences — all in one beautiful platform designed for modern travelers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1 max-w-md">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input className="input-glass pl-12 py-4 text-lg" placeholder="Where do you want to go?"
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Link to="/trips/new" className="btn-primary py-4 px-8 text-lg">
                <Plane size={20} /> Plan a Trip
              </Link>
            </div>

            <div className="flex items-center gap-8 text-slate-500 text-sm">
              <div className="flex items-center gap-2"><Globe size={16} className="text-indigo-400" /> 50+ Cities</div>
              <div className="flex items-center gap-2"><MapPin size={16} className="text-purple-400" /> 75+ Activities</div>
              <div className="flex items-center gap-2"><TrendingUp size={16} className="text-amber-400" /> Budget Tracking</div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Regional Selections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Top Destinations</h2>
            <p className="text-slate-400 mt-1">Popular places loved by travelers worldwide</p>
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
                  <h3 className="text-white font-semibold text-sm">{city.name}</h3>
                  <p className="text-slate-300 text-xs">{city.country}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Previous Trips */}
      {prevTrips.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-3xl font-bold text-white mb-2">Previous Trips</h2>
          <p className="text-slate-400 mb-8">Revisit your past adventures</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {prevTrips.map(trip => (
              <Link to={`/trips/${trip.id}/view`} key={trip.id} className="trip-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={16} className="text-indigo-400" />
                  <span className="text-xs text-slate-400">{new Date(trip.start_date).toLocaleDateString()}</span>
                </div>
                <h3 className="text-white font-semibold mb-1">{trip.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-2">{trip.description || 'No description'}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="badge badge-completed">Completed</span>
                  <span className="text-indigo-400 text-xs font-medium">View →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 mb-8">
        <div className="glass rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Plan Your Next Trip?</h2>
            <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">Create detailed itineraries, manage budgets, and share your adventures with the community.</p>
            <Link to="/trips/new" className="btn-primary text-lg py-4 px-10">
              <Plane size={22} /> Start Planning Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
