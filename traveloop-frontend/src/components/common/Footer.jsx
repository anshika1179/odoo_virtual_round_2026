import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto footer-wrapper bg-white/60 backdrop-blur-lg border-t border-amber-900/10">
      <div className="container footer-content">
        
        {/* Brand */}
        <div className="flex flex-col items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Traveloop" className="w-10 h-10 rounded-xl" />
            <span className="brand-font text-amber-950" style={{ fontSize: '32px', fontWeight: 700 }}>Traveloop.</span>
          </Link>
        </div>

        {/* Links */}
        <div className="footer-nav">
          <Link to="/" className="text-amber-900/70 hover:text-amber-950 font-medium text-sm transition-colors">Home</Link>
          <Link to="/trips" className="text-amber-900/70 hover:text-amber-950 font-medium text-sm transition-colors">Trips</Link>
          <Link to="/community" className="text-amber-900/70 hover:text-amber-950 font-medium text-sm transition-colors">Community</Link>
          <Link to="/search/cities" className="text-amber-900/70 hover:text-amber-950 font-medium text-sm transition-colors">Explore</Link>
        </div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Hackathon Credits */}
        <div className="footer-hackathon">
          <p className="footer-hackathon-title">Made for Odoo x Parul University Virtual Round</p>
          <div className="footer-team mt-1">
            Team Members: ANSHIKA • KHUSHI PATEL • ATUL UPADHYAY • SATYAM KUMAR SINGH
          </div>
        </div>

      </div>
    </footer>
  );
}
