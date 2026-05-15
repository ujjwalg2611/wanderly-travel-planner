import React, { useState, useEffect } from 'react';
import Layout from '../components/ui/Layout';
import { flightsAPI, alertsAPI } from '../services/api';
import { PlaneTakeoff, PlaneLanding, Calendar, Users, Search, Bell, ArrowRight, ArrowLeftRight, Clock, Briefcase, RefreshCw, ChevronLeft, ChevronRight, Star, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { format, parseISO, addMonths, subMonths } from 'date-fns';

function FareCalendar({ from, to }) {
  const [month, setMonth] = useState(new Date());
  const [calendar, setCalendar] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!from || !to) return;
    setLoading(true);
    const monthStr = format(month, 'yyyy-MM');
    flightsAPI.fareCalendar({ from, to, month: monthStr })
      .then(r => setCalendar(r.calendar || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [from, to, month]);

  const weeks = [];
  if (calendar.length) {
    const first = new Date(calendar[0].date);
    const padDays = first.getDay();
    let week = Array(padDays).fill(null);
    calendar.forEach(day => {
      week.push(day);
      if (week.length === 7) { weeks.push(week); week = []; }
    });
    if (week.length) weeks.push([...week, ...Array(7 - week.length).fill(null)]);
  }

  const minPrice = Math.min(...calendar.filter(c => c?.available).map(c => c.price));
  const maxPrice = Math.max(...calendar.filter(c => c?.available).map(c => c.price));

  const getColor = (price) => {
    if (!price) return '';
    const ratio = (price - minPrice) / (maxPrice - minPrice);
    if (ratio < 0.33) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
    if (ratio < 0.66) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
    return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <Calendar size={16} className="text-sand-500"/> Fare Calendar
        </h4>
        <div className="flex items-center gap-2">
          <button onClick={() => setMonth(m => subMonths(m, 1))} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#243045] text-gray-500"><ChevronLeft size={16}/></button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-28 text-center">{format(month, 'MMMM yyyy')}</span>
          <button onClick={() => setMonth(m => addMonths(m, 1))} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#243045] text-gray-500"><ChevronRight size={16}/></button>
        </div>
      </div>
      {!from || !to ? (
        <p className="text-sm text-gray-400 text-center py-8">Enter origin and destination to see fare calendar</p>
      ) : loading ? (
        <div className="h-48 shimmer-bg rounded-xl"/>
      ) : (
        <>
          <div className="grid grid-cols-7 mb-1">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
              <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-0.5 mb-0.5">
              {week.map((day, di) => (
                <div key={di} className={`p-1 rounded-lg text-center cursor-pointer transition-all hover:scale-105 ${day ? getColor(day.price) : ''} ${day?.cheapest ? 'ring-2 ring-green-400' : ''}`}>
                  {day && (
                    <>
                      <div className="text-xs font-medium">{new Date(day.date).getDate()}</div>
                      <div className="text-[9px] font-semibold">₹{Math.round(day.price / 1000)}k</div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-200 inline-block"/> Cheap</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-200 inline-block"/> Medium</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-200 inline-block"/> Expensive</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded ring-2 ring-green-400 bg-green-100 inline-block"/> Cheapest</span>
          </div>
        </>
      )}
    </div>
  );
}

function FlightCard({ flight, onBook }) {
  return (
    <div className="card p-4 hover:shadow-card-hover transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{flight.airlineLogo}</span>
          <div>
            <div className="font-semibold text-sm text-gray-800 dark:text-gray-200">{flight.airline}</div>
            <div className="text-xs text-gray-400">{flight.flightNumber}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-display font-bold text-sand-600 dark:text-sand-400">₹{flight.price.toLocaleString()}</div>
          <div className="text-xs text-gray-400">per person</div>
        </div>
      </div>
      <div className="flex items-center justify-between py-3 border-y border-gray-100 dark:border-[#2a3a50] mb-3">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-800 dark:text-white">{flight.departure}</div>
          <div className="text-xs text-gray-400 font-medium">{flight.from}</div>
        </div>
        <div className="flex-1 flex flex-col items-center px-4">
          <div className="text-xs text-gray-400 mb-1">{flight.duration}</div>
          <div className="flex items-center w-full gap-1">
            <div className="flex-1 h-0.5 bg-gray-200 dark:bg-[#2a3a50]"/>
            <PlaneTakeoff size={14} className="text-sand-400"/>
            <div className="flex-1 h-0.5 bg-gray-200 dark:bg-[#2a3a50]"/>
          </div>
          <div className="text-xs text-gray-400 mt-1">{flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-800 dark:text-white">{flight.arrival}</div>
          <div className="text-xs text-gray-400 font-medium">{flight.to}</div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1"><Briefcase size={11}/> {flight.baggage}</span>
          <span className={`badge ${flight.refundable ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-red-50 dark:bg-red-900/20 text-red-500'}`}>
            {flight.refundable ? 'Refundable' : 'Non-refundable'}
          </span>
          <span className="badge bg-sand-50 dark:bg-sand-900/20 text-sand-600 dark:text-sand-400">{flight.class}</span>
        </div>
        <button onClick={() => onBook(flight)}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-sand-500 to-sand-600 text-white rounded-xl text-xs font-semibold hover:from-sand-600 hover:to-sand-700 transition-all shadow-sm">
          Book <ArrowRight size={12}/>
        </button>
      </div>
    </div>
  );
}

export default function FlightsPage() {
  const [tripType, setTripType] = useState('one-way');
  const [form, setForm] = useState({ from: '', to: '', date: '', returnDate: '', passengers: 1, class: 'Economy' });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ stops: 'any', maxPrice: '' });
  const [alertRoute, setAlertRoute] = useState('');
  const [alertPrice, setAlertPrice] = useState('');
  const [sortBy, setSortBy] = useState('price');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!form.from || !form.to) { toast.error('Enter origin and destination'); return; }
    setLoading(true);
    try {
      const data = await flightsAPI.search({ ...form, tripType });
      setResults(data);
      toast.success(`Found ${data.outbound.length} flights!`);
    } catch { toast.error('Search failed'); }
    finally { setLoading(false); }
  };

  const handleBook = (flight) => {
    window.open(`https://www.skyscanner.net/transport/flights/${flight.from}/${flight.to}/`, '_blank');
    toast.success('Opening booking page... (connect real API for production)');
  };

  const handleAlert = async () => {
    if (!alertRoute || !alertPrice) { toast.error('Fill all fields'); return; }
    await alertsAPI.create({ route: alertRoute, targetPrice: alertPrice });
    toast.success('Price alert set! We\'ll notify you.');
    setAlertRoute(''); setAlertPrice('');
  };

  const sortedFlights = (results?.outbound || [])
    .filter(f => filter.stops === 'any' || (filter.stops === '0' && f.stops === 0) || (filter.stops === '1' && f.stops <= 1))
    .filter(f => !filter.maxPrice || f.price <= parseInt(filter.maxPrice))
    .sort((a, b) => sortBy === 'price' ? a.price - b.price : sortBy === 'duration' ? a.duration.localeCompare(b.duration) : a.departure.localeCompare(b.departure));

  return (
    <Layout title="Flight Search">
      {/* Search form */}
      <div className="card p-6 mb-6">
        <div className="flex gap-2 mb-5">
          {['one-way', 'round-trip'].map(t => (
            <button key={t} onClick={() => setTripType(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${tripType === t ? 'bg-sand-500 text-white shadow-md' : 'bg-gray-100 dark:bg-[#243045] text-gray-600 dark:text-gray-400'}`}>
              {t === 'round-trip' ? '⇄ Round Trip' : '→ One Way'}
            </button>
          ))}
        </div>
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">From</label>
              <div className="relative">
                <PlaneTakeoff size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input type="text" placeholder="Delhi, Mumbai..." value={form.from}
                  onChange={e => setForm({...form, from: e.target.value})}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm focus:border-sand-400 transition-colors"/>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">To</label>
              <div className="relative">
                <PlaneLanding size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input type="text" placeholder="Paris, Tokyo..." value={form.to}
                  onChange={e => setForm({...form, to: e.target.value})}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm focus:border-sand-400 transition-colors"/>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Depart</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input type="date" value={form.date} min={new Date().toISOString().split('T')[0]}
                  onChange={e => setForm({...form, date: e.target.value})}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm focus:border-sand-400 transition-colors"/>
              </div>
            </div>
            {tripType === 'round-trip' ? (
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Return</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                  <input type="date" value={form.returnDate} min={form.date || new Date().toISOString().split('T')[0]}
                    onChange={e => setForm({...form, returnDate: e.target.value})}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm focus:border-sand-400 transition-colors"/>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Passengers</label>
                <div className="relative">
                  <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                  <select value={form.passengers} onChange={e => setForm({...form, passengers: parseInt(e.target.value)})}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm focus:border-sand-400">
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Passenger{n>1?'s':''}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-sand-500 to-sand-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-sand-600 hover:to-sand-700 transition-all shadow-md disabled:opacity-60">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <><Search size={18}/> Search Flights</>}
          </button>
        </form>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {results ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-semibold text-gray-800 dark:text-white">{form.from} → {form.to}</h3>
                  <p className="text-xs text-gray-400">{sortedFlights.length} flights found</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Sort:</span>
                  {['price','departure','duration'].map(s => (
                    <button key={s} onClick={() => setSortBy(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${sortBy === s ? 'bg-sand-500 text-white' : 'bg-white dark:bg-[#1a2535] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#2a3a50]'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              {/* Filters */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-gray-500"><Filter size={12}/> Filters:</div>
                {['any','0','1'].map(s => (
                  <button key={s} onClick={() => setFilter(f=>({...f,stops:s}))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter.stops===s?'bg-ocean-500 text-white':'bg-white dark:bg-[#1a2535] border border-gray-200 dark:border-[#2a3a50] text-gray-600 dark:text-gray-400'}`}>
                    {s==='any'?'Any stops':s==='0'?'Non-stop':'Max 1 stop'}
                  </button>
                ))}
                <input type="number" placeholder="Max price ₹" value={filter.maxPrice}
                  onChange={e => setFilter(f=>({...f,maxPrice:e.target.value}))}
                  className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#1a2535] text-gray-700 dark:text-gray-300 w-32"/>
              </div>
              <div className="space-y-3">
                {sortedFlights.length === 0 ? (
                  <div className="card p-8 text-center text-gray-400">No flights match your filters</div>
                ) : sortedFlights.map(f => (
                  <FlightCard key={f.id} flight={f} onBook={handleBook}/>
                ))}
              </div>
            </>
          ) : (
            <div className="card p-12 text-center">
              <PlaneTakeoff size={48} className="mx-auto text-gray-300 mb-4"/>
              <h3 className="font-display text-xl text-gray-500 mb-2">Search for flights</h3>
              <p className="text-gray-400 text-sm">Enter origin, destination and travel date to find the best fares</p>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <FareCalendar from={form.from} to={form.to}/>

          {/* Price Alert */}
          <div className="card p-5">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2"><Bell size={14} className="text-sand-500"/> Set Price Alert</h4>
            <div className="space-y-3">
              <input type="text" placeholder="Route e.g. Delhi - Paris" value={alertRoute}
                onChange={e => setAlertRoute(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm"/>
              <input type="number" placeholder="Target price ₹" value={alertPrice}
                onChange={e => setAlertPrice(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm"/>
              <button onClick={handleAlert}
                className="w-full py-2.5 bg-sand-500 text-white rounded-xl text-sm font-medium hover:bg-sand-600 transition-colors flex items-center justify-center gap-2">
                <Bell size={14}/> Notify me
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">We'll alert you when prices drop below your target</p>
          </div>

          {/* Quick destinations */}
          <div className="card p-5">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 text-sm">Popular Routes</h4>
            <div className="space-y-2">
              {[['Delhi','Dubai'],['Mumbai','Singapore'],['Bangalore','London'],['Chennai','Tokyo'],['Delhi','New York']].map(([f,t]) => (
                <button key={`${f}-${t}`} onClick={() => setForm(p=>({...p,from:f,to:t}))}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-[#243045] text-sm text-gray-600 dark:text-gray-400 transition-colors group">
                  <span>{f} → {t}</span>
                  <ArrowRight size={12} className="text-gray-300 group-hover:text-sand-400 transition-colors"/>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
