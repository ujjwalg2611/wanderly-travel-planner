import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/ui/Layout';
import { tripsAPI } from '../services/api';
import {
  Calendar, List, MapPin, Sun, Sunset, Moon, Hotel,
  Car, Edit3, ChevronLeft, ChevronRight, Clock, Tag
} from 'lucide-react';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval,
         isSameDay, isWithinInterval, isSameMonth, addMonths, subMonths } from 'date-fns';

const SLOT_COLORS = {
  morning:   { bg: 'bg-yellow-50 dark:bg-yellow-900/20', dot: 'bg-yellow-400', text: 'text-yellow-700 dark:text-yellow-400', icon: Sun },
  afternoon: { bg: 'bg-orange-50 dark:bg-orange-900/20', dot: 'bg-orange-400', text: 'text-orange-700 dark:text-orange-400', icon: Sunset },
  evening:   { bg: 'bg-purple-50 dark:bg-purple-900/20', dot: 'bg-purple-400', text: 'text-purple-700 dark:text-purple-400', icon: Moon },
};

function TimelineView({ trips }) {
  const navigate = useNavigate();
  const allDays = trips.flatMap(trip =>
    (trip.itinerary || []).map(day => ({ ...day, trip }))
  ).sort((a, b) => new Date(a.date) - new Date(b.date));

  if (allDays.length === 0) {
    return (
      <div className="card p-16 text-center">
        <Calendar size={40} className="mx-auto text-gray-300 mb-3"/>
        <p className="text-gray-400">No itinerary days yet. Create a trip to get started.</p>
      </div>
    );
  }

  return (
    <div className="relative timeline-line pl-12 space-y-4">
      {allDays.map((day, idx) => (
        <div key={`${day.trip.id}-${day.id}`} className="relative animate-fade-in">
          {/* Timeline dot */}
          <div className="absolute -left-12 top-4 w-10 h-10 rounded-2xl bg-gradient-to-br from-sand-400 to-sand-600 flex items-center justify-center shadow-md z-10">
            <span className="text-white font-bold text-xs">{day.day}</span>
          </div>

          <div className="card p-5 hover:shadow-card-hover transition-all duration-300">
            <div className="flex items-start justify-between mb-3 gap-4">
              <div>
                <div className="font-semibold text-gray-800 dark:text-gray-200">
                  {day.date ? format(parseISO(day.date), 'EEEE, MMMM d, yyyy') : `Day ${day.day}`}
                </div>
                <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
                  <MapPin size={10}/> {day.trip.destination}
                  <span className="text-gray-300">·</span>
                  <span className="text-sand-500 font-medium">{day.trip.title}</span>
                </div>
              </div>
              <button
                onClick={() => navigate(`/trips/${day.trip.id}`)}
                className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold text-sand-600 dark:text-sand-400 bg-sand-50 dark:bg-sand-900/20 hover:bg-sand-100 transition-colors">
                View Trip →
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              {['morning', 'afternoon', 'evening'].map(slot => {
                const c = SLOT_COLORS[slot];
                const Icon = c.icon;
                const activity = day[slot];
                return (
                  <div key={slot} className={`${c.bg} rounded-xl p-3`}>
                    <div className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1.5 ${c.text}`}>
                      <Icon size={12}/> {slot}
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-tight">
                      {activity?.activity || '—'}
                    </div>
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Clock size={9}/> {activity?.time}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-[#2a3a50] text-xs text-gray-400">
              <span className="flex items-center gap-1"><Hotel size={11}/> {day.hotel}</span>
              <span className="flex items-center gap-1"><Car size={11}/> {day.transport}</span>
              <span className="ml-auto font-semibold text-sand-500">${day.budget}/day</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CalendarView({ trips }) {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad start
  const startPad = monthStart.getDay();
  const padDays = Array(startPad).fill(null);

  const getTripForDay = (day) =>
    trips.filter(trip =>
      trip.startDate && trip.endDate &&
      isWithinInterval(day, {
        start: parseISO(trip.startDate),
        end: parseISO(trip.endDate),
      })
    );

  const TRIP_COLORS = ['bg-sand-400','bg-ocean-400','bg-forest-400','bg-dusk-500','bg-coral-400'];

  return (
    <div className="card overflow-hidden">
      {/* Month nav */}
      <div className="p-5 border-b border-gray-100 dark:border-[#2a3a50] flex items-center justify-between">
        <button onClick={() => setCurrentMonth(m => subMonths(m, 1))}
          className="w-9 h-9 rounded-xl hover:bg-gray-100 dark:hover:bg-[#243045] flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors">
          <ChevronLeft size={18}/>
        </button>
        <h3 className="font-display font-semibold text-lg text-gray-800 dark:text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button onClick={() => setCurrentMonth(m => addMonths(m, 1))}
          className="w-9 h-9 rounded-xl hover:bg-gray-100 dark:hover:bg-[#243045] flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors">
          <ChevronRight size={18}/>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-gray-100 dark:border-[#2a3a50]">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7">
        {padDays.map((_, i) => <div key={`pad-${i}`} className="h-24 border-b border-r border-gray-50 dark:border-[#2a3a50]/30"/>)}
        {days.map((day, idx) => {
          const dayTrips = getTripForDay(day);
          const isToday = isSameDay(day, new Date());
          return (
            <div key={idx}
              className={`h-24 border-b border-r border-gray-50 dark:border-[#2a3a50]/30 p-1.5 relative ${isToday ? 'bg-sand-50/50 dark:bg-sand-900/10' : 'hover:bg-gray-50 dark:hover:bg-[#1a2535]/50'} transition-colors`}>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-semibold mb-1 ${isToday ? 'bg-sand-500 text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-0.5 overflow-hidden">
                {dayTrips.slice(0, 2).map((trip, ti) => {
                  const isStart = isSameDay(day, parseISO(trip.startDate));
                  return (
                    <button key={trip.id} onClick={() => navigate(`/trips/${trip.id}`)}
                      className={`w-full text-left text-[10px] px-1.5 py-0.5 rounded font-medium text-white truncate ${TRIP_COLORS[ti % TRIP_COLORS.length]} hover:opacity-80 transition-opacity`}>
                      {isStart ? `✈ ` : ''}{trip.title.length > 12 ? trip.destination.split(',')[0] : trip.title}
                    </button>
                  );
                })}
                {dayTrips.length > 2 && (
                  <div className="text-[9px] text-gray-400 pl-1">+{dayTrips.length - 2} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      {trips.length > 0 && (
        <div className="p-4 border-t border-gray-100 dark:border-[#2a3a50] flex flex-wrap gap-3">
          {trips.map((trip, i) => (
            <div key={trip.id} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <div className={`w-2.5 h-2.5 rounded-sm ${TRIP_COLORS[i % TRIP_COLORS.length]}`}/>
              {trip.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ItineraryPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('timeline');
  const [selectedTrip, setSelectedTrip] = useState('all');

  useEffect(() => {
    tripsAPI.getAll()
      .then(data => { setTrips(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = selectedTrip === 'all'
    ? trips
    : trips.filter(t => t.id === selectedTrip);

  return (
    <Layout title="Itineraries">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex gap-2">
          <button onClick={() => setView('timeline')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${view === 'timeline' ? 'bg-sand-500 text-white shadow-md' : 'bg-white dark:bg-[#1a2535] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#2a3a50]'}`}>
            <List size={15}/> Timeline
          </button>
          <button onClick={() => setView('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${view === 'calendar' ? 'bg-sand-500 text-white shadow-md' : 'bg-white dark:bg-[#1a2535] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#2a3a50]'}`}>
            <Calendar size={15}/> Calendar
          </button>
        </div>

        <div className="flex gap-2 items-center">
          <select value={selectedTrip} onChange={e => setSelectedTrip(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#1a2535] text-gray-700 dark:text-gray-300 text-sm">
            <option value="all">All Trips</option>
            {trips.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_,i) => (
            <div key={i} className="card h-48 shimmer-bg rounded-2xl"/>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <Calendar size={48} className="mx-auto text-gray-300 mb-4"/>
          <h3 className="font-display text-xl text-gray-500 mb-2">No itineraries yet</h3>
          <p className="text-gray-400 mb-6">Create a trip and your itinerary will appear here</p>
          <button onClick={() => navigate('/trips/new')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-sand-500 text-white rounded-xl font-medium hover:bg-sand-600 transition-colors">
            Plan a Trip
          </button>
        </div>
      ) : view === 'timeline' ? (
        <TimelineView trips={filtered}/>
      ) : (
        <CalendarView trips={filtered}/>
      )}
    </Layout>
  );
}
