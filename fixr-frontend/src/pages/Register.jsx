import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import GoogleSignInButton from '../components/ui/GoogleSignInButton';

const ROLES = [
  { value: 'student',      label: 'Student',      icon: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=80&h=80&fit=crop&auto=format&q=80' },
  { value: 'gig_worker',   label: 'Gig Worker',   icon: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=80&h=80&fit=crop&auto=format&q=80' },
  { value: 'professional', label: 'Professional', icon: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=80&h=80&fit=crop&auto=format&q=80' },
  { value: 'sme',          label: 'SME / Business',icon: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=80&h=80&fit=crop&auto=format&q=80' },
  { value: 'farmer',       label: 'Farmer',        icon: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=80&h=80&fit=crop&auto=format&q=80' },
  { value: 'cooperative',  label: 'Cooperative',   icon: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=80&h=80&fit=crop&auto=format&q=80' },
  { value: 'government',   label: 'Government',    icon: 'https://images.unsplash.com/photo-1541872705-1f73c6400ec9?w=80&h=80&fit=crop&auto=format&q=80' },
  { value: 'diaspora',     label: 'Diaspora',      icon: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=80&h=80&fit=crop&auto=format&q=80' },
];

export default function Register() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', password: '',
    role: params.get('role') || 'gig_worker', country: 'KE',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async e => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/register', form);
      login(data); navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=1600&fit=crop&auto=format&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-primary/30 to-dark/80" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="text-3xl font-black text-accent">FIXR<span className="text-white">.</span></Link>
          <div className="space-y-4">
            {['Free forever, no credit card', 'M-Pesa payments built in', 'AI CV builder included', 'Kenya DPA 2022 compliant'].map(f => (
              <div key={f} className="flex items-center gap-3 text-white text-sm">
                <div className="w-5 h-5 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-start justify-center px-6 py-12 bg-dark overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-6">
            <Link to="/" className="text-2xl font-black text-accent">FIXR<span className="text-primary">.</span></Link>
          </div>
          <h1 className="text-3xl font-black mb-1">Join FIXR Africa</h1>
          <p className="text-gray-400 text-sm mb-8">Free forever. No credit card needed.</p>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1 block">Full Name</label>
                <input name="full_name" placeholder="Jane Wanjiru" required
                  className="input" value={form.full_name} onChange={onChange} />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1 block">Email</label>
                <input name="email" type="email" placeholder="jane@example.com"
                  className="input" value={form.email} onChange={onChange} />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1 block">Phone</label>
                <input name="phone" placeholder="2547XXXXXXXX"
                  className="input" value={form.phone} onChange={onChange} />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1 block">Password</label>
                <input name="password" type="password" placeholder="Min 8 characters" required
                  className="input" value={form.password} onChange={onChange} />
              </div>
            </div>

            {/* Role picker */}
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-3 block">I am a…</label>
              <div className="grid grid-cols-4 gap-2">
                {ROLES.map(r => (
                  <button
                    type="button" key={r.value}
                    onClick={() => setForm(f => ({ ...f, role: r.value }))}
                    className={`relative flex flex-col items-center gap-1 p-2 rounded-xl border transition text-center ${
                      form.role === r.value
                        ? 'border-accent bg-accent/10 shadow-lg shadow-accent/10'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <img src={r.icon} alt={r.label} className="w-10 h-10 rounded-lg object-cover" />
                    <span className="text-xs text-gray-300 leading-tight">{r.label}</span>
                    {form.role === r.value && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-dark" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1 block">Country</label>
              <select name="country" className="input" value={form.country} onChange={onChange}>
                <option value="KE">🇰🇪 Kenya</option>
                <option value="UG">🇺🇬 Uganda</option>
                <option value="TZ">🇹🇿 Tanzania</option>
                <option value="RW">🇷🇼 Rwanda</option>
                <option value="GH">🇬🇭 Ghana</option>
                <option value="NG">🇳🇬 Nigeria</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 text-red-400 text-sm">{error}</div>
            )}

            <button type="submit" disabled={loading} className="btn-accent w-full py-3 disabled:opacity-60 flex items-center justify-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />}
              {loading ? 'Creating account…' : 'Create Free Account →'}
            </button>

            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-800" />
              <span className="text-xs text-gray-600">or</span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>

            <GoogleSignInButton role={form.role} redirectTo="/profile" />

            <p className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-accent hover:underline font-medium">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
