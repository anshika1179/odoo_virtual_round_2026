import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { Mail, Lock, ArrowRight, Loader2, CheckCircle, KeyRound } from 'lucide-react';

export default function ForgotPassword() {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleForgot = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await API.post('/auth/forgot-password', { email });
      setResetToken(res.data.reset_token);
      setStep('reset');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send reset request');
    } finally { setLoading(false); }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      await API.post('/auth/reset-password', { token: resetToken, new_password: newPassword });
      setStep('done');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reset password');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl animate-fadeInUp">
        <div className="glass rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[520px]">

          {/* Left — Image Panel */}
          <div className="hidden md:block md:w-1/2 relative">
            <img src="/images/auth-bg.jpg" alt="Travel lounge" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 via-amber-900/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <h2 className="text-5xl brand-font text-white drop-shadow-lg mb-2">Traveloop</h2>
              <p className="text-amber-100/90 text-sm">Secure your journey. Reset in seconds.</p>
            </div>
          </div>

          {/* Right — Form Panel */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-amber-900 md:hidden brand-font mb-1">Traveloop</h1>
              <div className="flex items-center gap-3 mb-1">
                <KeyRound size={24} className="text-amber-700" />
                <h2 className="text-2xl font-bold text-amber-900">
                  {step === 'done' ? 'Password Reset!' : 'Reset Password'}
                </h2>
              </div>
              <p className="text-amber-700/70 text-sm">
                {step === 'email' && 'Enter your email to get a reset token'}
                {step === 'reset' && 'Enter your new password'}
                {step === 'done' && 'You can now log in with your new password'}
              </p>
            </div>

            {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-sm">{error}</div>}

            {step === 'email' && (
              <form onSubmit={handleForgot} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-amber-800 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600/50" />
                    <input type="email" className="input-glass pl-10" placeholder="you@example.com"
                      value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base py-3 rounded-xl">
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <><span>Send Reset Token</span> <ArrowRight size={18} /></>}
                </button>
              </form>
            )}

            {step === 'reset' && (
              <form onSubmit={handleReset} className="space-y-5">
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-700 text-sm flex items-center gap-2">
                  <CheckCircle size={16} /> Reset token generated for {email}
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-800 mb-1.5">New Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600/50" />
                    <input type="password" className="input-glass pl-10" placeholder="••••••••" minLength={6}
                      value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-800 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600/50" />
                    <input type="password" className="input-glass pl-10" placeholder="••••••••" minLength={6}
                      value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base py-3 rounded-xl">
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <><span>Reset Password</span> <ArrowRight size={18} /></>}
                </button>
              </form>
            )}

            {step === 'done' && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <p className="text-amber-800">Your password has been successfully reset.</p>
                <Link to="/login" className="btn-primary w-full justify-center text-base py-3 rounded-xl inline-flex">
                  Go to Login <ArrowRight size={18} />
                </Link>
              </div>
            )}

            {step !== 'done' && (
              <p className="text-center text-amber-700/70 text-sm mt-6">
                Remember your password?{' '}
                <Link to="/login" className="text-amber-800 hover:text-amber-600 font-semibold">Sign in</Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
