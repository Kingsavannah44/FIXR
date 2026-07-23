import { useState } from 'react';
import { Link } from 'react-router-dom';

const PX = (id, w = 56, h = 56) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

/* ── Link columns ───────────────────────────────────────────────── */
const COLS = [
  {
    heading: 'Services',
    links: [
      { label: 'FIXR Housing',  to: '/housing',      img: PX(186077)  },
      { label: 'Construction',  to: '/construction', img: PX(209315)  },
      { label: 'SONGA na FIXR', to: '/transport',    img: PX(1545743) },
    ],
  },
  {
    heading: 'Platform',
    links: [
      { label: 'Gig Marketplace',    to: '/gigs',       img: PX(2219024) },
      { label: 'Learning Center',    to: '/learning',   img: PX(1181671) },
      { label: 'AI Tools',           to: '/ai-tools',   img: PX(3760067) },
      { label: 'Business Dashboard', to: '/dashboard',  img: PX(3182812) },
      { label: 'Pricing',            to: '/pricing',    img: PX(1181406) },
    ],
  },
  {
    heading: 'Categories',
    links: [
      { label: 'Trades & Artisans', to: '/gigs?category=trades',       img: PX(2219024) },
      { label: 'Creative & Design', to: '/gigs?category=creative',     img: PX(3184291) },
      { label: 'Agribusiness',      to: '/gigs?category=agribusiness', img: PX(1181519) },
      { label: 'Internships',       to: '/gigs?category=internship',   img: PX(1181406) },
      { label: 'Remote & Diaspora', to: '/gigs?category=remote',       img: PX(1181671) },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About FIXR',     to: '/about',   img: PX(1239291) },
      { label: 'Blog & News',    to: '/blog',    img: PX(1181406) },
      { label: 'Contact Us',     to: '/contact', img: PX(1239291) },
      { label: 'Privacy Policy', to: '/',        img: PX(3182812) },
      { label: 'DPA Compliance', to: '/',        img: PX(3354648) },
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
    icon: (
      <svg className="w-[17px] h-[17px]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn', href: 'https://linkedin.com',
    icon: (
      <svg className="w-[17px] h-[17px]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Facebook', href: 'https://facebook.com',
    icon: (
      <svg className="w-[17px] h-[17px]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp', href: 'https://wa.me',
    icon: (
      <svg className="w-[17px] h-[17px]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
      </svg>
    ),
  },
];

const TRUST = [
  { label: 'M-Pesa Native',  icon: '💳' },
  { label: 'Kenya DPA 2022', icon: '🛡️' },
  { label: 'SSL Secured',    icon: '🔒' },
  { label: 'Free to Join',   icon: '✅' },
];

const WORKER_AVATARS = [
  PX(1181406, 48, 48),
  PX(1239291, 48, 48),
  PX(1181244, 48, 48),
  PX(733872,  48, 48),
];

export default function Footer() {
  const [email, setEmail]         = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="mt-20 bg-[#080f14]">

      {/* ── Hero band ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        <img
          src={PX(1118448, 1920, 500)}
          alt="African landscape"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080f14]/60 via-transparent to-[#080f14]" />
        <div className="relative z-10 py-14 sm:py-20 px-4 text-center">
          <div
            className="text-4xl sm:text-6xl lg:text-7xl font-black leading-none select-none mb-4"
            style={{ color: 'rgba(249,168,37,0.10)' }}
          >
            FIXR AFRICA
          </div>
          <p className="text-gray-400 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
            Empowering every African worker from Nairobi to Lagos, Accra to Kigali.
          </p>
        </div>
      </div>

      {/* ── Newsletter band ─────────────────────────────────────────── */}
      <div className="border-y border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Stay in the loop</div>
              <div className="text-gray-500 text-xs mt-0.5">Weekly gigs, tips and FIXR updates. No spam.</div>
            </div>
          </div>

          {subscribed ? (
            <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Subscribed!
            </div>
          ) : (
            <form
              onSubmit={e => { e.preventDefault(); if (email) setSubscribed(true); }}
              className="flex w-full sm:w-auto gap-2"
            >
              <input
                type="email"
                placeholder="your@email.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input flex-1 sm:w-56 text-sm h-10"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-green-700 text-white font-bold text-sm px-5 h-10 rounded-xl transition flex-shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── Main grid ───────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Brand column — full width on mobile, 2 cols on lg */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5 group w-fit">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-green-400 flex items-center justify-center border border-primary/40 group-hover:border-accent/50 transition-all">
                <span className="text-white font-black text-base tracking-tight">FX</span>
              </div>
              <div className="leading-none">
                <div className="text-xl font-black text-accent">FIXR<span className="text-primary">.</span></div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mt-0.5">Africa</div>
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-[240px]">
              Kenya's all-in-one platform for gig workers, students, SMEs, farmers and diaspora.
            </p>

            {/* Socials */}
            <div className="flex flex-wrap gap-2 mb-6">
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

            {/* Trust badges — icon only, no image */}
            <div className="grid grid-cols-2 gap-2">
              {TRUST.map(b => (
                <div
                  key={b.label}
                  className="flex items-center gap-2 bg-gray-900/60 border border-gray-800/60 rounded-xl px-3 py-2"
                >
                  <span className="text-sm flex-shrink-0">{b.icon}</span>
                  <span className="text-xs text-gray-400 font-medium leading-tight">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Link columns — 2-col on mobile, 4-col on lg */}
          <div className="sm:col-span-2 lg:col-span-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {COLS.map(col => (
              <div key={col.heading}>
                <h4 className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500 mb-4 pb-2 border-b border-gray-800/60">
                  {col.heading}
                </h4>
                <ul className="space-y-3">
                  {col.links.map(item => (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        className="flex items-center gap-2.5 group"
                      >
                        <img
                          src={item.img}
                          alt=""
                          className="w-6 h-6 rounded-md object-cover border border-gray-800/80 group-hover:border-accent/40 transition-all duration-200 flex-shrink-0"
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                        <span className="text-sm text-gray-400 group-hover:text-white transition-colors duration-150 font-medium leading-tight">
                          {item.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── Countries strip ─────────────────────────────────────────── */}
      <div className="border-t border-gray-800/50 px-4 sm:px-6 py-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-600 uppercase tracking-widest font-bold">Available in</span>
            {COUNTRIES.map(c => (
              <div
                key={c.name}
                className="flex items-center gap-1.5 bg-gray-900/50 border border-gray-800/60 rounded-full px-3 py-1 hover:border-gray-700 transition cursor-default"
              >
                <img src={c.flag} alt={c.name} className="w-4 h-[12px] object-cover rounded-sm" />
                <span className="text-xs text-gray-400 font-medium">{c.name}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex">
              {WORKER_AVATARS.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#080f14]"
                  style={{ marginLeft: i > 0 ? '-8px' : 0, zIndex: 4 - i }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">
              <span className="text-accent font-bold">50K+</span> workers joined
            </span>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────── */}
      <div className="border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">

          {/* Left: copyright + links — no pipe dividers */}
          <div className="flex items-center gap-4 flex-wrap text-xs text-gray-600 justify-center sm:justify-start">
            <span>© {new Date().getFullYear()} FIXR Africa Ltd.</span>
            <Link to="/" className="hover:text-gray-400 transition flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Home
            </Link>
            <Link to="/about"   className="hover:text-gray-400 transition">About</Link>
            <Link to="/contact" className="hover:text-gray-400 transition">Contact</Link>
            <span className="hidden sm:inline">All rights reserved.</span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Operational
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <img src="https://flagcdn.com/w20/ke.png" alt="Kenya" className="w-4 h-3 object-cover rounded-sm" />
              Nairobi, Kenya
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              className="group flex items-center gap-1.5 text-xs text-gray-600 hover:text-white transition-colors"
            >
              <span className="w-7 h-7 rounded-lg bg-gray-800/80 group-hover:bg-primary border border-gray-700/60 group-hover:border-primary/50 flex items-center justify-center transition-all">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                </svg>
              </span>
              <span className="hidden sm:block">Top</span>
            </button>
          </div>

        </div>
      </div>

      {/* ── Accent ground line ──────────────────────────────────────── */}
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50" />

    </footer>
  );
}
