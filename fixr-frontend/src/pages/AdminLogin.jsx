import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Already logged in as admin → go straight to panel
  useEffect(() => {
    if (user?.role === 'admin') navigate('/admin', { replace: true });
  }, [user, navigate]);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      if (data.user?.role !== 'admin') {
        setError('Access denied. Admin accounts only.');
        return;
      }
      login(data);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark px-4">
      <div className="w-full max-w-sm">

        {/* Logo + badge */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-white">Admin Access</h1>
          <p className="text-gray-500 text-sm mt-1">FIXR Africa · Restricted</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1 block">Email</label>
            <input
              name="email" type="email" required autoFocus
              placeholder="admin@fixr.africa"
              className="input" value={form.email} onChange={onChange}
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1 block">Password</label>
            <input
              name="password" type="password" required
              placeholder="••••••••"
              className="input" value={form.password} onChange={onChange}
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? 'Verifying…' : 'Sign In to Admin Panel'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-6">
          Not an admin?{' '}
          <a href="/login" className="text-gray-500 hover:text-gray-300 transition">Regular login →</a>
        </p>
      </div>
    </div>
  );
}
