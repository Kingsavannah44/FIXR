import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const SERVICE_CATALOGUE = {
  cleaning: { icon: '🧹', label: 'Cleaning', desc: 'Regular cleaning service included' },
  waste_management: { icon: '🗑️', label: 'Waste Management', desc: 'Scheduled waste collection' },
  maintenance: { icon: '🔧', label: 'Maintenance', desc: 'On-call maintenance crew' },
  fire_safety: { icon: '🔥', label: 'Fire Safety', desc: 'Fire extinguishers + inspection' },
  ambulance: { icon: '🚑', label: 'Ambulance Access', desc: '24/7 emergency response' },
  cctv_setup: { icon: '📹', label: 'CCTV', desc: 'Full perimeter surveillance' },
  internet: { icon: '📡', label: 'Internet', desc: 'High-speed fibre included' },
  security_guard: { icon: '💂', label: 'Security Guard', desc: '24hr on-site security' },
  parking: { icon: '🚗', label: 'Parking', desc: 'Designated parking space' },
};

export default function HousingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [messages, setMessages] = useState([]);
  const [msgBody, setMsgBody] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [escrow, setEscrow] = useState(null);
  const [escrowLoading, setEscrowLoading] = useState(false);
  const [tab, setTab] = useState('overview');
  const msgEndRef = useRef(null);

  useEffect(() => {
    api.get(`/housing/listings/${id}`)
      .then(r => setListing(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (tab === 'messages' && user) {
      api.get(`/housing/listings/${id}/messages`)
        .then(r => setMessages(r.data))
        .catch(() => {});
    }
  }, [tab, id, user]);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const photos = (() => { try { return JSON.parse(listing?.photos || '[]'); } catch { return []; } })();
  const services = (() => { try { return JSON.parse(listing?.bundled_services || '[]'); } catch { return []; } })();

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!msgBody.trim()) return;
    setSendingMsg(true);
    try {
      await api.post(`/housing/listings/${id}/messages`, { body: msgBody });
      setMsgBody('');
      const { data } = await api.get(`/housing/listings/${id}/messages`);
      setMessages(data);
    } catch {
    } finally {
      setSendingMsg(false);
    }
  };

  const initiateEscrow = async () => {
    if (!user) return navigate('/login');
    setEscrowLoading(true);
    try {
      const { data } = await api.post('/housing/escrow', { listing_id: id, method: 'wallet' });
      setEscrow(data);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to initiate escrow');
    } finally {
      setEscrowLoading(false);
    }
  };

  const fundEscrow = async () => {
    if (!escrow) return;
    setEscrowLoading(true);
    try {
      const { data } = await api.post(`/housing/escrow/${escrow.id}/fund`);
      setEscrow(data);
      alert('Escrow funded! Waiting for landlord confirmation after move-in.');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to fund escrow');
    } finally {
      setEscrowLoading(false);
    }
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="animate-pulse space-y-4">
        <div className="h-72 bg-gray-800 rounded-2xl" />
        <div className="h-6 bg-gray-800 rounded w-2/3" />
        <div className="h-4 bg-gray-800 rounded w-1/3" />
      </div>
    </div>
  );

  if (!listing) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-3">🏚️</div>
      <p className="text-lg font-semibold">Listing not found</p>
      <Link to="/housing" className="btn-primary mt-4 inline-block">Back to Housing</Link>
    </div>
  );

  const isOwner = user?.id === listing.owner_id;
  const totalAmount = parseFloat(listing.rent_amount) + parseFloat(listing.deposit_amount || 0);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/housing" className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-6">
        ← Back to Housing
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Photos + Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photo carousel */}
          <div className="relative rounded-2xl overflow-hidden bg-gray-900">
            <img
              src={photos[photoIdx] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&auto=format&q=80'}
              alt={listing.title}
              className="w-full h-72 object-cover"
            />
            {photos.length > 1 && (
              <>
                <button onClick={() => setPhotoIdx(i => (i - 1 + photos.length) % photos.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-dark/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-dark transition">‹</button>
                <button onClick={() => setPhotoIdx(i => (i + 1) % photos.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-dark/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-dark transition">›</button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {photos.map((_, i) => <div key={i} className={`w-1.5 h-1.5 rounded-full transition ${i === photoIdx ? 'bg-accent' : 'bg-white/40'}`} />)}
                </div>
              </>
            )}
            {/* Status badge */}
            <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
              listing.status === 'active' ? 'bg-green-500/80 text-white' :
              listing.status === 'under_offer' ? 'bg-yellow-500/80 text-dark' :
              listing.status === 'rented' ? 'bg-gray-500/80 text-white' : 'bg-gray-700 text-white'
            }`}>
              {listing.status === 'active' ? '✅ Available' : listing.status === 'under_offer' ? '⏳ Under Offer' : listing.status}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-800">
            {['overview', 'services', 'messages'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-semibold capitalize transition ${tab === t ? 'text-accent border-b-2 border-accent' : 'text-gray-400 hover:text-white'}`}>
                {t}
              </button>
            ))}
          </div>

          {/* Overview */}
          {tab === 'overview' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-start gap-3 mb-3">
                  <div>
                    <h1 className="text-2xl font-black mb-1">{listing.title}</h1>
                    <p className="text-gray-400 text-sm flex items-center gap-1">
                      <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                      {listing.location}
                    </p>
                  </div>
                  {listing.owner_verified && (
                    <span className="inline-flex items-center gap-1 bg-primary/20 text-green-400 border border-primary/40 text-xs font-bold px-2 py-1 rounded-full ml-auto">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      Verified Owner
                    </span>
                  )}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{listing.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Monthly Rent</div>
                  <div className="text-xl font-black text-accent">KES {Number(listing.rent_amount).toLocaleString()}</div>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Deposit</div>
                  <div className="text-xl font-black">KES {Number(listing.deposit_amount || 0).toLocaleString()}</div>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Property Type</div>
                  <div className="font-semibold capitalize">{listing.property_type}</div>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Available From</div>
                  <div className="font-semibold">{listing.available_date ? new Date(listing.available_date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Immediate'}</div>
                </div>
              </div>
            </div>
          )}

          {/* Services */}
          {tab === 'services' && (
            <div>
              {services.length === 0 ? (
                <p className="text-gray-500 text-sm py-4">No bundled services listed for this property.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {services.map(s => {
                    const svc = SERVICE_CATALOGUE[s] || { icon: '✓', label: s.replace('_', ' '), desc: 'Included' };
                    return (
                      <div key={s} className="bg-gray-900 border border-gray-800 rounded-xl p-3 flex items-start gap-3">
                        <span className="text-2xl">{svc.icon}</span>
                        <div>
                          <div className="font-semibold text-sm capitalize">{svc.label}</div>
                          <div className="text-gray-400 text-xs">{svc.desc}</div>
                        </div>
                        <div className="ml-auto">
                          <span className="text-xs text-green-400 bg-green-900/30 px-2 py-0.5 rounded-full">Included</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          {tab === 'messages' && (
            <div>
              {!user ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-3">Please log in to message the landlord</p>
                  <Link to="/login" className="btn-primary px-5 py-2">Log In</Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-3 text-xs text-gray-400">
                    💬 Direct thread with {listing.owner?.full_name || 'landlord'}. All messages are logged for dispute resolution.
                  </div>
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1 scrollbar-hide">
                    {messages.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No messages yet. Start the conversation.</p>}
                    {messages.map(m => {
                      const isMe = m.sender_id === user?.id;
                      return (
                        <div key={m.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                          <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {m.sender_name?.[0] || '?'}
                          </div>
                          <div className={`max-w-xs ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                            <div className={`px-3 py-2 rounded-xl text-sm ${isMe ? 'bg-primary text-white rounded-tr-sm' : 'bg-gray-800 rounded-tl-sm'}`}>
                              {m.body}
                            </div>
                            <span className="text-gray-600 text-xs mt-0.5">
                              {new Date(m.created_at).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={msgEndRef} />
                  </div>
                  <form onSubmit={sendMessage} className="flex gap-2 mt-2">
                    <input
                      className="input flex-1"
                      placeholder="Type your message..."
                      value={msgBody}
                      onChange={e => setMsgBody(e.target.value)}
                    />
                    <button type="submit" disabled={sendingMsg || !msgBody.trim()} className="btn-primary px-4 disabled:opacity-50">
                      {sendingMsg ? '...' : 'Send'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Owner card + Escrow panel */}
        <div className="space-y-4">
          {/* Owner card */}
          <div className="card">
            <h3 className="font-bold mb-3 text-sm text-gray-400 uppercase tracking-widest">Property Owner</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gray-700 flex items-center justify-center text-lg font-black">
                {listing.owner?.full_name?.[0] || '?'}
              </div>
              <div>
                <div className="font-bold">{listing.owner?.full_name || 'Unknown'}</div>
                {listing.owner_verified && (
                  <span className="inline-flex items-center gap-1 text-green-400 text-xs">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    ID Verified
                  </span>
                )}
              </div>
            </div>
            {listing.owner?.bio && <p className="text-gray-400 text-xs mb-3">{listing.owner.bio}</p>}
            {!isOwner && (
              <button onClick={() => setTab('messages')} className="btn-primary w-full text-sm py-2">
                💬 Message Owner
              </button>
            )}
          </div>

          {/* Escrow panel */}
          {!isOwner && listing.status === 'active' && (
            <div className="card border-primary/30 bg-primary/5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🔐</span>
                <div>
                  <h3 className="font-bold text-sm">Escrow-Protected Rental</h3>
                  <p className="text-gray-400 text-xs">Pay securely. Funds released only on move-in.</p>
                </div>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-300">
                  <span>First month rent</span>
                  <span className="font-semibold">KES {Number(listing.rent_amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Security deposit</span>
                  <span className="font-semibold">KES {Number(listing.deposit_amount || 0).toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-700 pt-2 flex justify-between font-black text-base">
                  <span>Total in escrow</span>
                  <span className="text-accent">KES {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {!escrow ? (
                <button onClick={initiateEscrow} disabled={escrowLoading} className="btn-accent w-full py-2.5 font-bold disabled:opacity-50">
                  {escrowLoading ? 'Processing...' : 'Initiate Escrow →'}
                </button>
              ) : escrow.status === 'pending_payment' ? (
                <div className="space-y-2">
                  <div className="text-xs text-yellow-400 bg-yellow-900/20 border border-yellow-800/40 rounded-lg p-2">
                    ⏳ Escrow created. Fund it to lock in your rental.
                  </div>
                  <button onClick={fundEscrow} disabled={escrowLoading} className="btn-accent w-full py-2.5 font-bold disabled:opacity-50">
                    {escrowLoading ? 'Processing...' : 'Fund Escrow (Demo)'}
                  </button>
                </div>
              ) : (
                <div className="text-xs text-green-400 bg-green-900/20 border border-green-800/40 rounded-lg p-2 text-center">
                  ✅ Escrow funded. Awaiting move-in confirmations.
                </div>
              )}

              <div className="mt-3 text-xs text-gray-500 space-y-1">
                <div className="flex items-start gap-1.5">
                  <span>🛡️</span>
                  <span>Funds auto-refund if landlord cancels or 14 days pass without confirmation.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span>⚠️</span>
                  <span>10% cancellation fee applies if you cancel after funding.</span>
                </div>
              </div>
            </div>
          )}

          {listing.status === 'under_offer' && !isOwner && (
            <div className="card border-yellow-800/40 bg-yellow-900/10 text-center">
              <div className="text-2xl mb-2">⏳</div>
              <p className="font-semibold text-sm">Under Offer</p>
              <p className="text-gray-400 text-xs mt-1">Another tenant has initiated escrow. This listing will become available again if that escrow expires.</p>
            </div>
          )}

          {listing.status === 'rented' && (
            <div className="card border-gray-700 bg-gray-900/30 text-center">
              <div className="text-2xl mb-2">🏠</div>
              <p className="font-semibold text-sm">Currently Rented</p>
              <p className="text-gray-400 text-xs mt-1">This property is occupied. Check back later.</p>
            </div>
          )}

          {isOwner && (
            <Link to="/housing/landlord" className="btn-primary w-full text-center block py-2.5 text-sm">
              ⚙️ Manage This Listing
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
