import React, { useState, useEffect } from 'react';
import Layout from '../components/ui/Layout';
import { socialAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Users, UserPlus, UserCheck, MapPin, Heart, MessageCircle, Globe, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const mockUsers = [
  { id: 'u1', name: 'Sarah Mitchell', bio: 'Adventure seeker & photography lover', location: 'San Francisco, CA', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=sarah', followers: ['a','b','c'], following: ['d'], trips: 12 },
  { id: 'u2', name: 'James Kowalski', bio: 'Food explorer & cultural enthusiast', location: 'New York, NY', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=james', followers: ['a','b'], following: [], trips: 8 },
  { id: 'u3', name: 'Emma Rodriguez', bio: 'Solo traveler | 45 countries visited', location: 'Barcelona, Spain', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=emma', followers: ['a','b','c','d','e'], following: ['a'], trips: 31 },
  { id: 'u4', name: 'Marco Tanaka', bio: 'Nature lover & hiking enthusiast', location: 'Tokyo, Japan', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=marco', followers: ['a'], following: ['b'], trips: 19 },
  { id: 'u5', name: 'Lila Sharma', bio: 'Wellness & mindful travel advocate', location: 'Mumbai, India', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=lila', followers: ['a','b','c'], following: ['c'], trips: 7 },
  { id: 'u6', name: 'Chris Laurent', bio: 'Budget traveler, world wanderer', location: 'Paris, France', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=chris', followers: ['a'], following: [], trips: 24 },
];

const mockFeed = [
  { id: 'f1', userName: 'Sarah Mitchell', userAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=sarah', action: 'created a new trip', tripTitle: 'Magical Bali Retreat', destination: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500', likes: 24, comments: 5, time: '2h ago' },
  { id: 'f2', userName: 'Emma Rodriguez', userAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=emma', action: 'shared itinerary', tripTitle: 'Tokyo Food Week', destination: 'Tokyo, Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500', likes: 41, comments: 12, time: '5h ago' },
  { id: 'f3', userName: 'Marco Tanaka', userAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=marco', action: 'completed trip', tripTitle: 'Patagonia Wilderness', destination: 'Argentina', image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=500', likes: 89, comments: 23, time: '1d ago' },
  { id: 'f4', userName: 'Lila Sharma', userAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=lila', action: 'recommended', tripTitle: 'Santorini Getaway', destination: 'Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500', likes: 57, comments: 8, time: '2d ago' },
];

function UserCard({ user, isFollowing, onToggle }) {
  return (
    <div className="card p-5 flex items-start gap-4 hover:shadow-card-hover transition-all duration-300">
      <div className="relative flex-shrink-0">
        <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-2xl object-cover bg-sand-100 dark:bg-[#243045]"/>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white dark:border-[#1a2535]"/>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{user.name}</div>
        <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><MapPin size={9}/> {user.location}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-1">{user.bio}</div>
        <div className="flex items-center gap-3 mt-2.5 text-xs text-gray-400">
          <span><b className="text-gray-700 dark:text-gray-300">{user.trips}</b> trips</span>
          <span><b className="text-gray-700 dark:text-gray-300">{user.followers.length}</b> followers</span>
        </div>
      </div>
      <button onClick={() => onToggle(user.id)}
        className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${isFollowing ? 'bg-sand-50 dark:bg-sand-900/20 text-sand-600 dark:text-sand-400 border border-sand-200 dark:border-sand-800' : 'bg-gradient-to-r from-sand-500 to-sand-600 text-white shadow-sm hover:shadow-md'}`}>
        {isFollowing ? <><UserCheck size={12}/> Following</> : <><UserPlus size={12}/> Follow</>}
      </button>
    </div>
  );
}

function FeedCard({ post, onLike, liked }) {
  return (
    <div className="card overflow-hidden">
      <div className="p-4 flex items-center gap-3">
        <img src={post.userAvatar} alt={post.userName} className="w-10 h-10 rounded-xl object-cover bg-sand-100 dark:bg-[#243045]"/>
        <div>
          <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">{post.userName}</span>
          <span className="text-sm text-gray-400 mx-1">{post.action}</span>
          <span className="font-medium text-sm text-sand-600 dark:text-sand-400">"{post.tripTitle}"</span>
          <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><MapPin size={9}/> {post.destination} · {post.time}</div>
        </div>
      </div>
      {post.image && (
        <div className="relative h-56 overflow-hidden">
          <img src={post.image} alt="" className="w-full h-full object-cover"
            onError={e => e.target.style.display='none'}/>
          <div className="trip-card-overlay absolute inset-0"/>
        </div>
      )}
      <div className="p-4 flex items-center gap-4">
        <button onClick={() => onLike(post.id)}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}>
          <Heart size={15} className={liked ? 'fill-red-500' : ''}/> {post.likes + (liked ? 1 : 0)}
        </button>
        <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-ocean-500 transition-colors font-medium">
          <MessageCircle size={15}/> {post.comments}
        </button>
        <div className="ml-auto text-xs text-gray-300">Share ↗</div>
      </div>
    </div>
  );
}

export default function SocialPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('discover');
  const [following, setFollowing] = useState(new Set(['u3']));
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const toggleFollow = async (userId) => {
    setFollowing(prev => {
      const next = new Set(prev);
      if (next.has(userId)) { next.delete(userId); toast.success('Unfollowed'); }
      else { next.add(userId); toast.success('Following! 🎉'); }
      return next;
    });
  };

  const toggleLike = (postId) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId); else next.add(postId);
      return next;
    });
  };

  return (
    <Layout title="Social">
      {/* Stats banner */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: Users, label: 'Following', value: following.size, color: 'from-sand-400 to-sand-600' },
          { icon: Globe, label: 'Community', value: '50K+', color: 'from-ocean-400 to-ocean-600' },
          { icon: TrendingUp, label: 'Trending Trips', value: '142', color: 'from-forest-400 to-forest-600' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
              <Icon size={18} className="text-white"/>
            </div>
            <div>
              <div className="font-display font-bold text-lg text-gray-800 dark:text-white">{value}</div>
              <div className="text-xs text-gray-400">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['discover', 'feed', 'following'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${tab === t ? 'bg-sand-500 text-white shadow-md' : 'bg-white dark:bg-[#1a2535] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#2a3a50] hover:border-sand-300'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'discover' && (
        <div className="grid md:grid-cols-2 gap-4">
          {mockUsers.map(u => (
            <UserCard key={u.id} user={u} isFollowing={following.has(u.id)} onToggle={toggleFollow}/>
          ))}
        </div>
      )}

      {tab === 'feed' && (
        <div className="max-w-2xl mx-auto space-y-4">
          {mockFeed.map(post => (
            <FeedCard key={post.id} post={post} liked={likedPosts.has(post.id)} onLike={toggleLike}/>
          ))}
        </div>
      )}

      {tab === 'following' && (
        <div className="grid md:grid-cols-2 gap-4">
          {mockUsers.filter(u => following.has(u.id)).length === 0 ? (
            <div className="col-span-2 card p-12 text-center">
              <Users size={40} className="mx-auto text-gray-300 mb-3"/>
              <h3 className="font-display text-lg text-gray-500 mb-2">Not following anyone yet</h3>
              <p className="text-gray-400 text-sm">Go to Discover to follow travelers</p>
            </div>
          ) : (
            mockUsers.filter(u => following.has(u.id)).map(u => (
              <UserCard key={u.id} user={u} isFollowing={true} onToggle={toggleFollow}/>
            ))
          )}
        </div>
      )}
    </Layout>
  );
}
