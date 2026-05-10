import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { Globe, Mail, Lock, ArrowRight, Loader2, CheckCircle, KeyRound } from 'lucide-react';

export default function ForgotPassword() {
  const [step, setStep] = useState('email'); // 'email' | 'reset' | 'done'
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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-fadeInUp relative">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 animate-float">
            <KeyRound size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">
            {step === 'done' ? 'Password Reset!' : 'Reset Password'}
          </h1>
          <p className="text-slate-400 mt-2">
            {step === 'email' && 'Enter your email to get a reset token'}
            {step === 'reset' && 'Enter your new password'}
            {step === 'done' && 'You can now log in with your new password'}
          </p>
        </div>

        <div className="glass rounded-2xl p-8">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
          )}

          {step === 'email' && (
            <form onSubmit={handleForgot} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="email" className="input-glass pl-10" placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base py-3">
                {loading ? <Loader2 size={20} className="animate-spin" /> : <><span>Send Reset Token</span> <ArrowRight size={18} /></>}
              </button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleReset} className="space-y-5">
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-2">
                <CheckCircle size={16} /> Reset token generated for {email}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="password" className="input-glass pl-10" placeholder="••••••••" minLength={6}
                    value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="password" className="input-glass pl-10" placeholder="••••••••" minLength={6}
                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base py-3">
                {loading ? <Loader2 size={20} className="animate-spin" /> : <><span>Reset Password</span> <ArrowRight size={18} /></>}
              </button>
            </form>
          )}

          {step === 'done' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                <CheckCircle size={32} className="text-green-400" />
              </div>
              <p className="text-slate-300">Your password has been successfully reset.</p>
              <Link to="/login" className="btn-primary w-full justify-center text-base py-3 inline-flex">
                Go to Login <ArrowRight size={18} />
              </Link>
            </div>
          )}

          {step !== 'done' && (
            <p className="text-center text-slate-400 text-sm mt-6">
              Remember your password?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
