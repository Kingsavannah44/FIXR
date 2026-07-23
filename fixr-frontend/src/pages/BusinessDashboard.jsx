import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const PX = (id, w = 800, h = 400) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

const CATEGORIES = [
  { value: 'trades',       label: 'Trades & Artisans', icon: '🔧' },
  { value: 'creative',     label: 'Creative & Design',  icon: '🎨' },
  { value: 'agribusiness', label: 'Agribusiness',        icon: '🌾' },
  { value: 'internship',   label: 'Internship',          icon: '💼' },
  { value: 'remote',       label: 'Remote / Diaspora',   icon: '🌐' },
];

const NAV = [
  { key: 'overview', icon: '📊', label: 'Overview'   },
  { key: 'post',     icon: '➕', label: 'Post a Gig' },
  { key: 'my-gigs',  icon: '📋', label: 'My Gigs'    },
];

const EMPTY = {
  title: '', description: '', category: 'trades',
  budget_min: '', budget_max: '', location: '', is_remote: false,
};

export default function BusinessDashboard() {
  const { user }      = useAuth();
  const navigate      = useNavigate();
  const [params]      = useSearchParams();
  const [tab, setTab] = useState(params.get('tab') || 'overview');
  const [stats, setStats]         = useState(null);
  const [myGigs, setMyGigs]       = useState([]);
  const [loadingGigs, setLoadingGigs] = useState(false);
  const [form, setForm]           = useState(EMPTY);
  const [errors, setErrors]       = useState({});
  const [msg, setMsg]             = useState('');
  const [posting, setPosting]     = useState(false);

  useEffect(() => { if (user === null) navigate('/login?next=/dashboard'); }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    if (['admin', 'sme', 'government'].includes(user.role)) {
      api.get('/analytics/overview').then(r => setStats(r.data)).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    if (tab !== 'my-gigs' || !user) return;
    setLoadingGigs(true);
    api.get('/gigs?limit=100')
      .then(r => setMyGigs(r.data.filter(g => g.poster_id === user.id)))
      .catch(() => setMyGigs([]))
      .finally(() => setLoadingGigs(false));
  }, [tab, user]);

  const validate = () => {
    const e = {};
    if (!form.title.trim())                   e.title       = 'Title is required';
    else if (form.title.length > 120)         e.title       = 'Max 120 characters';
    if (!form.description.trim())             e.description = 'Description is required';
    else if (form.description.trim().length < 30) e.description = 'Please write at least 30 characters';
    if (form.budget_min && isNaN(+form.budget_min)) e.budget_min = 'Must be a number';
    if (form.budget_max && isNaN(+form.budget_max)) e.budget_max = 'Must be a number';
    if (+form.budget_min > 0 && +form.budget_max > 0 && +form.budget_min > +form.budget_max)
      e.budget_max = 'Max must be ≥ min';
    return e;
  };

  const postGig = async e => {
    e.preventDefault();
    setMsg('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setPosting(true);
    try {
      await api.post('/gigs', {
        ...form,
        budget_min: form.budget_min ? +form.budget_min : null,
        budget_max: form.budget_max ? +form.budget_max : null,
      });
      setMsg('success');
      setForm(EMPTY);
    } catch (err) {
      setMsg(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally { setPosting(false); }
  };

  const f = key => e => {
    setForm(prev => ({ ...prev, [key]: e.target.value }));
    setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  if (!user) return null;

  /* ─────────────────────────── RENDER ─────────────────────────── */
  return (
    <div className="min-h-screen bg-dark">

      {/* Banner */}
      <div className="relative h-44 overflow-hidden">
        <img src={PX(2219024, 1600, 400)} alt="" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/30 to-dark" />
        <div className="absolute inset-0 bg-primary/10" />
        <div className="absolute bottom-5 left-6 sm:left-10">
          <p className="text-xs font-bold uppercase tracking-widest text-green-400 mb-1">Business Dashboard</p>
          <h1 className="text-2xl font-black text-white drop-shadow-lg">Manage your gigs</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="flex flex-col md:flex-row gap-6 pt-2">

          {/* Sidebar */}
          <aside className="md:w-56 flex-shrink-0 space-y-4">
            <nav className="card !p-2 space-y-1">
              {NAV.map(n => (
                <button key={n.key} onClick={() => setTab(n.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left ${
                    tab === n.key
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
                  }`}>
                  <span>{n.icon}</span>{n.label}
                </button>
              ))}
            </nav>

            <div className="card !p-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-green-400 flex items-center justify-center font-black text-white text-lg flex-shrink-0">
                  {user.full_name?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold truncate">{user.full_name}</div>
                  <div className="text-xs text-gray-500 capitalize mt-0.5">{user.role?.replace('_', ' ')}</div>
                </div>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">

            {/* ── OVERVIEW ─────────────────────────────────────── */}
            {tab === 'overview' && (
              <div className="space-y-6">
                {stats ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Users',    value: stats.total_users,  icon: '👥', id: 1181406 },
                      { label: 'Courses Done',   value: stats.completed_courses, icon: '🎓', id: 1181671 },
                      { label: 'Total Paid Out', value: `KES ${Number(stats.total_payments_kes || 0).toLocaleString()}`, icon: '💰', id: 3760067 },
                      { label: 'Open Gigs',      value: stats.gigs?.find(g => g.status === 'open')?.count || 0, icon: '⚡', id: 2219024 },
                    ].map(s => (
                      <div key={s.label} className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-border">
                        <img src={PX(s.id, 300, 200)} alt="" className="absolute inset-0 w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/60 to-transparent" />
                        <div className="absolute inset-0 flex flex-col justify-end p-4">
                          <div className="text-2xl font-black text-white leading-none mb-1">{s.value}</div>
                          <div className="text-xs text-gray-300">{s.label}</div>
                        </div>
                        <div className="absolute top-3 right-3 text-xl">{s.icon}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card">
                    <h2 className="font-bold text-lg mb-1">Welcome back, {user.full_name?.split(' ')[0]} 👋</h2>
                    <p className="text-gray-400 text-sm">Analytics are available for SME, Government, and Admin accounts.</p>
                  </div>
                )}

                <div className="card">
                  <h2 className="font-bold text-base mb-4">Quick actions</h2>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {[
                      { icon: '➕', label: 'Post a Gig',  desc: 'Find the right talent fast', action: () => setTab('post'),     style: 'btn-primary' },
                      { icon: '📋', label: 'My Gigs',     desc: 'View all applications',       action: () => setTab('my-gigs'), style: 'btn-accent'  },
                      { icon: '🤖', label: 'AI Tools',    desc: 'CV builder & pricing',        action: () => navigate('/ai-tools'), style: 'btn-ghost' },
                    ].map(a => (
                      <button key={a.label} onClick={a.action}
                        className={`${a.style} p-4 text-left flex flex-col gap-1.5 rounded-xl`}>
                        <span className="text-xl">{a.icon}</span>
                        <span className="font-bold text-sm">{a.label}</span>
                        <span className="text-xs opacity-60 font-normal">{a.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── POST A GIG ───────────────────────────────────── */}
            {tab === 'post' && (
              <div className="max-w-2xl">
                {msg === 'success' ? (
                  <div className="card text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-3xl mx-auto mb-5">🎉</div>
                    <h3 className="font-black text-xl mb-2 text-green-300">Gig posted successfully</h3>
                    <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto">
                      Your gig is now live. Qualified applicants will start coming in shortly.
                    </p>
                    <div className="flex gap-3 justify-center flex-wrap">
                      <button onClick={() => { setMsg(''); setTab('my-gigs'); }} className="btn-primary px-6">
                        View My Gigs
                      </button>
                      <button onClick={() => setMsg('')} className="btn-ghost px-6">
                        Post Another
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="card">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-7 pb-5 border-b border-border">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-2xl flex-shrink-0">➕</div>
                      <div>
                        <h2 className="font-black text-xl leading-tight">Post a New Gig</h2>
                        <p className="text-gray-400 text-sm mt-1">
                          Reach thousands of verified workers across Kenya.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={postGig} className="space-y-5" noValidate>

                      {/* Title */}
                      <div>
                        <label className="label">
                          Gig Title <span className="text-red-400">*</span>
                        </label>
                        <input
                          placeholder="e.g. Need an Electrician for Office Rewiring in Westlands"
                          value={form.title}
                          onChange={f('title')}
                          maxLength={120}
                          className={`input ${errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                        />
                        <div className="flex items-center justify-between mt-1.5">
                          {errors.title
                            ? <p className="text-red-400 text-xs">{errors.title}</p>
                            : <p className="text-gray-600 text-xs">Be specific. Better titles attract better applicants.</p>
                          }
                          <span className={`text-xs ml-auto ${form.title.length > 100 ? 'text-yellow-400' : 'text-gray-600'}`}>
                            {form.title.length}/120
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="label">
                          Description <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          placeholder="Describe the work, timeline, requirements, and what you're looking for. The more detail, the better the match."
                          value={form.description}
                          onChange={f('description')}
                          rows={5}
                          className={`input resize-none leading-relaxed ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                        />
                        <div className="flex items-center justify-between mt-1.5">
                          {errors.description
                            ? <p className="text-red-400 text-xs">{errors.description}</p>
                            : <p className="text-gray-600 text-xs">Include skills required, project length, and any tools needed</p>
                          }
                          <span className={`text-xs ml-auto ${form.description.length < 30 && form.description.length > 0 ? 'text-yellow-400' : 'text-gray-600'}`}>
                            {form.description.length} chars
                          </span>
                        </div>
                      </div>

                      {/* Category + Location */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="label">Category <span className="text-red-400">*</span></label>
                          <select value={form.category} onChange={f('category')} className="input">
                            {CATEGORIES.map(c => (
                              <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="label">Location</label>
                          <input
                            placeholder="e.g. Nairobi CBD, Westlands"
                            value={form.location}
                            onChange={f('location')}
                            className="input"
                          />
                        </div>
                      </div>

                      {/* Budget */}
                      <div>
                        <label className="label">Budget Range (KES)</label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">KES</span>
                              <input
                                type="number"
                                placeholder="Min e.g. 2000"
                                value={form.budget_min}
                                onChange={f('budget_min')}
                                min={0}
                                className={`input pl-12 ${errors.budget_min ? 'border-red-500' : ''}`}
                              />
                            </div>
                            {errors.budget_min && <p className="text-red-400 text-xs mt-1">{errors.budget_min}</p>}
                          </div>
                          <div>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">KES</span>
                              <input
                                type="number"
                                placeholder="Max e.g. 10000"
                                value={form.budget_max}
                                onChange={f('budget_max')}
                                min={0}
                                className={`input pl-12 ${errors.budget_max ? 'border-red-500' : ''}`}
                              />
                            </div>
                            {errors.budget_max && <p className="text-red-400 text-xs mt-1">{errors.budget_max}</p>}
                          </div>
                        </div>
                        <p className="text-gray-600 text-xs mt-1.5">Leave blank if you prefer to negotiate directly</p>
                      </div>

                      {/* Remote toggle */}
                      <label className="flex items-center gap-3 cursor-pointer group w-fit">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={form.is_remote}
                          onClick={() => setForm(p => ({ ...p, is_remote: !p.is_remote }))}
                          className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                            form.is_remote ? 'bg-primary' : 'bg-gray-700'
                          }`}
                        >
                          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
                            form.is_remote ? 'left-6' : 'left-1'
                          }`} />
                        </button>
                        <div>
                          <span className="text-sm font-medium text-gray-200">Remote gig</span>
                          <p className="text-xs text-gray-500">Workers can apply from anywhere in Kenya</p>
                        </div>
                      </label>

                      {/* Server error */}
                      {msg && msg !== 'success' && (
                        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                          <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                          </svg>
                          <p className="text-red-400 text-sm">{msg}</p>
                        </div>
                      )}

                      {/* Submit */}
                      <div className="pt-2 border-t border-border flex items-center gap-4">
                        <button
                          type="submit"
                          disabled={posting}
                          className="btn-accent px-8 py-3 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {posting && (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                            </svg>
                          )}
                          {posting ? 'Posting…' : 'Post Gig'}
                        </button>
                        <p className="text-gray-600 text-xs">
                          By posting you agree to the{' '}
                          <Link to="/" className="text-gray-400 hover:text-white transition underline">FIXR Gig Policy</Link>
                        </p>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* ── MY GIGS ──────────────────────────────────────── */}
            {tab === 'my-gigs' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-black text-xl">My Posted Gigs</h2>
                  <button onClick={() => setTab('post')} className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/>
                    </svg>
                    New Gig
                  </button>
                </div>

                {loadingGigs ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="card animate-pulse space-y-3">
                        <div className="h-3 bg-gray-800 rounded w-1/4" />
                        <div className="h-5 bg-gray-800 rounded w-3/4" />
                        <div className="h-3 bg-gray-800 rounded w-full" />
                        <div className="h-3 bg-gray-800 rounded w-2/3" />
                      </div>
                    ))}
                  </div>
                ) : myGigs.length === 0 ? (
                  <div className="card text-center py-16">
                    <div className="text-4xl mb-3">📋</div>
                    <h3 className="font-bold text-lg mb-1">No gigs posted yet</h3>
                    <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
                      Post your first gig and start finding skilled workers across Kenya.
                    </p>
                    <button onClick={() => setTab('post')} className="btn-primary">Post Your First Gig</button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {myGigs.map(gig => {
                      const cat = CATEGORIES.find(c => c.value === gig.category);
                      return (
                        <div key={gig.id} className="card group hover:border-primary/50 hover:shadow-card-hover transition-all duration-300">
                          <div className="flex items-start justify-between mb-3 gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`badge text-xs ${gig.status === 'open' ? 'badge-success' : 'bg-gray-700/60 text-gray-400 border border-gray-700'}`}>
                                {gig.status === 'open' ? '● Open' : gig.status}
                              </span>
                              {cat && (
                                <span className="text-xs text-gray-500 font-medium">{cat.icon} {cat.label}</span>
                              )}
                              {gig.is_remote && (
                                <span className="badge badge-primary text-xs">🌐 Remote</span>
                              )}
                            </div>
                          </div>

                          <h3 className="font-bold text-sm leading-snug mb-2 group-hover:text-accent transition-colors">
                            {gig.title}
                          </h3>
                          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-4">
                            {gig.description}
                          </p>

                          <div className="flex items-center justify-between pt-3 border-t border-border">
                            <div className="flex items-center gap-2">
                              {gig.location && (
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                  </svg>
                                  {gig.location}
                                </span>
                              )}
                              <span className="text-accent text-xs font-bold">
                                {gig.budget_min
                                  ? `KES ${Number(gig.budget_min).toLocaleString()}${gig.budget_max ? ` to ${Number(gig.budget_max).toLocaleString()}` : '+'}`
                                  : 'Negotiable'}
                              </span>
                            </div>
                            <Link
                              to={`/gigs/${gig.id}`}
                              className="text-xs text-gray-500 hover:text-accent transition font-medium flex items-center gap-1"
                            >
                              Applications
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                              </svg>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
