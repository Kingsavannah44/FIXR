import { useState } from 'react';
import { Link } from 'react-router-dom';

/* ── DATA ──────────────────────────────────────────────────────── */

const COLS = [
  {
    heading: 'Services',
    links: [
      { label: 'FIXR Housing',      to: '/housing',      img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=56&h=56&fit=crop&auto=format&q=70' },
      { label: 'Construction',      to: '/construction', img: 'https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=56&h=56&fit=crop&auto=format&q=70' },
      { label: 'SONGA na FIXR',     to: '/transport',    img: 'https://images.unsplash.com/photo-1559181567-c3190ca9be46?w=56&h=56&fit=crop&auto=format&q=70' },
    ],
  },
  {
    heading: 'Platform',
    links: [
      { label: 'Gig Marketplace',    to: '/gigs',       img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=56&h=56&fit=crop&auto=format&q=70' },
      { label: 'Learning Center',    to: '/learning',   img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=56&h=56&fit=crop&auto=format&q=70' },
      { label: 'AI Tools',           to: '/ai-tools',   img: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=56&h=56&fit=crop&auto=format&q=70' },
      { label: 'Business Dashboard', to: '/dashboard',  img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=56&h=56&fit=crop&auto=format&q=70' },
      { label: 'Pricing',            to: '/pricing',    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=56&h=56&fit=crop&auto=format&q=70' },
    ],
  },
  {
    heading: 'Categories',
    links: [
      { label: 'Trades & Artisans',  to: '/gigs?category=trades',       img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=56&h=56&fit=crop&auto=format&q=70' },
      { label: 'Creative & Design',  to: '/gigs?category=creative',     img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=56&h=56&fit=crop&auto=format&q=70' },
      { label: 'Agribusiness',       to: '/gigs?category=agribusiness', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=56&h=56&fit=crop&auto=format&q=70' },
      { label: 'Internships',        to: '/gigs?category=internship',   img: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=56&h=56&fit=crop&auto=format&q=70' },
      { label: 'Remote & Diaspora',  to: '/gigs?category=remote',       img: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=56&h=56&fit=crop&auto=format&q=70' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About FIXR',     to: '/about',   img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=56&h=56&fit=crop&auto=format&q=70' },
      { label: 'Blog & News',    to: '/blog',    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=56&h=56&fit=crop&auto=format&q=70' },
      { label: 'Contact Us',     to: '/contact', img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=56&h=56&fit=crop&auto=format&q=70' },
      { label: 'Privacy Policy', to: '/',        img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=56&h=56&fit=crop&auto=format&q=70' },
      { label: 'DPA Compliance', to: '/',        img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=56&h=56&fit=crop&auto=format&q=70' },
    ],
  },
];

const COUNTRIES = [
  { name: 'Kenya',    flag: 'https://flagcdn.com/w40/ke.png' },
  { name: 'Uganda',   flag: 'https://flagcdn.com/w40/ug.png' },
  { name: 'Tanzania', flag: 'https://flagcdn.com/w40/tz.png' },
  { name: 'Rwanda',   flag: 'https://flagcdn.com/w40/rw.png' },
  { name: 'Ghana',    flag: 'https://flagcdn.com/w40/gh.png' },
  { name: 'Nigeria',  flag: 'https://flagcdn.com/w40/ng.png' },
];

const SOCIALS = [
  {
    label: 'X / Twitter', href: 'https://twitter.com',
    icon: <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
  },
  {
    label: 'LinkedIn', href: 'https://linkedin.com',
    icon: <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>,
  },
  {
    label: 'Facebook', href: 'https://facebook.com',
    icon: <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>,
  },
  {
    label: 'WhatsApp', href: 'https://wa.me',
    icon: <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>,
  },
];

const TRUST_BADGES = [
  { label: 'M-Pesa Native',   img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=40&h=40&fit=crop&auto=format&q=70' },
  { label: 'Kenya DPA 2022',  img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=40&h=40&fit=crop&auto=format&q=70' },
  { label: 'SSL Secured',     img: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=40&h=40&fit=crop&auto=format&q=70' },
  { label: 'Free to Join',    img: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=40&h=40&fit=crop&auto=format&q=70' },
];

/* ── COMPONENT ──────────────────────────────────────────────────── */

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative mt-24 overflow-hidden">

      {/* ══ GROUND LAYER — Kenya landscape anchors the footer ══════ */}
      <div className="relative h-56 sm:h-72 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=1920&h=600&fit=crop&auto=format&q=85"
          alt="Africa landscape"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark gradient fading upward so it merges with page content */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/30 to-transparent" />
        {/* Dark gradient fading downward so it merges into the footer body */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080f14] via-[#080f14]/60 to-transparent" />

        {/* Centred brand stamp over the landscape */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="text-5xl sm:text-7xl font-black tracking-tight leading-none select-none"
               style={{ color: 'rgba(249,168,37,0.12)', letterSpacing: '-0.03em' }}>
            FIXR AFRICA
          </div>
          <p className="mt-3 text-gray-400 text-sm sm:text-base max-w-sm leading-relaxed">
            Empowering every African worker — from Nairobi to Lagos, Accra to Kigali.
          </p>
        </div>
      </div>

      {/* ══ FOOTER BODY ════════════════════════════════════════════ */}
      <div className="bg-[#080f14]">

        {/* ── NEWSLETTER BAND ────────────────────────────────────── */}
        <div className="border-y border-gray-800/50">
          <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-white font-bold text-sm">Stay in the loop</div>
                <div className="text-gray-400 text-xs mt-0.5">Weekly gigs, tips & FIXR updates. No spam.</div>
              </div>
            </div>
            {subscribed ? (
              <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                You're subscribed!
              </div>
            ) : (
              <form
                onSubmit={e => { e.preventDefault(); if (email) setSubscribed(true); }}
                className="flex w-full md:w-auto gap-2"
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input flex-1 md:w-64 text-sm h-10 rounded-xl"
                />
                <button type="submit" className="bg-primary hover:bg-green-700 text-white font-bold text-sm px-5 h-10 rounded-xl transition flex-shrink-0">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── MAIN LINK GRID ─────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-10">

          {/* Brand column */}
          <div className="sm:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5 group w-fit">
              <img
                src="https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=88&h=88&fit=crop&auto=format&q=80"
                alt="FIXR"
                className="w-12 h-12 rounded-2xl object-cover border border-gray-700 group-hover:border-accent/50 transition-all"
              />
              <div className="leading-none">
                <div className="text-2xl font-black text-accent">FIXR<span className="text-primary">.</span></div>
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-600 mt-0.5">Africa</div>
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-[260px]">
              Kenya's all-in-one platform for gig workers, students, SMEs, farmers, cooperatives, and diaspora.
            </p>

            {/* Socials */}
            <div className="flex gap-2 mb-7">
              {SOCIALS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl bg-gray-800/70 hover:bg-primary border border-gray-700/60 hover:border-primary/60 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-2">
              {TRUST_BADGES.map(b => (
                <div key={b.label} className="flex items-center gap-2 bg-gray-900/60 border border-gray-800/60 rounded-xl px-3 py-2">
                  <img src={b.img} alt={b.label} className="w-6 h-6 rounded-lg object-cover flex-shrink-0" />
                  <span className="text-xs text-gray-400 font-medium leading-tight">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLS.map(col => (
            <div key={col.heading}>
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 mb-5 pb-2 border-b border-gray-800/60">
                {col.heading}
              </h4>
              <ul className="space-y-3.5">
                {col.links.map(item => (
                  <li key={item.label}>
                    {item.external ? (
                      <a href={item.href} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 group">
                        <img src={item.img} alt={item.label} className="w-7 h-7 rounded-lg object-cover border border-gray-800/80 group-hover:border-accent/40 group-hover:scale-110 transition-all duration-200 flex-shrink-0" />
                        <span className="text-sm text-gray-400 group-hover:text-white transition-colors duration-150 font-medium leading-tight flex items-center gap-1">
                          {item.label} <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </span>
                      </a>
                    ) : (
                      <Link to={item.to} className="flex items-center gap-2.5 group">
                        <img src={item.img} alt={item.label} className="w-7 h-7 rounded-lg object-cover border border-gray-800/80 group-hover:border-accent/40 group-hover:scale-110 transition-all duration-200 flex-shrink-0" />
                        <span className="text-sm text-gray-400 group-hover:text-white transition-colors duration-150 font-medium leading-tight">{item.label}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── COUNTRIES STRIP ────────────────────────────────────── */}
        <div className="border-t border-gray-800/50 py-5 px-6">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-600 uppercase tracking-widest font-bold mr-1">Available in</span>
              {COUNTRIES.map(c => (
                <div key={c.name} className="flex items-center gap-1.5 bg-gray-900/50 border border-gray-800/60 rounded-full px-3 py-1.5 hover:border-gray-700 transition cursor-default">
                  <img src={c.flag} alt={c.name} className="w-5 h-[14px] object-cover rounded-sm shadow-sm" />
                  <span className="text-xs text-gray-400 font-medium">{c.name}</span>
                </div>
              ))}
            </div>

            {/* Worker avatars + count */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex">
                {[
                  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=48&h=48&fit=crop&auto=format&q=70',
                  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=48&h=48&fit=crop&auto=format&q=70',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&auto=format&q=70',
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=48&h=48&fit=crop&auto=format&q=70',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover border-[2px] border-[#080f14]"
                    style={{ marginLeft: i > 0 ? '-8px' : 0, zIndex: 4 - i }}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">
                <span className="text-accent font-bold">50K+</span> workers joined
              </span>
            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR ─────────────────────────────────────────── */}
        <div className="border-t border-gray-800/50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">

            {/* Left */}
            <div className="flex items-center gap-3 flex-wrap text-xs text-gray-600">
              <span>© {new Date().getFullYear()} FIXR Africa Ltd.</span>
              <span className="w-px h-3 bg-gray-800" />
              <Link to="/" className="flex items-center gap-1 hover:text-gray-400 transition">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Home
              </Link>
              <span className="w-px h-3 bg-gray-800" />
              <Link to="/about" className="hover:text-gray-400 transition">About</Link>
              <span className="w-px h-3 bg-gray-800" />
              <Link to="/contact" className="hover:text-gray-400 transition">Contact</Link>
              <span className="w-px h-3 bg-gray-800 hidden sm:block" />
              <span className="hidden sm:block">All rights reserved.</span>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
              {/* Status */}
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Operational
              </div>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <img src="https://flagcdn.com/w20/ke.png" alt="Kenya" className="w-4 h-3 object-cover rounded-sm" />
                Nairobi, Kenya
              </div>

              {/* Back to top */}
              <button
                onClick={scrollToTop}
                aria-label="Back to top"
                className="group flex items-center gap-1.5 text-xs text-gray-600 hover:text-white transition-colors"
              >
                <span className="w-7 h-7 rounded-lg bg-gray-800/80 group-hover:bg-primary border border-gray-700/60 group-hover:border-primary/50 flex items-center justify-center transition-all">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                  </svg>
                </span>
                <span className="hidden sm:block">Back to top</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── ABSOLUTE GROUND LINE — solid earth ─────────────────── */}
        <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary opacity-60" />
      </div>
    </footer>
  );
}
