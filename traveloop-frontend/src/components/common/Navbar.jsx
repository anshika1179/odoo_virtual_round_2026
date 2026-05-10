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
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all" 
         style={{ backgroundColor: 'rgba(255,248,240,0.92)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(120,90,60,0.08)' }}>
      <div className="mx-auto flex items-center justify-between"
           style={{ maxWidth: '1440px', padding: '0 64px', height: '72px' }}>

        {/* Left — Logo + Brand */}
        <Link to="/" className="flex items-center group shrink-0" style={{ gap: '10px' }}>
          <img src="/images/logo.png" alt="Traveloop" className="w-8 h-8 rounded-full object-cover group-hover:rotate-[360deg] transition-transform duration-700 ease-in-out" />
          <span className="brand-font text-[#451a03] hidden sm:inline" style={{ fontSize: '28px', fontWeight: 700 }}>Traveloop.</span>
        </Link>

        {/* Center — Nav Links (desktop) */}
        <div className="hidden md:flex items-center mx-auto" style={{ gap: '28px' }}>
          {user && navLinks.map(link => (
            <Link key={link.to} to={link.to}
              className={`flex items-center gap-1.5 transition-all duration-300 ${isActive(link.to) ? 'text-amber-900' : 'text-amber-900/60 hover:text-amber-900'}`}
              style={{ fontSize: '16px', fontWeight: 500 }}>
              {link.icon} {link.label}
            </Link>
          ))}
        </div>

        {/* Right — Profile / Auth */}
        <div className="hidden md:flex items-center shrink-0 ml-auto">
          {user ? (
            <div className="flex items-center">
              <Link to="/profile" className="flex items-center hover:opacity-80 transition-opacity" style={{ marginLeft: '32px', gap: '10px' }}>
                <div className="w-9 h-9 rounded-full overflow-hidden bg-amber-100 flex items-center justify-center shrink-0 border border-amber-900/10">
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
                <div className="flex flex-col text-left">
                  <span className="text-amber-950 leading-tight" style={{ fontSize: '16px', fontWeight: 600 }}>{user.full_name?.split(' ')[0]}</span>
                </div>
              </Link>
              <button onClick={handleLogout} className="p-2 ml-4 rounded-full text-amber-900/40 hover:text-red-500 hover:bg-red-50 transition-all" title="Logout">
                <LogOut size={20} strokeWidth={1.5} />
              </button>
            </div>
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

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t" style={{ backgroundColor: 'rgba(255,248,240,0.95)', backdropFilter: 'blur(10px)', borderColor: 'rgba(120,90,60,0.08)' }}>
          <div className="px-6 py-4 space-y-2">
            {user && navLinks.map(link => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all
                  ${isActive(link.to) ? 'bg-amber-900/5 text-amber-900' : 'text-amber-900/60 hover:text-amber-900 hover:bg-amber-900/5'}`}>
                {link.icon} {link.label}
              </Link>
            ))}
            {user && (
              <div className="pt-4 mt-2 border-t" style={{ borderColor: 'rgba(120,90,60,0.08)' }}>
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
