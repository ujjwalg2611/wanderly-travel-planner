import React, { useState, useEffect } from 'react';
import { Bell, Search, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const notifications = [
  { id: 1, text: 'Your trip to Bali starts in 3 days!', time: '2h ago', type: 'trip', read: false },
  { id: 2, text: 'Weather alert for Paris: Rain expected', time: '5h ago', type: 'weather', read: false },
  { id: 3, text: 'Budget alert: 80% of Rome trip budget used', time: '1d ago', type: 'budget', read: true },
];

export default function Header({ title }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const [query, setQuery] = useState('');
  const unread = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-white dark:bg-[#0f1923] border-b border-sand-100 dark:border-[#2a3a50] flex items-center px-6 gap-4 flex-shrink-0">
      <h1 className="font-display text-xl font-semibold text-gray-800 dark:text-gray-100 flex-shrink-0">
        {title}
      </h1>

      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
        <input
          type="text"
          placeholder="Search destinations, trips..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-[#1a2535] border border-gray-200 dark:border-[#2a3a50] rounded-xl text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:border-sand-400 transition-colors"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <X size={14}/>
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1a2535] text-gray-500 dark:text-gray-400 transition-colors">
            <Bell size={18}/>
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                {unread}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-12 w-80 bg-white dark:bg-[#1a2535] rounded-2xl shadow-xl border border-gray-100 dark:border-[#2a3a50] z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-[#2a3a50] flex items-center justify-between">
                <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">Notifications</span>
                <span className="badge bg-red-100 text-red-600">{unread} new</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`px-4 py-3 border-b border-gray-50 dark:border-[#2a3a50]/50 hover:bg-gray-50 dark:hover:bg-[#243045] cursor-pointer ${!n.read ? 'bg-sand-50/50 dark:bg-sand-900/10' : ''}`}>
                    <div className="flex gap-3 items-start">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? 'bg-sand-500' : 'bg-gray-300'}`}/>
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{n.text}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center">
                <button className="text-xs text-sand-600 font-medium hover:underline">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        {user && (
          <button onClick={() => navigate('/settings')} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-sand-200 dark:ring-sand-800"/>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">{user.name}</span>
          </button>
        )}
      </div>
    </header>
  );
}
