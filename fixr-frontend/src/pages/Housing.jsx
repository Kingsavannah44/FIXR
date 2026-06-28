import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

const PROPERTY_TYPES = ['apartment', 'house', 'bedsitter', 'commercial'];
const SERVICE_ICONS = {
  cleaning: '🧹', waste_management: '🗑️', maintenance: '🔧',
  fire_safety: '🔥', ambulance: '🚑', cctv_setup: '📹',
  internet: '📡', security_guard: '💂', parking: '🚗',
};

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 bg-primary/20 text-green-400 border border-primary/40 text-xs font-bold px-2 py-0.5 rounded-full">
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      Verified Owner
    </span>
  );
}

function ListingCard({ listing }) {
  const photos = (() => { try { return JSON.parse(listing.photos || '[]'); } catch { return []; } })();
  const services = (() => { try { return JSON.parse(listing.bundled_services || '[]'); } catch { return []; } })();
  const photo = photos[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&auto=format&q=80';

  return (
    <Link to={`/housing/${listing.id}`} className="card !p-0 overflow-hidden group hover:border-primary/60 hover:scale-[1.01] transition-all duration-300 block">
      <div className="relative h-52 overflow-hidden">
        <img src={photo} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/30 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          {listing.owner_verified && <VerifiedBadge />}
          <span className="badge bg-accent/90 text-dark capitalize">{listing.property_type}</span>
        </div>
        <div className="absolute bottom-3 left-3 text-white font-black text-xl drop-shadow">
          KES {Number(listing.rent_amount).toLocaleString()}<span className="text-sm font-normal text-gray-300">/mo</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-base mb-1 line-clamp-1">{listing.title}</h3>
        <p className="text-gray-400 text-xs mb-3 flex items-center gap-1">
          <svg className="w-3 h-3 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          {listing.location}
        </p>
        {services.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {services.slice(0, 4).map(s => (
              <span key={s} className="text-xs bg-gray-800 px-2 py-0.5 rounded-full text-gray-300">
                {SERVICE_ICONS[s] || '✓'} {s.replace('_', ' ')}
              </span>
            ))}
            {services.length > 4 && <span className="text-xs text-gray-500">+{services.length - 4} more</span>}
          </div>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300">
              {listing.owner_name?.[0] || '?'}
            </div>
            {listing.owner_name}
          </span>
          <span className="text-primary font-semibold">View →</span>
        </div>
      </div>
    </Link>
  );
}

export default function Housing() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ location: '', type: '', min_price: '', max_price: '' });
  const [applied, setApplied] = useState({});

  const fetchListings = async (f = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (f.location) params.set('location', f.location);
      if (f.type) params.set('type', f.type);
      if (f.min_price) params.set('min_price', f.min_price);
      if (f.max_price) params.set('max_price', f.max_price);
      const { data } = await api.get(`/housing/listings?${params}`);
      setListings(data);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setApplied(filters);
    fetchListings(filters);
  };

  const clearFilters = () => {
    const empty = { location: '', type: '', min_price: '', max_price: '' };
    setFilters(empty);
    setApplied(empty);
    fetchListings({});
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-xl">🏠</div>
          <div>
            <h1 className="text-3xl font-black">FIXR Housing</h1>
            <p className="text-gray-400 text-sm">Verified listings. Escrow-protected payments. Zero fraud.</p>
          </div>
        </div>

        {/* Trust callout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          {[
            { icon: '✅', label: 'Verified Owners', desc: 'Every landlord identity-checked before listing' },
            { icon: '🔐', label: 'Escrow Protection', desc: 'Funds held until both parties confirm move-in' },
            { icon: '💬', label: 'Direct Messaging', desc: 'Talk to landlords directly — no middlemen' },
          ].map(t => (
            <div key={t.label} className="bg-gray-900/60 border border-gray-800 rounded-xl p-3 flex items-start gap-3">
              <span className="text-2xl">{t.icon}</span>
              <div>
                <div className="font-semibold text-sm">{t.label}</div>
                <div className="text-gray-400 text-xs">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search + Filters */}
      <form onSubmit={handleSearch} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <input
            className="input col-span-2 md:col-span-1"
            placeholder="Location (e.g. Kilimani)"
            value={filters.location}
            onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
          />
          <select
            className="input"
            value={filters.type}
            onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
          >
            <option value="">All Types</option>
            {PROPERTY_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
          </select>
          <input
            className="input"
            type="number"
            placeholder="Min KES"
            value={filters.min_price}
            onChange={e => setFilters(f => ({ ...f, min_price: e.target.value }))}
          />
          <input
            className="input"
            type="number"
            placeholder="Max KES"
            value={filters.max_price}
            onChange={e => setFilters(f => ({ ...f, max_price: e.target.value }))}
          />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1">Search</button>
            {(applied.location || applied.type || applied.min_price || applied.max_price) && (
              <button type="button" onClick={clearFilters} className="px-3 py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white transition text-sm">✕</button>
            )}
          </div>
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card !p-0 overflow-hidden animate-pulse">
              <div className="h-52 bg-gray-800" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-800 rounded w-3/4" />
                <div className="h-3 bg-gray-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-5xl mb-3">🏘️</div>
          <p className="text-lg font-semibold">No listings found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div>
          <p className="text-gray-400 text-sm mb-4">{listings.length} listing{listings.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
        </div>
      )}

      {/* CTA for landlords */}
      <div className="mt-16 relative rounded-2xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=400&fit=crop&auto=format&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/95 to-primary/60" />
        <div className="relative z-10 p-10">
          <h2 className="text-2xl font-black mb-2">Are you a property owner?</h2>
          <p className="text-gray-300 mb-4 max-w-md text-sm">List your property with FIXR and reach thousands of verified tenants. Escrow payments protect you too.</p>
          <Link to="/housing/landlord" className="btn-accent px-6 py-2.5 inline-flex items-center gap-2">
            List Your Property →
          </Link>
        </div>
      </div>
    </main>
  );
}
