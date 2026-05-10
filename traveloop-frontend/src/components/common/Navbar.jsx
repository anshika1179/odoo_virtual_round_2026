import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Menu, X, Home, Map, Users, Search, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: <Home size={16} /> },
    { to: '/trips', label: 'My Trips', icon: <Map size={16} /> },
    { to: '/search/cities', label: 'Explore', icon: <Search size={16} /> },
    { to: '/community', label: 'Community', icon: <Users size={16} /> },
  ];

  if (user?.is_admin) {
    navLinks.push({ to: '/admin', label: 'Admin', icon: <LayoutDashboard size={16} /> });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-amber-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-16">

          {/* Left — Logo + Brand */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <img src="/images/logo.png" alt="Traveloop" className="w-9 h-9 rounded-lg object-cover group-hover:scale-110 transition-transform" />
            <span className="text-2xl brand-font gradient-text hidden sm:inline">Traveloop</span>
          </Link>

          {/* Center — Nav Links (desktop) */}
          <div className="hidden md:flex items-center gap-1 mx-auto">
            {user && navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`nav-link flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${isActive(link.to)
                    ? 'active bg-amber-100 text-amber-900'
                    : 'text-amber-700 hover:text-amber-900 hover:bg-amber-50'}`}>
                {link.icon} {link.label}
              </Link>
            ))}
          </div>

          {/* Right — Profile / Auth */}
          <div className="hidden md:flex items-center gap-2 shrink-0 ml-auto">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-amber-50 transition-all">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shrink-0 ring-2 ring-amber-200">
                    {user.profile_photo_url ? (
                      <img
                        src={user.profile_photo_url}
                        alt={user.full_name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<span class="text-amber-900 text-sm font-bold">${user.full_name?.[0]?.toUpperCase() || '?'}</span>`; }}
                      />
                    ) : (
                      <User size={14} className="text-amber-900" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-amber-800">{user.full_name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="p-2 rounded-lg text-amber-500 hover:text-red-600 hover:bg-red-50 transition-all" title="Logout">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-5">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 text-amber-700 ml-auto" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-amber-200/60 animate-fadeInUp">
          <div className="px-4 py-3 space-y-1">
            {user && navLinks.map(link => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                  ${isActive(link.to) ? 'bg-amber-100 text-amber-900' : 'text-amber-700 hover:text-amber-900 hover:bg-amber-50'}`}>
                {link.icon} {link.label}
              </Link>
            ))}
            {user && (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-amber-700 hover:text-amber-900 hover:bg-amber-50">
                  <User size={16} /> Profile
                </Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-600 w-full text-left hover:bg-red-50">
                  <LogOut size={16} /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
