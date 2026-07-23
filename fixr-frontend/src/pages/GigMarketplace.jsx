import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/client';

/* ── Pexels — African work context ──────────────────────────────── */
const PX = (id, w = 80, h = 80) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

const CATEGORIES = [
  { slug: 'all',          label: 'All Gigs',     img: PX(1181406),  color: 'from-gray-700'   },  // professional worker — generic
  { slug: 'trades',       label: 'Trades',        img: PX(2219024),  color: 'from-orange-900' },  // tradesperson at work ✓
  { slug: 'creative',     label: 'Creative',      img: PX(3184291),  color: 'from-purple-900' },  // creative/design scene ✓
  { slug: 'agribusiness', label: 'Agribusiness',  img: PX(1181519),  color: 'from-green-900'  },  // outdoor worker/learning ✓
  { slug: 'internship',   label: 'Internships',   img: PX(1181406),  color: 'from-blue-900'   },  // professional ✓
  { slug: 'remote',       label: 'Remote',        img: PX(1181671),  color: 'from-cyan-900'   },  // person on phone/laptop ✓
];

const CAT_META = {
  trades:       { img: PX(2219024), badge: 'bg-orange-500/15 text-orange-300 border-orange-500/25' },
  creative:     { img: PX(3184291), badge: 'bg-purple-500/15 text-purple-300 border-purple-500/25' },
  agribusiness: { img: PX(1181519), badge: 'bg-green-500/15 text-green-300 border-green-500/25'    },
  internship:   { img: PX(1181406), badge: 'bg-blue-500/15 text-blue-300 border-blue-500/25'       },
  remote:       { img: PX(1181671), badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25'       },
};

/* Real African professional portraits for gig posters */
const POSTER_AVATARS = [
  PX(1239291, 48, 48),   // African woman professional
  PX(1181406, 48, 48),   // African man professional
  PX(733872,  48, 48),   // African woman smiling
  PX(1181244, 48, 48),   // African male engineer ✓
  PX(3354648, 48, 48),   // professional driver/worker ✓
];

export default function GigMarketplace() {
  const [params, setParams] = useSearchParams();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const category = params.get('category') || 'all';

  useEffect(() => {
    setLoading(true);
    const query = category !== 'all' ? `?category=${category}` : '';
    api.get(`/gigs${query}`)
      .then(r => setGigs(r.data))
      .finally(() => setLoading(false));
  }, [category]);

  const filtered = gigs.filter(g =>
    !search || g.title.toLowerCase().includes(search.toLowerCase()) ||
    g.description?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCat = CATEGORIES.find(c => c.slug === category) || CATEGORIES[0];

  return (
    <div className="min-h-screen bg-dark">

      {/* ── HERO HEADER ── */}
      <div className="relative overflow-hidden">
        <img
          src={activeCat.img}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${activeCat.color}/80 to-dark/95`} />
        <div className="absolute inset-0 bg-dark/50" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-white mb-1">Gig Marketplace</h1>
              <p className="text-gray-400 text-sm">
                {loading ? '…' : `${filtered.length} opportunities across Kenya & beyond`}
              </p>
            </div>
            <Link
              to="/dashboard?tab=post"
              className="flex items-center gap-2 btn-primary text-sm flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Post a Gig
            </Link>
          </div>

          {/* Search bar */}
          <div className="mt-6 relative max-w-xl">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search gigs by title or keyword…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input pl-10 bg-gray-900/80 backdrop-blur-sm border-gray-700/60 focus:border-primary h-11 rounded-xl text-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ── CATEGORY TABS with real images ── */}
        <div className="flex gap-3 overflow-x-auto pb-1 mb-8 scrollbar-hide">
          {CATEGORIES.map(c => {
            const active = category === c.slug;
            return (
              <button
                key={c.slug}
                onClick={() => setParams(c.slug !== 'all' ? { category: c.slug } : {})}
                className={`flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 border flex-shrink-0 whitespace-nowrap ${
                  active
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                    : 'border-gray-700/60 text-gray-400 hover:border-gray-500 hover:text-white bg-gray-900/40'
                }`}
              >
                <img
                  src={c.img}
                  alt={c.label}
                  className={`w-6 h-6 rounded-full object-cover border-2 transition-all ${active ? 'border-white/40' : 'border-gray-700 opacity-70'}`}
                />
                {c.label}
              </button>
            );
          })}
        </div>

        {/* ── GIG GRID ── */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-gray-800 rounded w-1/3 mb-3" />
                <div className="h-5 bg-gray-800 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-800 rounded w-full mb-1" />
                <div className="h-3 bg-gray-800 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <img
              src={PX(1181406, 300, 200)}
              alt="No results"
              className="w-40 h-28 object-cover rounded-2xl mx-auto mb-4 opacity-40"
            />
            <h3 className="text-lg font-bold text-gray-400 mb-1">No gigs found</h3>
            <p className="text-gray-600 text-sm mb-4">Try a different category or be the first to post!</p>
            <Link to="/dashboard?tab=post" className="btn-primary text-sm">Post the First Gig</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((gig, idx) => {
              const meta = CAT_META[gig.category] || { img: CATEGORIES[0].img, badge: 'bg-gray-700/40 text-gray-300 border-gray-700' };
              const avatar = POSTER_AVATARS[idx % POSTER_AVATARS.length];
              return (
                <Link
                  to={`/gigs/${gig.id}`}
                  key={gig.id}
                  className="group card !p-0 overflow-hidden flex flex-col hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                >
                  {/* Category image banner */}
                  <div className="relative h-28 overflow-hidden flex-shrink-0">
                    <img
                      src={meta.img}
                      alt={gig.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

                    {/* Status pill */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`badge border text-xs ${meta.badge}`}>
                        {gig.category}
                      </span>
                      {gig.is_remote && (
                        <span className="badge bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 text-xs">
                          Remote
                        </span>
                      )}
                    </div>

                    {/* Budget floated to bottom-right of banner */}
                    <div className="absolute bottom-3 right-3">
                      <span className="text-accent font-black text-sm drop-shadow">
                        {gig.budget_min && gig.budget_max
                          ? `KES ${Number(gig.budget_min).toLocaleString()}+`
                          : 'Negotiable'}
                      </span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="flex flex-col flex-1 p-4 gap-2">
                    <h3 className="font-bold text-white leading-snug group-hover:text-accent transition-colors line-clamp-2">
                      {gig.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 flex-1">
                      {gig.description}
                    </p>

                    {/* Footer row */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-800/60 mt-1">
                      <div className="flex items-center gap-2">
                        <img
                          src={avatar}
                          alt={gig.poster_name}
                          className="w-6 h-6 rounded-full object-cover border border-gray-700"
                        />
                        <span className="text-gray-500 text-xs truncate max-w-[100px]">{gig.poster_name}</span>
                      </div>
                      <span className="text-xs text-primary font-semibold group-hover:gap-1 flex items-center gap-0.5 transition-all">
                        View
                        <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
