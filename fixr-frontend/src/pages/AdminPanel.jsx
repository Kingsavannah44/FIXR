import { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

/* ── helpers ─────────────────────────────────────── */
const fmt = n => Number(n || 0).toLocaleString();
const timeAgo = iso => {
  const s = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

/* ── stat card ───────────────────────────────────── */
function StatCard({ label, value, sub, img, color }) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-gray-800 group hover:border-gray-600 transition">
      <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className={`absolute inset-0 bg-gradient-to-br ${color} to-dark/90`} />
      <div className="relative p-5">
        <div className="text-3xl font-black text-white mb-0.5">{value}</div>
        <div className="text-sm font-semibold text-white/80">{label}</div>
        {sub && <div className="text-xs text-white/50 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

/* ── confirm modal ───────────────────────────────── */
function ConfirmModal({ msg, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="text-3xl mb-3 text-center">⚠️</div>
        <p className="text-white font-semibold text-center mb-1">Are you sure?</p>
        <p className="text-gray-400 text-sm text-center mb-6">{msg}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 border border-gray-700 text-gray-300 rounded-xl py-2.5 text-sm hover:bg-gray-800 transition">Cancel</button>
          <button onClick={onConfirm} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl py-2.5 text-sm font-bold transition">Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ── section header ──────────────────────────────── */
function SectionHeader({ title, count, action }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <h2 className="font-black text-xl text-white">{title}</h2>
        {count !== undefined && (
          <span className="badge bg-primary/20 text-primary border border-primary/30 text-xs">{fmt(count)} total</span>
        )}
      </div>
      {action}
    </div>
  );
}

/* ── nav items ───────────────────────────────────── */
const NAV = [
  { key: 'overview', label: 'Overview',  img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=56&h=56&fit=crop&auto=format&q=70' },
  { key: 'users',    label: 'Users',     img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=56&h=56&fit=crop&auto=format&q=70' },
  { key: 'gigs',     label: 'Gigs',      img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=56&h=56&fit=crop&auto=format&q=70' },
  { key: 'courses',  label: 'Courses',   img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=56&h=56&fit=crop&auto=format&q=70' },
  { key: 'payments', label: 'Payments',  img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=56&h=56&fit=crop&auto=format&q=70' },
];

const ROLE_COLORS = {
  admin:        'bg-red-500/20 text-red-300 border-red-500/30',
  sme:          'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  gig_worker:   'bg-blue-500/20 text-blue-300 border-blue-500/30',
  student:      'bg-purple-500/20 text-purple-300 border-purple-500/30',
  farmer:       'bg-green-500/20 text-green-300 border-green-500/30',
  professional: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  diaspora:     'bg-orange-500/20 text-orange-300 border-orange-500/30',
  government:   'bg-pink-500/20 text-pink-300 border-pink-500/30',
};

const AVATARS = [
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=48&h=48&fit=crop&auto=format&q=70',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=48&h=48&fit=crop&auto=format&q=70',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&auto=format&q=70',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=48&h=48&fit=crop&auto=format&q=70',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&h=48&fit=crop&auto=format&q=70',
];

/* ══════════════════════════════════════════════════ */
export default function AdminPanel() {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');
  const [stats, setStats]       = useState(null);
  const [users, setUsers]       = useState([]);
  const [gigs,  setGigs]        = useState([]);
  const [courses, setCourses]   = useState([]);
  const [payments, setPayments] = useState([]);
  const [search, setSearch]     = useState('');
  const [confirm, setConfirm]   = useState(null); // { msg, onConfirm }
  const [toast, setToast]       = useState('');
  const [editUser, setEditUser] = useState(null);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', level: 'beginner', points_reward: 50 });
  const [addingCourse, setAddingCourse] = useState(false);

  const notify = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  /* ── guard ── */
  if (!user) return <Navigate to="/admin/login" />;
  if (user.role !== 'admin') return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <img src="https://images.unsplash.com/photo-1633265486064-086b219458ec?w=200&h=200&fit=crop&auto=format&q=70" alt="" className="w-24 h-24 rounded-2xl object-cover mb-5 opacity-50" />
      <h2 className="text-2xl font-black mb-2 text-red-400">Access Denied</h2>
      <p className="text-gray-400">This panel is restricted to administrators only.</p>
    </div>
  );

  /* ── fetch ── */
  const loadAll = useCallback(() => {
    api.get('/analytics/overview').then(r => setStats(r.data)).catch(() => {});
    api.get('/users').then(r => setUsers(r.data)).catch(() => {});
    api.get('/gigs').then(r => setGigs(r.data)).catch(() => {});
    api.get('/learning/courses').then(r => setCourses(r.data)).catch(() => {});
    api.get('/payments/history').then(r => setPayments(r.data)).catch(() => {});
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  /* ── actions ── */
  const deleteUser = id => {
    setConfirm({
      msg: 'This will permanently delete the user and all their data.',
      onConfirm: async () => {
        await api.delete(`/users/${id}`).catch(() => {});
        setUsers(u => u.filter(x => x.id !== id));
        setConfirm(null); notify('✅ User deleted');
      },
    });
  };

  const updateUserRole = async (id, role) => {
    await api.patch(`/users/${id}`, { role }).catch(() => {});
    setUsers(u => u.map(x => x.id === id ? { ...x, role } : x));
    setEditUser(null); notify('✅ Role updated');
  };

  const toggleGigStatus = async gig => {
    const status = gig.status === 'open' ? 'closed' : 'open';
    await api.patch(`/gigs/${gig.id}`, { status }).catch(() => {});
    setGigs(g => g.map(x => x.id === gig.id ? { ...x, status } : x));
    notify(`✅ Gig ${status}`);
  };

  const deleteGig = id => {
    setConfirm({
      msg: 'This will permanently remove the gig and all applications.',
      onConfirm: async () => {
        await api.delete(`/gigs/${id}`).catch(() => {});
        setGigs(g => g.filter(x => x.id !== id));
        setConfirm(null); notify('✅ Gig deleted');
      },
    });
  };

  const deleteCourse = id => {
    setConfirm({
      msg: 'This will permanently delete the course and all enrolment data.',
      onConfirm: async () => {
        await api.delete(`/learning/courses/${id}`).catch(() => {});
        setCourses(c => c.filter(x => x.id !== id));
        setConfirm(null); notify('✅ Course deleted');
      },
    });
  };

  const createCourse = async e => {
    e.preventDefault();
    const { data } = await api.post('/learning/courses', newCourse).catch(() => ({ data: null }));
    if (data) {
      setCourses(c => [data, ...c]);
      setNewCourse({ title: '', description: '', level: 'beginner', points_reward: 50 });
      setAddingCourse(false);
      notify('✅ Course created');
    }
  };

  /* ── search filter ── */
  const q = search.toLowerCase();
  const filteredUsers   = users.filter(u => !q || u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
  const filteredGigs    = gigs.filter(g => !q || g.title?.toLowerCase().includes(q));
  const filteredCourses = courses.filter(c => !q || c.title?.toLowerCase().includes(q));

  return (
    <div className="min-h-screen bg-dark">

      {/* ── HEADER BANNER ── */}
      <div className="relative overflow-hidden h-36">
        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=400&fit=crop&auto=format&q=80" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/60 to-dark/80" />
        <div className="relative z-10 h-full flex items-center px-6 max-w-7xl mx-auto gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Admin Panel</h1>
            <p className="text-gray-400 text-sm">Full platform control · Logged in as <span className="text-accent">{user.full_name}</span></p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex gap-6 flex-col lg:flex-row">

        {/* ── SIDEBAR ── */}
        <aside className="lg:w-52 flex-shrink-0">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-2 flex flex-row lg:flex-col gap-1 overflow-x-auto scrollbar-hide lg:sticky lg:top-24">
            {NAV.map(n => (
              <button
                key={n.key}
                onClick={() => { setTab(n.key); setSearch(''); }}
                className={`flex items-center gap-2 lg:gap-3 px-3 py-2 lg:py-2.5 rounded-xl text-sm font-semibold transition-all flex-shrink-0 ${
                  tab === n.key
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <img src={n.img} alt="" className="w-6 h-6 lg:w-7 lg:h-7 rounded-lg object-cover flex-shrink-0" />
                <span className="whitespace-nowrap">{n.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="flex-1 min-w-0 space-y-6">

          {/* ─ Global search ─ */}
          {tab !== 'overview' && (
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={`Search ${tab}…`}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input pl-10 h-10 rounded-xl text-sm w-full max-w-sm"
              />
            </div>
          )}

          {/* ════ OVERVIEW ════ */}
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Users"   value={fmt(stats?.total_users)}        sub="registered"       img="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=200&fit=crop&auto=format&q=60" color="from-blue-900/70" />
                <StatCard label="Open Gigs"     value={fmt(stats?.gigs?.find(g => g.status === 'open')?.count)} sub="live now" img="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=300&h=200&fit=crop&auto=format&q=60" color="from-green-900/70" />
                <StatCard label="Courses Done"  value={fmt(stats?.completed_courses)}  sub="enrollments"      img="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&h=200&fit=crop&auto=format&q=60" color="from-purple-900/70" />
                <StatCard label="Total Paid"    value={`KES ${fmt(stats?.total_payments_kes)}`} sub="via M-Pesa" img="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop&auto=format&q=60" color="from-yellow-900/70" />
              </div>

              {/* Recent users */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <SectionHeader title="Recent Users" count={users.length} />
                <div className="space-y-2">
                  {users.slice(0, 5).map((u, i) => (
                    <div key={u.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-800/50 transition">
                      <img src={u.avatar_url || AVATARS[i % AVATARS.length]} alt="" className="w-9 h-9 rounded-xl object-cover border border-gray-700 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white truncate">{u.full_name}</div>
                        <div className="text-xs text-gray-500 truncate">{u.email || u.phone}</div>
                      </div>
                      <span className={`badge border text-xs ${ROLE_COLORS[u.role] || 'bg-gray-700 text-gray-400 border-gray-600'}`}>{u.role}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent gigs */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <SectionHeader title="Recent Gigs" count={gigs.length} />
                <div className="space-y-2">
                  {gigs.slice(0, 5).map(gig => (
                    <div key={gig.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-800/50 transition">
                      <img
                        src={`https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=56&h=56&fit=crop&auto=format&q=60`}
                        alt=""
                        className="w-9 h-9 rounded-xl object-cover border border-gray-700 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white truncate">{gig.title}</div>
                        <div className="text-xs text-gray-500">{gig.category} · {gig.poster_name}</div>
                      </div>
                      <span className={`badge text-xs border ${gig.status === 'open' ? 'bg-green-500/15 text-green-300 border-green-500/25' : 'bg-gray-700/50 text-gray-400 border-gray-600'}`}>
                        {gig.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════ USERS ════ */}
          {tab === 'users' && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-gray-800">
                <SectionHeader title="Manage Users" count={filteredUsers.length} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 text-left">
                      <th className="px-4 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold">User</th>
                      <th className="px-4 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold hidden sm:table-cell">Contact</th>
                      <th className="px-4 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold">Role</th>
                      <th className="px-4 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold hidden md:table-cell">Points</th>
                      <th className="px-4 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {filteredUsers.map((u, i) => (
                      <tr key={u.id} className="hover:bg-gray-800/30 transition group">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={u.avatar_url || AVATARS[i % AVATARS.length]}
                              alt=""
                              className="w-9 h-9 rounded-xl object-cover border border-gray-700 flex-shrink-0"
                            />
                            <div>
                              <div className="font-semibold text-white leading-tight">{u.full_name}</div>
                              <div className="text-xs text-gray-500">{u.country || 'KE'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <div className="text-gray-400 text-xs truncate max-w-[150px]">{u.email || u.phone}</div>
                        </td>
                        <td className="px-4 py-3">
                          {editUser === u.id ? (
                            <select
                              className="input text-xs h-8 rounded-lg w-32"
                              defaultValue={u.role}
                              onBlur={e => updateUserRole(u.id, e.target.value)}
                              autoFocus
                            >
                              {['admin','gig_worker','student','sme','farmer','cooperative','government','diaspora','professional'].map(r => (
                                <option key={r} value={r}>{r}</option>
                              ))}
                            </select>
                          ) : (
                            <span className={`badge border text-xs cursor-pointer hover:opacity-80 ${ROLE_COLORS[u.role] || 'bg-gray-700 text-gray-400 border-gray-600'}`}
                              onClick={() => setEditUser(u.id)}>
                              {u.role}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-accent font-bold text-sm">{fmt(u.points)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                            <button
                              onClick={() => setEditUser(editUser === u.id ? null : u.id)}
                              className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 flex items-center justify-center transition"
                              title="Edit role"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => deleteUser(u.id)}
                              className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition"
                              title="Delete user"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <div className="py-16 text-center text-gray-500 text-sm">No users found.</div>
                )}
              </div>
            </div>
          )}

          {/* ════ GIGS ════ */}
          {tab === 'gigs' && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-gray-800">
                <SectionHeader title="Manage Gigs" count={filteredGigs.length} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 text-left">
                      <th className="px-4 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold">Gig</th>
                      <th className="px-4 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold hidden md:table-cell">Poster</th>
                      <th className="px-4 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold">Budget</th>
                      <th className="px-4 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold">Status</th>
                      <th className="px-4 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {filteredGigs.map((gig, i) => {
                      const catImg = {
                        trades: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=56&h=56&fit=crop&auto=format&q=60',
                        creative: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=56&h=56&fit=crop&auto=format&q=60',
                        agribusiness: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=56&h=56&fit=crop&auto=format&q=60',
                        internship: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=56&h=56&fit=crop&auto=format&q=60',
                        remote: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=56&h=56&fit=crop&auto=format&q=60',
                      }[gig.category] || 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=56&h=56&fit=crop&auto=format&q=60';
                      return (
                        <tr key={gig.id} className="hover:bg-gray-800/30 transition group">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img src={catImg} alt="" className="w-9 h-9 rounded-xl object-cover border border-gray-700 flex-shrink-0" />
                              <div>
                                <div className="font-semibold text-white leading-tight line-clamp-1 max-w-[180px]">{gig.title}</div>
                                <div className="text-xs text-gray-500 capitalize">{gig.category}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <div className="flex items-center gap-2">
                              <img src={AVATARS[i % AVATARS.length]} alt="" className="w-6 h-6 rounded-full object-cover border border-gray-700" />
                              <span className="text-gray-400 text-xs">{gig.poster_name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-accent text-sm font-bold">
                              {gig.budget_min ? `KES ${fmt(gig.budget_min)}` : '—'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`badge border text-xs ${gig.status === 'open' ? 'bg-green-500/15 text-green-300 border-green-500/25' : 'bg-gray-700/50 text-gray-400 border-gray-600'}`}>
                              {gig.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                              <button
                                onClick={() => toggleGigStatus(gig)}
                                className="w-7 h-7 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 flex items-center justify-center transition"
                                title={gig.status === 'open' ? 'Close gig' : 'Reopen gig'}
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                              </button>
                              <a href={`/gigs/${gig.id}`} className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 flex items-center justify-center transition" title="View gig" target="_blank" rel="noreferrer">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                              <button
                                onClick={() => deleteGig(gig.id)}
                                className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition"
                                title="Delete gig"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredGigs.length === 0 && (
                  <div className="py-16 text-center text-gray-500 text-sm">No gigs found.</div>
                )}
              </div>
            </div>
          )}

          {/* ════ COURSES ════ */}
          {tab === 'courses' && (
            <div className="space-y-4">
              {/* Add course form */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-black text-lg">Manage Courses</h2>
                  <button
                    onClick={() => setAddingCourse(a => !a)}
                    className="flex items-center gap-2 btn-primary text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Course
                  </button>
                </div>

                {addingCourse && (
                  <form onSubmit={createCourse} className="grid sm:grid-cols-2 gap-3 mb-5 p-4 bg-gray-800/40 rounded-xl border border-gray-700/50">
                    <div className="sm:col-span-2">
                      <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1 block">Course Title</label>
                      <input required placeholder="e.g. Advanced Welding for Artisans" className="input text-sm"
                        value={newCourse.title} onChange={e => setNewCourse(n => ({ ...n, title: e.target.value }))} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1 block">Description</label>
                      <textarea required placeholder="What will learners achieve?" className="input text-sm h-20 resize-none"
                        value={newCourse.description} onChange={e => setNewCourse(n => ({ ...n, description: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1 block">Level</label>
                      <select className="input text-sm" value={newCourse.level} onChange={e => setNewCourse(n => ({ ...n, level: e.target.value }))}>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1 block">Points Reward</label>
                      <input type="number" min={10} max={500} className="input text-sm"
                        value={newCourse.points_reward} onChange={e => setNewCourse(n => ({ ...n, points_reward: e.target.value }))} />
                    </div>
                    <div className="sm:col-span-2 flex gap-2">
                      <button type="submit" className="btn-primary text-sm">Create Course</button>
                      <button type="button" onClick={() => setAddingCourse(false)} className="border border-gray-700 text-gray-400 px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition">Cancel</button>
                    </div>
                  </form>
                )}

                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredCourses.map(course => (
                    <div key={course.id} className="group relative bg-gray-800/40 border border-gray-700/50 rounded-xl overflow-hidden hover:border-primary/40 transition">
                      <div className="relative h-24 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=200&fit=crop&auto=format&q=70"
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                        <div className="absolute bottom-2 left-3 flex gap-1">
                          <span className={`badge text-xs border ${
                            course.level === 'beginner' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                            course.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                            'bg-red-500/20 text-red-300 border-red-500/30'
                          }`}>{course.level}</span>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="font-bold text-sm text-white leading-snug mb-1 line-clamp-1">{course.title}</div>
                        <div className="text-xs text-gray-500 line-clamp-2 mb-3">{course.description}</div>
                        <div className="flex items-center justify-between">
                          <span className="text-accent text-xs font-bold">+{course.points_reward} pts</span>
                          <button
                            onClick={() => deleteCourse(course.id)}
                            className="w-6 h-6 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition opacity-0 group-hover:opacity-100"
                            title="Delete course"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredCourses.length === 0 && (
                    <div className="col-span-3 py-12 text-center text-gray-500 text-sm">No courses found.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ════ PAYMENTS ════ */}
          {tab === 'payments' && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-gray-800">
                <SectionHeader title="Payment History" count={payments.length} />
              </div>
              {payments.length === 0 ? (
                <div className="py-16 text-center">
                  <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=150&fit=crop&auto=format&q=70" alt="" className="w-32 h-24 object-cover rounded-2xl mx-auto mb-4 opacity-30" />
                  <p className="text-gray-500 text-sm">No payment records yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800 text-left">
                        <th className="px-4 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold">User</th>
                        <th className="px-4 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold">Amount</th>
                        <th className="px-4 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold">Status</th>
                        <th className="px-4 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold hidden md:table-cell">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60">
                      {payments.map((p, i) => (
                        <tr key={p.id} className="hover:bg-gray-800/30 transition">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <img src={AVATARS[i % AVATARS.length]} alt="" className="w-7 h-7 rounded-lg object-cover border border-gray-700" />
                              <span className="text-gray-300 text-xs">{p.phone || p.user_name || '—'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-accent font-bold">KES {fmt(p.amount)}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`badge border text-xs ${p.status === 'completed' ? 'bg-green-500/15 text-green-300 border-green-500/25' : p.status === 'failed' ? 'bg-red-500/15 text-red-300 border-red-500/25' : 'bg-yellow-500/15 text-yellow-300 border-yellow-500/25'}`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell text-gray-500 text-xs">
                            {p.created_at ? timeAgo(p.created_at) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* ── CONFIRM MODAL ── */}
      {confirm && <ConfirmModal msg={confirm.msg} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}

      {/* ── TOAST ── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 border border-gray-700 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          {toast}
        </div>
      )}
    </div>
  );
}
