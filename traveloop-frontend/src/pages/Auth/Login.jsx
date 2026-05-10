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
    <div className="min-h-screen relative overflow-hidden">
      {/* Geometric Background Design */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Base gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-100 to-amber-200" />
        
        {/* Geometric triangles and trapezoids */}
        <div className="absolute inset-0">
          {/* Large triangle top-left */}
          <div className="absolute top-0 left-0 w-0 h-0 border-l-[400px] border-l-transparent border-r-[200px] border-r-transparent border-b-[350px] border-b-amber-600/20" />
          <div className="absolute top-10 left-10 w-0 h-0 border-l-[300px] border-l-transparent border-r-[150px] border-r-transparent border-b-[250px] border-b-orange-600/15" />
          
          {/* Triangle top-right */}
          <div className="absolute top-0 right-0 w-0 h-0 border-l-[200px] border-l-transparent border-r-[400px] border-r-transparent border-b-[300px] border-b-amber-700/15" />
          
          {/* Trapezoid bottom-left */}
          <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[350px] border-l-transparent border-r-[200px] border-r-transparent border-t-[250px] border-t-orange-600/20" />
          
          {/* Triangle bottom-right */}
          <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[200px] border-l-transparent border-r-[350px] border-r-transparent border-t-[300px] border-t-amber-600/18" />
          
          {/* Medium geometric shapes */}
          <div className="absolute top-1/4 left-1/4 w-0 h-0 border-l-[150px] border-l-transparent border-r-[100px] border-r-transparent border-b-[120px] border-b-yellow-600/12" />
          <div className="absolute top-1/3 right-1/3 w-0 h-0 border-l-[100px] border-l-transparent border-r-[150px] border-r-transparent border-b-[100px] border-b-amber-500/10" />
          <div className="absolute bottom-1/4 left-1/3 w-0 h-0 border-l-[120px] border-l-transparent border-r-[80px] border-r-transparent border-t-[100px] border-t-orange-500/12" />
          
          {/* Small decorative triangles */}
          <div className="absolute top-20 right-40 w-0 h-0 border-l-[60px] border-l-transparent border-r-[40px] border-r-transparent border-b-[50px] border-b-amber-700/15" />
          <div className="absolute bottom-32 left-20 w-0 h-0 border-l-[50px] border-l-transparent border-r-[30px] border-r-transparent border-t-[40px] border-t-yellow-600/10" />
          <div className="absolute top-1/2 right-20 w-0 h-0 border-l-[40px] border-l-transparent border-r-[60px] border-r-transparent border-b-[35px] border-b-orange-600/12" />
        </div>
        
        {/* Overlay pattern for texture */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(60deg, transparent, transparent 40px, rgba(146, 64, 14, 0.08) 40px, rgba(146, 64, 14, 0.08) 80px),
                             repeating-linear-gradient(-60deg, transparent, transparent 40px, rgba(245, 158, 11, 0.05) 40px, rgba(245, 158, 11, 0.05) 80px)`
          }} />
        </div>
        
        {/* Depth overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/10 via-transparent to-orange-900/5" />
      </div>

      {/* Main Content Area */}
      <main className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-lg animate-fadeInUp relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">Welcome Back</h1>
            <p className="text-amber-700">Sign in to continue your journey</p>
          </div>

          <div className="glass rounded-2xl p-8 shadow-2xl shadow-amber-900/20 border border-amber-700/30 backdrop-blur-xl relative overflow-hidden max-w-full">
            {/* Subtle shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-1000" style={{
              backgroundSize: '200% 100%',
              animation: 'shimmer-bg 3s ease-in-out infinite'
            }} />
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm relative z-10">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="w-full">
              <label className="block text-sm font-medium text-amber-800 mb-2">Email</label>
              <div className="relative w-full">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600" />
                <input type="email" className="input-glass pl-10 w-full" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-amber-800 mb-2">Password</label>
              <input type="password" className="input-glass w-full" placeholder="••••••••"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center text-base py-3 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {loading ? <Loader2 size={20} className="animate-spin relative z-10" /> : <><span className="relative z-10">Sign In</span> <ArrowRight size={18} className="relative z-10" /></>}
            </button>
          </form>

          <p className="text-center text-amber-700 text-sm mt-6 relative z-10">
            Don't have an account?{' '}
            <Link to="/register" className="text-amber-800 hover:text-amber-900 font-medium transition-colors duration-200">Create one</Link>
          </p>
        </div>
      </div>
      </main>
    </div>
  );
}
