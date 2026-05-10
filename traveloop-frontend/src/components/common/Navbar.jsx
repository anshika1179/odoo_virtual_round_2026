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
    { to: '/', label: 'Dashboard', icon: <Home size={18} strokeWidth={1.5} /> },
    { to: '/trips', label: 'My Trips', icon: <Map size={18} strokeWidth={1.5} /> },
    { to: '/search/cities', label: 'Explore', icon: <Search size={18} strokeWidth={1.5} /> },
    { to: '/community', label: 'Community', icon: <Users size={18} strokeWidth={1.5} /> },
  ];

  if (user?.is_admin) {
    navLinks.push({ to: '/admin', label: 'Admin', icon: <LayoutDashboard size={18} strokeWidth={1.5} /> });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-amber-900/5 shadow-soft transition-all">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex items-center h-20">

          {/* Left — Logo + Brand */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <img src="/images/logo.png" alt="Traveloop" className="w-8 h-8 rounded-full object-cover group-hover:rotate-[360deg] transition-transform duration-700 ease-in-out" />
            <span className="text-xl font-bold tracking-tight text-amber-950 hidden sm:inline">Traveloop.</span>
          </Link>

          {/* Center — Nav Links (desktop) */}
          <div className="hidden md:flex items-center gap-2 mx-auto">
            {user && navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                  ${isActive(link.to)
                    ? 'bg-amber-900/5 text-amber-900'
                    : 'text-amber-900/60 hover:text-amber-900 hover:bg-amber-900/5'}`}>
                {link.icon} {link.label}
              </Link>
            ))}
          </div>

          {/* Right — Profile / Auth */}
          <div className="hidden md:flex items-center gap-4 shrink-0 ml-auto">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center gap-3 px-2 py-1 rounded-full hover:bg-amber-900/5 transition-all">
                  <div className="flex flex-col text-right">
                    <span className="text-sm font-semibold text-amber-950 leading-none">{user.full_name?.split(' ')[0]}</span>
                    <span className="text-xs text-amber-900/50 mt-1">Traveler</span>
                  </div>
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-amber-100 flex items-center justify-center shrink-0 border border-amber-900/10">
                    {user.profile_photo_url ? (
                      <img
                        src={user.profile_photo_url}
                        alt={user.full_name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<span class="text-amber-900 text-sm font-bold">${user.full_name?.[0]?.toUpperCase() || '?'}</span>`; }}
                      />
                    ) : (
                      <User size={18} strokeWidth={1.5} className="text-amber-900/60" />
                    )}
                  </div>
                </Link>
                <button onClick={handleLogout} className="p-2.5 rounded-full text-amber-900/40 hover:text-red-500 hover:bg-red-50 transition-all" title="Logout">
                  <LogOut size={20} strokeWidth={1.5} />
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="btn-secondary text-sm">Log in</Link>
                <Link to="/register" className="btn-primary text-sm">Sign up</Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 text-amber-900/70 ml-auto" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-amber-900/5 animate-fadeInUp">
          <div className="px-6 py-4 space-y-2">
            {user && navLinks.map(link => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all
                  ${isActive(link.to) ? 'bg-amber-900/5 text-amber-900' : 'text-amber-900/60 hover:text-amber-900 hover:bg-amber-900/5'}`}>
                {link.icon} {link.label}
              </Link>
            ))}
            {user && (
              <div className="pt-4 mt-2 border-t border-amber-900/5">
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm text-amber-900/60 hover:text-amber-900 hover:bg-amber-900/5">
                  <User size={18} strokeWidth={1.5} /> Profile
                </Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm text-red-500 w-full text-left hover:bg-red-50">
                  <LogOut size={18} strokeWidth={1.5} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
