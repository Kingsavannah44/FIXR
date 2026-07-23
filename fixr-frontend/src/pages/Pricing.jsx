import { useState } from 'react';
import { Link } from 'react-router-dom';

const PLANS = [
  {
    name: 'Free',
    price: { monthly: 0, annual: 0 },
    desc: 'Perfect for individuals getting started.',
    badge: null,
    features: [
      'Apply to 5 gigs/month',
      'AI CV Builder',
      'Access all free courses',
      'M-Pesa payments',
      'Basic profile & portfolio',
      'FIXR Points & rewards',
    ],
    missing: ['Priority listing', 'Unlimited applications', 'Analytics dashboard', 'Verified badge'],
    cta: 'Get Started Free',
    to: '/register',
    style: 'border-gray-700',
    btnStyle: 'border border-gray-600 text-white hover:bg-gray-800 transition',
  },
  {
    name: 'Pro',
    price: { monthly: 499, annual: 399 },
    desc: 'For serious gig workers and freelancers.',
    badge: 'Most Popular',
    features: [
      'Unlimited gig applications',
      'AI CV Builder + Pricing Advisor',
      'All courses including premium',
      'M-Pesa payments',
      'Full profile + verified badge',
      'Priority search listing',
      'FIXR Points 2× multiplier',
    ],
    missing: ['Analytics dashboard', 'Team seats'],
    cta: 'Start Pro Free (14 days)',
    to: '/register?plan=pro',
    style: 'border-accent shadow-2xl shadow-accent/10',
    btnStyle: 'btn-accent',
  },
  {
    name: 'Business',
    price: { monthly: 2499, annual: 1999 },
    desc: 'For SMEs, cooperatives, and employers.',
    badge: null,
    features: [
      'Everything in Pro',
      'Post unlimited gigs',
      'Analytics dashboard',
      'Team seats (up to 10)',
      'Dedicated account manager',
      'Branded employer profile',
      'Bulk M-Pesa payouts',
    ],
    missing: [],
    cta: 'Contact Sales',
    to: '/contact',
    style: 'border-gray-700',
    btnStyle: 'btn-primary',
  },
];

const FAQS = [
  { q: 'Is FIXR really free?', a: 'Yes. The Free plan is free forever with no credit card required. You get the core features including the AI CV builder and gig applications.' },
  { q: 'How does M-Pesa payment work?', a: 'We use the Safaricom Daraja API. When you receive payment for a gig, it goes directly to your M-Pesa number. No bank account needed.' },
  { q: 'Can I cancel my Pro plan anytime?', a: 'Absolutely. Cancel anytime from your dashboard. You keep Pro features until the end of your billing period.' },
  { q: 'Do you offer government or NGO pricing?', a: 'Yes. We have special pricing for government agencies and NGOs. Contact us at the link below.' },
  { q: 'Is my data safe?', a: 'FIXR is fully Kenya DPA 2022 compliant. You own your data and can request erasure at any time.' },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-dark">
      {/* Hero */}
      <div className="text-center py-20 px-6">
        <span className="badge bg-accent/20 text-accent border border-accent/30 mb-5 inline-block">💰 Simple Pricing</span>
        <h1 className="text-4xl md:text-5xl font-black mb-4">Pay for what you need.</h1>
        <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">Start free. Upgrade when you're ready. No hidden fees.</p>

        {/* Toggle */}
        <div className="inline-flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl p-1">
          <button onClick={() => setAnnual(false)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${!annual ? 'bg-primary text-white' : 'text-gray-400'}`}>Monthly</button>
          <button onClick={() => setAnnual(true)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${annual ? 'bg-primary text-white' : 'text-gray-400'}`}>
            Annual
            <span className="bg-accent/20 text-accent text-xs px-1.5 py-0.5 rounded-full">-20%</span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map(plan => (
            <div key={plan.name} className={`card relative flex flex-col border-2 ${plan.style}`}>
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-accent text-dark text-xs font-black px-3 py-1 rounded-full shadow-lg">{plan.badge}</span>
                </div>
              )}
              <div className="mb-6">
                <h3 className="font-black text-xl mb-1">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.desc}</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black text-white">
                    {plan.price.monthly === 0 ? 'Free' : `KES ${(annual ? plan.price.annual : plan.price.monthly).toLocaleString()}`}
                  </span>
                  {plan.price.monthly > 0 && <span className="text-gray-500 text-sm mb-1">/mo</span>}
                </div>
                {annual && plan.price.monthly > 0 && (
                  <p className="text-xs text-gray-500 mt-1">Billed annually · Save KES {((plan.price.monthly - plan.price.annual) * 12).toLocaleString()}/yr</p>
                )}
              </div>

              <div className="flex-1 space-y-2.5 mb-6">
                {plan.features.map(f => (
                  <div key={f} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </div>
                ))}
                {plan.missing.map(f => (
                  <div key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </div>
                ))}
              </div>

              <Link to={plan.to} className={`text-center py-3 rounded-lg font-semibold text-sm ${plan.btnStyle}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Trusted by */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm mb-6">Trusted by workers across Africa</p>
          <div className="flex justify-center gap-8 flex-wrap">
            {['50K+ Workers', '12K+ Gigs', '300+ Courses', 'M-Pesa Native', 'DPA Compliant'].map(t => (
              <span key={t} className="text-gray-400 text-sm font-semibold">{t}</span>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={i} className="card !p-0 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-semibold text-sm">{f.q}</span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-gray-400 leading-relaxed border-t border-gray-800 pt-3">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
