import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/ui/Layout';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, tripsAPI } from '../services/api';
import { PlaneTakeoff, MapPin, Wallet, Globe, Plus, ArrowRight, Calendar, Users, TrendingUp } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const spendingData = [
  { month: 'Jan', amount: 1200 }, { month: 'Feb', amount: 800 },
  { month: 'Mar', amount: 2400 }, { month: 'Apr', amount: 1800 },
  { month: 'May', amount: 3200 }, { month: 'Jun', amount: 1600 },
];

const statusColors = { upcoming: 'bg-ocean-100 text-ocean-700 dark:bg-ocean-900/30 dark:text-ocean-400', ongoing: 'bg-forest-100 text-forest-700 dark:bg-forest-900/30 dark:text-forest-400', past: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' };

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white"/>
      </div>
      <div>
        <div className="text-2xl font-display font-bold text-gray-800 dark:text-white">{value}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
        {sub && <div className="text-xs text-green-500 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

function TripCard({ trip, onClick }) {
  const start = trip.startDate ? format(parseISO(trip.startDate), 'MMM d') : '';
  const end = trip.endDate ? format(parseISO(trip.endDate), 'MMM d, yyyy') : '';
  return (
    <div onClick={onClick} className="card overflow-hidden cursor-pointer group hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-40 overflow-hidden">
        <img src={trip.coverImage || `https://source.unsplash.com/400x200/?${encodeURIComponent(trip.destination)},travel`}
          alt={trip.destination} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
        <div className="trip-card-overlay absolute inset-0"/>
        <div className="absolute top-3 right-3">
          <span className={`badge ${statusColors[trip.status] || statusColors.upcoming}`}>
            {trip.status || 'upcoming'}
          </span>
        </div>
        <div className="absolute bottom-3 left-4">
          <div className="text-white font-display font-semibold text-lg leading-tight">{trip.title}</div>
          <div className="flex items-center gap-1 text-white/70 text-xs mt-0.5">
            <MapPin size={10}/> {trip.destination}
          </div>
        </div>
      </div>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <Calendar size={12}/>
          {start} – {end}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <Users size={12}/> {trip.travelersCount || 1} travelers
        </div>
        <div className="text-xs font-semibold text-sand-600 dark:text-sand-400">${trip.budget?.toLocaleString()}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.get().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <Layout title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => <div key={i} className="card p-5 h-24 shimmer-bg rounded-2xl"/>)}
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card h-64 shimmer-bg rounded-2xl"/>
        <div className="card h-64 shimmer-bg rounded-2xl"/>
      </div>
    </Layout>
  );

  const stats = data?.stats || {};
  const upcoming = data?.upcoming || [];
  const ongoing = data?.ongoing || [];
  const allTrips = [...ongoing, ...upcoming];

  return (
    <Layout title="Dashboard">
      {/* Welcome */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-800 dark:text-white">
            Good day, {user?.name?.split(' ')[0]}! ✈️
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Here's what's happening with your travels</p>
        </div>
        <button onClick={() => navigate('/trips/new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sand-500 to-sand-600 text-white rounded-xl font-medium text-sm hover:from-sand-600 hover:to-sand-700 transition-all shadow-md hover:shadow-glow-sand">
          <Plus size={16}/> New Trip
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={PlaneTakeoff} label="Total Trips" value={stats.totalTrips || 0} color="bg-gradient-to-br from-sand-400 to-sand-600"/>
        <StatCard icon={Globe} label="Countries" value={stats.countriesVisited || 0} sub="+2 this year" color="bg-gradient-to-br from-ocean-400 to-ocean-600"/>
        <StatCard icon={Calendar} label="Upcoming" value={stats.upcomingTrips || 0} color="bg-gradient-to-br from-forest-400 to-forest-600"/>
        <StatCard icon={Wallet} label="Total Spent" value={`$${(stats.totalSpent || 0).toLocaleString()}`} color="bg-gradient-to-br from-dusk-400 to-dusk-600"/>
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Spending chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-semibold text-gray-800 dark:text-white">Travel Spending</h3>
              <p className="text-xs text-gray-400 mt-0.5">Monthly overview</p>
            </div>
            <div className="flex items-center gap-1.5 text-green-500 text-sm font-medium">
              <TrendingUp size={14}/> +24%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={spendingData}>
              <defs>
                <linearGradient id="sandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c4842a" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#c4842a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-[#2a3a50]"/>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`}/>
              <Tooltip formatter={v => [`$${v}`, 'Spent']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}/>
              <Area type="monotone" dataKey="amount" stroke="#c4842a" strokeWidth={2.5} fill="url(#sandGrad)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick actions */}
        <div className="card p-6">
          <h3 className="font-display font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Plan New Trip', icon: Plus, path: '/trips/new', color: 'from-sand-500 to-sand-600' },
              { label: 'Explore Destinations', icon: Globe, path: '/explore', color: 'from-ocean-500 to-ocean-600' },
              { label: 'View Itineraries', icon: Calendar, path: '/itinerary', color: 'from-forest-500 to-forest-600' },
              { label: 'Track Expenses', icon: Wallet, path: '/expenses', color: 'from-dusk-500 to-dusk-600' },
            ].map(({ label, icon: Icon, path, color }) => (
              <button key={path} onClick={() => navigate(path)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#243045] transition-colors group text-left">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={16} className="text-white"/>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                <ArrowRight size={14} className="ml-auto text-gray-300 group-hover:text-gray-500 transition-colors"/>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming trips */}
      {allTrips.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-gray-800 dark:text-white">Your Trips</h3>
            <button onClick={() => navigate('/trips')} className="text-sm text-sand-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight size={14}/>
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allTrips.slice(0, 3).map(trip => (
              <TripCard key={trip.id} trip={trip} onClick={() => navigate(`/trips/${trip.id}`)}/>
            ))}
          </div>
        </div>
      )}

      {allTrips.length === 0 && (
        <div className="mt-6 card p-12 text-center">
          <div className="w-20 h-20 bg-sand-50 dark:bg-sand-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <PlaneTakeoff size={32} className="text-sand-400"/>
          </div>
          <h3 className="font-display text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No trips yet</h3>
          <p className="text-gray-400 mb-6">Start planning your first adventure!</p>
          <button onClick={() => navigate('/trips/new')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sand-500 to-sand-600 text-white rounded-xl font-medium hover:from-sand-600 hover:to-sand-700 transition-all shadow-md">
            <Plus size={16}/> Plan Your First Trip
          </button>
        </div>
      )}
    </Layout>
  );
}
