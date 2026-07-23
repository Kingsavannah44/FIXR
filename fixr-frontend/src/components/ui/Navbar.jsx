import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/* ── Curated African-context imagery ──────────────────────────────
   All Pexels IDs referencing African professionals & workplaces   */
const PX = (id, w = 56, h = 56) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

const MEGA = {
  Explore: {
    img: PX(2219024, 400, 240),   // African tradesperson at work
    tagline: 'Find work across Kenya',
    links: [
      { label: 'Gig Marketplace',    to: '/gigs',      desc: 'Browse & apply for gigs',           img: PX(2219024)  },
      { label: 'Learning Center',    to: '/learning',  desc: 'Upskill, earn FIXR points',         img: PX(1181671)  },
      { label: 'AI Tools',           to: '/ai-tools',  desc: 'CV builder, gig pricing',           img: PX(3760067)  },
      { label: 'Business Dashboard', to: '/dashboard', desc: 'Post gigs, track analytics',        img: PX(3182812)  },
      { label: 'SONGA na FIXR',      to: '/transport', desc: 'Fast, safe transport across Kenya', img: PX(1545743)  },
    ],
  },
  Categories: {
    img: PX(2219024, 400, 240),   // African tradesperson at work
    tagline: 'Every type of work',
    links: [
      { label: 'Housing',           to: '/housing',                    desc: 'Verified listings, escrow payments', img: PX(186077)   },
      { label: 'Construction',      to: '/construction',               desc: 'Project tracking & supervision',     img: PX(209315)   },
      { label: 'Trades & Artisans', to: '/gigs?category=trades',       desc: 'Plumbing, electrical, carpentry',    img: PX(2219024)  },
      { label: 'Creative & Design', to: '/gigs?category=creative',     desc: 'Design, photography, video',         img: PX(3184291)  },
      { label: 'Agribusiness',      to: '/gigs?category=agribusiness', desc: 'Farming, cooperatives, export',      img: PX(1181519)  },  // outdoor ✓
      { label: 'Internships',       to: '/gigs?category=internship',   desc: 'Students & graduates',               img: PX(1181406)  },
    ],
  },
  Company: {
    img: PX(1239291, 400, 240),   // African professional woman — team
    tagline: 'Built for Africa',
    links: [
      { label: 'About FIXR',  to: '/about',   desc: 'Our story & mission',        img: PX(1239291) },
      { label: 'Blog & News', to: '/blog',    desc: 'Stories from the platform',  img: PX(1181406) },
      { label: 'Pricing',     to: '/pricing', desc: 'Free, Pro & Business',        img: PX(3182812) },
      { label: 'Contact Us',  to: '/contact', desc: 'Get in touch with us',        img: PX(1239291) },
    ],
  },
};

const MOBILE_LINKS = [
  { label: 'Home',          to: '/',              img: PX(3182812, 56, 56)  },
  { label: 'Marketplace',   to: '/gigs',          img: PX(2219024, 56, 56)  },
  { label: 'Housing',       to: '/housing',       img: PX(186077, 56, 56)   },
  { label: 'Construction',  to: '/construction',  img: PX(209315, 56, 56)   },
  { label: 'Transport',     to: '/transport',     img: PX(1545743, 56, 56)  },
  { label: 'Learning',      to: '/learning',      img: PX(1181671, 56, 56)  },
  { label: 'AI Tools',      to: '/ai-tools',      img: PX(3760067, 56, 56)  },
  { label: 'Pricing',       to: '/pricing',       img: PX(3182812, 56, 56)  },
  { label: 'Blog',          to: '/blog',          img: PX(1181406, 56, 56)  },
  { label: 'About',         to: '/about',         img: PX(1239291, 56, 56)  },
  { label: 'Contact',       to: '/contact',       img: PX(1239291, 56, 56)  },
  { label: 'Admin Panel',   to: '/admin',         img: PX(3354648, 56, 56), adminOnly: true },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navRef = useRef(null);
  const searchRef = useRef(null);

  const isHome = location.pathname === '/';
  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + '?');

  /* Scroll-aware transparency — only on home page */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close mega menu on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu(null);
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Close everything on route change */
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/gigs?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
      setMobileOpen(false);
    }
  };

  const navBg = isHome && !scrolled
    ? 'bg-transparent border-transparent'
    : 'bg-gray-950/95 backdrop-blur-xl border-gray-800/80 shadow-2xl shadow-black/20';

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-500 ${navBg}`}
    >
      {/* ── TOP BAR ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="relative w-9 h-9">
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary to-green-400 flex items-center justify-center border border-primary/40 group-hover:border-accent/60 transition shadow-glow-primary">
              <span className="text-white font-black text-sm tracking-tight">FX</span>
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-black text-accent tracking-tight">FIXR<span className="text-primary">.</span></span>
            <span className="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-semibold -mt-0.5">Africa</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5">

          {/* Home pill */}
          <Link
            to="/"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
              isActive('/') && location.pathname === '/'
                ? 'bg-primary/15 text-primary border border-primary/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Home
          </Link>

          {/* Mega menu triggers */}
          {Object.keys(MEGA).map(key => (
            <button
              key={key}
              onMouseEnter={() => setOpenMenu(key)}
              onMouseLeave={() => setOpenMenu(null)}
              onClick={() => setOpenMenu(openMenu === key ? null : key)}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                openMenu === key ? 'bg-white/8 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {key}
              <svg
                className={`w-3.5 h-3.5 mt-0.5 transition-transform duration-200 ${openMenu === key ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          ))}

          {user && (
            <Link
              to="/dashboard"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive('/dashboard') ? 'bg-primary/15 text-primary border border-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive('/admin')
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : 'text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Admin Panel
            </Link>
          )}
        </div>

        {/* Desktop search */}
        <form onSubmit={handleSearch} className="hidden lg:flex items-center">
          <div className={`flex items-center gap-2 bg-gray-900/80 border rounded-xl transition-all duration-300 overflow-hidden ${
            searchOpen ? 'w-56 border-gray-600 px-3' : 'w-9 border-gray-800 px-2.5 cursor-pointer hover:border-gray-600'
          } py-2`}
            onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50); }}
          >
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchOpen && (
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                placeholder="Search gigs, courses…"
                className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-full"
              />
            )}
          </div>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(o => !o)}
                className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-2xl border border-gray-700/60 hover:border-gray-600 bg-gray-900/60 hover:bg-gray-800/80 transition group"
              >
                {user.avatar_url ? (
                  <img src={user.avatar_url} className="w-7 h-7 rounded-xl object-cover" alt="" />
                ) : (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-xs font-black text-white">
                    {user.full_name?.[0]}
                  </div>
                )}
                <span className="text-sm text-gray-200 font-medium hidden sm:block">{user.full_name?.split(' ')[0]}</span>
                <svg className={`w-3 h-3 text-gray-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-3">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} className="w-9 h-9 rounded-xl object-cover" alt="" />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-sm font-black text-white">
                        {user.full_name?.[0]}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-bold text-white leading-tight">{user.full_name}</div>
                      <div className="text-xs text-gray-500 capitalize">{user.role?.replace('_', ' ')}</div>
                    </div>
                  </div>
                  {[
                    { label: 'My Profile', to: '/profile',   img: PX(1239291, 28, 28) },
                    { label: 'Dashboard',  to: '/dashboard', img: PX(3182812, 28, 28) },
                    { label: 'AI Tools',   to: '/ai-tools',  img: PX(3760067, 28, 28) },
                    ...(user.role === 'admin' ? [{ label: '⚙️ Admin Panel', to: '/admin', img: PX(3354648, 28, 28) }] : []),
                  ].map(item => (
                    <Link key={item.to} to={item.to} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800/60 hover:text-white transition">
                      <img src={item.img} alt="" className="w-6 h-6 rounded-lg object-cover" />
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-gray-800">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block text-sm text-gray-400 hover:text-white transition px-3 py-2 rounded-xl hover:bg-white/5">
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 bg-accent hover:bg-yellow-500 text-dark font-bold text-sm px-4 py-2 rounded-xl transition shadow-lg shadow-accent/20 hover:shadow-accent/40"
              >
                <div className="w-5 h-5 rounded-full bg-dark/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-dark" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                </div>
                <span className="hidden sm:inline">Join Free</span>
                <span className="sm:hidden">Join</span>
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-xl border border-gray-700 hover:border-gray-600 bg-gray-900/60 transition"
            aria-label="Toggle menu"
          >
            <span className={`w-4 h-0.5 bg-gray-300 rounded-full transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`w-4 h-0.5 bg-gray-300 rounded-full transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`w-4 h-0.5 bg-gray-300 rounded-full transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── MEGA DROPDOWN ───────────────────────────────────────── */}
      {openMenu && (
        <div
          className="hidden lg:block absolute left-0 right-0 top-full border-t border-gray-800/50 bg-gray-950/98 backdrop-blur-xl shadow-2xl shadow-black/40"
          onMouseEnter={() => setOpenMenu(openMenu)}
          onMouseLeave={() => setOpenMenu(null)}
        >
          <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-3 gap-8">
            {/* Links */}
            <div className="col-span-2 grid grid-cols-2 gap-2">
              {MEGA[openMenu].links.map(link => (
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition group"
                  >
                    <img src={link.img} alt={link.label} className="w-11 h-11 rounded-xl object-cover border border-gray-800 group-hover:border-accent/30 transition flex-shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-gray-200 group-hover:text-white transition leading-tight flex items-center gap-1">
                        {link.label}
                        <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 leading-snug">{link.desc}</div>
                    </div>
                  </a>
                ) : (
                  <Link key={link.to} to={link.to} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition group">
                    <img src={link.img} alt={link.label} className="w-11 h-11 rounded-xl object-cover border border-gray-800 group-hover:border-accent/30 transition flex-shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-gray-200 group-hover:text-white transition leading-tight">{link.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5 leading-snug">{link.desc}</div>
                    </div>
                  </Link>
                )
              ))}
            </div>

            {/* Feature image panel */}
            <div className="relative rounded-2xl overflow-hidden border border-gray-800">
              <img src={MEGA[openMenu].img} alt={openMenu} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">{openMenu}</div>
                <div className="text-white font-bold text-base">{MEGA[openMenu].tagline}</div>
                <Link
                  to={MEGA[openMenu].links[0].to}
                  className="mt-3 inline-flex items-center gap-1.5 text-accent text-xs font-bold hover:gap-2.5 transition-all"
                >
                  Explore → 
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE DRAWER ───────────────────────────────────────── */}
      <div className={`lg:hidden fixed inset-0 top-16 z-40 transition-all duration-300 ${mobileOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-dark/60 backdrop-blur-sm transition-opacity ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer panel */}
        <div className={`absolute left-0 top-0 bottom-0 w-80 bg-gray-950 border-r border-gray-800 overflow-y-auto transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 space-y-1">
            {/* User info if logged in */}
            {user && (
              <div className="flex items-center gap-3 p-3 mb-3 bg-gray-900 rounded-2xl border border-gray-800">
                {user.avatar_url ? (
                  <img src={user.avatar_url} className="w-11 h-11 rounded-xl object-cover" alt="" />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-green-600 flex items-center justify-center font-black text-white">
                    {user.full_name?.[0]}
                  </div>
                )}
                <div>
                  <div className="font-bold text-white text-sm">{user.full_name}</div>
                  <div className="text-xs text-gray-500 capitalize">{user.role?.replace('_', ' ')}</div>
                </div>
              </div>
            )}

            {/* Mobile search */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 mb-2">
              <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search gigs, courses…"
                className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-full"
              />
            </form>

            <p className="text-xs uppercase tracking-widest text-gray-600 px-3 pb-1">Navigation</p>

            {MOBILE_LINKS.filter(item => !item.adminOnly || user?.role === 'admin').map(item => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-medium transition ${
                  location.pathname === item.to
                    ? item.adminOnly ? 'bg-red-500/10 text-red-300 border border-red-500/15' : 'bg-primary/10 text-primary border border-primary/15'
                    : item.adminOnly ? 'text-red-400/70 hover:bg-red-500/10 hover:text-red-300' : 'text-gray-300 hover:bg-gray-800/60 hover:text-white'
                }`}
              >
                <img src={item.img} alt="" className="w-9 h-9 rounded-xl object-cover border border-gray-800 flex-shrink-0" />
                {item.label}
                {location.pathname === item.to && (
                  <svg className={`w-3 h-3 ml-auto ${item.adminOnly ? 'text-red-400' : 'text-primary'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </Link>
            ))}

            {user && (
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800/60 hover:text-white transition"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth actions */}
          <div className="p-4 border-t border-gray-800 space-y-2">
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 w-full border border-gray-700 text-gray-300 rounded-xl py-3 text-sm font-medium hover:bg-gray-800 transition">
                  My Profile
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl py-3 text-sm font-medium hover:bg-red-500/20 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center w-full border border-gray-700 text-gray-300 rounded-xl py-3 text-sm font-medium hover:bg-gray-800 transition">
                  Sign In
                </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-yellow-500 text-dark font-bold rounded-xl py-3 text-sm transition">
                  <div className="w-5 h-5 rounded-full bg-dark/20 flex items-center justify-center">
                    <svg className="w-3 h-3 text-dark" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                    </svg>
                  </div>
                  Join Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Spacer to prevent content jump (only when not transparent) */}
      {!(isHome && !scrolled) && <div className="h-0" />}
    </nav>
  );
}
