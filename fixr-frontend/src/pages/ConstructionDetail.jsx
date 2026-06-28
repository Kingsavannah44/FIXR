import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const PHASES = ['foundation','structure','roofing','finishing','electrical','plumbing','landscaping','other'];
const ROLE_COLORS = {
  owner: 'bg-accent/20 text-yellow-300 border-accent/30',
  engineer: 'bg-blue-900/30 text-blue-400 border-blue-800/40',
  supervisor: 'bg-purple-900/30 text-purple-400 border-purple-800/40',
  fundi: 'bg-orange-900/30 text-orange-400 border-orange-800/40',
  fixr_inspector: 'bg-primary/20 text-green-400 border-primary/30',
};
const STATUS_STYLES = {
  planning: 'bg-blue-900/30 text-blue-400',
  in_progress: 'bg-yellow-900/30 text-yellow-400',
  on_hold: 'bg-gray-800 text-gray-400',
  completed: 'bg-green-900/30 text-green-400',
  cancelled: 'bg-red-900/30 text-red-400',
};

export default function ConstructionDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('updates');
  const [updateForm, setUpdateForm] = useState({ title: '', description: '', phase: 'foundation', percentage_complete: 0, photos: [] });
  const [milestoneForm, setMilestoneForm] = useState({ title: '', description: '', due_date: '', target_percentage: 0 });
  const [inviteForm, setInviteForm] = useState({ invitee_email: '', invitee_phone: '', member_role: 'fundi' });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const load = async () => {
    try {
      const [projRes, updatesRes] = await Promise.all([
        api.get(`/construction/projects/${id}`),
        api.get(`/construction/projects/${id}/updates`),
      ]);
      setProject(projRes.data);
      setUpdates(updatesRes.data);
    } catch {
      navigate('/construction');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return navigate('/login');
    load();
  }, [id, user]);

  // Check inactivity on load
  useEffect(() => {
    if (project?.status === 'in_progress') {
      api.get(`/construction/projects/${id}/inactivity-check`).catch(() => {});
    }
  }, [project?.status]);

  const submitUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/construction/projects/${id}/updates`, updateForm);
      setUpdateForm({ title: '', description: '', phase: 'foundation', percentage_complete: 0, photos: [] });
      await load();
      showToast('Update submitted!');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  const addMilestone = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/construction/projects/${id}/milestones`, milestoneForm);
      setMilestoneForm({ title: '', description: '', due_date: '', target_percentage: 0 });
      await load();
      showToast('Milestone added!');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to add milestone');
    } finally {
      setSubmitting(false);
    }
  };

  const inviteMember = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post(`/construction/projects/${id}/invite`, inviteForm);
      setInviteForm({ invitee_email: '', invitee_phone: '', member_role: 'fundi' });
      showToast(`${data.invited} invited as ${data.role}`);
      await load();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to invite');
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (status) => {
    setStatusUpdating(true);
    try {
      await api.patch(`/construction/projects/${id}`, { status });
      await load();
      showToast(`Project status set to: ${status}`);
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-pulse space-y-4">
      <div className="h-8 bg-gray-800 rounded w-1/2" />
      <div className="h-4 bg-gray-800 rounded w-1/3" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-800 rounded-xl" />)}
      </div>
    </div>
  );

  if (!project) return null;

  const latestPct = updates[0]?.percentage_complete ?? 0;
  const myRole = project.my_role;
  const canSubmitUpdate = ['fundi', 'supervisor', 'engineer', 'fixr_inspector', 'owner'].includes(myRole);
  const canManage = ['owner', 'engineer'].includes(myRole);

  const overdueMilestones = (project.milestones || []).filter(m => {
    return m.status === 'pending' && new Date(m.due_date) < new Date();
  });

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-primary text-white px-5 py-3 rounded-xl shadow-2xl font-semibold text-sm">{toast}</div>
      )}

      <Link to="/construction" className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-6">
        ← Back to Projects
      </Link>

      {/* Project header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-black">{project.name}</h1>
            <span className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${STATUS_STYLES[project.status] || 'bg-gray-800 text-gray-400'}`}>
              {project.status?.replace('_', ' ')}
            </span>
          </div>
          <p className="text-gray-400 text-sm">{project.location} · {project.project_type}</p>
          {myRole && (
            <span className={`inline-flex mt-2 items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-semibold ${ROLE_COLORS[myRole] || 'bg-gray-800 text-gray-400 border-gray-700'}`}>
              Your role: {myRole.replace('_', ' ')}
            </span>
          )}
        </div>
        {canManage && (
          <div className="flex gap-2 flex-wrap">
            {['planning', 'in_progress', 'on_hold', 'completed'].map(s => (
              <button key={s} disabled={project.status === s || statusUpdating}
                onClick={() => updateStatus(s)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition ${project.status === s ? 'bg-accent/20 border-accent/40 text-accent' : 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'}`}>
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Overdue alert */}
      {overdueMilestones.length > 0 && (
        <div className="bg-red-900/20 border border-red-800/40 rounded-xl p-4 mb-6 flex items-start gap-3">
          <span className="text-xl flex-shrink-0">⚠️</span>
          <div>
            <p className="font-bold text-red-400 text-sm">{overdueMilestones.length} overdue milestone{overdueMilestones.length > 1 ? 's' : ''}</p>
            <p className="text-gray-400 text-xs">{overdueMilestones.map(m => m.title).join(', ')}</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="card text-center !p-3">
          <div className="text-2xl font-black text-accent">{latestPct}%</div>
          <div className="text-xs text-gray-400 mt-0.5">Progress</div>
        </div>
        <div className="card text-center !p-3">
          <div className="text-2xl font-black">{updates.length}</div>
          <div className="text-xs text-gray-400 mt-0.5">Updates</div>
        </div>
        <div className="card text-center !p-3">
          <div className="text-2xl font-black">{(project.milestones || []).filter(m => m.status === 'achieved').length}/{(project.milestones || []).length}</div>
          <div className="text-xs text-gray-400 mt-0.5">Milestones</div>
        </div>
        <div className="card text-center !p-3">
          <div className="text-2xl font-black">{(project.members || []).length}</div>
          <div className="text-xs text-gray-400 mt-0.5">Team</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="card mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold">Overall Progress</span>
          <span className="font-black text-accent">{latestPct}%</span>
        </div>
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-700"
            style={{ width: `${latestPct}%` }} />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1.5">
          <span>{project.estimated_start ? new Date(project.estimated_start).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' }) : 'Start'}</span>
          <span>{project.estimated_end ? new Date(project.estimated_end).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' }) : 'End'}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-800 mb-6 overflow-x-auto scrollbar-hide">
        {[
          { id: 'updates', label: '📸 Updates' },
          { id: 'milestones', label: '🏁 Milestones' },
          { id: 'team', label: '👥 Team' },
          ...(canSubmitUpdate ? [{ id: 'submit', label: '+ Submit Update' }] : []),
          ...(canManage ? [{ id: 'milestone_add', label: '+ Milestone' }, { id: 'invite', label: '+ Invite' }] : []),
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-semibold whitespace-nowrap transition flex-shrink-0 ${tab === t.id ? 'text-accent border-b-2 border-accent' : 'text-gray-400 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Updates feed */}
      {tab === 'updates' && (
        <div className="space-y-4">
          {updates.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <div className="text-5xl mb-3">📸</div>
              <p className="font-semibold">No updates yet</p>
              {canSubmitUpdate && <button onClick={() => setTab('submit')} className="btn-primary mt-4 px-6">Submit First Update</button>}
            </div>
          ) : updates.map(u => {
            const photos = (() => { try { return JSON.parse(u.photos || '[]'); } catch { return []; } })();
            return (
              <div key={u.id} className={`card ${u.is_fixr_verified ? 'border-primary/40 bg-primary/5' : ''}`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-700 flex items-center justify-center text-sm font-black flex-shrink-0">
                    {u.contributor_name?.[0] || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm">{u.contributor_name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${ROLE_COLORS[u.contributor_role] || 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                        {u.contributor_role?.replace('_', ' ')}
                      </span>
                      {u.is_fixr_verified && (
                        <span className="text-xs text-green-400 bg-primary/20 border border-primary/30 px-2 py-0.5 rounded-full font-bold">
                          ✅ FIXR Verified
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {new Date(u.created_at).toLocaleString('en-KE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-accent font-black text-sm">{u.percentage_complete}%</div>
                    <div className="text-gray-500 text-xs capitalize">{u.phase}</div>
                  </div>
                </div>

                <h3 className="font-bold mb-1">{u.title}</h3>
                {u.description && <p className="text-gray-300 text-sm mb-3 leading-relaxed">{u.description}</p>}

                {photos.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {photos.map((p, i) => (
                      <img key={i} src={p} alt={`Update photo ${i + 1}`}
                        className="w-24 h-20 rounded-xl object-cover border border-gray-700 hover:scale-110 transition" />
                    ))}
                  </div>
                )}

                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: `${u.percentage_complete}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0">{u.percentage_complete}% complete</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Milestones */}
      {tab === 'milestones' && (
        <div className="space-y-3">
          {(project.milestones || []).length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-5xl mb-3">🏁</div>
              <p className="font-semibold">No milestones yet</p>
              {canManage && <button onClick={() => setTab('milestone_add')} className="btn-primary mt-4 px-6">Add Milestone</button>}
            </div>
          ) : (project.milestones || []).map(m => {
            const isOverdue = m.status === 'pending' && new Date(m.due_date) < new Date();
            const displayStatus = isOverdue ? 'overdue' : m.status;
            return (
              <div key={m.id} className={`card flex items-start gap-4 ${isOverdue ? 'border-red-800/40' : m.status === 'achieved' ? 'border-primary/40' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${m.status === 'achieved' ? 'bg-primary/20' : isOverdue ? 'bg-red-900/20' : 'bg-gray-800'}`}>
                  {m.status === 'achieved' ? '✅' : isOverdue ? '⚠️' : '🏁'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold">{m.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${m.status === 'achieved' ? 'bg-green-900/30 text-green-400' : isOverdue ? 'bg-red-900/30 text-red-400' : 'bg-gray-800 text-gray-400'}`}>
                      {displayStatus}
                    </span>
                  </div>
                  {m.description && <p className="text-gray-400 text-xs mb-1">{m.description}</p>}
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>Due: {new Date(m.due_date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>Target: {m.target_percentage}%</span>
                    {m.achieved_at && <span className="text-green-400">Achieved: {new Date(m.achieved_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Team */}
      {tab === 'team' && (
        <div className="space-y-3">
          {(project.members || []).map(m => (
            <div key={m.id} className="card flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center font-bold">
                {m.full_name?.[0] || '?'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{m.full_name}</span>
                  {!m.accepted && <span className="text-xs text-yellow-400 bg-yellow-900/20 px-1.5 py-0.5 rounded">Pending</span>}
                </div>
                <p className="text-gray-500 text-xs">{m.email}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold capitalize ${ROLE_COLORS[m.member_role] || 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                {m.member_role?.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Submit update */}
      {tab === 'submit' && canSubmitUpdate && (
        <form onSubmit={submitUpdate} className="space-y-4 max-w-xl">
          <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-xl p-3 text-xs text-yellow-300">
            ⚠️ Updates are immutable. Once submitted, they cannot be edited — this ensures an honest audit trail.
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Update Title</label>
            <input className="input" placeholder="e.g. Ground floor columns cast" required
              value={updateForm.title} onChange={e => setUpdateForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea className="input h-24 resize-none" placeholder="What was done? Any issues?"
              value={updateForm.description} onChange={e => setUpdateForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Phase</label>
              <select className="input" value={updateForm.phase} onChange={e => setUpdateForm(f => ({ ...f, phase: e.target.value }))}>
                {PHASES.map(p => <option key={p} value={p} className="capitalize">{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">% Complete: {updateForm.percentage_complete}%</label>
              <input type="range" min={0} max={100} step={5}
                className="w-full accent-accent"
                value={updateForm.percentage_complete}
                onChange={e => setUpdateForm(f => ({ ...f, percentage_complete: parseInt(e.target.value) }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Photo URLs (one per line, max 5)</label>
            <textarea className="input h-20 resize-none text-xs" placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg"
              onChange={e => {
                const urls = e.target.value.split('\n').map(u => u.trim()).filter(Boolean).slice(0, 5);
                setUpdateForm(f => ({ ...f, photos: urls }));
              }} />
            <p className="text-xs text-gray-500 mt-1">Demo mode: paste image URLs. Production: file upload.</p>
          </div>
          <button type="submit" disabled={submitting} className="btn-accent px-8 py-3 font-black disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Submit Update (Immutable) →'}
          </button>
        </form>
      )}

      {/* Add milestone */}
      {tab === 'milestone_add' && canManage && (
        <form onSubmit={addMilestone} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-semibold mb-1">Milestone Title</label>
            <input className="input" placeholder="e.g. Foundation Complete" required
              value={milestoneForm.title} onChange={e => setMilestoneForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <input className="input" placeholder="Optional description"
              value={milestoneForm.description} onChange={e => setMilestoneForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Due Date</label>
              <input className="input" type="date" required
                value={milestoneForm.due_date} onChange={e => setMilestoneForm(f => ({ ...f, due_date: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Target Progress: {milestoneForm.target_percentage}%</label>
              <input type="range" min={0} max={100} step={5}
                className="w-full accent-accent mt-3"
                value={milestoneForm.target_percentage}
                onChange={e => setMilestoneForm(f => ({ ...f, target_percentage: parseInt(e.target.value) }))} />
            </div>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary px-8 py-3 font-black disabled:opacity-50">
            {submitting ? 'Adding...' : 'Add Milestone'}
          </button>
        </form>
      )}

      {/* Invite */}
      {tab === 'invite' && canManage && (
        <form onSubmit={inviteMember} className="space-y-4 max-w-md">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-3 text-xs text-gray-400">
            Invite by email or phone. The user must have a FIXR account. They'll receive a notification and must accept.
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input className="input" type="email" placeholder="user@example.com"
              value={inviteForm.invitee_email} onChange={e => setInviteForm(f => ({ ...f, invitee_email: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">OR Phone</label>
            <input className="input" placeholder="254700000000"
              value={inviteForm.invitee_phone} onChange={e => setInviteForm(f => ({ ...f, invitee_phone: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Role</label>
            <select className="input" value={inviteForm.member_role} onChange={e => setInviteForm(f => ({ ...f, member_role: e.target.value }))}>
              {['engineer', 'supervisor', 'fundi', 'fixr_inspector'].map(r => (
                <option key={r} value={r} className="capitalize">{r.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={submitting} className="btn-accent px-8 py-3 font-black disabled:opacity-50">
            {submitting ? 'Inviting...' : 'Send Invitation'}
          </button>
        </form>
      )}
    </main>
  );
}
