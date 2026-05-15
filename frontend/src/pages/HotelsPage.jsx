import React, { useState } from 'react';
import Layout from '../components/ui/Layout';
import { hotelsAPI } from '../services/api';
import { Building2, Search, MapPin, Star, Wifi, UtensilsCrossed, Car, Waves, Dumbbell, Calendar, Users, SlidersHorizontal, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const AMENITY_ICONS = { Pool: Waves, 'Free WiFi': Wifi, Restaurant: UtensilsCrossed, Gym: Dumbbell, Parking: Car };

function HotelCard({ hotel, onBook }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="card overflow-hidden hover:shadow-card-hover transition-all duration-300 group">
      <div className="flex gap-0">
        <div className="relative w-48 flex-shrink-0 overflow-hidden">
          <img src={hotel.image} alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => e.target.src='https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'}/>
          <div className="absolute top-2 left-2">
            <span className="badge bg-white/90 text-sand-700 text-xs font-bold">
              {'★'.repeat(hotel.stars)}
            </span>
          </div>
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-display font-semibold text-gray-800 dark:text-white text-base">{hotel.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                <MapPin size={10}/> {hotel.neighborhood} · {hotel.distance}
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-3">
              <div className="text-xl font-display font-bold text-sand-600 dark:text-sand-400">₹{hotel.pricePerNight.toLocaleString()}</div>
              <div className="text-xs text-gray-400">per night</div>
              <div className="text-xs font-medium text-gray-600 dark:text-gray-300">₹{hotel.totalPrice.toLocaleString()} total</div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-lg">
              <Star size={10} className="fill-green-500 text-green-500"/>
              <span className="text-xs font-bold">{hotel.rating}</span>
            </div>
            <span className="text-xs text-gray-400">{hotel.reviews.toLocaleString()} reviews</span>
            <span className={`badge text-xs ${hotel.breakfastIncluded ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
              {hotel.breakfastIncluded ? '🍳 Breakfast included' : 'No breakfast'}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {hotel.amenities.slice(0, 5).map(a => {
              const Icon = AMENITY_ICONS[a];
              return (
                <span key={a} className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#243045] px-2 py-0.5 rounded-lg">
                  {Icon ? <Icon size={10}/> : null} {a}
                </span>
              );
            })}
            {hotel.amenities.length > 5 && <span className="text-xs text-gray-400">+{hotel.amenities.length - 5} more</span>}
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${hotel.cancellation === 'Free cancellation' ? 'text-green-600' : 'text-red-500'}`}>
              {hotel.cancellation}
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => setExpanded(!expanded)}
                className="px-3 py-1.5 border border-gray-200 dark:border-[#2a3a50] text-gray-600 dark:text-gray-400 rounded-xl text-xs hover:bg-gray-50 dark:hover:bg-[#243045] transition-colors">
                {expanded ? 'Less' : 'Details'}
              </button>
              <button onClick={() => onBook(hotel)}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-sand-500 to-sand-600 text-white rounded-xl text-xs font-semibold hover:from-sand-600 hover:to-sand-700 transition-all shadow-sm">
                Book Now <ExternalLink size={11}/>
              </button>
            </div>
          </div>

          {expanded && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#2a3a50] animate-fade-in">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <strong>Address:</strong> {hotel.address}<br/>
                <strong>Room type:</strong> {hotel.roomType}<br/>
                <strong>All amenities:</strong> {hotel.amenities.join(', ')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HotelsPage() {
  const [form, setForm] = useState({ destination: '', checkin: '', checkout: '', guests: 1 });
  const [filters, setFilters] = useState({ stars: '', maxPrice: '', breakfast: false });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('price');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!form.destination) { toast.error('Enter a destination'); return; }
    setLoading(true);
    try {
      const params = { ...form, ...filters };
      const data = await hotelsAPI.search(params);
      setResults(data.hotels || []);
      toast.success(`Found ${data.hotels?.length || 0} hotels!`);
    } catch { toast.error('Search failed'); }
    finally { setLoading(false); }
  };

  const handleBook = (hotel) => {
    window.open(hotel.affiliateUrl, '_blank');
    toast.success('Opening booking.com... (affiliate link)');
  };

  const nights = form.checkin && form.checkout
    ? Math.max(1, Math.ceil((new Date(form.checkout) - new Date(form.checkin)) / 86400000))
    : 0;

  const sorted = (results || [])
    .filter(h => !filters.stars || h.stars >= parseInt(filters.stars))
    .filter(h => !filters.maxPrice || h.pricePerNight <= parseInt(filters.maxPrice))
    .filter(h => !filters.breakfast || h.breakfastIncluded)
    .sort((a, b) => sortBy === 'price' ? a.pricePerNight - b.pricePerNight : sortBy === 'rating' ? b.rating - a.rating : b.stars - a.stars);

  return (
    <Layout title="Hotel Search">
      <div className="card p-6 mb-6">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="col-span-2 lg:col-span-1">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Destination</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input type="text" placeholder="Paris, Bali, Tokyo..." required value={form.destination}
                  onChange={e => setForm({...form, destination: e.target.value})}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm focus:border-sand-400 transition-colors"/>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Check-in</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input type="date" value={form.checkin} min={new Date().toISOString().split('T')[0]}
                  onChange={e => setForm({...form, checkin: e.target.value})}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm focus:border-sand-400"/>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Check-out {nights > 0 && <span className="text-sand-500 normal-case font-normal">({nights}n)</span>}</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input type="date" value={form.checkout} min={form.checkin || new Date().toISOString().split('T')[0]}
                  onChange={e => setForm({...form, checkout: e.target.value})}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm focus:border-sand-400"/>
              </div>
            </div>
          </div>
          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-2 text-xs text-gray-500"><SlidersHorizontal size={13}/> Filters:</div>
            <select value={filters.stars} onChange={e => setFilters(f=>({...f, stars:e.target.value}))}
              className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#1a2535] text-gray-700 dark:text-gray-300 text-xs">
              <option value="">Any stars</option>
              {[2,3,4,5].map(s => <option key={s} value={s}>{s}+ Stars</option>)}
            </select>
            <input type="number" placeholder="Max ₹/night" value={filters.maxPrice}
              onChange={e => setFilters(f=>({...f, maxPrice:e.target.value}))}
              className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#1a2535] text-gray-700 dark:text-gray-300 text-xs w-32"/>
            <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
              <input type="checkbox" checked={filters.breakfast} onChange={e => setFilters(f=>({...f, breakfast:e.target.checked}))} className="rounded"/>
              Breakfast included
            </label>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-sand-500 to-sand-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-sand-600 hover:to-sand-700 transition-all shadow-md disabled:opacity-60">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <><Search size={18}/> Search Hotels</>}
          </button>
        </form>
      </div>

      {results && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-gray-800 dark:text-white">{form.destination}</h3>
              <p className="text-xs text-gray-400">{sorted.length} hotels found</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Sort:</span>
              {['price','rating','stars'].map(s => (
                <button key={s} onClick={() => setSortBy(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${sortBy===s?'bg-sand-500 text-white':'bg-white dark:bg-[#1a2535] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#2a3a50]'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {sorted.map(hotel => <HotelCard key={hotel.id} hotel={hotel} onBook={handleBook}/>)}
          </div>
        </>
      )}

      {!results && (
        <div className="card p-12 text-center">
          <Building2 size={48} className="mx-auto text-gray-300 mb-4"/>
          <h3 className="font-display text-xl text-gray-500 mb-2">Find your perfect stay</h3>
          <p className="text-gray-400 text-sm">Search from thousands of hotels, resorts, and boutique properties worldwide</p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {['Paris','Bali','Tokyo','London','Singapore','Dubai'].map(d => (
              <button key={d} onClick={() => setForm(f=>({...f, destination:d}))}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-[#2a3a50] text-sm text-gray-600 dark:text-gray-400 hover:border-sand-300 transition-colors">
                {d}
              </button>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
