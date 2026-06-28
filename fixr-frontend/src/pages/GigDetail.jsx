import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const CAT_IMAGES = {
  trades:       'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=400&fit=crop&auto=format&q=80',
  creative:     'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=400&fit=crop&auto=format&q=80',
  agribusiness: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=400&fit=crop&auto=format&q=80',
  internship:   'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=400&fit=crop&auto=format&q=80',
  remote:       'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=1200&h=400&fit=crop&auto=format&q=80',
};

const CAT_COLORS = {
  trades: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  creative: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  agribusiness: 'bg-green-500/20 text-green-300 border-green-500/30',
  internship: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  remote: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
};

export default function GigDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [gig, setGig] = useState(null);
  const [form, setForm] = useState({ cover_note: '', proposed_fee: '' });
  const [msg, setMsg] = useState('');
  const [applied, setApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/gigs/${id}`).then(r => setGig(r.data));
  }, [id]);

  const apply = async e => {
    e.preventDefault(); setSubmitting(true);
    try {
      await api.post(`/gigs/${id}/apply`, form);
      setApplied(true); setMsg('Application submitted!');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error submitting application');
    } finally { setSubmitting(false); }
  };

  if (!gig) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const heroImg = CAT_IMAGES[gig.category] || CAT_IMAGES.remote;

  return (
    <div className="min-h-screen bg-dark">
      {/* Hero banner */}
      <div className="relative h-52 overflow-hidden">
        <img src={heroImg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark/40 to-dark" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-10 pb-20">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-5">
            {/* Title card */}
            <div className="card">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`badge border ${CAT_COLORS[gig.category] || 'bg-gray-700 text-gray-300 border-gray-600'}`}>
                  {gig.category}
                </span>
                {gig.is_remote && <span className="badge bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">🌐 Remote</span>}
                <span className={`badge border ${gig.status === 'open' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-gray-700 text-gray-400 border-gray-600'}`}>
                  {gig.status === 'open' ? '🟢 Open' : gig.status}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black leading-tight mb-4">{gig.title}</h1>
              <p className="text-gray-300 leading-relaxed">{gig.description}</p>
            </div>

            {/* Details grid */}
            <div className="card">
              <h2 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">Gig Details</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '📍', label: 'Location', value: gig.location || 'Not specified' },
                  { icon: '💰', label: 'Budget', value: gig.budget_min && gig.budget_max ? `KES ${Number(gig.budget_min).toLocaleString()} – ${Number(gig.budget_max).toLocaleString()}` : 'Negotiable' },
                  { icon: '👤', label: 'Posted by', value: gig.poster_name },
                  { icon: '📅', label: 'Posted', value: new Date(gig.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) },
                ].map(d => (
                  <div key={d.label} className="bg-gray-800/50 rounded-xl p-4">
                    <div className="text-lg mb-1">{d.icon}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{d.label}</div>
                    <div className="text-sm font-medium text-white">{d.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Application form */}
            {user && gig.status === 'open' && user.id !== gig.poster_id && !applied && (
              <div className="card">
                <h2 className="font-bold text-lg mb-1">Apply for this Gig</h2>
                <p className="text-gray-400 text-sm mb-5">Make your application stand out with a strong cover note.</p>
                <form onSubmit={apply} className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1 block">Cover Note</label>
                    <textarea
                      placeholder="Why are you the right person? Mention your experience, availability, and approach…"
                      className="input h-32 resize-none text-sm leading-relaxed"
                      value={form.cover_note}
                      onChange={e => setForm(f => ({ ...f, cover_note: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1 block">Proposed Fee (KES)</label>
                    <input
                      type="number" placeholder="e.g. 5000"
                      className="input"
                      value={form.proposed_fee}
                      onChange={e => setForm(f => ({ ...f, proposed_fee: e.target.value }))}
                    />
                  </div>
                  {msg && <p className="text-red-400 text-sm">{msg}</p>}
                  <button type="submit" disabled={submitting} className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60">
                    {submitting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    {submitting ? 'Submitting…' : 'Submit Application →'}
                  </button>
                </form>
              </div>
            )}

            {applied && (
              <div className="card bg-green-500/10 border-green-500/30 text-center py-10">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="font-bold text-lg text-green-300 mb-1">Application Submitted!</h3>
                <p className="text-gray-400 text-sm">The employer will review your application and get in touch.</p>
              </div>
            )}

            {!user && (
              <div className="card text-center py-8 bg-primary/5 border-primary/20">
                <p className="text-gray-300 mb-4">Sign in to apply for this gig</p>
                <Link to="/login" className="btn-primary">Login to Apply</Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card bg-accent/5 border-accent/20">
              <div className="text-3xl font-black text-accent mb-1">
                {gig.budget_min && gig.budget_max
                  ? `KES ${Number(gig.budget_min).toLocaleString()}`
                  : 'Negotiable'}
              </div>
              {gig.budget_max && <div className="text-sm text-gray-400">up to KES {Number(gig.budget_max).toLocaleString()}</div>}
              {user && gig.status === 'open' && user.id !== gig.poster_id && !applied && (
                <a href="#apply" className="btn-accent w-full text-center mt-4 block">Apply Now</a>
              )}
            </div>

            <div className="card">
              <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Share this Gig</div>
              <div className="flex gap-2">
                {['WhatsApp', 'Copy Link'].map(s => (
                  <button key={s} className="flex-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg py-2 transition">
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <Link to="/gigs" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
              ← Back to Marketplace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
