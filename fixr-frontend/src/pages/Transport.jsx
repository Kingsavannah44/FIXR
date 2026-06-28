import { Link } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────────────
   Images: /images/transport/ folder in public/.
   Drop your images there with the exact filenames below.
   Hero: local /videos/hero1.mp4 + CSS gradient fallback.

   REQUIRED FILES (place in fixr-frontend/public/images/transport/):
     hero-bg.jpg          — wide road/highway shot, landscape
     premium-ride.jpg     — clean saloon car or driver+passenger
     express-bolt.jpg     — car moving fast, city blur
     local-matatu.jpg     — matatu / minibus on Nairobi street
     mpesa-pay.jpg        — person paying on phone / M-Pesa screen
     live-tracking.jpg    — phone with map / GPS navigation
     safety-first.jpg     — professional driver, seatbelt, safety gear
     step-open-app.jpg    — person using FIXR app on phone
     step-choose-ride.jpg — passenger selecting ride on screen
     step-pay.jpg         — M-Pesa payment confirmation screen
     mosaic-driver.jpg    — driver behind the wheel, smiling
     mosaic-street.jpg    — Nairobi street scene with vehicles
     mosaic-highway.jpg   — open highway, wide landscape
     avatar-1.jpg         — person portrait for testimonial
     avatar-2.jpg         — person portrait for testimonial
     avatar-3.jpg         — person portrait for testimonial
───────────────────────────────────────────────────────────────── */

const T = (name) => `/images/transport/${name}`;

// Service card images — each represents the service visually
const SERVICES = [
  {
    name: 'Premium Ride',
    tag: 'Private · AC · Vetted',
    desc: 'Comfortable saloon cars with vetted Kenyan drivers and transparent pricing.',
    img: T('premium-ride.jpg'),
    accent: '#F9A825',
  },
  {
    name: 'Express Bolt',
    tag: 'Fast · On-demand',
    desc: 'Fastest pickup in town. Book and be picked up in under 4 minutes.',
    img: T('express-bolt.jpg'),
    accent: '#4ade80',
  },
  {
    name: 'Local Matatu',
    tag: 'Shared · Affordable',
    desc: 'Trusted community routes at matatu prices. Know your route, pay less.',
    img: T('local-matatu.jpg'),
    accent: '#ffffff',
  },
  {
    name: 'M-Pesa Pay',
    tag: 'Cashless · Instant',
    desc: 'Pay with M-Pesa or your FIXR wallet. Automatic receipts every time.',
    img: T('mpesa-pay.jpg'),
    accent: '#F9A825',
  },
  {
    name: 'Live Tracking',
    tag: 'Real-time · GPS',
    desc: 'Watch your driver on the map. Accurate ETAs, live route updates.',
    img: T('live-tracking.jpg'),
    accent: '#4ade80',
  },
  {
    name: 'Safety First',
    tag: 'Verified · Insured',
    desc: 'NTSA-cleared drivers, insured vehicles, and 24/7 emergency support.',
    img: T('safety-first.jpg'),
    accent: '#ffffff',
  },
];

// How it works images
const STEPS = [
  { step: '01', emoji: '📱', title: 'Open FIXR',        desc: 'Log in — the same account you use for gigs and housing.',     img: T('step-open-app.jpg')    },
  { step: '02', emoji: '🗺️', title: 'Choose your ride', desc: 'Pick Comfort, Express, or Shuttle. Set pickup and drop-off.', img: T('step-choose-ride.jpg') },
  { step: '03', emoji: '💸', title: 'Pay with M-Pesa',  desc: 'Confirm payment, track live, and rate your driver.',          img: T('step-pay.jpg')         },
];

// Why section mosaic
const MOSAICS = [
  { img: T('mosaic-driver.jpg'),  alt: 'Driver smiling',  h: '220px' },
  { img: T('mosaic-street.jpg'),  alt: 'Nairobi street',  h: '220px' },
  { img: T('mosaic-highway.jpg'), alt: 'Open highway',    h: '150px', span: 2 },
];

const TIERS = [
  { label: 'FIXR Comfort', sub: 'Private saloon',       emoji: '🚗', color: '#F9A825' },
  { label: 'FIXR Express', sub: 'Fastest pickup',       emoji: '⚡', color: '#4ade80' },
  { label: 'FIXR Shuttle', sub: 'Shared matatu routes', emoji: '🚌', color: '#d1d5db' },
];

const STATS = [
  { value: '2,400+', label: 'Verified drivers', emoji: '✅' },
  { value: '47 towns', label: 'Routes covered',  emoji: '📍' },
  { value: '< 4 min', label: 'Avg pickup',       emoji: '⏱️' },
  { value: 'M-Pesa',  label: 'Instant pay',      emoji: '💳' },
];

const WHY = [
  { emoji: '🇰🇪', title: 'Kenyan coverage',  desc: 'Nairobi, Mombasa, Kisumu, Nakuru, and growing fast.' },
  { emoji: '🔒',   title: 'Verified drivers', desc: 'Every driver cleared through NTSA and background checks.' },
  { emoji: '💰',   title: 'No hidden fees',   desc: 'Clear fares before you confirm. No surge surprises.' },
  { emoji: '📞',   title: '24/7 support',     desc: 'Real humans on call, chat, or WhatsApp anytime.' },
];

const TESTIMONIALS = [
  { name: 'Brian Odhiambo', role: 'Gig worker, Nairobi', quote: 'SONGA picks me up in under 3 minutes every morning. Never miss a gig anymore.',           img: T('avatar-1.jpg') },
  { name: 'Amina Hassan',   role: 'SME owner, Mombasa',  quote: 'I send staff to client sites with FIXR Express. The M-Pesa billing makes it so easy.',     img: T('avatar-2.jpg') },
  { name: 'Kevin Waweru',   role: 'Engineer, Westlands', quote: 'FIXR Comfort is cleaner and cheaper than anything else in Nairobi. Tracking is spot on.',  img: T('avatar-3.jpg') },
];

/* ─────────────────────────────────────────────────────────────────
   FIXR-branded taxi SVG icon
   Yellow cab body, green FIXR stripe, "FIXR" text on the door
───────────────────────────────────────────────────────────────── */
function FixrTaxiIcon({ size = 36 }) {
  return (
    <svg
      viewBox="0 0 64 40"
      width={size}
      height={size * 40 / 64}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="FIXR Taxi"
    >
      {/* Car body */}
      <rect x="4" y="18" width="56" height="16" rx="4" fill="#F9A825" />
      {/* Cabin / roof */}
      <path d="M16 18 L20 8 L44 8 L48 18 Z" fill="#F9A825" />
      {/* Green FIXR stripe along door */}
      <rect x="4" y="22" width="56" height="5" fill="#1B5E20" />
      {/* FIXR text on stripe */}
      <text x="32" y="27" textAnchor="middle" fontSize="5" fontWeight="bold" fill="#F9A825" fontFamily="Arial,sans-serif" letterSpacing="1">FIXR</text>
      {/* Windshield */}
      <path d="M20 8 L22 18 L42 18 L44 8 Z" fill="#93c5fd" opacity="0.7" />
      {/* Left window */}
      <rect x="17" y="10" width="9" height="7" rx="1.5" fill="#bfdbfe" opacity="0.7" />
      {/* Right window */}
      <rect x="38" y="10" width="9" height="7" rx="1.5" fill="#bfdbfe" opacity="0.7" />
      {/* Front bumper */}
      <rect x="58" y="26" width="4" height="4" rx="1" fill="#374151" />
      {/* Rear bumper */}
      <rect x="2" y="26" width="4" height="4" rx="1" fill="#374151" />
      {/* Headlight */}
      <circle cx="60" cy="24" r="2" fill="#fef08a" />
      {/* Tail light */}
      <circle cx="4" cy="24" r="2" fill="#fca5a5" />
      {/* Left wheel */}
      <circle cx="16" cy="34" r="5" fill="#1f2937" />
      <circle cx="16" cy="34" r="2.5" fill="#6b7280" />
      {/* Right wheel */}
      <circle cx="48" cy="34" r="5" fill="#1f2937" />
      <circle cx="48" cy="34" r="2.5" fill="#6b7280" />
      {/* Taxi sign on roof */}
      <rect x="26" y="4" width="12" height="5" rx="1.5" fill="#1B5E20" />
      <text x="32" y="8.5" textAnchor="middle" fontSize="3.5" fontWeight="bold" fill="#F9A825" fontFamily="Arial,sans-serif">TAXI</text>
    </svg>
  );
}

export default function Transport() {
  return (
    <div style={{ background: '#0D1B2A', color: 'white', minHeight: '100vh' }}>

      {/* ══ HERO ════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', height: '92vh', minHeight: '600px', overflow: 'hidden' }}>

        {/* Local video — guaranteed to load */}
        <video
          autoPlay muted loop playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
        >
          <source src="/videos/hero1.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay + green glow */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(135deg, rgba(13,27,42,0.96) 0%, rgba(13,27,42,0.82) 55%, rgba(27,94,32,0.22) 100%)'
        }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: 'linear-gradient(to top, #0D1B2A 0%, transparent 45%)'
        }} />

        {/* Hero content */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 3, display: 'flex', alignItems: 'center' }}>
          <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '6rem 1.5rem', width: '100%' }}>
            <div style={{ maxWidth: '40rem' }}>

              {/* ── FIXR Taxi brand badge ── */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                background: 'rgba(27,94,32,0.28)', border: '1px solid rgba(27,94,32,0.55)',
                borderRadius: '999px', padding: '8px 18px', marginBottom: '1.5rem'
              }}>
                <FixrTaxiIcon size={38} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 900, color: '#4ade80', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    SONGA na FIXR
                  </div>
                  <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '1px' }}>Trusted transport across Kenya</div>
                </div>
              </div>

              {/* Headline */}
              <h1 style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
                Move fast.<br />
                Stay safe.<br />
                <span style={{ color: '#F9A825' }}>Pay with M-Pesa.</span>
              </h1>

              <p style={{ color: '#d1d5db', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: '30rem', marginBottom: '1.75rem' }}>
                Book premium rides, express pickups, and shared matatu routes — all through one trusted FIXR platform built for Kenyan workers and businesses.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '2rem' }}>
                <Link to="/register" className="btn-accent" style={{ padding: '12px 32px', fontSize: '1rem', fontWeight: 900 }}>
                  Book a Ride →
                </Link>
                <Link to="/contact" style={{
                  padding: '12px 32px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', transition: 'background 0.2s'
                }}>
                  Learn More
                </Link>
              </div>

              {/* Tier pills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {TIERS.map(t => (
                  <div key={t.label} style={{
                    borderRadius: '16px', padding: '12px', textAlign: 'center',
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(8px)'
                  }}>
                    <div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>{t.emoji}</div>
                    <div style={{ fontSize: '11px', fontWeight: 900, color: t.color }}>{t.label}</div>
                    <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>{t.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 4, textAlign: 'center' }}>
          <div style={{ width: '24px', height: '40px', border: '2px solid rgba(156,163,175,0.4)', borderRadius: '999px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '4px', margin: '0 auto' }}>
            <div className="animate-bounce" style={{ width: '6px', height: '12px', background: '#F9A825', borderRadius: '999px' }} />
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ═══════════════════════════════════════════════ */}
      <div style={{ background: '#111827', borderTop: '1px solid #1f2937', borderBottom: '1px solid #1f2937' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '1.5rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {STATS.map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.6rem' }}>{s.emoji}</span>
              <div>
                <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#F9A825', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ SERVICE CARDS — full image backgrounds ══════════════════ */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: '#F9A825', fontWeight: 700, fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '8px' }}>What we offer</p>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 900 }}>Transport services built for modern Kenya.</h2>
            <p style={{ color: '#6b7280', marginTop: '10px', maxWidth: '36rem', margin: '10px auto 0' }}>
              Every feature designed around how Kenyans actually move — CBD matatus to airport transfers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {SERVICES.map(s => (
              <article
                key={s.name}
                style={{
                  borderRadius: '20px', overflow: 'hidden', position: 'relative',
                  border: '1px solid #1f2937', transition: 'transform 0.3s, border-color 0.3s',
                  cursor: 'default'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.borderColor = s.accent + '55'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = '#1f2937'; }}
              >
                {/* Full image top half */}
                <div style={{ position: 'relative', height: '180px', overflow: 'hidden', background: '#1f2937' }}>
                  <img
                    src={s.img}
                    alt={s.name}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', display: 'block' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    onError={e => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.background = 'linear-gradient(135deg,#1f2937,#111827)';
                    }}
                  />
                  {/* Gradient over image */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(17,24,39,0.9) 0%, rgba(17,24,39,0.2) 60%, transparent 100%)' }} />
                  {/* Tag badge top-right */}
                  <span style={{
                    position: 'absolute', top: '12px', right: '12px',
                    padding: '3px 10px', borderRadius: '999px', fontSize: '10px', fontWeight: 700,
                    background: 'rgba(0,0,0,0.55)', border: `1px solid ${s.accent}55`, color: s.accent,
                    backdropFilter: 'blur(6px)', letterSpacing: '0.05em'
                  }}>
                    {s.tag}
                  </span>
                </div>

                {/* Text content */}
                <div style={{ background: '#111827', padding: '18px 20px 20px' }}>
                  <h3 style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '6px', color: s.accent }}>{s.name}</h3>
                  <p style={{ color: '#9ca3af', fontSize: '13px', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ════════════════════════════════════════════ */}
      <section style={{ background: '#0f172a', borderTop: '1px solid #1f2937', borderBottom: '1px solid #1f2937', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '60rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: '#F9A825', fontWeight: 700, fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '8px' }}>How it works</p>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 900 }}>Ride in 3 steps</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {STEPS.map(item => (
              <div key={item.step} style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid #1f2937', background: '#0D1B2A' }}>
                {/* Image */}
                <div style={{ position: 'relative', height: '180px', overflow: 'hidden', background: '#1f2937' }}>
                  <img
                    src={item.img}
                    alt={item.title}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={e => { e.target.style.display = 'none'; e.target.parentElement.style.background = 'linear-gradient(135deg,#1f2937,#0D1B2A)'; }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0D1B2A 0%, transparent 55%)' }} />
                  <span style={{ position: 'absolute', top: '12px', left: '12px', fontSize: '1.6rem' }}>{item.emoji}</span>
                  <span style={{ position: 'absolute', bottom: '10px', right: '14px', fontSize: '3rem', fontWeight: 900, lineHeight: 1, color: 'rgba(249,168,37,0.18)', userSelect: 'none' }}>{item.step}</span>
                </div>
                {/* Text */}
                <div style={{ padding: '16px 20px 20px' }}>
                  <h3 style={{ fontWeight: 900, fontSize: '1rem', marginBottom: '6px' }}>{item.title}</h3>
                  <p style={{ color: '#6b7280', fontSize: '13px', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY SONGA na FIXR ═══════════════════════════════════════ */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          {/* Left — text */}
          <div>
            <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9ca3af', border: '1px solid #374151', borderRadius: '999px', padding: '6px 16px', marginBottom: '1.25rem' }}>
              Why SONGA na FIXR
            </span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.25rem)', fontWeight: 900, lineHeight: 1.2, marginBottom: '1rem' }}>
              A transport experience<br />tuned for Kenya.
            </h2>
            <p style={{ color: '#d1d5db', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              FIXR combines local market expertise with modern ride technology — cashless M-Pesa fares, verified drivers, and real-time tracking on every route.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {WHY.map(f => (
                <div key={f.title} style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '1.2rem' }}>{f.emoji}</span>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: '#F9A825' }}>{f.title}</span>
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '12px', lineHeight: 1.5 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — image mosaic */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {MOSAICS.map((m, i) => (
              <div
                key={i}
                style={{
                  gridColumn: m.span ? `span ${m.span}` : undefined,
                  borderRadius: '16px', overflow: 'hidden',
                  height: m.h, border: '1px solid #1f2937', background: '#111827'
                }}
              >
                <img
                  src={m.img}
                  alt={m.alt}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  onError={e => { e.target.style.display = 'none'; e.target.parentElement.style.background = 'linear-gradient(135deg,#1f2937,#111827)'; }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ════════════════════════════════════════════ */}
      <section style={{ background: '#0f172a', borderTop: '1px solid #1f2937', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '60rem', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, textAlign: 'center', marginBottom: '2rem' }}>What riders say</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ background: '#0D1B2A', border: '1px solid #1f2937', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <p style={{ color: '#d1d5db', fontSize: '13px', lineHeight: 1.65, fontStyle: 'italic', flex: 1 }}>"{t.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={t.img}
                    alt={t.name}
                    style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #374151', flexShrink: 0 }}
                    onError={e => { e.target.style.background = '#1f2937'; e.target.removeAttribute('src'); }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px' }}>{t.name}</div>
                    <div style={{ color: '#6b7280', fontSize: '11px' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ═════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative', padding: '6rem 1.5rem', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0D1B2A 0%, #1B5E20 50%, #0D1B2A 100%)'
      }}>
        {/* Glow blobs */}
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: '#F9A825', opacity: 0.08, filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '350px', height: '350px', borderRadius: '50%', background: '#1B5E20', opacity: 0.12, filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '36rem', margin: '0 auto', textAlign: 'center' }}>
          {/* Big branded taxi in CTA */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <FixrTaxiIcon size={96} />
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1rem' }}>
            Ready to ride with<br />
            <span style={{ color: '#F9A825' }}>SONGA na FIXR?</span>
          </h2>
          <p style={{ color: '#d1d5db', fontSize: '1.05rem', maxWidth: '28rem', margin: '0 auto 2rem', lineHeight: 1.6 }}>
            Join thousands of Kenyans who already move smarter with FIXR. Sign up free and book your first ride today.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn-accent" style={{ padding: '14px 40px', fontSize: '1rem', fontWeight: 900 }}>
              Start Your Journey →
            </Link>
            <Link to="/contact" style={{
              padding: '14px 40px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.22)',
              color: 'white', fontWeight: 600, fontSize: '1rem', textDecoration: 'none'
            }}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
