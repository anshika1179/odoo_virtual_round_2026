import { Link } from 'react-router-dom';
import { Globe, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white/60 backdrop-blur-lg border-t border-amber-200/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <img src="/images/logo.png" alt="Traveloop" className="w-8 h-8 rounded-lg" />
            <span className="text-xl brand-font gradient-text">Traveloop</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-amber-600">
            <Link to="/" className="hover:text-amber-900 transition-colors">Home</Link>
            <Link to="/trips" className="hover:text-amber-900 transition-colors">Trips</Link>
            <Link to="/community" className="hover:text-amber-900 transition-colors">Community</Link>
            <Link to="/search/cities" className="hover:text-amber-900 transition-colors">Explore</Link>
          </div>

          {/* Copyright */}
          <p className="text-xs text-amber-500 flex items-center gap-1">
            Made with <Heart size={12} className="text-red-400 fill-red-400" /> © {new Date().getFullYear()} Traveloop
          </p>
        </div>
      </div>
    </footer>
  );
}
