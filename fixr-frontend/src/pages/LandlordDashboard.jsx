import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const PROPERTY_TYPES = ['apartment', 'house', 'bedsitter', 'commercial'];
const ALL_SERVICES = [
  'cleaning', 'waste_management', 'maintenance', 'fire_safety',
  'ambulance', 'cctv_setup', 'internet', 'security_guard', 'parking'
];
const SERVICE_ICONS = {
  cleaning: '🧹', waste_management: '🗑️', maintenance: '🔧',
  fire_safety: '🔥', ambulance: '🚑', cctv_setup: '📹',
  internet: '📡', security_guard: '💂', parking: '🚗',
};

export default function LandlordDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('listings');
  const [verification, setVerification] = useState(null);
  const [listings, setListings] = useState([]);
  const [escrows, setEscrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '', description: '', property_type: 'apartment',
    rent_amount: '', deposit_amount: '', location: '', county: 'Nairobi',
    available_date: '', bundled_services: [],
  });
  const [verForm, setVerForm] = useState({ national_id: '', id_doc_url: '' });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  useEffect(() => {
    if (!user) return navigate('/login');
    Promise.all([
      api.get('/housing/verify/me').then(r => setVerification(r.data)).catch(() => {}),
      api.get('/housing/listings/mine').then(r => setListings(r.data)).catch(() => {}),
      api.get('/housing/escrow/mine').then(r => setEscrows(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [user, navigate]);

  const submitVerification = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post('/housing/verify', verForm);
      setVerification(data);
      showToast('Verification submitted! Awaiting admin review.');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleService = (svc) => {
    setForm(f => ({
      ...f,
      bundled_services: f.bundled_services.includes(svc)
        ? f.bundled_services.filter(s => s !== svc)
        : [...f.bundled_services, svc],
    }));
  };

  const createListing = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post('/housing/listings', {
        ...form,
        rent_amount: parseFloat(form.rent_amount),
        deposit_amount: parseFloat(form.deposit_amount || 0),
      });
      setListings(l => [data, ...l]);
      setForm({ title: '', description: '', property_type: 'apartment', rent_amount: '', deposit_amount: '', location: '', county: 'Nairobi', available_date: '', bundled_services: [] });
      setTab('listings');
      showToast('Listing created successfully!');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to create listing');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmEscrow = async (escrowId) => {
    try {
      const { data } = await api.post(`/housing/escrow/${escrowId}/confirm`);
      showToast(data.message || 'Confirmed!');
      const { data: updated } = await api.get('/housing/escrow/mine');
      setEscrows(updated);
    } catch (err) {
      showToast(err.response?.data?.error || 'Error');
    }
  };

  const isVerified = verification?.status === 'approved';

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-800 rounded w-1/3" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-800 rounded-xl" />)}
        </div>
      </div>
    </div>
  );

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-primary text-white px-5 py-3 rounded-xl shadow-2xl font-semibold text-sm">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black">Landlord Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage your properties, escrows & services</p>
        </div>
        {isVerified && (
          <span className="inline-flex items-center gap-1.5 bg-primary/20 text-green-400 border border-primary/40 px-3 py-1.5 rounded-full text-sm font-bold">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Verified Owner
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Listings', value: listings.length, icon: '🏠' },
          { label: 'Active Escrows', value: escrows.filter(e => ['funded','pending_payment'].includes(e.status)).length, icon: '🔐' },
          { label: 'Completed Rentals', value: escrows.filter(e => e.status === 'released').length, icon: '✅' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-black">{s.value}</div>
            <div className="text-gray-400 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-800 mb-6">
        {[
          { id: 'listings', label: '🏠 My Listings' },
          { id: 'create', label: '+ New Listing', disabled: !isVerified },
          { id: 'escrows', label: '🔐 Escrows' },
          { id: 'verify', label: `${isVerified ? '✅' : '⚠️'} Verification` },
        ].map(t => (
          <button key={t.id} onClick={() => !t.disabled && setTab(t.id)}
            className={`px-4 py-2 text-sm font-semibold transition whitespace-nowrap ${t.disabled ? 'text-gray-600 cursor-not-allowed' : tab === t.id ? 'text-accent border-b-2 border-accent' : 'text-gray-400 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Listings tab */}
      {tab === 'listings' && (
        <div>
          {listings.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <div className="text-5xl mb-3">🏘️</div>
              <p className="font-semibold">No listings yet</p>
              {isVerified
                ? <button onClick={() => setTab('create')} className="btn-primary mt-4 px-6">Create Your First Listing</button>
                : <p className="text-sm mt-2">Complete identity verification to start listing.</p>}
            </div>
          ) : (
            <div className="space-y-4">
              {listings.map(l => {
                const photos = (() => { try { return JSON.parse(l.photos || '[]'); } catch { return []; } })();
                const services = (() => { try { return JSON.parse(l.bundled_services || '[]'); } catch { return []; } })();
                return (
                  <div key={l.id} className="card flex gap-4 !p-4 items-start">
                    <img
                      src={photos[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&h=150&fit=crop&auto=format&q=70'}
                      alt={l.title}
                      className="w-28 h-20 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link to={`/housing/${l.id}`} className="font-bold hover:text-accent transition line-clamp-1">{l.title}</Link>
                        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${l.status === 'active' ? 'bg-green-900/30 text-green-400' : l.status === 'rented' ? 'bg-blue-900/30 text-blue-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                          {l.status}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs mt-0.5">{l.location}</p>
                      <p className="text-accent font-black text-sm mt-1">KES {Number(l.rent_amount).toLocaleString()}/mo</p>
                      {services.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {services.slice(0, 5).map(s => (
                            <span key={s} className="text-xs bg-gray-800 px-1.5 py-0.5 rounded text-gray-400">{SERVICE_ICONS[s]} {s.replace('_', ' ')}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Create listing */}
      {tab === 'create' && isVerified && (
        <form onSubmit={createListing} className="space-y-5 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold mb-1">Listing Title</label>
              <input className="input" placeholder="e.g. 2-Bedroom Apartment, Kilimani" required
                value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold mb-1">Description</label>
              <textarea className="input h-24 resize-none" placeholder="Describe the property..."
                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Property Type</label>
              <select className="input" value={form.property_type} onChange={e => setForm(f => ({ ...f, property_type: e.target.value }))}>
                {PROPERTY_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Location</label>
              <input className="input" placeholder="e.g. Kilimani, Nairobi" required
                value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Monthly Rent (KES)</label>
              <input className="input" type="number" placeholder="45000" required
                value={form.rent_amount} onChange={e => setForm(f => ({ ...f, rent_amount: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Security Deposit (KES)</label>
              <input className="input" type="number" placeholder="45000"
                value={form.deposit_amount} onChange={e => setForm(f => ({ ...f, deposit_amount: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Available From</label>
              <input className="input" type="date"
                value={form.available_date} onChange={e => setForm(f => ({ ...f, available_date: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Bundled Services</label>
            <div className="grid grid-cols-3 gap-2">
              {ALL_SERVICES.map(svc => (
                <button type="button" key={svc} onClick={() => toggleService(svc)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition ${form.bundled_services.includes(svc) ? 'bg-primary/20 border-primary text-green-300' : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                  {SERVICE_ICONS[svc]} {svc.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-accent px-8 py-3 font-black disabled:opacity-50">
            {submitting ? 'Creating...' : 'Create Listing →'}
          </button>
        </form>
      )}

      {/* Escrows */}
      {tab === 'escrows' && (
        <div className="space-y-4">
          {escrows.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <div className="text-5xl mb-3">🔐</div>
              <p className="font-semibold">No escrow transactions yet</p>
            </div>
          ) : escrows.map(e => (
            <div key={e.id} className="card">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-bold">{e.listing_title}</p>
                  <p className="text-gray-400 text-xs">{e.listing_location}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-bold flex-shrink-0 ${
                  e.status === 'released' ? 'bg-green-900/30 text-green-400' :
                  e.status === 'funded' ? 'bg-blue-900/30 text-blue-400' :
                  e.status === 'pending_payment' ? 'bg-yellow-900/30 text-yellow-400' :
                  e.status === 'disputed' ? 'bg-red-900/30 text-red-400' :
                  'bg-gray-800 text-gray-400'
                }`}>
                  {e.status.replace('_', ' ')}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div>
                  <span className="text-gray-500 text-xs">Total Amount</span>
                  <p className="font-bold text-accent">KES {Number(e.amount).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Method</span>
                  <p className="font-semibold capitalize">{e.method}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Tenant Confirmed</span>
                  <p className={`font-semibold ${e.tenant_confirmed ? 'text-green-400' : 'text-gray-400'}`}>{e.tenant_confirmed ? '✅ Yes' : '⏳ Pending'}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Your Confirmation</span>
                  <p className={`font-semibold ${e.landlord_confirmed ? 'text-green-400' : 'text-gray-400'}`}>{e.landlord_confirmed ? '✅ Yes' : '⏳ Pending'}</p>
                </div>
              </div>
              {e.status === 'funded' && !e.landlord_confirmed && e.landlord_id === user?.id && (
                <button onClick={() => confirmEscrow(e.id)} className="btn-primary w-full py-2 text-sm">
                  ✅ Confirm Tenant Move-In & Release Funds
                </button>
              )}
              {e.status === 'released' && (
                <div className="text-center text-green-400 text-sm font-semibold">
                  💰 KES {Number(e.amount).toLocaleString()} credited to your wallet
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Verification tab */}
      {tab === 'verify' && (
        <div className="max-w-md">
          {isVerified ? (
            <div className="card border-primary/40 bg-primary/5 text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-bold text-lg text-green-400 mb-1">Identity Verified</h3>
              <p className="text-gray-400 text-sm">Your owner status has been confirmed by FIXR. Your listings display the Verified Owner badge.</p>
              {verification?.national_id && <p className="text-xs text-gray-600 mt-2">National ID: ••{verification.national_id.slice(-4)}</p>}
            </div>
          ) : verification?.status === 'pending' ? (
            <div className="card border-yellow-800/40 bg-yellow-900/10 text-center">
              <div className="text-4xl mb-3">⏳</div>
              <h3 className="font-bold text-yellow-400 mb-1">Verification Pending</h3>
              <p className="text-gray-400 text-sm">Your verification is under admin review. This usually takes 1 to 2 business days.</p>
              {verification?.admin_note && <p className="text-xs text-yellow-500 mt-2">Note: {verification.admin_note}</p>}
            </div>
          ) : (
            <form onSubmit={submitVerification} className="space-y-4">
              <div className="bg-yellow-900/20 border border-yellow-800/40 rounded-xl p-4 text-sm text-yellow-300 mb-4">
                ⚠️ Identity verification is required before you can list properties. This protects tenants from fraud.
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">National ID Number</label>
                <input className="input" placeholder="e.g. 12345678" required
                  value={verForm.national_id} onChange={e => setVerForm(f => ({ ...f, national_id: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">ID Document URL (optional)</label>
                <input className="input" placeholder="https://... (scan or photo)"
                  value={verForm.id_doc_url} onChange={e => setVerForm(f => ({ ...f, id_doc_url: e.target.value }))} />
                <p className="text-xs text-gray-500 mt-1">In production: upload directly. Demo accepts URL string.</p>
              </div>
              <button type="submit" disabled={submitting} className="btn-accent px-8 py-3 font-black disabled:opacity-50 w-full">
                {submitting ? 'Submitting...' : 'Submit for Verification'}
              </button>
              {verification?.status === 'rejected' && (
                <div className="text-red-400 text-sm bg-red-900/20 border border-red-800/40 rounded-xl p-3">
                  ❌ Previous verification rejected. {verification.admin_note && `Reason: ${verification.admin_note}`}
                </div>
              )}
            </form>
          )}
        </div>
      )}
    </main>
  );
}
