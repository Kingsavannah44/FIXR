import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const ROLE_LABELS = {
  student: '🎓 Student',
  gig_worker: '⚡ Gig Worker',
  sme: '🏢 SME / Business',
  farmer: '🌾 Farmer',
  diaspora: '🌐 Diaspora',
  government: '🏛️ Government',
};

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ bio: '', location: '', skills: '' });
  const [msg, setMsg] = useState('');
  const [fullProfile, setFullProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!user) return;
    api.get('/users/me').then(r => {
      setFullProfile(r.data);
      setForm({
        bio: r.data.bio || '',
        location: r.data.location || '',
        skills: (r.data.skills || []).join(', '),
      });
    });
  }, [user]);

  const save = async e => {
    e.preventDefault();
    setSaving(true);
    await api.patch('/users/me', {
      ...form,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
    });
    const r = await api.get('/users/me');
    setFullProfile(r.data);
    setMsg('Profile updated! +20 pts');
    setSaving(false);
    setTimeout(() => setMsg(''), 3000);
  };

  if (!user)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <div className="text-5xl mb-4">🔐</div>
        <h2 className="text-xl font-bold mb-2">Sign in to view your profile</h2>
        <p className="text-gray-400 mb-6">Your professional identity lives here.</p>
        <a href="/login" className="btn-primary">Login to FIXR</a>
      </div>
    );

  const initials = user.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const skillList = form.skills.split(',').map(s => s.trim()).filter(Boolean);
  const completionFields = [form.bio, form.location, form.skills, user.full_name];
  const completion = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100);

  return (
    <div className="min-h-screen bg-dark">
      {/* Banner */}
      <div className="h-36 bg-gradient-to-r from-primary/40 via-primary/20 to-accent/10 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/5 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-16 pb-20">
        {/* Avatar + Identity row */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-green-700 flex items-center justify-center text-3xl font-black text-white border-4 border-dark shadow-xl flex-shrink-0">
            {user.avatar_url
              ? <img src={user.avatar_url} className="w-full h-full rounded-2xl object-cover" alt="" />
              : initials}
          </div>
          <div className="flex-1 pb-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold leading-none">{user.full_name}</h1>
              <span className="badge bg-primary/20 text-primary text-xs">
                {ROLE_LABELS[user.role] || user.role}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-gray-400">
              {form.location && <span>📍 {form.location}</span>}
              <span>📧 {user.email || user.phone}</span>
            </div>
          </div>
          {/* Points badge */}
          <div className="sm:pb-1 flex-shrink-0">
            <div className="bg-accent/10 border border-accent/30 rounded-xl px-4 py-2 text-center">
              <div className="text-2xl font-black text-accent">{fullProfile?.points || 0}</div>
              <div className="text-xs text-gray-400 font-medium">FIXR Points</div>
            </div>
          </div>
        </div>

        {/* Profile completion bar */}
        <div className="card mb-6 !p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Profile Completion</span>
            <span className={`text-sm font-bold ${completion === 100 ? 'text-accent' : 'text-gray-400'}`}>
              {completion}%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
          {completion < 100 && (
            <p className="text-xs text-gray-500 mt-2">
              Complete your bio, location, and skills to unlock full visibility.
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 mb-6 w-full sm:w-fit overflow-x-auto scrollbar-hide">
          {['profile', 'portfolio', 'activity'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition ${
                activeTab === tab
                  ? 'bg-primary text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* --- TAB: PROFILE --- */}
        {activeTab === 'profile' && (
          <div className="grid md:grid-cols-5 gap-6">
            {/* Edit form */}
            <div className="md:col-span-3 card">
              <h2 className="font-bold text-base mb-5 flex items-center gap-2">
                ✏️ Edit Profile
              </h2>
              <form onSubmit={save} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1 block">Bio</label>
                  <textarea
                    placeholder="Tell clients what you do best…"
                    className="input h-24 resize-none text-sm leading-relaxed"
                    value={form.bio}
                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1 block">Location</label>
                  <input
                    placeholder="e.g. Nairobi, Kenya"
                    className="input text-sm"
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1 block">Skills</label>
                  <input
                    placeholder="React, Node.js, Welding, Photoshop…"
                    className="input text-sm"
                    value={form.skills}
                    onChange={e => setForm(f => ({ ...f, skills: e.target.value }))}
                  />
                  <p className="text-xs text-gray-600 mt-1">Separate skills with commas</p>
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary flex items-center gap-2 disabled:opacity-60"
                  >
                    {saving ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
                    ) : 'Save Changes'}
                  </button>
                  {msg && (
                    <span className="text-accent text-sm font-medium flex items-center gap-1">
                      ✅ {msg}
                    </span>
                  )}
                </div>
              </form>
            </div>

            {/* Skills sidebar */}
            <div className="md:col-span-2 space-y-4">
              {skillList.length > 0 && (
                <div className="card">
                  <h3 className="font-bold text-sm mb-3 text-gray-300">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillList.map(skill => (
                      <span
                        key={skill}
                        className="badge bg-primary/15 text-primary border border-primary/20 text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {form.bio && (
                <div className="card">
                  <h3 className="font-bold text-sm mb-2 text-gray-300">About</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{form.bio}</p>
                </div>
              )}

              <div className="card !p-4 bg-primary/5 border-primary/20">
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">Quick Links</div>
                <div className="space-y-2">
                  <a href="/ai-tools" className="flex items-center gap-2 text-sm text-gray-300 hover:text-accent transition">
                    🤖 <span>Build your AI CV</span>
                  </a>
                  <a href="/gigs" className="flex items-center gap-2 text-sm text-gray-300 hover:text-accent transition">
                    ⚡ <span>Find gigs matching your skills</span>
                  </a>
                  <a href="/learning" className="flex items-center gap-2 text-sm text-gray-300 hover:text-accent transition">
                    🎓 <span>Earn more points with courses</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: PORTFOLIO --- */}
        {activeTab === 'portfolio' && (
          <div>
            {fullProfile?.portfolio?.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {fullProfile.portfolio.map(p => (
                  <div key={p.id} className="card group">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-base">{p.title}</h3>
                      {p.url && (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-accent text-xs hover:underline flex items-center gap-1"
                        >
                          View ↗
                        </a>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{p.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card text-center py-16">
                <div className="text-4xl mb-3">📁</div>
                <h3 className="font-bold text-lg mb-1">No portfolio items yet</h3>
                <p className="text-gray-400 text-sm">Showcase your best work to stand out to employers.</p>
              </div>
            )}
          </div>
        )}

        {/* --- TAB: ACTIVITY --- */}
        {activeTab === 'activity' && (
          <div className="card text-center py-16">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-bold text-lg mb-1">Activity coming soon</h3>
            <p className="text-gray-400 text-sm">Your gig applications, course progress, and earnings will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
