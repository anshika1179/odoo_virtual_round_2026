import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPopularCities, getTrips } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Search, MapPin, Plane, Calendar, TrendingUp, ChevronRight, Globe, Sparkles, IndianRupee, CheckSquare, Users, StickyNote, Map, Star } from 'lucide-react';
import WorldMap from '../../components/maps/WorldMap';

export default function Landing() {
  const { user } = useAuth();
  const [cities, setCities] = useState([]);
  const [prevTrips, setPrevTrips] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const goSearch = (e) => { e.preventDefault(); navigate('/search/cities'); };

  const steps = [
    { icon: <Map size={26} />, title: 'Discover', desc: 'Find destinations based on your interests.' },
    { icon: <Users size={26} />, title: 'Connect', desc: 'Meet travelers going your way.' },
    { icon: <Calendar size={26} />, title: 'Plan', desc: 'Build your itinerary together.' },
  ];

  useEffect(() => {
    getPopularCities().then(r => setCities(r.data)).catch(() => {});
    if (user) getTrips({ status: 'COMPLETED' }).then(r => setPrevTrips(r.data.slice(0, 4))).catch(() => {});
  }, [user]);

  const features = [
    { icon: <Plane size={24} />, title: 'Smart Itineraries', desc: 'Build day-by-day travel plans with city search and drag & drop stops.', color: 'from-amber-700 to-amber-900' },
    { icon: <IndianRupee size={24} />, title: 'Budget Tracking', desc: 'Track expenses by category with visual charts and invoice exports.', color: 'from-emerald-500 to-green-600' },
    { icon: <CheckSquare size={24} />, title: 'Packing Checklists', desc: 'Category-based packing lists with progress tracking. Never forget essentials.', color: 'from-orange-600 to-yellow-600' },
    { icon: <Users size={24} />, title: 'Community Hub', desc: 'Share travel stories, get inspired, and connect with fellow travelers.', color: 'from-amber-600 to-orange-700' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden flex items-center" style={{ minHeight: '88vh', paddingTop: '110px', paddingBottom: '90px' }}>
        <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600" alt="Mountains at sunset"
             className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-amber-950/60" />

        {/* Top-right motto */}
        <div className="absolute hidden md:flex flex-col items-end text-white/90 font-serif italic" style={{ top: '110px', right: '48px', fontSize: '19px', lineHeight: 1.5 }}>
          <span>Explore · Plan</span>
          <span className="flex items-center gap-2">Connect · Repeat <Plane size={18} /></span>
        </div>

        <div className="container relative z-10">
          <div className="animate-fadeInUp" style={{ maxWidth: '760px' }}>
            <h1 className="text-white" style={{ fontSize: '64px', lineHeight: 1.08, fontWeight: 700, marginBottom: '20px' }}>
              <span className="font-serif italic" style={{ fontWeight: 400, color: '#fcd9a8' }}>Travel farther.</span><br />
              Connect deeper.
            </h1>
            <p className="text-white/85" style={{ fontSize: '19px', lineHeight: 1.7, marginBottom: '36px', maxWidth: '560px' }}>
              Discover places, meet fellow travelers, and build trips worth remembering.
            </p>

            {/* Search pill */}
            <form onSubmit={goSearch} className="flex items-center bg-white shadow-xl" style={{ borderRadius: '999px', padding: '8px', maxWidth: '620px', gap: '8px' }}>
              <Search size={20} className="text-amber-900/40 shrink-0" style={{ marginLeft: '14px' }} />
              <input className="flex-1 outline-none bg-transparent text-amber-950" placeholder="Where do you want to go?"
                style={{ fontSize: '16px', minWidth: 0 }}
                value={search} onChange={e => setSearch(e.target.value)} />
              <button type="submit" className="btn-primary shrink-0" style={{ height: '48px', padding: '0 28px', borderRadius: '999px', fontSize: '15px' }}>Search</button>
            </form>

            {!user && (
              <div className="flex flex-wrap items-center" style={{ gap: '14px', marginTop: '26px' }}>
                <Link to="/register" className="btn-primary" style={{ height: '46px', padding: '0 26px', borderRadius: '999px', fontSize: '15px', display: 'inline-flex', alignItems: 'center' }}>Get started free</Link>
                <Link to="/login" className="text-white font-semibold" style={{ fontSize: '15px', padding: '0 10px', textDecoration: 'underline', textUnderlineOffset: '4px' }}>Log in</Link>
              </div>
            )}

            {/* Stats */}
            <div className="flex flex-wrap items-center text-white" style={{ gap: '44px', marginTop: '44px' }}>
              <div className="flex items-center gap-3">
                <Users size={24} className="text-amber-300" />
                <div><p className="font-bold" style={{ fontSize: '22px', lineHeight: 1.2 }}>10K+</p><p className="text-white/70 text-sm">Travelers</p></div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={24} className="text-amber-300" />
                <div><p className="font-bold" style={{ fontSize: '22px', lineHeight: 1.2 }}>100+</p><p className="text-white/70 text-sm">Destinations</p></div>
              </div>
              <div className="flex items-center gap-3">
                <Star size={24} className="text-amber-300" />
                <div><p className="font-bold" style={{ fontSize: '22px', lineHeight: 1.2 }}>4.9/5</p><p className="text-white/70 text-sm">Experiences</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Moving places strip */}
      {cities.length > 0 && (
        <section style={{ paddingTop: '64px', paddingBottom: '8px' }}>
          <div className="overflow-hidden">
            <div className="marquee-track">
              {[...cities, ...cities].map((city, i) => (
                <Link to="/search/cities" key={city.id + '-' + i} className="relative rounded-3xl overflow-hidden shrink-0 shadow-sm block"
                      style={{ width: '280px', height: '180px' }}>
                  <img src={city.image_url} alt={city.name} className="w-full h-full object-cover"
                       onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-white font-bold" style={{ fontSize: '18px' }}>{city.name}</h3>
                    <p className="text-white/80 text-xs font-medium">{city.country}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
                onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} />
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
              <img src={city.image_url} alt={city.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white font-semibold text-sm">{city.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How Traveloop Works */}
      <section className="container" style={{ marginTop: '120px' }}>
        <div className="text-center" style={{ marginBottom: '12px' }}>
          <p className="text-amber-700 font-bold uppercase" style={{ fontSize: '13px', letterSpacing: '0.15em' }}>How Traveloop Works</p>
          <h2 className="text-amber-950 font-bold" style={{ fontSize: '36px', marginTop: '10px' }}>Your trip. Your people. Your loop.</h2>
        </div>

        {/* Dotted path with flying plane */}
        <div className="hidden md:block" style={{ marginBottom: '-6px' }}>
          <svg viewBox="0 0 1000 170" className="w-full" style={{ height: '170px' }}>
            <path id="loopPath" d="M 80 130 C 260 30, 420 140, 520 80 C 620 20, 760 120, 920 40"
                  fill="none" stroke="rgba(180,120,60,0.45)" strokeWidth="2.5" strokeDasharray="2 10" strokeLinecap="round" />
            <g>
              <animateMotion dur="8s" repeatCount="indefinite" rotate="auto">
                <mpath href="#loopPath" />
              </animateMotion>
              <path transform="translate(-12,-12) scale(1.4)" fill="#b45309"
                d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
            </g>
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '28px' }}>
          {steps.map((step, i) => (
            <div key={i} className="glass text-center animate-fadeInUp" style={{ borderRadius: '28px', padding: '36px 28px', border: '1px solid rgba(120,90,60,0.08)', animationDelay: `${i * 0.1}s` }}>
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shadow-sm" style={{ margin: '0 auto 18px' }}>
                {step.icon}
              </div>
              <h3 className="text-amber-950 font-bold" style={{ fontSize: '22px' }}>{step.title}</h3>
              <p className="text-amber-900/60" style={{ fontSize: '15px', lineHeight: 1.7, marginTop: '8px' }}>{step.desc}</p>
            </div>
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
