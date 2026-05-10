import { Link } from 'react-router-dom';
import { Globe, ExternalLink, Heart, Plane, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-indigo-500/10">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Globe size={22} className="text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Traveloop</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              Plan, explore & travel together. Your all-in-one travel companion for building itineraries, tracking budgets, and sharing experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Explore</h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home', icon: <Plane size={14} /> },
                { to: '/trips', label: 'My Trips', icon: <MapPin size={14} /> },
                { to: '/community', label: 'Community', icon: <Heart size={14} /> },
                { to: '/search/cities', label: 'Discover Cities', icon: <Globe size={14} /> },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-slate-400 hover:text-indigo-400 text-sm transition-colors flex items-center gap-2">
                    {link.icon} {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Features</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>✈️ Smart Trip Planning</li>
              <li>📊 Budget Tracking</li>
              <li>🎒 Packing Checklists</li>
              <li>📝 Trip Journals</li>
              <li>🌍 50+ Cities Database</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Connect</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://github.com/anshika1179/odoo_virtual_round_2026" target="_blank" rel="noreferrer"
                  className="text-slate-400 hover:text-indigo-400 text-sm transition-colors flex items-center gap-2">
                  <ExternalLink size={14} /> GitHub Repository
                </a>
              </li>
              <li>
                <a href="mailto:admin@traveloop.com"
                  className="text-slate-400 hover:text-indigo-400 text-sm transition-colors flex items-center gap-2">
                  <Mail size={14} /> admin@traveloop.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Traveloop. Built for Odoo Virtual Hackathon 2026.
          </p>
          <p className="text-slate-600 text-sm flex items-center gap-1">
            Made with <Heart size={12} className="text-red-400 fill-red-400" /> by Team Traveloop
          </p>
        </div>
      </div>
    </footer>
  );
}
