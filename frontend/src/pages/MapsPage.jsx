import React, { useState, useEffect } from 'react';
import Layout from '../components/ui/Layout';
import { mapsAPI } from '../services/api';
import { MapPin, Navigation, Star, Clock, ExternalLink, Search, Route, Utensils, Hotel, Camera, ShoppingBag, Music, TreePine, Stethoscope, Train } from 'lucide-react';
import toast from 'react-hot-toast';

const TYPE_CONFIG = {
  all:         { icon: MapPin,       label: 'All',          color: 'bg-gray-500' },
  attraction:  { icon: Camera,       label: 'Attractions',  color: 'bg-purple-500' },
  restaurant:  { icon: Utensils,     label: 'Food',         color: 'bg-orange-500' },
  hotel:       { icon: Hotel,        label: 'Hotels',       color: 'bg-blue-500' },
  shopping:    { icon: ShoppingBag,  label: 'Shopping',     color: 'bg-pink-500' },
  nature:      { icon: TreePine,     label: 'Nature',       color: 'bg-emerald-500' },
  nightlife:   { icon: Music,        label: 'Nightlife',    color: 'bg-indigo-500' },
  transport:   { icon: Train,        label: 'Transport',    color: 'bg-green-500' },
};

function PlaceCard({ place, onRoute }) {
  const cfg = TYPE_CONFIG[place.type] || TYPE_CONFIG.all;
  const Icon = cfg.icon;
  return (
    <div className="card p-4 hover:shadow-card-hover transition-all duration-300 group">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl ${cfg.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
          <Icon size={18} className="text-white"/>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{place.name}</h4>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center gap-1 text-xs text-yellow-500">
                  <Star size={10} className="fill-yellow-500"/> {place.rating}
                </div>
                <span className="text-gray-300 text-xs">·</span>
                <span className="text-xs text-gray-400">{place.reviews?.toLocaleString()} reviews</span>
              </div>
            </div>
            <div className={`flex-shrink-0 w-2.5 h-2.5 rounded-full mt-1 ${place.open ? 'bg-green-400' : 'bg-red-400'}`}
              title={place.open ? 'Open now' : 'Closed'}/>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1"><MapPin size={9}/> {place.distance}</span>
            <span className="flex items-center gap-1"><Clock size={9}/> {place.open ? 'Open now' : 'Closed'}</span>
            <span>{place.priceLevel}</span>
          </div>
          <div className="text-xs text-gray-400 mt-0.5 truncate">{place.address}</div>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={() => onRoute(place)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-ocean-50 dark:bg-ocean-900/20 text-ocean-600 dark:text-ocean-400 rounded-xl text-xs font-medium hover:bg-ocean-100 transition-colors">
          <Route size={11}/> Route
        </button>
        <a href={`https://www.google.com/maps/search/${encodeURIComponent(place.name + ' ' + place.address)}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-[#243045] text-gray-600 dark:text-gray-400 rounded-xl text-xs font-medium hover:bg-gray-100 transition-colors">
          <ExternalLink size={11}/> Maps
        </a>
        <span className={`ml-auto badge text-[10px] ${place.badgeClass}`}>
          {place.emoji} {place.type}
        </span>
      </div>
    </div>
  );
}

function MapPlaceholder({ destination, places }) {
  // Interactive SVG map placeholder with place dots
  const dots = places.slice(0, 6);
  return (
    <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-[#2a3a50] bg-gradient-to-br from-blue-50 to-green-50 dark:from-[#1a2535] dark:to-[#1a3050]"
      style={{ height: '380px' }}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 380">
        {/* Grid lines */}
        {[...Array(8)].map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i*50} x2="600" y2={i*50} stroke="currentColor" strokeOpacity="0.05" strokeWidth="1"/>
        ))}
        {[...Array(12)].map((_, i) => (
          <line key={`v${i}`} x1={i*50} y1="0" x2={i*50} y2="380" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1"/>
        ))}
        {/* Roads */}
        <path d="M 50 190 Q 200 100 350 190 T 550 190" stroke="#94a3b8" strokeOpacity="0.3" strokeWidth="3" fill="none"/>
        <path d="M 300 30 Q 350 150 300 350" stroke="#94a3b8" strokeOpacity="0.3" strokeWidth="2.5" fill="none"/>
        <path d="M 100 80 L 500 280" stroke="#94a3b8" strokeOpacity="0.2" strokeWidth="2" fill="none"/>
        <path d="M 80 300 Q 250 250 420 300 T 580 280" stroke="#94a3b8" strokeOpacity="0.2" strokeWidth="2" fill="none"/>
        {/* Place markers */}
        {dots.map((p, i) => {
          const x = 80 + (i % 3) * 180 + Math.random() * 60;
          const y = 80 + Math.floor(i / 3) * 140 + Math.random() * 40;
          const cfg = TYPE_CONFIG[p.type] || TYPE_CONFIG.all;
          return (
            <g key={p.id}>
              <circle cx={x} cy={y} r="16" fill="#c4842a" fillOpacity="0.15" stroke="#c4842a" strokeWidth="1.5"/>
              <circle cx={x} cy={y} r="6" fill="#c4842a"/>
              <text x={x} y={y + 28} textAnchor="middle" fontSize="10" fill="#6b7280" fontFamily="DM Sans, sans-serif" fontWeight="500">
                {p.name.length > 12 ? p.name.substring(0, 12) + '…' : p.name}
              </text>
            </g>
          );
        })}
        {/* Center marker */}
        <circle cx="300" cy="190" r="22" fill="#2c9eef" fillOpacity="0.15" stroke="#2c9eef" strokeWidth="2"/>
        <circle cx="300" cy="190" r="8" fill="#2c9eef"/>
        <text x="300" y="222" textAnchor="middle" fontSize="11" fill="#185FA5" fontFamily="DM Sans, sans-serif" fontWeight="600">You</text>
      </svg>

      {/* Overlay info */}
      <div className="absolute top-3 left-3 glass rounded-xl px-3 py-1.5 flex items-center gap-2">
        <MapPin size={13} className="text-sand-500"/>
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{destination || 'Select destination'}</span>
      </div>
      <div className="absolute bottom-3 right-3 glass rounded-xl px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400">
        Connect Google Maps API for live map
      </div>
    </div>
  );
}

export default function MapsPage() {
  const [destination, setDestination] = useState('');
  const [input, setInput] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [routeResult, setRouteResult] = useState(null);
  const [routeFrom, setRouteFrom] = useState('');
  const [routeTo, setRouteTo] = useState('');

  const handleSearch = async (dest) => {
    const d = dest || input.trim();
    if (!d) { toast.error('Enter a destination'); return; }
    setLoading(true);
    setDestination(d);
    try {
      const data = await mapsAPI.nearby(d, typeFilter === 'all' ? '' : typeFilter);
      setPlaces(data.places || []);
      toast.success(`Found ${data.places?.length || 0} places near ${d}`);
    } catch { toast.error('Search failed'); }
    finally { setLoading(false); }
  };

  const handleRoute = async (place) => {
    setRouteTo(place.name);
    try {
      const r = await mapsAPI.route(destination, place.name);
      setRouteResult(r);
      window.open(r.mapsUrl, '_blank');
    } catch { toast.error('Route failed'); }
  };

  const handleGetRoute = async () => {
    if (!routeFrom || !routeTo) { toast.error('Fill both fields'); return; }
    try {
      const r = await mapsAPI.route(routeFrom, routeTo);
      setRouteResult(r);
      window.open(r.mapsUrl, '_blank');
    } catch { toast.error('Route failed'); }
  };

  useEffect(() => {
    if (destination) handleSearch(destination);
  }, [typeFilter]);

  const filtered = typeFilter === 'all' ? places : places.filter(p => p.type === typeFilter);

  return (
    <Layout title="Maps & Places">
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
          <div className="card p-4">
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input type="text" placeholder="Search destination..." value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm focus:border-sand-400 transition-colors"/>
              </div>
              <button onClick={() => handleSearch()} disabled={loading}
                className="px-4 py-2.5 bg-sand-500 text-white rounded-xl text-sm font-medium hover:bg-sand-600 transition-colors disabled:opacity-60">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Search size={15}/>}
              </button>
            </div>
            {/* Quick cities */}
            <div className="flex flex-wrap gap-1.5">
              {['Paris','Tokyo','Bali','London'].map(c => (
                <button key={c} onClick={() => { setInput(c); handleSearch(c); }}
                  className="px-2.5 py-1 rounded-lg text-xs border border-gray-200 dark:border-[#2a3a50] text-gray-500 hover:border-sand-300 transition-colors">
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Type filters */}
          <div className="card p-4">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Filter by type</div>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(TYPE_CONFIG).map(([key, { icon: Icon, label, color }]) => (
                <button key={key} onClick={() => setTypeFilter(key)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl text-center transition-all ${typeFilter === key ? `${color} text-white shadow-md` : 'bg-gray-50 dark:bg-[#243045] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2a3a50]'}`}>
                  <Icon size={15}/>
                  <span className="text-[9px] font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Route planner */}
          <div className="card p-4">
            <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
              <Route size={14} className="text-ocean-500"/> Route Planner
            </h4>
            <div className="space-y-2 mb-3">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-400"/>
                <input type="text" placeholder="From..." value={routeFrom}
                  onChange={e => setRouteFrom(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm focus:border-sand-400"/>
              </div>
              <div className="relative">
                <MapPin size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400"/>
                <input type="text" placeholder="To..." value={routeTo}
                  onChange={e => setRouteTo(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm focus:border-sand-400"/>
              </div>
            </div>
            <button onClick={handleGetRoute}
              className="w-full py-2.5 bg-ocean-500 text-white rounded-xl text-sm font-medium hover:bg-ocean-600 transition-colors flex items-center justify-center gap-2">
              <Navigation size={14}/> Get Directions
            </button>
            {routeResult && (
              <div className="mt-3 p-3 rounded-xl bg-ocean-50 dark:bg-ocean-900/20 text-xs text-ocean-700 dark:text-ocean-400">
                <div className="font-semibold">📍 {routeResult.distance} · ⏱ {routeResult.duration}</div>
                <div className="text-ocean-500 mt-0.5">Opened in Google Maps</div>
              </div>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="lg:col-span-3 space-y-4">
          <MapPlaceholder destination={destination} places={filtered}/>

          {filtered.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-gray-800 dark:text-white">
                  Nearby Places {destination && `in ${destination}`}
                </h3>
                <span className="text-xs text-gray-400">{filtered.length} found</span>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {filtered.map(place => (
                  <PlaceCard key={place.id} place={place} onRoute={handleRoute}/>
                ))}
              </div>
            </div>
          )}

          {!destination && (
            <div className="card p-10 text-center">
              <MapPin size={40} className="mx-auto text-gray-300 mb-4"/>
              <h3 className="font-display text-lg text-gray-500 mb-1">Explore nearby places</h3>
              <p className="text-sm text-gray-400">Search any destination to discover restaurants, attractions, hotels and more</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
