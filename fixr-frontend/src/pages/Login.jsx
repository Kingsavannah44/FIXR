import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import GoogleSignInButton from '../components/ui/GoogleSignInButton';

export default function Login() {
  const [form, setForm] = useState({ email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data); navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=1600&fit=crop&auto=format&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-dark/80 via-primary/40 to-dark/60" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="text-3xl font-black text-accent tracking-tight">
            FIXR<span className="text-white">.</span>
          </Link>
          <div>
            <blockquote className="text-2xl font-bold text-white leading-snug mb-4">
              "I landed 3 gigs in my first week. FIXR changed everything."
            </blockquote>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format&q=80"
                className="w-10 h-10 rounded-full object-cover border-2 border-accent"
                alt=""
              />
              <div>
                <div className="text-white font-semibold text-sm">James Omondi</div>
                <div className="text-gray-400 text-xs">Electrician, Nairobi</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 bg-dark">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <Link to="/" className="text-2xl font-black text-accent">FIXR<span className="text-primary">.</span></Link>
          </div>
          <h1 className="text-3xl font-black mb-1">Welcome back</h1>
          <p className="text-gray-400 mb-8 text-sm">Sign in to your FIXR account</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1 block">Email</label>
              <input name="email" type="email" placeholder="you@example.com"
                className="input" value={form.email} onChange={onChange} />
            </div>
            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-800" />
              <span className="text-xs text-gray-600">or use phone</span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1 block">Phone</label>
              <input name="phone" placeholder="2547XXXXXXXX"
                className="input" value={form.phone} onChange={onChange} />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1 block">Password</label>
              <input name="password" type="password" placeholder="••••••••" required
                className="input" value={form.password} onChange={onChange} />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60 flex items-center justify-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>

            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-800" />
              <span className="text-xs text-gray-600">or</span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>

            <GoogleSignInButton redirectTo="/" />
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            No account?{' '}
            <Link to="/register" className="text-accent hover:underline font-medium">Create one free →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
