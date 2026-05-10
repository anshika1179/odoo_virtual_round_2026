import { Link } from 'react-router-dom';
import { Globe, Heart, Plane, MapPin, Users, DollarSign } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto" style={{ marginTop: '80px' }}>
      {/* Top gradient divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-900/15 to-transparent"></div>
      
      <div 
        className="bg-white/40 backdrop-blur-xl"
        style={{ padding: '64px 0 40px 0' }}
      >
        <div className="container">
          {/* Brand + Links Row */}
          <div className="flex flex-col items-center gap-8 mb-10">
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/images/logo.png" alt="Traveloop" className="w-12 h-12 rounded-2xl shadow-md group-hover:shadow-lg transition-shadow" />
              <span className="brand-font text-amber-950" style={{ fontSize: '36px', fontWeight: 700 }}>Traveloop.</span>
            </Link>
            
            <p className="text-amber-900/50 text-center max-w-md font-medium" style={{ fontSize: '15px', lineHeight: 1.8 }}>
              Your premium travel companion for planning stunning itineraries, tracking budgets, and exploring the world.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {[
              { icon: <Plane size={14} />, label: 'Smart Itineraries' },
              { icon: <DollarSign size={14} />, label: 'Budget Tracking' },
              { icon: <MapPin size={14} />, label: 'City Explorer' },
              { icon: <Users size={14} />, label: 'Community Hub' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full border border-amber-900/8 text-amber-900/60 text-xs font-semibold">
                <span className="text-amber-600">{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>

          {/* Nav Links */}
          <div className="flex items-center justify-center flex-wrap gap-8 mb-10">
            {[
              { to: '/', label: 'Home' },
              { to: '/trips', label: 'Trips' },
              { to: '/community', label: 'Community' },
              { to: '/search/cities', label: 'Explore' },
            ].map((link, i) => (
              <Link
                key={i}
                to={link.to}
                className="text-amber-900/60 hover:text-amber-950 font-semibold text-sm transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-orange-500 rounded-full group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full max-w-lg mx-auto h-px bg-gradient-to-r from-transparent via-amber-900/10 to-transparent mb-8"></div>

          {/* Hackathon Credits */}
          <div className="text-center">
            <p className="text-amber-950 font-bold" style={{ fontSize: '15px' }}>
              Made with <Heart size={14} className="inline text-red-500 fill-red-500 mx-1" style={{ verticalAlign: '-2px' }} /> for Odoo × Parul University Virtual Round
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
              {['ANSHIKA', 'KHUSHI PATEL', 'ATUL UPADHYAY', 'SATYAM KUMAR SINGH'].map((name, i) => (
                <span key={i} className="bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-xs font-bold border border-amber-200/50">
                  {name}
                </span>
              ))}
            </div>
            <p className="text-amber-900/30 text-xs mt-6 font-medium">© 2026 Traveloop. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
