import { Link } from 'react-router-dom';
import { Globe, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto bg-white/60 backdrop-blur-lg border-t border-amber-900/10">
      <div className="mx-auto flex flex-col items-center justify-center text-center" style={{ maxWidth: '1200px', paddingTop: '64px', paddingBottom: '48px' }}>
        
        {/* Brand */}
        <div className="flex flex-col items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Traveloop" className="w-10 h-10 rounded-xl" />
            <span className="brand-font text-amber-950" style={{ fontSize: '32px', fontWeight: 700 }}>Traveloop.</span>
          </Link>
        </div>

        {/* Links */}
        <div className="flex items-center justify-center" style={{ gap: '36px', marginTop: '28px' }}>
          <Link to="/" className="text-amber-900/70 hover:text-amber-950 font-medium text-sm transition-colors">Home</Link>
          <Link to="/trips" className="text-amber-900/70 hover:text-amber-950 font-medium text-sm transition-colors">Trips</Link>
          <Link to="/community" className="text-amber-900/70 hover:text-amber-950 font-medium text-sm transition-colors">Community</Link>
          <Link to="/search/cities" className="text-amber-900/70 hover:text-amber-950 font-medium text-sm transition-colors">Explore</Link>
        </div>

        {/* Divider */}
        <div className="bg-amber-950" style={{ width: '420px', height: '1px', opacity: 0.08, marginTop: '32px', marginBottom: '32px' }} />

        {/* Copyright */}
        <p className="flex items-center justify-center gap-1.5 text-amber-900/50 font-medium" style={{ fontSize: '13px' }}>
          Made with <Heart size={14} className="text-red-400 fill-red-400" /> © {new Date().getFullYear()} Traveloop
        </p>

      </div>
    </footer>
  );
}
