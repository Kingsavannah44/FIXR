import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const PROJECT_TYPES = ['residential', 'commercial', 'infrastructure', 'renovation'];
const STATUS_STYLES = {
  planning: 'bg-blue-900/30 text-blue-400',
  in_progress: 'bg-yellow-900/30 text-yellow-400',
  on_hold: 'bg-gray-800 text-gray-400',
  completed: 'bg-green-900/30 text-green-400',
  cancelled: 'bg-red-900/30 text-red-400',
};

function ProjectCard({ project }) {
  const pct = project.latest_update?.percentage_complete ?? 0;
  return (
    <Link to={`/construction/${project.id}`} className="card hover:border-primary/60 hover:scale-[1.01] transition-all duration-300 block">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-base line-clamp-1">{project.name}</h3>
          <p className="text-gray-400 text-xs mt-0.5">{project.location}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-semibold capitalize flex-shrink-0 ${STATUS_STYLES[project.status] || 'bg-gray-800 text-gray-400'}`}>
          {project.status?.replace('_', ' ')}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Progress</span>
          <span className="font-bold text-accent">{pct}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
        <div>
          <span className="text-gray-600 block">Type</span>
          <span className="capitalize text-white font-medium">{project.project_type}</span>
        </div>
        <div>
          <span className="text-gray-600 block">Budget</span>
          <span className="text-white font-medium">KES {Number(project.total_budget || 0).toLocaleString()}</span>
        </div>
        <div>
          <span className="text-gray-600 block">Members</span>
          <span className="text-white font-medium">{project.member_count || 1}</span>
        </div>
      </div>

      {project.latest_update && (
        <div className="mt-3 pt-3 border-t border-gray-800 text-xs text-gray-500">
          Last update: {new Date(project.latest_update.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
        </div>
      )}
    </Link>
  );
}

export default function Construction() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', location: '', project_type: 'residential',
    estimated_start: '', estimated_end: '', total_budget: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  useEffect(() => {
    if (!user) return navigate('/login');
    api.get('/construction/projects')
      .then(r => setProjects(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const createProject = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post('/construction/projects', {
        ...form,
        total_budget: parseFloat(form.total_budget || 0),
      });
      // Reload projects (includes member count etc)
      const { data: updated } = await api.get('/construction/projects');
      setProjects(updated);
      setForm({ name: '', description: '', location: '', project_type: 'residential', estimated_start: '', estimated_end: '', total_budget: '' });
      setShowCreate(false);
      showToast('Project created!');
      navigate(`/construction/${data.id}`);
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-primary text-white px-5 py-3 rounded-xl shadow-2xl font-semibold text-sm">{toast}</div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-900/30 rounded-xl flex items-center justify-center text-xl">🏗️</div>
            <div>
              <h1 className="text-3xl font-black">FIXR Construction</h1>
              <p className="text-gray-400 text-sm">Supervision transparency. Real-time accountability.</p>
            </div>
          </div>
        </div>
        <button onClick={() => setShowCreate(v => !v)} className="btn-accent px-5 py-2.5 font-bold">
          {showCreate ? '✕ Cancel' : '+ New Project'}
        </button>
      </div>

      {/* Trust pillars */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { icon: '📸', label: 'Photo Updates', desc: 'Daily photo evidence from your site' },
          { icon: '📊', label: 'Live Dashboard', desc: 'Real-time progress tracking' },
          { icon: '🔔', label: '48hr Alerts', desc: 'Auto-notify if updates stop' },
          { icon: '🔍', label: 'FIXR Inspector', desc: 'Independent 3rd-party verification' },
        ].map(t => (
          <div key={t.label} className="bg-gray-900/60 border border-gray-800 rounded-xl p-3">
            <div className="text-xl mb-1">{t.icon}</div>
            <div className="font-semibold text-sm">{t.label}</div>
            <div className="text-gray-400 text-xs mt-0.5">{t.desc}</div>
          </div>
        ))}
      </div>

      {/* Create project form */}
      {showCreate && (
        <form onSubmit={createProject} className="card mb-8 border-primary/30 bg-primary/5">
          <h2 className="font-bold text-lg mb-4">New Construction Project</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold mb-1">Project Name</label>
              <input className="input" placeholder="e.g. Wanjiku Residences Phase 1" required
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold mb-1">Description</label>
              <textarea className="input h-20 resize-none" placeholder="Brief project description..."
                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Location</label>
              <input className="input" placeholder="e.g. Kiambu Road, Nairobi"
                value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Project Type</label>
              <select className="input" value={form.project_type} onChange={e => setForm(f => ({ ...f, project_type: e.target.value }))}>
                {PROJECT_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Estimated Start</label>
              <input className="input" type="date"
                value={form.estimated_start} onChange={e => setForm(f => ({ ...f, estimated_start: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Estimated End</label>
              <input className="input" type="date"
                value={form.estimated_end} onChange={e => setForm(f => ({ ...f, estimated_end: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Total Budget (KES)</label>
              <input className="input" type="number" placeholder="e.g. 5000000"
                value={form.total_budget} onChange={e => setForm(f => ({ ...f, total_budget: e.target.value }))} />
            </div>
            {parseFloat(form.total_budget) >= 500000 && (
              <div className="sm:col-span-2 bg-primary/10 border border-primary/30 rounded-xl p-3 text-sm text-green-300">
                ✅ Budget qualifies for a <strong>FIXR Inspector</strong> — an independent verifier will be assigned.
              </div>
            )}
          </div>
          <div className="flex gap-3 mt-5">
            <button type="submit" disabled={submitting} className="btn-accent px-8 py-2.5 font-black disabled:opacity-50">
              {submitting ? 'Creating...' : 'Create Project →'}
            </button>
            <button type="button" onClick={() => setShowCreate(false)} className="px-5 py-2.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white transition">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Project list */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card animate-pulse space-y-3">
              <div className="h-4 bg-gray-800 rounded w-3/4" />
              <div className="h-2 bg-gray-800 rounded" />
              <div className="h-3 bg-gray-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-5xl mb-3">🏗️</div>
          <p className="font-semibold text-lg">No projects yet</p>
          <p className="text-sm mt-1">Create your first project or get invited by an owner</p>
          <button onClick={() => setShowCreate(true)} className="btn-accent mt-5 px-6 py-2.5">
            + Create Project
          </button>
        </div>
      ) : (
        <div>
          <p className="text-gray-400 text-sm mb-4">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map(p => <ProjectCard key={p.id} project={p} />)}
          </div>
        </div>
      )}
    </main>
  );
}
