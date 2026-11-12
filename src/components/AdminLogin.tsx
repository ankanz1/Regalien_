import React, { useState } from 'react';
import { AlertCircle, ArrowLeft, LockKeyhole, Mail, Send } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const AdminLogin: React.FC = () => {
  const { signIn, sendPasswordReset, authError, authLoading, user, adminProfile } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'reset'>('login');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!authLoading && user && adminProfile?.isAuthorized) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);
    try {
      if (mode === 'reset') {
        await sendPasswordReset(email.trim());
        setMessage('If an account exists for this address, a password reset email has been sent.');
      } else {
        await signIn(email.trim(), password);
        navigate('/admin', { replace: true });
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to complete authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F3EEE3] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white border border-[#111111]/15 shadow-xl p-8 sm:p-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#111111] text-white flex items-center justify-center">
            {mode === 'login' ? <LockKeyhole className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#D9541E] font-semibold">Regalien</p>
            <h1 className="font-serif text-2xl font-bold">{mode === 'login' ? 'Administrator Sign In' : 'Reset Password'}</h1>
          </div>
        </div>

        {(error || authError) && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-800 text-xs flex gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error || authError}</span>
          </div>
        )}
        {message && <div className="mb-5 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="block text-xs font-semibold uppercase tracking-wider mb-1">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full border border-[#111111]/20 px-3 py-3 text-sm outline-none focus:border-[#D9541E]"
            />
          </label>
          {mode === 'login' && (
            <label className="block">
              <span className="block text-xs font-semibold uppercase tracking-wider mb-1">Password</span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full border border-[#111111]/20 px-3 py-3 text-sm outline-none focus:border-[#D9541E]"
              />
            </label>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-[#D9541E] disabled:opacity-50 text-white px-4 py-3 text-xs font-bold uppercase tracking-wider"
          >
            {mode === 'login' ? <LockKeyhole className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            {isSubmitting ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Send Reset Email'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => { setMode(mode === 'login' ? 'reset' : 'login'); setError(''); setMessage(''); }}
          className="mt-5 text-xs text-[#D9541E] hover:underline"
        >
          {mode === 'login' ? 'Forgot your password?' : 'Return to sign in'}
        </button>
        <a href="/" className="mt-6 flex items-center gap-1 text-xs text-[#111111]/60 hover:text-[#D9541E]">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to website
        </a>
      </div>
    </main>
  );
};
