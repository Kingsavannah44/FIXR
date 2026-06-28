import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const NAV = [
  { key: 'overview', icon: '📊', label: 'Overview' },
  { key: 'post',     icon: '➕', label: 'Post a Gig' },
  { key: 'my-gigs', icon: '📋', label: 'My Gigs' },
];

export default function BusinessDashboard() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') || 'overview');
  const [stats, setStats] = useState(null);
  const [myGigs, setMyGigs] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', category: 'trades', budget_min: '', budget_max: '', location: '', is_remote: false });
  const [msg, setMsg] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    api.get('/gigs?status=open').then(r =>
      setMyGigs(r.data.filter(g => g.poster_id === user?.id))
    );
    if (['admin', 'sme', 'government'].includes(user?.role)) {
      api.get('/analytics/overview').then(r => setStats(r.data)).catch(() => {});
    }
  }, [user]);

  const postGig = async e => {
    e.preventDefault(); setMsg(''); setPosting(true);
    try {
      await api.post('/gigs', form);
      setMsg('success');
      setForm({ title: '', description: '', category: 'trades', budget_min: '', budget_max: '', location: '', is_remote: false });
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error posting gig');
    } finally { setPosting(false); }
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Top banner */}
      <div className="relative h-40 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&h=400&fit=crop&auto=format&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark" />
        <div className="absolute inset-0 bg-primary/20" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 pb-20">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-56 flex-shrink-0">
            <div className="card !p-2 space-y-1">
              {NAV.map(n => (
                <button
                  key={n.key}
                  onClick={() => setTab(n.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition text-left ${
                    tab === n.key ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span>{n.icon}</span> {n.label}
                </button>
              ))}
            </div>

            <div className="card mt-4 !p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-lg font-black text-primary">
                  {user?.full_name?.[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold leading-tight">{user?.full_name}</div>
                  <div className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">

            {/* Overview */}
            {tab === 'overview' && (
              <div className="space-y-6">
                {stats ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Users',      value: stats.total_users,                                        icon: '👥', img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300&h=200&fit=crop&auto=format&q=60', color: 'from-blue-900/80' },
                      { label: 'Courses Done',     value: stats.completed_courses,                                  icon: '🎓', img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&h=200&fit=crop&auto=format&q=60', color: 'from-purple-900/80' },
                      { label: 'Total Paid Out',   value: `KES ${Number(stats.total_payments_kes||0).toLocaleString()}`, icon: '💰', img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop&auto=format&q=60', color: 'from-green-900/80' },
                      { label: 'Open Gigs',        value: stats.gigs?.find(g=>g.status==='open')?.count || 0,      icon: '⚡', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=200&fit=crop&auto=format&q=60', color: 'from-orange-900/80' },
                    ].map(s => (
                      <div key={s.label} className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-gray-800">
                        <img src={s.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
                        <div className={`absolute inset-0 bg-gradient-to-t ${s.color} to-transparent`} />
                        <div className="absolute inset-0 flex flex-col justify-end p-4">
                          <div className="text-2xl font-black text-white leading-none mb-0.5">{s.value}</div>
                          <div className="text-xs text-gray-300">{s.label}</div>
                        </div>
                        <div className="absolute top-3 right-3 text-xl">{s.icon}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card">
                    <h2 className="font-bold text-lg mb-1">Welcome, {user?.full_name} 👋</h2>
                    <p className="text-gray-400 text-sm">Analytics are available for SME, Government, and Admin roles.</p>
                  </div>
                )}

                <div className="card">
                  <h2 className="font-bold mb-4">Quick Actions</h2>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {[
                      { icon: '➕', label: 'Post a Gig', desc: 'Find the right talent fast', action: () => setTab('post'), style: 'btn-primary' },
                      { icon: '📋', label: 'My Gigs', desc: 'View applications', action: () => setTab('my-gigs'), style: 'btn-accent' },
                      { icon: '🤖', label: 'AI Tools', desc: 'CV, Pricing & more', action: () => window.location.href='/ai-tools', style: 'border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-lg transition' },
                    ].map(a => (
                      <button key={a.label} onClick={a.action} className={`${a.style} p-4 text-left flex flex-col gap-1`}>
                        <span className="text-xl">{a.icon}</span>
                        <span className="font-semibold text-sm">{a.label}</span>
                        <span className="text-xs opacity-70">{a.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Post Gig */}
            {tab === 'post' && (
              <div className="card max-w-2xl">
                <h2 className="font-black text-xl mb-1">Post a New Gig</h2>
                <p className="text-gray-400 text-sm mb-6">Reach thousands of qualified workers across Kenya.</p>

                {msg === 'success' ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">🎉</div>
                    <h3 className="font-bold text-xl mb-2 text-green-300">Gig Posted Successfully!</h3>
                    <p className="text-gray-400 text-sm mb-6">Applicants will start coming in shortly.</p>
                    <div className="flex gap-3 justify-center">
                      <button onClick={() => { setMsg(''); setTab('my-gigs'); }} className="btn-primary">View My Gigs</button>
                      <button onClick={() => setMsg('')} className="border border-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition">Post Another</button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={postGig} className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1 block">Gig Title</label>
                      <input placeholder="e.g. Need an Electrician for Office Rewiring" required className="input"
                        value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1 block">Description</label>
                      <textarea placeholder="Describe the work, timeline, requirements, and what you're looking for…" required className="input h-28 resize-none text-sm"
                        value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1 block">Category</label>
                        <select className="input" value={form.category}
                          onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                          {[['trades','🔧 Trades'],['creative','🎨 Creative'],['agribusiness','🌾 Agribusiness'],['internship','💼 Internship'],['remote','🌐 Remote']].map(([v,l]) => (
                            <option key={v} value={v}>{l}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1 block">Location</label>
                        <input placeholder="e.g. Nairobi CBD" className="input"
                          value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1 block">Min Budget (KES)</label>
                        <input type="number" placeholder="2000" className="input"
                          value={form.budget_min} onChange={e => setForm(f => ({ ...f, budget_min: e.target.value }))} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1 block">Max Budget (KES)</label>
                        <input type="number" placeholder="10000" className="input"
                          value={form.budget_max} onChange={e => setForm(f => ({ ...f, budget_max: e.target.value }))} />
                      </div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-10 h-6 rounded-full transition-colors ${form.is_remote ? 'bg-primary' : 'bg-gray-700'} relative`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.is_remote ? 'left-5' : 'left-1'}`} />
                      </div>
                      <input type="checkbox" className="sr-only" checked={form.is_remote}
                        onChange={e => setForm(f => ({ ...f, is_remote: e.target.checked }))} />
                      <span className="text-sm text-gray-300">This is a remote gig 🌐</span>
                    </label>
                    {msg && msg !== 'success' && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 text-red-400 text-sm">{msg}</div>
                    )}
                    <button type="submit" disabled={posting} className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60">
                      {posting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                      {posting ? 'Posting…' : 'Post Gig →'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* My Gigs */}
            {tab === 'my-gigs' && (
              <div>
                <h2 className="font-black text-xl mb-6">My Posted Gigs</h2>
                {myGigs.length === 0 ? (
                  <div className="card text-center py-16">
                    <div className="text-4xl mb-3">📋</div>
                    <h3 className="font-bold text-lg mb-1">No gigs posted yet</h3>
                    <p className="text-gray-400 text-sm mb-6">Post your first gig and start finding talent.</p>
                    <button onClick={() => setTab('post')} className="btn-primary">Post Your First Gig</button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {myGigs.map(gig => (
                      <div key={gig.id} className="card group">
                        <div className="flex items-start justify-between mb-3">
                          <span className={`badge text-xs ${gig.status === 'open' ? 'bg-green-500/20 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                            {gig.status === 'open' ? '🟢 Open' : gig.status}
                          </span>
                          <span className="text-xs text-gray-500">{gig.category}</span>
                        </div>
                        <h3 className="font-bold mb-1 leading-snug">{gig.title}</h3>
                        <p className="text-gray-400 text-sm line-clamp-2 mb-4">{gig.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-accent text-sm font-semibold">
                            {gig.budget_min ? `KES ${Number(gig.budget_min).toLocaleString()}+` : 'Negotiable'}
                          </span>
                          <a href={`/gigs/${gig.id}`} className="text-xs text-gray-400 hover:text-white transition">
                            View applications →
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
