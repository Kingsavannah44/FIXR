import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

/* ── Pexels CDN helper — African professionals & scenes ──────────
   IDs chosen for authentic African diversity and professionalism  */
const PX = (id, w = 800, h = 500) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

/* ── DATA ─────────────────────────────────────────────── */

const STATS = [
  { label: 'Active Workers', value: '50K+', img: PX(1181406, 400, 400)  },  // African professional man
  { label: 'Gigs Posted',    value: '12K+', img: PX(3184291, 400, 400)  },  // creative/design work scene
  { label: 'Courses',        value: '300+', img: PX(1181671, 400, 400)  },  // person learning on phone
  { label: 'Countries',      value: '6',    img: PX(1239291, 400, 400)  },  // African professional woman
];

const CATEGORIES = [
  { label: 'Housing',           sub: 'Verified listings, escrow payments',   slug: null, link: '/housing',      img: PX(186077,  800, 800), accent: 'from-blue-900/80'   },
  { label: 'Construction',      sub: 'Project tracking, supervision reports', slug: null, link: '/construction', img: PX(209315,  800, 800), accent: 'from-yellow-900/80' },
  { label: 'Trades & Artisans', sub: 'Plumbing, Electrical, Carpentry',       slug: 'trades',       img: PX(2219024, 800, 800), accent: 'from-orange-900/80' },
  { label: 'Creative & Design', sub: 'Design, Photography, Video',            slug: 'creative',     img: PX(3184291, 800, 800), accent: 'from-purple-900/80' },
  { label: 'Agribusiness',      sub: 'Farming, Cooperatives, Export',         slug: 'agribusiness', img: PX(1181519, 800, 800), accent: 'from-green-900/80'  },  // outdoor/field scene ✓
  { label: 'AI Tools',          sub: 'CV Builder, Gig Pricing, Recs',         slug: null, link: '/ai-tools',    img: PX(3760067, 800, 800), accent: 'from-yellow-900/80' },
];

const SCROLL_SECTIONS = [
  {
    id: 'housing',      label: 'FIXR Housing',    to: '/housing',      cta: 'Browse Housing',
    headline: 'Rent without\nthe fraud.',
    sub: 'Verified landlords only. Escrow-protected deposits. Direct messaging. No middlemen, no scams.',
    img: PX(186077, 1600, 900),
    pills: [{ text: 'Verified Owners' }, { text: 'Escrow Safe' }, { text: 'Direct Chat' }],
    align: 'left',  accent: 'from-blue-900/70',
  },
  {
    id: 'construction', label: 'Construction',    to: '/construction', cta: 'Track Projects',
    headline: 'Supervise every\nbrick and beam.',
    sub: 'Real-time updates, photo evidence, milestone tracking, and FIXR inspector verification.',
    img: PX(209315, 1600, 900),
    pills: [{ text: 'Daily Updates' }, { text: 'FIXR Inspector' }, { text: 'Milestones' }],
    align: 'right', accent: 'from-yellow-900/70',
  },
  {
    id: 'gigs',         label: 'Gig Marketplace', to: '/gigs',         cta: 'Browse Gigs',
    headline: 'Find work. Post work.\nGet paid instantly.',
    sub: 'Hundreds of local and remote gigs across Kenya, from trades to tech. Apply in seconds.',
    img: PX(2219024, 1600, 900),   // tradesperson at work — African context
    pills: [{ text: 'Trades' }, { text: 'Creative' }, { text: 'Remote' }, { text: 'Agri' }],
    align: 'left',  accent: 'from-indigo-900/70',
  },
  {
    id: 'learning',     label: 'Learning Center', to: '/learning',     cta: 'Explore Courses',
    headline: 'Upskill and earn\nFIXR points.',
    sub: '300+ courses built for African workers. Complete a course, earn points, unlock better gigs.',
    img: PX(1181671, 1600, 900),
    pills: [{ text: 'Beginner' }, { text: 'Intermediate' }, { text: 'Advanced' }, { text: 'AI Guided' }],
    align: 'right', accent: 'from-purple-900/70',
  },
  {
    id: 'transport',    label: 'SONGA na FIXR',   to: '/transport',    cta: 'Book a Ride',
    headline: 'Move fast.\nPay with M-Pesa.',
    sub: 'Book premium rides, express pickups, and shared matatu routes across Kenya.',
    img: PX(1118448, 1600, 900),
    pills: [{ text: 'Comfort' }, { text: 'Express' }, { text: 'Shuttle' }],
    align: 'left',  accent: 'from-green-900/70',
  },
  {
    id: 'ai',           label: 'AI Tools',        to: '/ai-tools',     cta: 'Try AI Tools',
    headline: 'AI that works\nfor African workers.',
    sub: 'Free AI CV builder, gig pricing advisor, and personalised course recommendations.',
    img: PX(3760067, 1600, 900),
    pills: [{ text: 'CV Builder' }, { text: 'Pricing' }, { text: 'Recommendations' }],
    align: 'right', accent: 'from-yellow-900/70',
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
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      <img
        src={s.img}
        alt={s.label}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        onError={e => e.target.style.display = 'none'}
      />
      <div className={`absolute inset-0 bg-gradient-to-${isLeft ? 'r' : 'l'} ${s.accent} via-dark/70 to-dark/95`} />
      <div className="absolute inset-0 bg-dark/40" />

      <div className={`relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
        <div className={`max-w-xl transition-all duration-1000 ${
          visible ? 'opacity-100 translate-y-0'
            : isLeft ? 'opacity-0 -translate-x-16' : 'opacity-0 translate-x-16'
        }`}>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-300 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
              {s.label}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight text-white mb-5 drop-shadow-lg whitespace-pre-line">
            {s.headline}
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-md">{s.sub}</p>
          <div className="flex flex-wrap gap-2 mb-8">
            {s.pills.map(p => (
              <span key={p.text} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5 text-xs text-white font-medium">
                {p.text}
              </span>
            ))}
          </div>
          <Link to={s.to} className="inline-flex items-center gap-2 btn-accent px-8 py-3 text-base shadow-xl shadow-accent/20">
            {s.cta} →
          </Link>
        </div>
      </div>

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

  /* Parallax removed — using static Pexels image for hero */
  const [scrollY] = useState(0);

  return (
    <main>

      {/* ══ HERO ════════════════════════════════════════════════════ */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Pexels background image — African professionals */}
        <img
          src={PX(3182812, 1920, 1080)}
          alt="FIXR Africa hero"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
          onError={e => e.target.style.display='none'}
        />
        {/* Local video for atmosphere over the image */}
        <video autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 1, opacity: 0.4 }}>
          <source src="/videos/hero1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/40 to-dark" style={{ zIndex: 2 }} />

        {/* Floating worker photos — real African professionals */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
          {[
            { img: PX(1181406, 80, 80), top: '20%', left: '8%',  label: 'Engineer'  },
            { img: PX(1239291, 80, 80), top: '65%', left: '5%',  label: 'Designer'  },
            { img: PX(1181244, 80, 80), top: '25%', right: '7%', label: 'Developer' },
            { img: PX(733872,  80, 80), top: '70%', right: '6%', label: 'Farmer'    },
          ].map((a, i) => (
            <div key={i} className="absolute hidden md:flex flex-col items-center gap-1 animate-bounce"
              style={{ top: a.top, left: a.left, right: a.right, animationDelay: `${i*0.2}s`, animationDuration: '3s' }}>
              <img src={a.img} alt={a.label} className="w-12 h-12 rounded-full border-2 border-accent/60 object-cover shadow-xl"
                onError={e => e.target.style.display='none'} />
              <span className="text-xs text-white/70 bg-dark/60 backdrop-blur-sm px-2 py-0.5 rounded-full">{a.label}</span>
            </div>
          ))}
        </div>

        <div className="relative text-center px-6 max-w-4xl mx-auto" style={{ zIndex: 4 }}>
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="badge bg-primary/30 text-green-300 border border-primary/40 backdrop-blur-sm text-xs font-bold uppercase tracking-widest">
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

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400" style={{ zIndex: 4 }}>
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-accent rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ══ STATS ═══════════════════════════════════════════════════ */}
      <section className="bg-gray-900 border-y border-gray-800 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5 px-6">
          {STATS.map(s => (
            <div key={s.label} className="relative rounded-2xl overflow-hidden aspect-square border border-gray-800 group hover:border-accent/40 transition">
              <img src={s.img} alt={s.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e => e.target.style.display='none'} />
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
          <p className="text-gray-400 text-lg">Find work, learn skills, and grow your income on FIXR.</p>
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
                onError={e => e.target.style.display='none'}
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${c.accent} via-transparent to-black/20 opacity-80 group-hover:opacity-90 transition-opacity`} />
              <div className="absolute inset-0 flex flex-col justify-end p-7">
                <h3 className="text-2xl font-black text-white leading-tight mb-1 drop-shadow-lg">{c.label}</h3>
                <p className="text-gray-300 text-sm leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">{c.sub}</p>
                <div className="mt-4 flex items-center gap-2 text-accent text-sm font-bold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Explore →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══ FULL-PAGE SCROLL SECTIONS (one per page) ═══════════════ */}
      {SCROLL_SECTIONS.map(s => (
        <ScrollSection key={s.id} s={s} />
      ))}

      {/* ══ HOW IT WORKS ════════════════════════════════════════════ */}
      <section className="bg-gray-900 border-y border-gray-800 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">How FIXR works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Create your profile', desc: 'Sign up in 60 seconds. Add your skills, location, and let AI build your CV.',      img: PX(1181671, 800, 500) },
              { step: '02', title: 'Find or post a gig',  desc: 'Browse hundreds of local and remote opportunities, or post one as an employer.',   img: PX(2219024, 800, 500) },
              { step: '03', title: 'Get paid via M-Pesa', desc: 'Secure payments straight to your M-Pesa wallet. No bank account needed.',           img: PX(3760067, 800, 500) },
            ].map(item => (
              <div key={item.step} className="card !p-0 overflow-hidden group">
                <div className="relative h-52 overflow-hidden">
                  <img src={item.img} alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => e.target.style.display='none'} />
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
            { name: 'James Omondi',  role: 'Electrician, Nairobi',     quote: 'I landed 3 gigs in my first week. FIXR changed everything for my family.',           img: PX(1181406, 200, 200), bg: PX(2219024, 600, 300) },
            { name: 'Grace Achieng', role: 'Graphic Designer, Kisumu', quote: 'The AI CV builder got me interviews I never would have landed before.',              img: PX(1239291, 200, 200), bg: PX(3184291, 600, 300) },
            { name: 'Samuel Mutua',  role: 'Farmer, Machakos',         quote: 'Found buyers for my harvest within 48 hours. FIXR is the future of farming in Kenya.', img: PX(1181244, 200, 200), bg: PX(1181519, 600, 300) },
          ].map(t => (
            <div key={t.name} className="card !p-0 overflow-hidden">
              <div className="relative h-28 overflow-hidden">
                <img src={t.bg} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900" />
              </div>
              <div className="px-5 pb-5 -mt-6 relative">
                <img src={t.img} alt={t.name} className="w-14 h-14 rounded-xl object-cover border-2 border-gray-900 shadow-xl mb-3" onError={e => e.target.style.display='none'} />
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
          src={PX(1181406, 1920, 700)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          onError={e => e.target.style.display='none'}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-dark/92" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="flex justify-center gap-3 mb-6">
            {[
              PX(1239291, 60, 60),
              PX(1181406, 60, 60),
              PX(1181244, 60, 60),
            ].map((src, i) => (
              <img key={i} src={src} alt="" className="w-10 h-10 rounded-full border-2 border-white/30 object-cover"
                style={{ marginLeft: i > 0 ? '-8px' : '0' }}
                onError={e => e.target.style.display='none'} />
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