import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const TOOLS = [
  {
    key: 'cv',
    label: 'AI CV Builder',
    desc: 'Generate a professional CV from your FIXR profile in seconds.',
    img: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop&auto=format&q=80',
    accent: 'from-blue-900/60',
    tag: 'Most Popular',
  },
  {
    key: 'pricing',
    label: 'Gig Pricing Advisor',
    desc: 'Know your market rate before you quote. Never undersell again.',
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop&auto=format&q=80',
    accent: 'from-green-900/60',
    tag: 'Free',
  },
];

export default function AITools() {
  const { user } = useAuth();
  const [tab, setTab] = useState('cv');
  const [cv, setCv] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [pricingForm, setPricingForm] = useState({ category: 'trades', skills: '', location: 'Nairobi' });
  const [loading, setLoading] = useState(false);

  const generateCV = async () => {
    setLoading(true);
    const { data } = await api.post('/ai/cv-builder');
    setCv(data); setLoading(false);
  };

  const getPricing = async e => {
    e.preventDefault(); setLoading(true);
    const payload = { ...pricingForm, skills: pricingForm.skills.split(',').map(s => s.trim()).filter(Boolean) };
    const { data } = await api.post('/ai/gig-pricing', payload);
    setPricing(data); setLoading(false);
  };

  if (!user) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <img
        src="https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=300&fit=crop&auto=format&q=80"
        alt=""
        className="w-48 h-36 object-cover rounded-2xl mb-6 opacity-60"
      />
      <h2 className="text-2xl font-black mb-2">AI Tools for African Workers</h2>
      <p className="text-gray-400 mb-6 max-w-sm">Sign in to access your free CV builder, pricing advisor, and personalised course recommendations.</p>
      <Link to="/login" className="btn-accent">Sign In to Continue</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="relative py-16 px-6 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1600&h=500&fit=crop&auto=format&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="badge bg-accent/20 text-accent border border-accent/30 mb-4 inline-block">🤖 Powered by AI</span>
          <h1 className="text-4xl md:text-5xl font-black mb-3">AI Tools</h1>
          <p className="text-gray-400 text-lg">Built for African workers. No extra cost, ever.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 -mt-4">
        {/* Tool selector cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {TOOLS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`group relative rounded-2xl overflow-hidden text-left transition-all duration-300 border-2 ${
                tab === t.key ? 'border-accent shadow-lg shadow-accent/10 scale-[1.01]' : 'border-gray-800 hover:border-gray-600'
              }`}
            >
              <img src={t.img} alt={t.label} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className={`absolute inset-0 bg-gradient-to-t ${t.accent} to-transparent`} />
              {tab === t.key && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-dark" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white">{t.label}</h3>
                  <span className="badge bg-accent/20 text-accent text-xs">{t.tag}</span>
                </div>
                <p className="text-gray-300 text-xs leading-snug">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* CV Builder */}
        {tab === 'cv' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="font-black text-xl mb-2">Generate Your CV</h2>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                We pull your name, role, skills, bio, and portfolio from your FIXR profile and craft a polished, job-ready CV instantly.
              </p>
              <div className="space-y-3 mb-6">
                {['Professional summary written by AI', 'Skills section auto-formatted', 'Portfolio projects included', 'Downloadable PDF (coming soon)'].map(f => (
                  <div key={f} className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    {f}
                  </div>
                ))}
              </div>
              <button onClick={generateCV} disabled={loading} className="btn-accent w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />Generating…</>
                  : '✨ Generate My CV'}
              </button>
            </div>

            {cv ? (
              <div className="card bg-white text-gray-900 space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-2xl font-black text-gray-900">{cv.name}</h3>
                  <p className="text-primary font-semibold capitalize">{cv.role?.replace('_', ' ')}</p>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Summary</div>
                  <p className="text-gray-700 text-sm leading-relaxed">{cv.summary}</p>
                </div>
                {cv.skills?.length > 0 && (
                  <div>
                    <div className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Skills</div>
                    <div className="flex flex-wrap gap-1.5">
                      {cv.skills.map(s => (
                        <span key={s} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full border border-gray-200">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {cv.portfolio?.length > 0 && (
                  <div>
                    <div className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Portfolio</div>
                    {cv.portfolio.map((p, i) => (
                      <div key={i} className="text-sm text-gray-700 mb-1">▸ <strong>{p.title}</strong>: {p.description}</div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-400 border-t border-gray-100 pt-3">
                  Generated {new Date(cv.generated_at).toLocaleString()}
                </p>
              </div>
            ) : (
              <div className="card border-dashed border-gray-700 flex flex-col items-center justify-center text-center py-16">
                <div className="text-4xl mb-3">📄</div>
                <p className="text-gray-500 text-sm">Your generated CV will appear here</p>
              </div>
            )}
          </div>
        )}

        {/* Pricing Advisor */}
        {tab === 'pricing' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="font-black text-xl mb-2">Gig Pricing Advisor</h2>
              <p className="text-sm text-gray-400 mb-6">Know your market rate before you quote. Never undersell again.</p>
              <form onSubmit={getPricing} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1 block">Category</label>
                  <select className="input" value={pricingForm.category}
                    onChange={e => setPricingForm(f => ({ ...f, category: e.target.value }))}>
                    {[['trades','🔧 Trades'],['creative','🎨 Creative'],['agribusiness','🌾 Agribusiness'],['internship','💼 Internship'],['remote','🌐 Remote']].map(([v,l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1 block">Your Skills</label>
                  <input placeholder="e.g. Welding, Plumbing, React" className="input"
                    value={pricingForm.skills}
                    onChange={e => setPricingForm(f => ({ ...f, skills: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1 block">Location</label>
                  <input placeholder="e.g. Nairobi, Mombasa" className="input"
                    value={pricingForm.location}
                    onChange={e => setPricingForm(f => ({ ...f, location: e.target.value }))} />
                </div>
                <button type="submit" disabled={loading} className="btn-accent w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />Calculating…</>
                    : '💡 Get My Pricing Advice'}
                </button>
              </form>
            </div>

            {pricing ? (
              <div className="card space-y-5">
                <div className="text-center p-6 bg-accent/10 rounded-xl border border-accent/20">
                  <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">Recommended Rate</div>
                  <div className="text-4xl font-black text-accent">
                    KES {Number(pricing.recommended_min).toLocaleString()} to {Number(pricing.recommended_max).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{pricing.unit}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3">Tips to Earn More</div>
                  <div className="space-y-2">
                    {pricing.tips.map((t, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-gray-300 bg-gray-800/50 rounded-lg px-3 py-2.5">
                        <span className="text-accent mt-0.5">💡</span> {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card border-dashed border-gray-700 flex flex-col items-center justify-center text-center py-16">
                <div className="text-4xl mb-3">💰</div>
                <p className="text-gray-500 text-sm">Your pricing recommendation will appear here</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
