import { useState } from 'react';

/* ── Pexels — African cities & professionals ────────────────────── */
const PX = (id, w = 600, h = 400) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

/* Nairobi skyline & Kampala — verified Pexels IDs */
const OFFICES = [
  { city: 'Nairobi',  country: '🇰🇪 Kenya',  address: 'Westlands Business Park, Waiyaki Way', img: PX(3354648, 600, 400) },  // professional transport/Nairobi context
  { city: 'Kampala',  country: '🇺🇬 Uganda',  address: 'Nakasero, Plot 12 Kampala Road',       img: PX(1181406, 600, 400) },  // African professional scene
];

const TOPICS = ['General Inquiry', 'Partnership', 'Press & Media', 'Technical Support', 'Government / NGO Pricing', 'Report an Issue'];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', topic: TOPICS[0], message: '' });
  const [sent, setSent] = useState(false);

  const onSubmit = e => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Hero */}
      <div className="relative py-20 overflow-hidden">
        <img
          src={PX(1239291, 1600, 600)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        />
        <div className="relative z-10 text-center px-6">
          <span className="badge bg-primary/25 text-green-300 border border-primary/35 mb-5 inline-block text-xs font-bold uppercase tracking-widest">Get in Touch</span>
          <h1 className="text-4xl md:text-5xl font-black mb-4">We would love to hear from you</h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">Whether you're a partner, employer, or worker, our team is here to help.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Form */}
          <div className="card">
            {sent ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="font-black text-xl mb-2">Message Sent!</h3>
                <p className="text-gray-400 text-sm">We'll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} className="btn-primary mt-6">Send Another</button>
              </div>
            ) : (
              <>
                <h2 className="font-black text-xl mb-1">Send us a message</h2>
                <p className="text-gray-400 text-sm mb-6">We respond within 24 hours on business days.</p>
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1 block">Name</label>
                      <input placeholder="Jane Wanjiru" required className="input"
                        value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1 block">Email</label>
                      <input type="email" placeholder="jane@example.com" required className="input"
                        value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1 block">Topic</label>
                    <select className="input" value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}>
                      {TOPICS.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1 block">Message</label>
                    <textarea placeholder="Tell us how we can help…" required className="input h-32 resize-none text-sm leading-relaxed"
                      value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                  </div>
                  <button type="submit" className="btn-primary w-full py-3">Send Message →</button>
                </form>
              </>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="font-bold mb-4">Other ways to reach us</h2>
              <div className="space-y-4">
                {[
                  { icon: '✉️', label: 'Email', value: 'hello@fixr.africa', href: 'mailto:hello@fixr.africa' },
                  { icon: '📱', label: 'WhatsApp', value: '+254 700 000 000', href: 'https://wa.me/254700000000' },
                  { icon: '🐦', label: 'Twitter / X', value: '@FIXRAfrica', href: 'https://twitter.com' },
                ].map(c => (
                  <a key={c.label} href={c.href} target="_blank" rel="noreferrer"
                    className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-lg group-hover:bg-primary transition">
                      {c.icon}
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">{c.label}</div>
                      <div className="text-sm font-medium text-white group-hover:text-accent transition">{c.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Offices */}
            <div>
              <h2 className="font-bold mb-4">Our Offices</h2>
              <div className="space-y-4">
                {OFFICES.map(o => (
                  <div key={o.city} className="card !p-0 overflow-hidden flex gap-0 flex-col sm:flex-row">
                    <img src={o.img} alt={o.city} className="w-full sm:w-28 h-32 sm:h-auto object-cover" />
                    <div className="p-4">
                      <div className="font-bold">{o.city}</div>
                      <div className="text-xs text-gray-500 mb-1">{o.country}</div>
                      <div className="text-sm text-gray-400">{o.address}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
