import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { register as registerApi } from '../../services/api';
import { Mail, Lock, User, Phone, MapPin, ArrowRight, Loader2 } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', city: '', country: '', additional_info: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await registerApi(form);
      loginUser(res.data.access_token, res.data.user);
      navigate('/');
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map(d => d.msg?.replace('Value error, ', '')).join('. '));
      } else {
        setError(detail || 'Registration failed');
      }
    } finally { setLoading(false); }
  };

  const set = (key) => (e) => setForm({...form, [key]: e.target.value});

  return (
    <div className="login-page">
      <div className="w-full animate-fadeInUp flex justify-center">
        <div className="login-card glass shadow-2xl">

          {/* Left — Image Panel */}
          <div className="login-image relative">
            <img
              src="/images/auth-bg.jpg"
              alt="Travel lounge"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 via-amber-900/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <h2 className="text-5xl brand-font text-white drop-shadow-lg mb-2">Traveloop</h2>
              <p className="text-amber-100/90 text-sm">Your journey starts here. Plan, explore, and share.</p>
            </div>
          </div>

          {/* Right — Form Panel */}
          <div className="login-form-section">
            <div>
              <h1 className="text-3xl font-bold text-amber-900 md:hidden brand-font mb-1">Traveloop</h1>
              <h2 className="text-2xl font-bold text-amber-900">Create your account</h2>
              <p className="text-amber-700/70 mt-1 text-sm">Start planning your next adventure</p>
            </div>

            {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-800 mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600/50" />
                    <input className="input-glass pl-10" placeholder="John Doe" value={form.full_name} onChange={set('full_name')} required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-800 mb-1.5">Email *</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600/50" />
                    <input type="email" className="input-glass pl-10" placeholder="you@email.com" value={form.email} onChange={set('email')} required />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-800 mb-1.5">Phone</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600/50" />
                    <input className="input-glass pl-10" placeholder="+91 9876543210" value={form.phone} onChange={set('phone')} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-800 mb-1.5">Password *</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600/50" />
                    <input type="password" className="input-glass pl-10" placeholder="Min 6 chars" value={form.password} onChange={set('password')} required />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-800 mb-1.5">City</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600/50" />
                    <input className="input-glass pl-10" placeholder="Mumbai" value={form.city} onChange={set('city')} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-800 mb-1.5">Country</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600/50" />
                    <input className="input-glass pl-10" placeholder="India" value={form.country} onChange={set('country')} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-800 mb-1.5">About You</label>
                <textarea className="input-glass" rows={2} placeholder="Tell us about yourself..." value={form.additional_info} onChange={set('additional_info')} />
              </div>

              <button type="submit" disabled={loading} className="btn-primary signin-btn">
                {loading ? <Loader2 size={20} className="animate-spin" /> : <><span>Create Account</span> <ArrowRight size={18} /></>}
              </button>
            </form>

            <p className="text-center text-amber-700/70 text-sm mt-5">
              Already have an account? <Link to="/login" className="text-amber-800 hover:text-amber-600 font-semibold">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
