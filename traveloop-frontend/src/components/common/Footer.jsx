import { Link } from 'react-router-dom';
import { Globe, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto">
      {/* CTA Section */}
      <div className="mx-auto px-4 sm:px-6" style={{ maxWidth: '1440px', paddingBottom: '80px' }}>
        <div className="mx-auto flex flex-col items-center justify-center text-center glass shadow-soft relative overflow-hidden" 
             style={{ maxWidth: '1200px', padding: '64px', borderRadius: '32px', border: '1px solid rgba(120,90,60,0.08)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-100/50 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-orange-50/50 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
          
          <h2 className="text-amber-950 font-bold relative z-10" style={{ fontSize: '40px', marginBottom: '24px', letterSpacing: '-0.02em' }}>
            Ready to explore the world?
          </h2>
          <p className="text-amber-900/70 text-lg max-w-lg mb-8 relative z-10">
            Join thousands of travelers curating their dream itineraries, tracking budgets, and sharing experiences.
          </p>
          <Link to="/register" className="btn-primary relative z-10" style={{ height: '56px', padding: '0 40px', borderRadius: '18px', fontSize: '18px', fontWeight: 600, marginTop: '24px' }}>
            Get Started Free
          </Link>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-white/60 backdrop-blur-lg border-t border-amber-900/10">
        <div className="mx-auto" style={{ maxWidth: '1440px', padding: '40px 64px' }}>
          <div className="flex flex-col items-center justify-center gap-8">
            {/* Brand */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <img src="/images/logo.png" alt="Traveloop" className="w-8 h-8 rounded-lg" />
                <span className="text-2xl font-bold text-amber-950">Traveloop</span>
              </div>
              <p className="text-amber-900/50 text-sm">Design your ultimate travel experience.</p>
            </div>

            {/* Links */}
            <div className="flex items-center justify-center flex-wrap gap-8 text-sm font-medium text-amber-900/70">
              <Link to="/" className="hover:text-amber-950 transition-colors">Home</Link>
              <Link to="/trips" className="hover:text-amber-950 transition-colors">Trips</Link>
              <Link to="/community" className="hover:text-amber-950 transition-colors">Community</Link>
              <Link to="/search/cities" className="hover:text-amber-950 transition-colors">Explore</Link>
            </div>

            {/* Copyright */}
            <div className="w-full h-px bg-amber-900/10 max-w-md mx-auto" />
            <p className="text-sm font-medium text-amber-900/50 flex items-center gap-1.5">
              Made with <Heart size={14} className="text-red-400 fill-red-400" /> © {new Date().getFullYear()} Traveloop
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
