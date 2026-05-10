import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { login as loginApi } from '../../services/api';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginApi(form);
      loginUser(res.data.access_token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.full_name?.split(' ')[0] || 'traveler'}!`);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
      toast.error('Login failed. Please check your credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl animate-fadeInUp">
        <div className="glass rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[560px]">

          {/* Left — Image Panel */}
          <div className="hidden md:block md:w-1/2 relative">
            <img
              src="/images/auth-bg.jpg"
              alt="Travel lounge"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 via-amber-900/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <h2 className="text-5xl brand-font text-white drop-shadow-lg mb-2">Traveloop</h2>
              <p className="text-amber-100/90 text-sm">Plan. Explore. Share your journey.</p>
            </div>
          </div>

          {/* Right — Form Panel */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-amber-900 md:hidden brand-font mb-1">Traveloop</h1>
              <h2 className="text-2xl font-bold text-amber-900">Welcome back</h2>
              <p className="text-amber-700/70 mt-1 text-sm">Please enter your details</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600/50" />
                  <input type="email" className="input-glass pl-10" placeholder="you@example.com"
                    value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-800 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600/50" />
                  <input type="password" className="input-glass pl-10" placeholder="••••••••"
                    value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-amber-700 cursor-pointer">
                  <input type="checkbox" className="rounded border-amber-300 accent-amber-700" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-amber-800 hover:text-amber-600 font-medium">Forgot Password?</Link>
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full justify-center text-base py-3 rounded-xl">
                {loading ? <Loader2 size={20} className="animate-spin" /> : <><span>Sign In</span> <ArrowRight size={18} /></>}
              </button>
            </form>

            <p className="text-center text-amber-700/70 text-sm mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-amber-800 hover:text-amber-600 font-semibold">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
