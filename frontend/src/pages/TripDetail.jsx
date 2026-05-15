import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/ui/Layout';
import { tripsAPI, itineraryAPI, expensesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, Users, Wallet, Heart, Share2, MessageCircle, Edit3, Sun, Sunset, Moon, Hotel, Car, ChevronDown, ChevronUp, Plus, Send, ArrowLeft } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

const slotIcons = { morning: Sun, afternoon: Sunset, evening: Moon };
const slotColors = { morning: 'from-yellow-400 to-orange-400', afternoon: 'from-orange-400 to-sand-500', evening: 'from-purple-500 to-dusk-500' };

function DayCard({ day, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState('');

  const startEdit = (slot, field, val) => { setEditing(`${slot}-${field}`); setEditVal(val); };
  const saveEdit = async (slot, field) => {
    const updated = { ...day, [slot]: { ...day[slot], [field]: editVal } };
    await onUpdate(day.id, updated);
    setEditing(null);
  };

  return (
    <div className="card overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 dark:hover:bg-[#243045] transition-colors">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sand-400 to-sand-600 flex flex-col items-center justify-center flex-shrink-0 shadow-md">
          <span className="text-white font-bold text-lg leading-none">{day.day}</span>
          <span className="text-white/60 text-[9px] uppercase tracking-wider">day</span>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-gray-800 dark:text-gray-200">{day.date ? format(parseISO(day.date), 'EEEE, MMM d') : `Day ${day.day}`}</div>
          <div className="text-xs text-gray-400 mt-0.5">{day.hotel}</div>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>${day.budget}</span>
          {expanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 dark:border-[#2a3a50] p-4 space-y-3 animate-fade-in">
          {['morning', 'afternoon', 'evening'].map(slot => {
            const Icon = slotIcons[slot];
            const activity = day[slot];
            return (
              <div key={slot} className="flex gap-3">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${slotColors[slot]} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <Icon size={14} className="text-white"/>
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-[#243045] rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{slot} · {activity?.time}</span>
                    <button onClick={() => startEdit(slot, 'activity', activity?.activity || '')}
                      className="text-gray-300 hover:text-sand-500 transition-colors">
                      <Edit3 size={11}/>
                    </button>
                  </div>
                  {editing === `${slot}-activity` ? (
                    <div className="flex gap-2">
                      <input value={editVal} onChange={e => setEditVal(e.target.value)}
                        className="flex-1 text-sm px-2 py-1 rounded-lg border border-sand-300 dark:border-sand-700 bg-white dark:bg-[#1a2535] text-gray-800 dark:text-gray-200 focus:outline-none"/>
                      <button onClick={() => saveEdit(slot, 'activity')} className="text-xs bg-sand-500 text-white px-2 py-1 rounded-lg">Save</button>
                      <button onClick={() => setEditing(null)} className="text-xs text-gray-400 px-2 py-1 rounded-lg hover:bg-gray-100">Cancel</button>
                    </div>
                  ) : (
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{activity?.activity}</div>
                  )}
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-1"><MapPin size={9}/> {activity?.location}</div>
                </div>
              </div>
            );
          })}

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#243045] rounded-xl p-3">
              <Hotel size={14} className="text-sand-400"/>
              <div><div className="font-medium text-gray-700 dark:text-gray-300">Hotel</div><div className="truncate">{day.hotel}</div></div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#243045] rounded-xl p-3">
              <Car size={14} className="text-ocean-400"/>
              <div><div className="font-medium text-gray-700 dark:text-gray-300">Transport</div><div className="truncate">{day.transport}</div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [colabEmail, setColabEmail] = useState('');
  const [expenses, setExpenses] = useState({ expenses: [], total: 0, byCategory: {} });

  useEffect(() => {
    Promise.all([
      tripsAPI.getById(id),
      expensesAPI.get(id)
    ]).then(([t, e]) => {
      setTrip(t);
      setLiked(t.likes?.includes(user?.id));
      setExpenses(e);
    }).catch(() => navigate('/trips'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleLike = async () => {
    const r = await tripsAPI.like(id);
    setLiked(r.liked);
    setTrip(t => ({ ...t, likes: [...Array(r.likes)] }));
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    const c = await tripsAPI.comment(id, comment);
    setTrip(t => ({ ...t, comments: [...(t.comments || []), c] }));
    setComment('');
  };

  const handleUpdateDay = async (dayId, updated) => {
    await itineraryAPI.updateDay(id, dayId, updated);
    setTrip(t => ({ ...t, itinerary: t.itinerary.map(d => d.id === dayId ? updated : d) }));
    toast.success('Updated!');
  };

  const handleCollaborate = async () => {
    if (!colabEmail.trim()) return;
    await tripsAPI.collaborate(id, colabEmail);
    toast.success('Collaborator added!');
    setColabEmail('');
  };

  const handleShare = async () => {
    await tripsAPI.update(id, { isPublic: !trip.isPublic });
    setTrip(t => ({ ...t, isPublic: !t.isPublic }));
    toast.success(trip.isPublic ? 'Trip is now private' : 'Trip shared publicly!');
  };

  if (loading) return (
    <Layout title="Trip Details">
      <div className="h-64 shimmer-bg rounded-3xl mb-6"/>
      <div className="grid lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_,i) => <div key={i} className="h-48 shimmer-bg rounded-2xl"/>)}
      </div>
    </Layout>
  );
  if (!trip) return null;

  const tabs = ['itinerary', 'social', 'collaborate'];

  return (
    <Layout title={trip.title}>
      <button onClick={() => navigate('/trips')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4 transition-colors">
        <ArrowLeft size={14}/> Back to Trips
      </button>

      {/* Hero */}
      <div className="relative h-64 rounded-3xl overflow-hidden mb-6 shadow-xl">
        <img src={trip.coverImage || `https://source.unsplash.com/800x300/?${encodeURIComponent(trip.destination)}`}
          alt="" className="w-full h-full object-cover"/>
        <div className="trip-card-overlay absolute inset-0"/>
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="font-display text-4xl font-bold text-white mb-2">{trip.title}</h1>
              <div className="flex flex-wrap gap-3 text-white/80 text-sm">
                <span className="flex items-center gap-1.5"><MapPin size={13}/> {trip.destination}</span>
                <span className="flex items-center gap-1.5"><Calendar size={13}/> {trip.startDate ? format(parseISO(trip.startDate), 'MMM d') : ''} – {trip.endDate ? format(parseISO(trip.endDate), 'MMM d, yyyy') : ''}</span>
                <span className="flex items-center gap-1.5"><Users size={13}/> {trip.travelersCount} travelers</span>
                <span className="flex items-center gap-1.5"><Wallet size={13}/> ${trip.budget?.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleLike}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl backdrop-blur-sm text-sm font-medium transition-all ${liked ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                <Heart size={14} className={liked ? 'fill-white' : ''}/> {trip.likes?.length || 0}
              </button>
              <button onClick={handleShare}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl backdrop-blur-sm text-sm font-medium transition-all ${trip.isPublic ? 'bg-green-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                <Share2 size={14}/> {trip.isPublic ? 'Public' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${activeTab === t ? 'bg-sand-500 text-white shadow-md' : 'bg-white dark:bg-[#1a2535] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#2a3a50] hover:border-sand-300'}`}>
            {t}
          </button>
        ))}
      </div>

      {activeTab === 'itinerary' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-display font-semibold text-gray-800 dark:text-white mb-3">Day-wise Itinerary</h3>
            {(trip.itinerary || []).length === 0 ? (
              <div className="card p-8 text-center text-gray-400">No itinerary generated yet</div>
            ) : (
              (trip.itinerary || []).map(day => (
                <DayCard key={day.id} day={day} onUpdate={handleUpdateDay}/>
              ))
            )}
          </div>
          <div className="space-y-4">
            {/* Budget breakdown */}
            <div className="card p-5">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 text-sm">Budget Overview</h4>
              <div className="text-center mb-4">
                <div className="text-3xl font-display font-bold text-gray-800 dark:text-white">${trip.budget?.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Total Budget</div>
              </div>
              <div className="space-y-2.5">
                {Object.entries(expenses.byCategory || {}).map(([cat, amt]) => (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">{cat}</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">${amt}</span>
                    </div>
                    <div className="budget-bar">
                      <div className="budget-fill" style={{ width: `${Math.min(100, (amt / trip.budget) * 100)}%` }}/>
                    </div>
                  </div>
                ))}
                {Object.keys(expenses.byCategory || {}).length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-2">No expenses tracked yet</p>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#2a3a50] flex justify-between text-sm">
                <span className="text-gray-500">Spent</span>
                <span className="font-semibold text-red-500">${expenses.total}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">Remaining</span>
                <span className="font-semibold text-green-500">${Math.max(0, (trip.budget || 0) - expenses.total)}</span>
              </div>
            </div>

            {/* Trip map placeholder */}
            <div className="card overflow-hidden">
              <div className="map-placeholder h-48 flex items-center justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin size={32} className="mx-auto text-ocean-500 mb-2 animate-bounce-soft"/>
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">{trip.destination}</div>
                    <div className="text-xs text-gray-400 mt-1">Google Maps Integration</div>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-400 text-center">Connect Google Maps API for live map</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'social' && (
        <div className="max-w-2xl space-y-4">
          {/* Comments */}
          <div className="card p-5">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <MessageCircle size={16}/> Comments ({(trip.comments || []).length})
            </h4>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {(trip.comments || []).length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">No comments yet. Be first!</p>
              )}
              {(trip.comments || []).map(c => (
                <div key={c.id} className="flex gap-3">
                  <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${c.userId}`} alt=""
                    className="w-8 h-8 rounded-full flex-shrink-0 bg-sand-100"/>
                  <div className="flex-1 bg-gray-50 dark:bg-[#243045] rounded-xl p-3">
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">{c.userName}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{c.text}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={comment} onChange={e => setComment(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleComment()}
                placeholder="Write a comment..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm"/>
              <button onClick={handleComment}
                className="px-4 py-2.5 bg-sand-500 text-white rounded-xl hover:bg-sand-600 transition-colors">
                <Send size={14}/>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'collaborate' && (
        <div className="max-w-md space-y-4">
          <div className="card p-5">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Invite Collaborator</h4>
            <div className="flex gap-2">
              <input value={colabEmail} onChange={e => setColabEmail(e.target.value)}
                placeholder="friend@example.com"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm"/>
              <button onClick={handleCollaborate}
                className="px-4 py-2.5 bg-sand-500 text-white rounded-xl hover:bg-sand-600 transition-colors flex items-center gap-2 text-sm font-medium">
                <Plus size={14}/> Add
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Collaborators can edit itinerary and add expenses</p>
          </div>
          {(trip.collaborators || []).length > 0 && (
            <div className="card p-5">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Collaborators</h4>
              {trip.collaborators.map(c => (
                <div key={c} className="flex items-center gap-3 py-2">
                  <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${c}`} alt="" className="w-8 h-8 rounded-full bg-sand-100"/>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{c}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
