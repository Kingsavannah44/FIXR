import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/client';

const CATEGORIES = [
  { slug: 'all',          label: 'All Gigs',      img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=80&h=80&fit=crop&auto=format&q=70', color: 'from-gray-700' },
  { slug: 'trades',       label: 'Trades',         img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=80&h=80&fit=crop&auto=format&q=70', color: 'from-orange-900' },
  { slug: 'creative',     label: 'Creative',       img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=80&h=80&fit=crop&auto=format&q=70', color: 'from-purple-900' },
  { slug: 'agribusiness', label: 'Agribusiness',   img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=80&h=80&fit=crop&auto=format&q=70', color: 'from-green-900' },
  { slug: 'internship',   label: 'Internships',    img: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=80&h=80&fit=crop&auto=format&q=70', color: 'from-blue-900' },
  { slug: 'remote',       label: 'Remote',         img: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=80&h=80&fit=crop&auto=format&q=70', color: 'from-cyan-900' },
];

const CAT_META = {
  trades:       { img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=80&h=80&fit=crop&auto=format&q=70', badge: 'bg-orange-500/15 text-orange-300 border-orange-500/25' },
  creative:     { img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=80&h=80&fit=crop&auto=format&q=70', badge: 'bg-purple-500/15 text-purple-300 border-purple-500/25' },
  agribusiness: { img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=80&h=80&fit=crop&auto=format&q=70', badge: 'bg-green-500/15 text-green-300 border-green-500/25' },
  internship:   { img: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=80&h=80&fit=crop&auto=format&q=70', badge: 'bg-blue-500/15 text-blue-300 border-blue-500/25' },
  remote:       { img: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=80&h=80&fit=crop&auto=format&q=70', badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25' },
};

const POSTER_AVATARS = [
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=48&h=48&fit=crop&auto=format&q=70',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&auto=format&q=70',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=48&h=48&fit=crop&auto=format&q=70',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=48&h=48&fit=crop&auto=format&q=70',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&h=48&fit=crop&auto=format&q=70',
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
              src="https://images.unsplash.com/photo-1612832021455-245704c6755a?w=300&h=200&fit=crop&auto=format&q=70"
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
