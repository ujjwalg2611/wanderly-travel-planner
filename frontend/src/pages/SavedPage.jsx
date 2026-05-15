import React, { useState } from 'react';
import Layout from '../components/ui/Layout';
import { Heart, MapPin, Star, Trash2, Plus, BookmarkCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const mockSaved = [
  { id: 's1', type: 'destination', name: 'Kyoto, Japan', rating: 4.9, category: 'Cultural Heritage', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500', savedAt: '2 days ago' },
  { id: 's2', type: 'destination', name: 'Santorini, Greece', rating: 4.8, category: 'Island Paradise', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500', savedAt: '1 week ago' },
  { id: 's3', type: 'itinerary', name: 'Tokyo Food Week', rating: 4.7, category: 'Curated Itinerary', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500', savedAt: '2 weeks ago', author: 'James K.' },
  { id: 's4', type: 'destination', name: 'Bali, Indonesia', rating: 4.7, category: 'Tropical Retreat', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500', savedAt: '3 weeks ago' },
  { id: 's5', type: 'itinerary', name: 'European Grand Tour', rating: 4.6, category: 'Curated Itinerary', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500', savedAt: '1 month ago', author: 'Emma R.' },
  { id: 's6', type: 'destination', name: 'Patagonia, Argentina', rating: 4.9, category: 'Wilderness', image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=500', savedAt: '1 month ago' },
];

export default function SavedPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState(mockSaved);
  const [filter, setFilter] = useState('all');

  const filtered = items.filter(i => filter === 'all' || i.type === filter);

  const remove = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
    toast('Removed from saved', { icon: '🗑️' });
  };

  return (
    <Layout title="Saved">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {['all', 'destination', 'itinerary'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === f ? 'bg-sand-500 text-white shadow-md' : 'bg-white dark:bg-[#1a2535] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#2a3a50]'}`}>
              {f === 'all' ? `All (${items.length})` : `${f === 'destination' ? '📍' : '📋'} ${f}s (${items.filter(i=>i.type===f).length})`}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <BookmarkCheck size={48} className="mx-auto text-gray-300 mb-4"/>
          <h3 className="font-display text-xl text-gray-500 mb-2">Nothing saved yet</h3>
          <p className="text-gray-400 mb-6">Explore destinations and save your favorites</p>
          <button onClick={() => navigate('/recommendations')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-sand-500 text-white rounded-xl font-medium hover:bg-sand-600 transition-colors">
            <Plus size={16}/> Discover Places
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(item => (
            <div key={item.id} className="card overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              <div className="relative h-44 overflow-hidden">
                <img src={item.image} alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={e => e.target.src=`https://source.unsplash.com/500x300/?travel`}/>
                <div className="trip-card-overlay absolute inset-0"/>
                <div className="absolute top-3 left-3">
                  <span className={`badge text-[10px] ${item.type === 'destination' ? 'bg-ocean-500/90 text-white' : 'bg-forest-500/90 text-white'}`}>
                    {item.type === 'destination' ? '📍 Destination' : '📋 Itinerary'}
                  </span>
                </div>
                <button onClick={() => remove(item.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-500/80 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 size={13}/>
                </button>
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-display font-bold text-white text-lg leading-tight">{item.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex items-center gap-1 text-yellow-400 text-xs">
                      <Star size={10} className="fill-yellow-400"/> {item.rating}
                    </div>
                    {item.author && (
                      <span className="text-white/60 text-xs">by {item.author}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{item.category}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Saved {item.savedAt}</div>
                </div>
                <button onClick={() => navigate(item.type === 'itinerary' ? '/explore' : '/recommendations')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-sand-50 dark:bg-sand-900/20 text-sand-600 dark:text-sand-400 rounded-xl text-xs font-semibold hover:bg-sand-100 transition-colors">
                  View <MapPin size={11}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
