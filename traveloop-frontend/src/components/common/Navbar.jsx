import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Globe, LogOut, User, Menu, X, Home, Map, Users, Search, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const navLinks = [
    { to: '/', label: 'Home', icon: <Home size={18} /> },
    { to: '/trips', label: 'My Trips', icon: <Map size={18} /> },
    { to: '/community', label: 'Community', icon: <Users size={18} /> },
    { to: '/search/cities', label: 'Explore', icon: <Search size={18} /> },
  ];

  if (user?.is_admin) {
    navLinks.push({ to: '/admin', label: 'Admin', icon: <LayoutDashboard size={18} /> });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-indigo-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Globe size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Traveloop</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {user && navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`nav-link flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${isActive(link.to) ? 'active bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                {link.icon} {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-all">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <span className="text-sm text-slate-300">{user.full_name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn-secondary text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 text-slate-400" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-indigo-500/10 animate-fadeInUp">
          <div className="px-4 py-3 space-y-1">
            {user && navLinks.map(link => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                  ${isActive(link.to) ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:text-white'}`}>
                {link.icon} {link.label}
              </Link>
            ))}
            {user && (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-slate-400 hover:text-white">
                  <User size={18} /> Profile
                </Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 w-full text-left">
                  <LogOut size={18} /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
