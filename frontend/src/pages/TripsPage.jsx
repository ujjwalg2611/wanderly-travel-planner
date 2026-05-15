import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/ui/Layout';
import { tripsAPI } from '../services/api';
import { Plus, MapPin, Calendar, Users, Wallet, Globe2, Trash2, Edit, Share2, Eye, MoreVertical } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import toast from 'react-hot-toast';

const interestOptions = ['adventure', 'culture', 'nature', 'food', 'relaxation', 'shopping'];
const interestEmojis = { adventure: '🧗', culture: '🏛️', nature: '🌿', food: '🍜', relaxation: '🧘', shopping: '🛍️' };

function CreateTripModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: '', destination: '', startDate: '', endDate: '',
    budget: 1000, travelersCount: 1, interests: ['culture'], description: '', isPublic: false
  });
  const [loading, setLoading] = useState(false);

  const toggleInterest = (i) => {
    setForm(f => ({ ...f, interests: f.interests.includes(i) ? f.interests.filter(x => x !== i) : [...f.interests, i] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const trip = await tripsAPI.create(form);
      toast.success('Trip created! 🎉');
      onCreated(trip);
      onClose();
    } catch { toast.error('Failed to create trip'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1a2535] rounded-3xl w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="p-6 border-b border-gray-100 dark:border-[#2a3a50]">
          <h2 className="font-display text-2xl font-bold text-gray-800 dark:text-white">Plan New Trip ✈️</h2>
          <p className="text-gray-400 text-sm mt-1">Fill in details and we'll generate your itinerary</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Trip Name</label>
              <input type="text" placeholder="e.g. Bali Adventure 2025" value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm"/>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Destination *</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input type="text" placeholder="Paris, France" required value={form.destination}
                  onChange={e => setForm({...form, destination: e.target.value})}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm"/>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Start Date *</label>
              <input type="date" required value={form.startDate}
                onChange={e => setForm({...form, startDate: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">End Date *</label>
              <input type="date" required value={form.endDate}
                onChange={e => setForm({...form, endDate: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Budget (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input type="number" min="0" value={form.budget}
                  onChange={e => setForm({...form, budget: parseInt(e.target.value)})}
                  className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm"/>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Travelers</label>
              <div className="relative">
                <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input type="number" min="1" max="20" value={form.travelersCount}
                  onChange={e => setForm({...form, travelersCount: parseInt(e.target.value)})}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm"/>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Interests</label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map(i => (
                <button key={i} type="button" onClick={() => toggleInterest(i)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${form.interests.includes(i) ? 'bg-sand-500 text-white shadow-md' : 'bg-gray-100 dark:bg-[#243045] text-gray-600 dark:text-gray-400 hover:bg-sand-50'}`}>
                  <span>{interestEmojis[i]}</span> {i}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Description</label>
            <textarea placeholder="Tell us about your trip..." rows={2} value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm resize-none"/>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <div className={`w-10 h-6 rounded-full relative transition-colors ${form.isPublic ? 'bg-sand-500' : 'bg-gray-200 dark:bg-[#2a3a50]'}`} onClick={() => setForm({...form, isPublic: !form.isPublic})}>
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.isPublic ? 'translate-x-4' : ''}`}/>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Make trip public (share with community)</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-[#2a3a50] text-gray-600 dark:text-gray-400 font-medium text-sm hover:bg-gray-50 dark:hover:bg-[#243045] transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sand-500 to-sand-600 text-white font-semibold text-sm hover:from-sand-600 hover:to-sand-700 transition-all shadow-md disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <><Plus size={16}/> Create & Generate</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TripsPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    tripsAPI.getAll().then(setTrips).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this trip?')) return;
    await tripsAPI.delete(id);
    setTrips(t => t.filter(x => x.id !== id));
    toast.success('Trip deleted');
  };

  const handleShare = async (trip, e) => {
    e.stopPropagation();
    await tripsAPI.update(trip.id, { isPublic: !trip.isPublic });
    setTrips(ts => ts.map(t => t.id === trip.id ? {...t, isPublic: !t.isPublic} : t));
    toast.success(trip.isPublic ? 'Trip made private' : 'Trip shared publicly!');
  };

  const now = new Date();
  const filtered = trips.filter(t => {
    if (filter === 'upcoming') return new Date(t.startDate) > now;
    if (filter === 'ongoing') return new Date(t.startDate) <= now && new Date(t.endDate) >= now;
    if (filter === 'past') return new Date(t.endDate) < now;
    return true;
  });

  return (
    <Layout title="My Trips">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {['all', 'upcoming', 'ongoing', 'past'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === f ? 'bg-sand-500 text-white shadow-md' : 'bg-white dark:bg-[#1a2535] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#2a3a50] hover:border-sand-300'}`}>
              {f}
            </button>
          ))}
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sand-500 to-sand-600 text-white rounded-xl font-medium text-sm hover:from-sand-600 hover:to-sand-700 transition-all shadow-md">
          <Plus size={16}/> New Trip
        </button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="card h-72 shimmer-bg rounded-2xl"/>)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <Globe2 size={48} className="mx-auto text-gray-300 mb-4"/>
          <h3 className="font-display text-xl font-semibold text-gray-500 mb-2">No trips found</h3>
          <p className="text-gray-400 mb-6">Create your first trip to get started</p>
          <button onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-sand-500 text-white rounded-xl font-medium hover:bg-sand-600 transition-colors">
            <Plus size={16}/> Create Trip
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(trip => {
            const days = trip.startDate && trip.endDate ? differenceInDays(parseISO(trip.endDate), parseISO(trip.startDate)) + 1 : 0;
            return (
              <div key={trip.id} className="card overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-300"
                onClick={() => navigate(`/trips/${trip.id}`)}>
                <div className="relative h-48 overflow-hidden">
                  <img src={trip.coverImage || `https://source.unsplash.com/400x200/?${encodeURIComponent(trip.destination)},travel`}
                    alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                  <div className="trip-card-overlay absolute inset-0"/>
                  <div className="absolute top-3 left-3 flex gap-2">
                    {trip.isPublic && <span className="badge bg-green-500/90 text-white text-[10px]">Public</span>}
                    {(trip.itinerary?.length > 0) && <span className="badge bg-ocean-500/90 text-white text-[10px]">{days}d plan</span>}
                  </div>
                  <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/trips/${trip.id}`); }}
                      className="w-7 h-7 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                      <Eye size={12}/>
                    </button>
                    <button onClick={(e) => handleShare(trip, e)}
                      className="w-7 h-7 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                      <Share2 size={12}/>
                    </button>
                    <button onClick={(e) => handleDelete(trip.id, e)}
                      className="w-7 h-7 bg-red-500/70 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-red-500 transition-colors">
                      <Trash2 size={12}/>
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-display font-bold text-white text-xl leading-tight">{trip.title}</h3>
                    <div className="flex items-center gap-1 text-white/70 text-xs mt-0.5">
                      <MapPin size={10}/> {trip.destination}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={11}/>
                      {trip.startDate ? format(parseISO(trip.startDate), 'MMM d') : '—'} – {trip.endDate ? format(parseISO(trip.endDate), 'MMM d, yyyy') : '—'}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={11}/> {trip.travelersCount || 1}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5 flex-wrap">
                      {(trip.interests || []).slice(0, 2).map(i => (
                        <span key={i} className="badge bg-sand-50 dark:bg-sand-900/20 text-sand-600 dark:text-sand-400 text-[10px]">
                          {interestEmojis[i]} {i}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-sand-600 dark:text-sand-400 font-semibold text-sm">
                      <Wallet size={12}/> ${trip.budget?.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreate && (
        <CreateTripModal onClose={() => setShowCreate(false)} onCreated={t => setTrips(p => [t, ...p])}/>
      )}
    </Layout>
  );
}
