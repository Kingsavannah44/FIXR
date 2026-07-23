import { Link } from 'react-router-dom';

/* ── All images from Pexels CDN — confirmed delivering bytes ──────
   Format: https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg?auto=compress&cs=tinysrgb&w=800
──────────────────────────────────────────────────────────────── */
const PX = (id, w = 800, h = 500) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

const SERVICES = [
  {
    name: 'Premium Ride',
    tag: 'Private · AC · Vetted',
    desc: 'Comfortable saloon cars with vetted Kenyan drivers and transparent pricing.',
    img: PX(2127732),   // driver in car
    accent: '#F9A825',
  },
  {
    name: 'Express Bolt',
    tag: 'Fast · On-demand',
    desc: 'Fastest pickup in town. Book and be picked up in under 4 minutes.',
    img: PX(1545743),   // car on open road
    accent: '#4ade80',
  },
  {
    name: 'Local Matatu',
    tag: 'Shared · Affordable',
    desc: 'Trusted community routes at matatu prices. Know your route, pay less.',
    img: PX(1004409),   // bus / public transport
    accent: '#e2e8f0',
  },
  {
    name: 'M-Pesa Pay',
    tag: 'Cashless · Instant',
    desc: 'Pay with M-Pesa or your FIXR wallet. Automatic receipts every time.',
    img: PX(3760067),   // mobile payment / phone
    accent: '#F9A825',
  },
  {
    name: 'Live Tracking',
    tag: 'Real-time · GPS',
    desc: 'Watch your driver on the map. Accurate ETAs, live route updates.',
    img: PX(1181671),   // person using phone / app
    accent: '#4ade80',
  },
  {
    name: 'Safety First',
    tag: 'Verified · Insured',
    desc: 'NTSA-cleared drivers, insured vehicles, and 24/7 emergency support.',
    img: PX(3354648),   // professional ride / taxi
    accent: '#e2e8f0',
  },
];

const TIERS = [
  { label: 'FIXR Comfort', sub: 'Private saloon',      img: PX(2127732, 120, 120), color: '#F9A825' },
  { label: 'FIXR Express', sub: 'Fastest pickup',      img: PX(1545743, 120, 120), color: '#4ade80' },
  { label: 'FIXR Shuttle', sub: 'Shared matatu route', img: PX(1004409, 120, 120), color: '#e2e8f0' },
];

const STATS = [
  { value: '2,400+',  label: 'Verified drivers', img: PX(3354648, 80, 80)  },
  { value: '47 towns',label: 'Routes covered',   img: PX(1118448, 80, 80)  },
  { value: '< 4 min', label: 'Avg pickup time',  img: PX(1170194, 80, 80)  },
  { value: 'M-Pesa',  label: 'Instant payment',  img: PX(3760067, 80, 80)  },
];

const STEPS = [
  { step: '01', title: 'Open FIXR',        desc: 'Log in with the same account you use for gigs and housing.',   img: PX(1181671) },
  { step: '02', title: 'Choose your ride', desc: 'Pick Comfort, Express or Shuttle. Set your drop-off point.',    img: PX(3354648) },
  { step: '03', title: 'Pay with M-Pesa',  desc: 'Confirm payment, track live, and rate your driver.',             img: PX(3760067) },
];

const MOSAICS = [
  { img: PX(2127732, 600, 400), alt: 'Driver at wheel',  h: '220px' },
  { img: PX(1170194, 600, 400), alt: 'City traffic',     h: '220px' },
  { img: PX(1118448, 1200, 300),alt: 'Open highway',     h: '160px', span: 2 },
];

const WHY = [
  { img: PX(1239291, 48, 48), title: 'Kenyan coverage',  desc: 'Nairobi, Mombasa, Kisumu, Nakuru, and growing fast.' },
  { img: PX(3354648, 48, 48), title: 'Verified drivers',  desc: 'Every driver cleared through NTSA and background checks.' },
  { img: PX(3760067, 48, 48), title: 'No hidden fees',   desc: 'Clear fares before you confirm. No surprise surges.' },
  { img: PX(1181671, 48, 48), title: '24/7 support',      desc: 'Real humans on call, chat, or WhatsApp anytime.' },
];

const TESTIMONIALS = [
  { name: 'Brian Odhiambo', role: 'Gig worker, Nairobi', quote: 'SONGA picks me up in under 3 minutes. Never miss a gig anymore.',       img: PX(733872, 80, 80)  },
  { name: 'Amina Hassan',   role: 'SME owner, Mombasa',  quote: 'FIXR Express gets my staff to clients fast. M-Pesa billing is seamless.', img: PX(1239291, 80, 80) },
  { name: 'Kevin Waweru',   role: 'Engineer, Westlands', quote: 'FIXR Comfort is cleaner and cheaper than anything else in Nairobi.',       img: PX(1181244, 80, 80) },
];


export default function Transport() {
  return (
    <div style={{ background: '#0D1B2A', color: '#fff', minHeight: '100vh' }}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', height: '92vh', minHeight: '600px', overflow: 'hidden' }}>
        {/* Pexels highway as hero bg */}
        <img
          src={PX(1118448, 1920, 1080)}
          alt="Highway transport"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
        />
        {/* Video overlay for atmosphere */}
        <video autoPlay muted loop playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1, opacity: 0.35 }}>
          <source src="/videos/hero1.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(135deg,rgba(13,27,42,0.95) 0%,rgba(13,27,42,0.75) 55%,rgba(27,94,32,0.2) 100%)' }}/>
        <div style={{ position: 'absolute', inset: 0, zIndex: 3, background: 'linear-gradient(to top,#0D1B2A 0%,transparent 45%)' }}/>

        <div style={{ position: 'absolute', inset: 0, zIndex: 4, display: 'flex', alignItems: 'center' }}>
          <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '5rem 1.5rem', width: '100%' }}>
            <div style={{ maxWidth: '38rem' }}>
              {/* Brand badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(27,94,32,0.3)', border: '1px solid rgba(27,94,32,0.55)', borderRadius: '999px', padding: '8px 18px', marginBottom: '1.75rem' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 900, color: '#4ade80', letterSpacing: '0.15em', textTransform: 'uppercase' }}>SONGA na FIXR</div>
                  <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '1px' }}>Trusted transport across Kenya</div>
                </div>
              </div>
              <h1 style={{ fontSize: 'clamp(2.8rem,6vw,4.5rem)', fontWeight: 900, lineHeight: 1, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
                Move fast.<br/>Stay safe.<br/><span style={{ color: '#F9A825' }}>Pay with M-Pesa.</span>
              </h1>
              <p style={{ color: '#d1d5db', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: '30rem', marginBottom: '1.75rem' }}>
                Book premium rides, express pickups, and shared matatu routes through one trusted FIXR platform.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '2rem' }}>
                <Link to="/register" className="btn-accent" style={{ padding: '12px 32px', fontSize: '1rem', fontWeight: 900 }}>Book a Ride →</Link>
                <Link to="/contact" style={{ padding: '12px 32px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600, fontSize: '1rem', textDecoration: 'none' }}>Learn More</Link>
              </div>
              {/* Tier pills with real images */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
                {TIERS.map(t => (
                  <div key={t.label} style={{ borderRadius: '16px', padding: '12px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={t.img} alt={t.label} style={{ width: 40, height: 40, borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} onError={e => e.target.style.display='none'} />
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 900, color: t.color }}>{t.label}</div>
                      <div style={{ fontSize: '10px', color: '#9ca3af' }}>{t.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 5 }}>
          <div style={{ width: 24, height: 40, border: '2px solid rgba(156,163,175,0.4)', borderRadius: '999px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 4 }}>
            <div className="animate-bounce" style={{ width: 6, height: 12, background: '#F9A825', borderRadius: '999px' }}/>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────── */}
      <div style={{ background: '#111827', borderTop: '1px solid #1f2937', borderBottom: '1px solid #1f2937' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
          {STATS.map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={s.img} alt={s.label} style={{ width: 44, height: 44, borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} onError={e => e.target.style.display='none'} />
              <div>
                <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#F9A825', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SERVICE CARDS ────────────────────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: '#F9A825', fontWeight: 700, fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '8px' }}>What we offer</p>
            <h2 style={{ fontSize: 'clamp(1.75rem,3vw,2.5rem)', fontWeight: 900 }}>Transport services built for modern Kenya.</h2>
            <p style={{ color: '#6b7280', marginTop: '10px', maxWidth: '36rem', marginLeft: 'auto', marginRight: 'auto' }}>Every feature designed around how Kenyans actually move.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '20px' }}>
            {SERVICES.map(s => (
              <article key={s.name} style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid #1f2937', background: '#111827', transition: 'transform 0.3s,border-color 0.3s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.borderColor = s.accent + '66'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = '#1f2937'; }}>
                {/* Card image */}
                <div style={{ position: 'relative', height: '200px', overflow: 'hidden', background: '#1f2937' }}>
                  <img src={s.img} alt={s.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    onError={e => { e.target.style.display = 'none'; }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(17,24,39,0.92) 0%,rgba(17,24,39,0.15) 55%,transparent 100%)' }}/>
                  <span style={{ position: 'absolute', top: '12px', right: '12px', padding: '3px 10px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, background: 'rgba(0,0,0,0.6)', border: `1px solid ${s.accent}55`, color: s.accent, backdropFilter: 'blur(6px)' }}>{s.tag}</span>
                </div>
                <div style={{ padding: '18px 20px 22px' }}>
                  <h3 style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '6px', color: s.accent }}>{s.name}</h3>
                  <p style={{ color: '#9ca3af', fontSize: '13px', lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section style={{ background: '#0f172a', borderTop: '1px solid #1f2937', borderBottom: '1px solid #1f2937', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '60rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: '#F9A825', fontWeight: 700, fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '8px' }}>How it works</p>
            <h2 style={{ fontSize: 'clamp(1.75rem,3vw,2.5rem)', fontWeight: 900 }}>Ride in 3 steps</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '20px' }}>
            {STEPS.map(item => (
              <div key={item.step} style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid #1f2937', background: '#0D1B2A' }}>
                <div style={{ position: 'relative', height: '200px', overflow: 'hidden', background: '#1f2937' }}>
                  <img src={item.img} alt={item.title} loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={e => { e.target.style.display = 'none'; e.target.parentElement.style.background = '#1f2937'; }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,#0D1B2A 0%,transparent 55%)' }}/>
                  <span style={{ position: 'absolute', bottom: '10px', right: '14px', fontSize: '3rem', fontWeight: 900, lineHeight: 1, color: 'rgba(249,168,37,0.2)', userSelect: 'none' }}>{item.step}</span>
                </div>
                <div style={{ padding: '16px 20px 22px' }}>
                  <h3 style={{ fontWeight: 900, fontSize: '1rem', marginBottom: '6px' }}>{item.title}</h3>
                  <p style={{ color: '#6b7280', fontSize: '13px', lineHeight: 1.65 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY SONGA na FIXR ────────────────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3.5rem', alignItems: 'center' }}>
          {/* Text side */}
          <div>
            <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9ca3af', border: '1px solid #374151', borderRadius: '999px', padding: '6px 16px', marginBottom: '1.25rem' }}>
              Why SONGA na FIXR
            </span>
            <h2 style={{ fontSize: 'clamp(1.6rem,2.5vw,2.25rem)', fontWeight: 900, lineHeight: 1.2, marginBottom: '1rem' }}>
              A transport experience<br/>tuned for Kenya.
            </h2>
            <p style={{ color: '#d1d5db', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              FIXR combines local market expertise with modern ride technology. Cashless M-Pesa fares, verified drivers, and real-time tracking on every route.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {WHY.map(f => (
                <div key={f.title} style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={f.img} alt={f.title} style={{ width: 36, height: 36, borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} onError={e => e.target.style.display='none'} />
                    <span style={{ fontWeight: 700, fontSize: '13px', color: '#F9A825' }}>{f.title}</span>
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '12px', lineHeight: 1.55 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image mosaic */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {MOSAICS.map((m, i) => (
              <div key={i} style={{ gridColumn: m.span ? `span ${m.span}` : undefined, borderRadius: '16px', overflow: 'hidden', height: m.h, border: '1px solid #1f2937', background: '#111827' }}>
                <img src={m.img} alt={m.alt} loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  onError={e => { e.target.style.display = 'none'; }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <section style={{ background: '#0f172a', borderTop: '1px solid #1f2937', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '60rem', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, textAlign: 'center', marginBottom: '2rem' }}>What riders say</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '16px' }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ background: '#0D1B2A', border: '1px solid #1f2937', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <p style={{ color: '#d1d5db', fontSize: '13px', lineHeight: 1.7, fontStyle: 'italic', flex: 1 }}>"{t.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={t.img} alt={t.name}
                    style={{ width: 44, height: 44, borderRadius: '10px', objectFit: 'cover', border: '1px solid #374151', flexShrink: 0 }}
                    onError={e => { e.target.style.display = 'none'; }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px' }}>{t.name}</div>
                    <div style={{ color: '#6b7280', fontSize: '11px', marginTop: '1px' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '420px' }}>
        {/* Real road image as CTA background */}
        <img src={PX(1571460, 1920, 600)} alt="Road at night"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
          onError={e => { e.target.style.display = 'none'; }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(135deg,rgba(13,27,42,0.96) 0%,rgba(13,27,42,0.80) 60%,rgba(27,94,32,0.35) 100%)' }}/>

        {/* Glow blobs */}
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '350px', height: '350px', borderRadius: '50%', background: '#F9A825', opacity: 0.07, filter: 'blur(70px)', pointerEvents: 'none', zIndex: 2 }}/>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: '#1B5E20', opacity: 0.1, filter: 'blur(55px)', pointerEvents: 'none', zIndex: 2 }}/>

        <div style={{ position: 'relative', zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '420px', padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: '36rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1rem' }}>
              Ready to ride with<br/><span style={{ color: '#F9A825' }}>SONGA na FIXR?</span>
            </h2>
            <p style={{ color: '#d1d5db', fontSize: '1.05rem', maxWidth: '28rem', margin: '0 auto 2rem', lineHeight: 1.65 }}>
              Join thousands of Kenyans who already move smarter with FIXR. Sign up free and book your first ride today.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn-accent" style={{ padding: '14px 40px', fontSize: '1rem', fontWeight: 900 }}>
                Start Your Journey →
              </Link>
              <Link to="/contact" style={{ padding: '14px 40px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.22)', color: '#fff', fontWeight: 600, fontSize: '1rem', textDecoration: 'none' }}>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
