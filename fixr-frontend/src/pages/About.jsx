import { Link } from 'react-router-dom';

const TEAM = [
  { name: 'Amara Osei', role: 'CEO & Co-Founder', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&auto=format&q=80', country: '🇰🇪' },
  { name: 'David Kimani', role: 'CTO', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format&q=80', country: '🇰🇪' },
  { name: 'Fatima Al-Hassan', role: 'Head of Product', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop&auto=format&q=80', country: '🇬🇭' },
  { name: 'Brian Mwangi', role: 'Head of Growth', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&auto=format&q=80', country: '🇰🇪' },
];

const VALUES = [
  { icon: '🌍', title: 'Africa First', desc: 'Every feature is designed for African workers, internet speeds, and payment systems.' },
  { icon: '⚡', title: 'Radical Simplicity', desc: 'No bloat. Every screen should be usable by someone on a first-time smartphone.' },
  { icon: '🛡️', title: 'Trust & Safety', desc: 'Kenya DPA 2022 compliant. Your data is yours — always.' },
  { icon: '🤝', title: 'Inclusive Economy', desc: 'From rural farmers to diaspora professionals — everyone deserves opportunity.' },
];

const MILESTONES = [
  { year: '2023', event: 'FIXR founded in Nairobi, Kenya' },
  { year: 'Q1 2024', event: 'MVP launched — Auth, Gigs, Learning' },
  { year: 'Q2 2024', event: 'M-Pesa integration & AI tools added' },
  { year: 'Q3 2024', event: '50,000 registered users milestone' },
  { year: '2025 →', event: 'Expanding to UG, TZ, GH, NG, RW' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-dark">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&h=900&fit=crop&auto=format&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/50 to-dark" />
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <span className="badge bg-primary/30 text-primary border border-primary/40 mb-5 inline-block">🌍 Our Story</span>
          <h1 className="text-5xl md:text-6xl font-black mb-5 leading-tight">
            Built for Africa,<br />by Africans.
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto leading-relaxed">
            We started FIXR because we saw talented people across Kenya struggling to find work — not because there wasn't work, but because the tools weren't built for them.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-black mb-4">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed mb-4 text-lg">
              To unlock economic opportunity for every African — whether you're a welder in Kibera, a designer in Accra, a farmer in the Rift Valley, or a software engineer in the diaspora.
            </p>
            <p className="text-gray-400 leading-relaxed">
              FIXR connects the informal and formal economies through technology that actually works — built for low-bandwidth, built for M-Pesa, built for real African workers.
            </p>
          </div>
          <div className="relative rounded-2xl overflow-hidden aspect-video">
            <img
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=500&fit=crop&auto=format&q=80"
              alt="Team collaborating"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/20" />
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-gray-900 border-y border-gray-800 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">What we stand for</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map(v => (
              <div key={v.title} className="card text-center">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-black text-center mb-12">Our Journey</h2>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-800" />
          <div className="space-y-8">
            {MILESTONES.map((m, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="relative flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${i === MILESTONES.length - 1 ? 'border-accent bg-accent/10' : 'border-primary bg-primary/10'}`}>
                    <div className={`w-3 h-3 rounded-full ${i === MILESTONES.length - 1 ? 'bg-accent' : 'bg-primary'}`} />
                  </div>
                </div>
                <div className="pt-2">
                  <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${i === MILESTONES.length - 1 ? 'text-accent' : 'text-primary'}`}>{m.year}</div>
                  <div className="text-white font-semibold">{m.event}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="bg-gray-900 border-y border-gray-800 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-3">Meet the Team</h2>
          <p className="text-gray-400 text-center mb-12">The people building Africa's work platform.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map(t => (
              <div key={t.name} className="text-center group">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 border border-gray-800 group-hover:border-primary transition">
                  <img src={t.img} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute top-3 right-3 text-xl">{t.country}</span>
                </div>
                <div className="font-bold">{t.name}</div>
                <div className="text-gray-400 text-sm">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-20 px-6">
        <h2 className="text-3xl font-black mb-3">Join us in building Africa's future</h2>
        <p className="text-gray-400 mb-8">Start free. No credit card. No friction.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/register" className="btn-accent px-8 py-3">Get Started Free</Link>
          <Link to="/contact" className="border border-gray-700 text-gray-300 hover:bg-gray-800 px-8 py-3 rounded-lg text-sm font-semibold transition">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
