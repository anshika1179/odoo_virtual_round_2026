import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { login as loginApi } from '../../services/api';
import { Globe, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Multi-layered Background Design */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Base gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50" />
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(146, 64, 14, 0.05) 35px, rgba(146, 64, 14, 0.05) 70px),
                             repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(245, 158, 11, 0.03) 35px, rgba(245, 158, 11, 0.03) 70px)`
          }} />
        </div>
        
        {/* Floating gradient orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-orange-500/15 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-orange-500/15 to-yellow-600/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-br from-yellow-500/12 to-amber-600/8 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-600/15 to-orange-700/10 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}} />
        
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-amber-600/40 rounded-full animate-pulse" />
        <div className="absolute top-32 right-32 w-3 h-3 bg-orange-500/30 rounded-full animate-pulse" style={{animationDelay: '0.5s'}} />
        <div className="absolute bottom-20 left-20 w-4 h-4 bg-yellow-600/35 rounded-full animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-32 left-32 w-3 h-3 bg-amber-500/25 rounded-full animate-pulse" style={{animationDelay: '1.5s'}} />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full" style={{
            backgroundImage: `linear-gradient(rgba(146, 64, 14, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(146, 64, 14, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        {/* Radial gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/5 via-transparent to-orange-900/5" />
      </div>

      <div className="w-full max-w-md animate-fadeInUp relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-700 shadow-lg shadow-amber-600/30 mb-4 animate-gentle-float">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
          <p className="text-amber-700">Sign in to continue your journey</p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-2xl shadow-amber-900/20 border border-amber-700/30 backdrop-blur-xl relative overflow-hidden">
          {/* Subtle shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-1000" style={{
            backgroundSize: '200% 100%',
            animation: 'shimmer-bg 3s ease-in-out infinite'
          }} />
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600" />
                <input type="email" className="input-glass pl-10" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600" />
                <input type="password" className="input-glass pl-12" placeholder="••••••••"
                  value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center text-base py-3 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {loading ? <Loader2 size={20} className="animate-spin relative z-10" /> : <><span className="relative z-10">Sign In</span> <ArrowRight size={18} className="relative z-10" /></>}
            </button>
          </form>

          <p className="text-center text-amber-700 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-amber-800 hover:text-amber-900 font-medium transition-colors duration-200">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
