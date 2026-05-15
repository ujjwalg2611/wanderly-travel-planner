import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/ui/Layout';
import { tripsAPI } from '../services/api';
import { MapPin, Heart, MessageCircle, Calendar, Users, Search, Filter, Globe } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

const categories = ['All', 'Beach', 'Mountain', 'City', 'Culture', 'Adventure', 'Food', 'Nature'];

// Mock explore data
const mockPublicTrips = [
  { id: 'e1', title: 'Magical Bali Retreat', destination: 'Bali, Indonesia', startDate: '2025-06-01', endDate: '2025-06-10', budget: 2500, travelersCount: 2, userName: 'Sarah M.', likes: ['u1', 'u2', 'u3'], comments: [{}, {}], interests: ['nature', 'relaxation'], coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600', isPublic: true },
  { id: 'e2', title: 'Tokyo Food Adventure', destination: 'Tokyo, Japan', startDate: '2025-07-15', endDate: '2025-07-22', budget: 3200, travelersCount: 1, userName: 'James K.', likes: ['u1'], comments: [{}], interests: ['food', 'culture'], coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600', isPublic: true },
  { id: 'e3', title: 'European Grand Tour', destination: 'Paris, France', startDate: '2025-08-01', endDate: '2025-08-21', budget: 6000, travelersCount: 3, userName: 'Emma R.', likes: ['u1', 'u2'], comments: [{}, {}, {}], interests: ['culture', 'food'], coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600', isPublic: true },
  { id: 'e4', title: 'Patagonia Wilderness', destination: 'Patagonia, Argentina', startDate: '2025-09-10', endDate: '2025-09-20', budget: 4500, travelersCount: 2, userName: 'Marco T.', likes: ['u1', 'u2', 'u3', 'u4'], comments: [{}], interests: ['adventure', 'nature'], coverImage: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600', isPublic: true },
  { id: 'e5', title: 'Morocco Desert Journey', destination: 'Marrakech, Morocco', startDate: '2025-10-01', endDate: '2025-10-08', budget: 1800, travelersCount: 2, userName: 'Lila S.', likes: ['u1'], comments: [], interests: ['culture', 'adventure'], coverImage: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600', isPublic: true },
  { id: 'e6', title: 'Santorini Honeymoon', destination: 'Santorini, Greece', startDate: '2025-05-20', endDate: '2025-05-28', budget: 5500, travelersCount: 2, userName: 'Alex & Mia', likes: ['u1', 'u2', 'u3', 'u4', 'u5'], comments: [{}, {}], interests: ['relaxation', 'food'], coverImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600', isPublic: true },
];

export default function ExplorePage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState(mockPublicTrips);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [likedTrips, setLikedTrips] = useState(new Set());

  const filtered = trips.filter(t => {
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.destination.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const handleLike = async (tripId) => {
    setLikedTrips(prev => {
      const next = new Set(prev);
      if (next.has(tripId)) next.delete(tripId); else next.add(tripId);
      return next;
    });
  };

  return (
    <Layout title="Explore">
      {/* Hero banner */}
      <div className="relative h-52 rounded-3xl overflow-hidden mb-6"
        style={{ background: 'linear-gradient(135deg, #0f1923 0%, #1a3a5c 100%)' }}>
        <div className="absolute inset-0 hero-pattern"/>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          <div className="flex items-center gap-2 mb-3">
            <Globe size={20} className="text-sand-400 animate-bounce-soft"/>
            <span className="text-sand-400 text-sm font-medium tracking-wider uppercase">Discover</span>
          </div>
          <h2 className="font-display text-4xl font-bold text-white mb-3">Find Your Next Adventure</h2>
          <div className="relative w-full max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input type="text" placeholder="Search destinations or trips..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:bg-white/20 transition-colors text-sm"/>
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${category === c ? 'bg-sand-500 text-white shadow-md' : 'bg-white dark:bg-[#1a2535] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#2a3a50] hover:border-sand-300'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Trip grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(trip => (
          <div key={trip.id} className="card overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className="relative h-52 overflow-hidden">
              <img src={trip.coverImage} alt={trip.destination}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={e => { e.target.src = `https://source.unsplash.com/600x400/?${encodeURIComponent(trip.destination)},travel`; }}/>
              <div className="trip-card-overlay absolute inset-0"/>
              <button onClick={() => handleLike(trip.id)}
                className={`absolute top-3 right-3 w-8 h-8 rounded-xl backdrop-blur-sm flex items-center justify-center transition-all ${likedTrips.has(trip.id) ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}>
                <Heart size={14} className={likedTrips.has(trip.id) ? 'fill-white' : ''}/>
              </button>
              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="font-display font-bold text-white text-lg leading-tight">{trip.title}</h3>
                <div className="flex items-center gap-1 text-white/70 text-xs mt-0.5">
                  <MapPin size={10}/> {trip.destination}
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                <div className="flex items-center gap-1.5">
                  <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${trip.userName}`} alt=""
                    className="w-5 h-5 rounded-full bg-sand-100"/>
                  {trip.userName}
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Heart size={11}/> {trip.likes?.length + (likedTrips.has(trip.id) ? 1 : 0)}</span>
                  <span className="flex items-center gap-1"><MessageCircle size={11}/> {trip.comments?.length}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar size={11}/>
                  {format(parseISO(trip.startDate), 'MMM d')} – {format(parseISO(trip.endDate), 'MMM d')}
                  <span>·</span>
                  <Users size={11}/> {trip.travelersCount}
                </div>
                <button onClick={() => navigate(`/trips/${trip.id}`)}
                  className="text-xs font-semibold text-sand-600 dark:text-sand-400 hover:text-sand-700 transition-colors">
                  View →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
