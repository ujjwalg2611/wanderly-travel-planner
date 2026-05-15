import React, { useState, useEffect } from 'react';
import Layout from '../components/ui/Layout';
import { recommendationsAPI } from '../services/api';
import { Star, MapPin, Sparkles, Wind, Thermometer, Droplets, Clock, Heart, ArrowRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const featured = [
  { name: 'Kyoto, Japan', rating: 4.9, type: 'Cultural Heritage', temp: '22°C', bestTime: 'Mar–May', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600', tags: ['Temples', 'Cherry Blossoms', 'Tea Ceremony'], desc: 'Ancient temples, zen gardens, and traditional geisha culture.' },
  { name: 'Santorini, Greece', rating: 4.8, type: 'Island Paradise', temp: '28°C', bestTime: 'Jun–Sep', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600', tags: ['Sunset Views', 'Beaches', 'Wine'], desc: 'Iconic whitewashed villages perched above sparkling caldera waters.' },
  { name: 'Bali, Indonesia', rating: 4.7, type: 'Tropical Retreat', temp: '30°C', bestTime: 'Apr–Oct', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600', tags: ['Rice Terraces', 'Temples', 'Surfing'], desc: 'Lush jungles, sacred temples, and world-class surf breaks.' },
  { name: 'Patagonia, Argentina', rating: 4.9, type: 'Wilderness', temp: '12°C', bestTime: 'Nov–Mar', image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600', tags: ['Glaciers', 'Trekking', 'Wildlife'], desc: 'Raw wilderness with towering peaks and ancient glaciers.' },
  { name: 'Tokyo, Japan', rating: 4.8, type: 'Urban Explorer', temp: '20°C', bestTime: 'Mar–Nov', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600', tags: ['Street Food', 'Technology', 'Culture'], desc: 'Ultra-modern meets ancient tradition in the world\'s greatest city.' },
  { name: 'Amalfi Coast, Italy', rating: 4.8, type: 'Coastal Beauty', temp: '26°C', bestTime: 'May–Sep', image: 'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=600', tags: ['Cliffside Villages', 'Seafood', 'Beaches'], desc: 'Dramatic coastal road lined with pastel villages and lemon groves.' },
];

const trendingNow = [
  { name: 'Tbilisi, Georgia', tag: '🔥 Trending', growth: '+340%', image: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=400' },
  { name: 'Cartagena, Colombia', tag: '✨ Hidden Gem', growth: '+210%', image: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=400' },
  { name: 'Faroe Islands', tag: '🌊 Underrated', growth: '+180%', image: 'https://images.unsplash.com/photo-1552751753-0fc84ae5b6c8?w=400' },
];

const aiSuggestions = [
  { title: 'Perfect for You', desc: 'Based on your interest in culture & food', destination: 'Kyoto + Osaka, Japan', duration: '10 days', budget: '$2,800' },
  { title: 'Weekend Escape', desc: 'Quick getaway from your usual routine', destination: 'Barcelona, Spain', duration: '4 days', budget: '$900' },
  { title: 'Adventure Awaits', desc: 'Push your limits this season', destination: 'Nepal Trek', duration: '14 days', budget: '$1,500' },
];

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const toggleSave = (name) => {
    setSaved(prev => {
      const next = new Set(prev);
      if (next.has(name)) { next.delete(name); toast('Removed from saved', { icon: '🗑️' }); }
      else { next.add(name); toast.success('Saved to favorites! ❤️'); }
      return next;
    });
  };

  const handlePlan = (dest) => {
    navigate('/trips', { state: { prefill: dest } });
    toast.success(`Starting trip to ${dest}!`);
  };

  return (
    <Layout title="Discover">
      {/* AI Banner */}
      <div className="relative rounded-3xl overflow-hidden mb-8 p-8"
        style={{ background: 'linear-gradient(135deg, #0f1923 0%, #1a3050 50%, #0d2a40 100%)' }}>
        <div className="absolute inset-0 hero-pattern opacity-20"/>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10"
          style={{ background: 'radial-gradient(circle, #c4842a 0%, transparent 70%)' }}/>
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sand-400 to-sand-600 flex items-center justify-center">
                <Sparkles size={16} className="text-white"/>
              </div>
              <span className="text-sand-400 text-sm font-semibold tracking-wide">AI Powered</span>
            </div>
            <h2 className="font-display text-3xl font-bold text-white mb-2">Smart Travel Recommendations</h2>
            <p className="text-gray-400 max-w-md">Personalized destinations based on your travel history, interests, and budget.</p>
          </div>
          <div className="hidden lg:flex gap-3">
            {aiSuggestions.map((s, i) => (
              <div key={i} className="glass-dark rounded-2xl p-4 border border-white/10 w-44 cursor-pointer hover:border-sand-500/50 transition-colors" onClick={() => handlePlan(s.destination)}>
                <div className="text-xs text-sand-400 font-semibold mb-1">{s.title}</div>
                <div className="text-white text-sm font-medium mb-2">{s.destination}</div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{s.duration}</span>
                  <span className="text-green-400 font-semibold">{s.budget}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-xl text-gray-800 dark:text-white flex items-center gap-2">
            <Zap size={18} className="text-sand-500"/> Trending Now
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {trendingNow.map(t => (
            <div key={t.name} className="relative rounded-2xl overflow-hidden h-36 cursor-pointer group">
              <img src={t.image} alt={t.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={e => e.target.src='https://source.unsplash.com/400x200/?travel'}/>
              <div className="trip-card-overlay absolute inset-0"/>
              <div className="absolute top-2.5 left-2.5">
                <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg font-medium">{t.tag}</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <div className="font-semibold text-white text-sm">{t.name}</div>
                <div className="text-green-400 text-xs font-medium mt-0.5">searches {t.growth} ↑</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {['all', 'beach', 'mountain', 'city', 'adventure', 'culture'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === f ? 'bg-sand-500 text-white shadow-md' : 'bg-white dark:bg-[#1a2535] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#2a3a50]'}`}>
            {filter === f && '✦ '}{f}
          </button>
        ))}
      </div>

      {/* Featured destinations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-xl text-gray-800 dark:text-white">Top Destinations</h3>
          <span className="text-xs text-gray-400">Curated for you</span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((dest) => (
            <div key={dest.name} className="card overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img src={dest.image} alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={e => e.target.src=`https://source.unsplash.com/600x400/?${encodeURIComponent(dest.name)}`}/>
                <div className="trip-card-overlay absolute inset-0"/>
                <button onClick={() => toggleSave(dest.name)}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-xl backdrop-blur-sm flex items-center justify-center transition-all ${saved.has(dest.name) ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}>
                  <Heart size={14} className={saved.has(dest.name) ? 'fill-white' : ''}/>
                </button>
                <div className="absolute top-3 left-3">
                  <span className="text-xs bg-sand-500/90 text-white px-2.5 py-1 rounded-lg font-medium">{dest.type}</span>
                </div>
                <div className="absolute bottom-3 left-4">
                  <h3 className="font-display font-bold text-white text-lg">{dest.name}</h3>
                  <div className="flex items-center gap-1 text-yellow-400 text-xs mt-0.5">
                    <Star size={10} className="fill-yellow-400"/> <span className="font-semibold">{dest.rating}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{dest.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {dest.tags.map(tag => (
                    <span key={tag} className="badge bg-gray-100 dark:bg-[#243045] text-gray-600 dark:text-gray-400 text-[10px]">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1"><Thermometer size={10}/> {dest.temp}</span>
                  <span className="flex items-center gap-1"><Clock size={10}/> Best: {dest.bestTime}</span>
                </div>
                <button onClick={() => handlePlan(dest.name)}
                  className="w-full py-2.5 bg-gradient-to-r from-sand-500 to-sand-600 text-white rounded-xl text-sm font-medium hover:from-sand-600 hover:to-sand-700 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
                  Plan This Trip <ArrowRight size={14}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
