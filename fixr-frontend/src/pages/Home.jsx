import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

/* ── DATA ─────────────────────────────────────────────── */

const STATS = [
  { label: 'Active Workers', value: '50K+', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=120&h=120&fit=crop&auto=format&q=80' },
  { label: 'Gigs Posted',    value: '12K+', img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=120&h=120&fit=crop&auto=format&q=80' },
  { label: 'Courses',        value: '300+', img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=120&h=120&fit=crop&auto=format&q=80' },
  { label: 'Countries',      value: '6',    img: 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=120&h=120&fit=crop&auto=format&q=80' },
];

const CATEGORIES = [
  { label: 'Housing',             sub: 'Verified listings, Escrow payments',   slug: null, link: '/housing',      img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1080&h=1080&fit=crop&auto=format&q=80', accent: 'from-blue-900/80' },
  { label: 'Construction',        sub: 'Project tracking, Supervision reports', slug: null, link: '/construction', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1080&h=1080&fit=crop&auto=format&q=80', accent: 'from-yellow-900/80' },
  { label: 'Trades & Artisans',   sub: 'Plumbing, Electrical, Carpentry',       slug: 'trades',       img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1080&h=1080&fit=crop&auto=format&q=80', accent: 'from-orange-900/80' },
  { label: 'Creative & Design',   sub: 'Design, Photography, Video',            slug: 'creative',     img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1080&h=1080&fit=crop&auto=format&q=80', accent: 'from-purple-900/80' },
  { label: 'Agribusiness',        sub: 'Farming, Cooperatives, Export',         slug: 'agribusiness', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1080&h=1080&fit=crop&auto=format&q=80', accent: 'from-green-900/80' },
  { label: 'AI Tools',            sub: 'CV Builder, Gig Pricing, Recs',         slug: null, link: '/ai-tools', img: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1080&h=1080&fit=crop&auto=format&q=80', accent: 'from-yellow-900/80' },
];

/* Each full-page scroll section — previewing every major page */
const SCROLL_SECTIONS = [
  {
    id: 'housing',
    label: 'FIXR Housing',
    headline: 'Rent without\nthe fraud.',
    sub: 'Verified landlords only. Escrow-protected deposits. Direct tenant–landlord messaging. No middlemen, no scams.',
    cta: 'Browse Housing',
    to: '/housing',
    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&h=1000&fit=crop&auto=format&q=85',
    pills: [
      { text: 'Verified Owners', img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=60&h=60&fit=crop&auto=format&q=70' },
      { text: 'Escrow Safe', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=60&h=60&fit=crop&auto=format&q=70' },
      { text: 'Direct Chat', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=60&h=60&fit=crop&auto=format&q=70' },
    ],
    align: 'left',
    accent: 'from-blue-900/60',
  },
  {
    id: 'construction',
    label: 'Construction',
    headline: 'Supervise every\nbrick and beam.',
    sub: 'Real-time project updates, photo evidence, milestone tracking, and FIXR inspector verification — so your building project never goes dark.',
    cta: 'Track Projects',
    to: '/construction',
    img: 'https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=1600&h=1000&fit=crop&auto=format&q=85',
    pills: [
      { text: 'Daily Updates', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=60&h=60&fit=crop&auto=format&q=70' },
      { text: 'FIXR Inspector', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=60&h=60&fit=crop&auto=format&q=70' },
      { text: 'Milestones', img: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=60&h=60&fit=crop&auto=format&q=70' },
    ],
    align: 'right',
    accent: 'from-yellow-900/60',
  },
  {
    id: 'gigs',
    label: 'Gig Marketplace',
    headline: 'Find work. Post work.\nGet paid instantly.',
    sub: 'Hundreds of local and remote gigs across Kenya — from trades to tech. Apply in seconds, get paid via M-Pesa.',
    cta: 'Browse Gigs',
    to: '/gigs',
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&h=1000&fit=crop&auto=format&q=85',
    pills: [
      { text: 'Trades', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=60&h=60&fit=crop&auto=format&q=70' },
      { text: 'Creative', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=60&h=60&fit=crop&auto=format&q=70' },
      { text: 'Remote', img: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=60&h=60&fit=crop&auto=format&q=70' },
      { text: 'Agri', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=60&h=60&fit=crop&auto=format&q=70' },
    ],
    align: 'left',
    accent: 'from-blue-900/60',
  },
  {
    id: 'learning',
    label: 'Learning Center',
    headline: 'Upskill and earn\nFIXR points.',
    sub: '300+ courses built for African workers. Complete a course, earn points, unlock better gigs.',
    cta: 'Explore Courses',
    to: '/learning',
    img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&h=1000&fit=crop&auto=format&q=85',
    pills: [
      { text: 'Beginner', img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=60&h=60&fit=crop&auto=format&q=70' },
      { text: 'Intermediate', img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=60&h=60&fit=crop&auto=format&q=70' },
      { text: 'Advanced', img: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=60&h=60&fit=crop&auto=format&q=70' },
      { text: 'AI Guided', img: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=60&h=60&fit=crop&auto=format&q=70' },
    ],
    align: 'right',
    accent: 'from-purple-900/60',
  },
  {
    id: 'ai',
    label: 'AI Tools',
    headline: 'AI that works\nfor African workers.',
    sub: 'Free AI CV builder, gig pricing advisor, and personalised course recommendations — powered by FIXR intelligence.',
    cta: 'Try AI Tools',
    to: '/ai-tools',
    img: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1600&h=1000&fit=crop&auto=format&q=85',
    pills: [
      { text: 'CV Builder', img: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=60&h=60&fit=crop&auto=format&q=70' },
      { text: 'Pricing', img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=60&h=60&fit=crop&auto=format&q=70' },
      { text: 'Recs', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=60&h=60&fit=crop&auto=format&q=70' },
    ],
    align: 'left',
    accent: 'from-yellow-900/60',
  },
  {
    id: 'about',
    label: 'About Us',
    headline: 'Built for Africa,\nby Africans.',
    sub: 'We started FIXR because talented people across Kenya were struggling to find work — not because there wasn\'t work, but because the tools weren\'t built for them.',
    cta: 'Our Story',
    to: '/about',
    img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&h=1000&fit=crop&auto=format&q=85',
    pills: [
      { text: 'Nairobi', img: 'https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=60&h=60&fit=crop&auto=format&q=70' },
      { text: 'Team', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=60&h=60&fit=crop&auto=format&q=70' },
      { text: 'Mission', img: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=60&h=60&fit=crop&auto=format&q=70' },
    ],
    align: 'right',
    accent: 'from-green-900/60',
  },
  {
    id: 'pricing',
    label: 'Pricing',
    headline: 'Free forever.\nUpgrade when ready.',
    sub: 'The Free plan gives you everything you need to start. Pro and Business plans unlock unlimited applications, analytics, and priority listing.',
    cta: 'See Pricing',
    to: '/pricing',
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&h=1000&fit=crop&auto=format&q=85',
    pills: [
      { text: 'Free Plan', img: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=60&h=60&fit=crop&auto=format&q=70' },
      { text: 'Pro · KES 499', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=60&h=60&fit=crop&auto=format&q=70' },
      { text: 'Business', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=60&h=60&fit=crop&auto=format&q=70' },
    ],
    align: 'left',
    accent: 'from-cyan-900/60',
  },
  {
    id: 'blog',
    label: 'Blog & News',
    headline: 'Stories from\nthe platform.',
    sub: 'News, guides, and insights from the FIXR team and community. Learn how workers across Africa are growing with FIXR.',
    cta: 'Read the Blog',
    to: '/blog',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=1000&fit=crop&auto=format&q=85',
    pills: [
      { text: 'News', img: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=60&h=60&fit=crop&auto=format&q=70' },
      { text: 'Guides', img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=60&h=60&fit=crop&auto=format&q=70' },
      { text: 'Community', img: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=60&h=60&fit=crop&auto=format&q=70' },
    ],
    align: 'right',
    accent: 'from-orange-900/60',
  },
];

/* ── COMPONENT ─────────────────────────────────────────── */

function useInView(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.25 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

function ScrollSection({ s }) {
  const ref = useRef(null);
  const visible = useInView(ref);
  const isLeft = s.align === 'left';

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Full-bleed background */}
      <img
        src={s.img}
        alt={s.label}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      {/* Directional gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-${isLeft ? 'r' : 'l'} ${s.accent} via-dark/70 to-dark/95`} />
      <div className="absolute inset-0 bg-dark/40" />

      {/* Content */}
      <div className={`relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
        <div
          className={`max-w-xl transition-all duration-1000 ${
            visible
              ? 'opacity-100 translate-y-0'
              : isLeft
              ? 'opacity-0 -translate-x-16'
              : 'opacity-0 translate-x-16'
          }`}
        >
          {/* Page label pill with image */}
          <div className="flex items-center gap-2 mb-6">
            <img src={s.pills[0].img} alt="" className="w-8 h-8 rounded-lg object-cover border border-white/10" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-300 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
              {s.label}
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight text-white mb-5 drop-shadow-lg whitespace-pre-line">
            {s.headline}
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-md">
            {s.sub}
          </p>

          {/* Image pills row */}
          <div className="flex flex-wrap gap-2 mb-8">
            {s.pills.map(p => (
              <div key={p.text} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5">
                <img src={p.img} alt={p.text} className="w-5 h-5 rounded-full object-cover" />
                <span className="text-xs text-white font-medium">{p.text}</span>
              </div>
            ))}
          </div>

          <Link
            to={s.to}
            className="inline-flex items-center gap-2 btn-accent px-8 py-3 text-base shadow-xl shadow-accent/20"
          >
            {s.cta} →
          </Link>
        </div>
      </div>

      {/* Section indicator dot */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <div className="w-1 h-10 bg-gradient-to-b from-white/0 to-white/20 mx-auto mb-2 rounded-full" />
        <span className="text-xs text-gray-500 uppercase tracking-widest">{s.label}</span>
      </div>
    </section>
  );
}

export default function Home() {
  const heroRef = useRef(null);
  const [heroVisible, setHeroVisible] = useState(true);

  /* Parallax scroll on hero image */
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main>

      {/* ══ HERO — full-viewport with parallax ══════════════════════ */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1920&h=1080&fit=crop&auto=format&q=90"
          alt="FIXR Africa hero"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          className="absolute inset-0 w-full h-[120%] object-cover will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/50 via-dark/40 to-dark" />

        {/* Floating worker avatars */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&auto=format&q=70', top: '20%', left: '8%',  label: 'Engineer', delay: '0s' },
            { img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=80&h=80&fit=crop&auto=format&q=70', top: '65%', left: '5%',  label: 'Designer', delay: '0.4s' },
            { img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format&q=70', top: '25%', right: '7%', label: 'Developer', delay: '0.2s' },
            { img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format&q=70', top: '70%', right: '6%', label: 'Farmer', delay: '0.6s' },
          ].map((a, i) => (
            <div
              key={i}
              className="absolute hidden md:flex flex-col items-center gap-1 animate-bounce"
              style={{ top: a.top, left: a.left, right: a.right, animationDelay: a.delay, animationDuration: '3s' }}
            >
              <img src={a.img} alt={a.label} className="w-12 h-12 rounded-full border-2 border-accent/60 object-cover shadow-xl" />
              <span className="text-xs text-white/70 bg-dark/60 backdrop-blur-sm px-2 py-0.5 rounded-full">{a.label}</span>
            </div>
          ))}
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Kenya flag badge with image */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <img
              src="https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=48&h=32&fit=crop&auto=format&q=80"
              alt="Africa map"
              className="w-8 h-6 rounded object-cover border border-primary/40"
            />
            <span className="badge bg-primary/30 text-primary border border-primary/40 backdrop-blur-sm text-xs font-bold uppercase tracking-widest">
              Built for Africa
            </span>
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black mb-6 leading-[0.95] tracking-tight drop-shadow-2xl">
            Connect.<br />Work.<br /><span className="text-accent">Grow.</span>
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto mb-10 text-lg md:text-xl leading-relaxed">
            Kenya's all-in-one platform for gig workers, students, SMEs, farmers, and diaspora.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="btn-accent text-base px-10 py-4 shadow-2xl shadow-accent/30 text-lg font-black">
              Get Started Free
            </Link>
            <Link to="/gigs" className="text-base px-10 py-4 rounded-lg font-bold border border-white/20 text-white hover:bg-white/10 backdrop-blur-sm transition text-lg">
              Browse Gigs →
            </Link>
          </div>
        </div>

        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400">
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-accent rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ══ STATS — image-backed cards ══════════════════════════════ */}
      <section className="bg-gray-900 border-y border-gray-800 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5 px-6">
          {STATS.map(s => (
            <div key={s.label} className="relative rounded-2xl overflow-hidden aspect-square border border-gray-800 group hover:border-accent/40 transition">
              <img src={s.img} alt={s.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <div className="text-4xl font-black text-accent drop-shadow">{s.value}</div>
                <div className="text-gray-300 text-sm mt-1 font-medium">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CATEGORIES ══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto py-20 px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-3">Everything in one place</h2>
          <p className="text-gray-400 text-lg">Find work, learn skills, and grow your income — all on FIXR.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map(c => (
            <Link
              key={c.label}
              to={c.link || `/gigs?category=${c.slug}`}
              className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-800 hover:border-accent/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/50"
            >
              <img
                src={c.img}
                alt={c.label}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${c.accent} via-transparent to-black/20 opacity-80 group-hover:opacity-90 transition-opacity`} />
              <div className="absolute inset-0 flex flex-col justify-end p-7">
                <h3 className="text-2xl font-black text-white leading-tight mb-1 drop-shadow-lg">{c.label}</h3>
                <p className="text-gray-300 text-sm leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">{c.sub}</p>
                <div className="mt-4 flex items-center gap-2 text-accent text-sm font-bold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Explore →
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg px-2.5 py-1 text-xs font-semibold text-white">
                {c.slug ? `#${c.slug}` : 'AI'}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══ FULL-PAGE SCROLL SECTIONS (one per page) ═══════════════ */}
      {SCROLL_SECTIONS.map(s => (
        <ScrollSection key={s.id} s={s} />
      ))}

      {/* ══ RIDE-HAILING PARTNERS ══════════════════════════════════ */}
      <section className="bg-gray-900 border-y border-gray-800 py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="badge bg-primary/30 text-primary border border-primary/40 mb-3 inline-block">
              <svg viewBox="0 0 24 24" className="w-4 h-4 inline mr-1" fill="currentColor">
                <path d="M4 16V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10"/>
                <rect x="4" y="16" width="16" height="4" rx="1"/>
                <circle cx="7.5" cy="18" r="1.5"/>
                <circle cx="16.5" cy="18" r="1.5"/>
              </svg>
              SONGA na FIXR Transport
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mb-2">Need a ride to your next job?</h2>
            <p className="text-gray-400 text-sm sm:text-base">Book directly with SONGA na FIXR — fast, safe, and affordable transport across Kenya.</p>
          </div>
          <div className="grid sm:grid-cols-1 gap-4 max-w-md mx-auto">
            {/* SONGA na FIXR */}
            <Link
              to="/transport"
              className="group relative rounded-2xl overflow-hidden border border-gray-700 hover:border-primary/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20"
            >
              <img
                src="https://images.unsplash.com/photo-1559181567-c3190ca9be46?w=800&h=400&fit=crop&auto=format&q=85"
                alt="SONGA na FIXR Transport"
                className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
                        <path d="M4 16V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10"/>
                        <rect x="4" y="16" width="16" height="4" rx="1"/>
                        <circle cx="7.5" cy="18" r="1.5"/>
                        <circle cx="16.5" cy="18" r="1.5"/>
                      </svg>
                    </div>
                    <span className="text-white font-black text-xl">SONGA na FIXR</span>
                  </div>
                  <p className="text-gray-300 text-sm">Fast, safe transport across Kenya</p>
                </div>
                <span className="text-white/60 group-hover:text-primary transition text-sm font-bold">Book Now →</span>
              </div>
            </Link>
          </div>

          <p className="text-center text-xs text-gray-600 mt-5">
            Rides managed by FIXR. Book your transport directly through our platform.
          </p>
        </div>
      </section>

      {/* ══ HOW IT WORKS ════════════════════════════════════════════ */}
      <section className="bg-gray-900 border-y border-gray-800 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">How FIXR works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Create your profile', desc: 'Sign up in 60 seconds. Add your skills, location, and let AI build your CV.', img: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=500&fit=crop&auto=format&q=80' },
              { step: '02', title: 'Find or post a gig',  desc: 'Browse hundreds of local and remote opportunities — or post one as an employer.', img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=500&fit=crop&auto=format&q=80' },
              { step: '03', title: 'Get paid via M-Pesa', desc: 'Secure payments straight to your M-Pesa wallet. No bank account needed.', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop&auto=format&q=80' },
            ].map(item => (
              <div key={item.step} className="card !p-0 overflow-hidden group">
                <div className="relative h-52 overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-5xl font-black text-accent/25 leading-none select-none">{item.step}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ════════════════════════════════════════════ */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-12">What workers say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'James Omondi',   role: 'Electrician, Nairobi',       quote: 'I landed 3 gigs in my first week. FIXR changed everything for my family.',          img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format&q=80', bg: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=300&fit=crop&auto=format&q=60' },
            { name: 'Grace Achieng',  role: 'Graphic Designer, Kisumu',   quote: 'The AI CV builder got me interviews I never would have landed before. Incredible.',   img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&auto=format&q=80', bg: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=300&fit=crop&auto=format&q=60' },
            { name: 'Samuel Mutua',   role: 'Farmer, Machakos',           quote: 'Found buyers for my harvest within 48 hours. FIXR is the future of farming in Kenya.', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&auto=format&q=80', bg: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=300&fit=crop&auto=format&q=60' },
          ].map(t => (
            <div key={t.name} className="card !p-0 overflow-hidden">
              <div className="relative h-28 overflow-hidden">
                <img src={t.bg} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900" />
              </div>
              <div className="px-5 pb-5 -mt-6 relative">
                <img src={t.img} alt={t.name} className="w-14 h-14 rounded-xl object-cover border-2 border-gray-900 shadow-xl mb-3" />
                <p className="text-gray-300 text-sm leading-relaxed mb-4 italic">"{t.quote}"</p>
                <div className="font-bold text-sm">{t.name}</div>
                <div className="text-gray-500 text-xs">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CTA BANNER ══════════════════════════════════════════════ */}
      <section className="relative py-28 px-6 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&h=700&fit=crop&auto=format&q=85"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-dark/90" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="flex justify-center gap-3 mb-6">
            {[
              'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=60&h=60&fit=crop&auto=format&q=70',
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&auto=format&q=70',
              'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=60&h=60&fit=crop&auto=format&q=70',
            ].map((src, i) => (
              <img key={i} src={src} alt="" className="w-10 h-10 rounded-full border-2 border-white/30 object-cover" style={{ marginLeft: i > 0 ? '-8px' : '0' }} />
            ))}
            <span className="ml-2 text-sm text-gray-300 self-center">50,000+ workers already joined</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">Are you a business or employer?</h2>
          <p className="text-gray-300 mb-8 text-lg">Post gigs, find vetted talent, and grow your team across Kenya with FIXR.</p>
          <Link to="/register?role=sme" className="btn-accent text-lg px-10 py-4 shadow-2xl shadow-accent/20">
            Start Hiring Today →
          </Link>
        </div>
      </section>

    </main>
  );
}