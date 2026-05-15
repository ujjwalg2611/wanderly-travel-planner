import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard, Map, Compass, Users, Wallet, Settings,
  LogOut, Sun, Moon, PlaneTakeoff, Heart, ChevronLeft, ChevronRight,
  Plus, Star, Building2, Globe, CloudSun, Award, MapPin, Split,
  Sparkles, FileText
} from 'lucide-react';

const NAV = [
  { section: 'Main', items: [
    { path: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/trips',        icon: PlaneTakeoff,    label: 'My Trips' },
    { path: '/itinerary',   icon: Map,             label: 'Itineraries' },
    { path: '/ai-assistant', icon: Sparkles,        label: 'AI Assistant', badge: 'NEW' },
  ]},
  { section: 'Book', items: [
    { path: '/flights',      icon: PlaneTakeoff,    label: 'Flights' },
    { path: '/hotels',       icon: Building2,       label: 'Hotels' },
    { path: '/maps',         icon: MapPin,          label: 'Maps & Places' },
  ]},
  { section: 'Tools', items: [
    { path: '/weather',      icon: CloudSun,        label: 'Weather' },
    { path: '/visa',         icon: FileText,        label: 'Visa Checker' },
    { path: '/expenses',     icon: Wallet,          label: 'Expenses' },
    { path: '/split',        icon: Split,           label: 'Expense Split' },
    { path: '/loyalty',      icon: Award,           label: 'Rewards' },
  ]},
  { section: 'Explore', items: [
    { path: '/explore',         icon: Compass, label: 'Explore' },
    { path: '/recommendations', icon: Star,    label: 'Discover' },
    { path: '/social',          icon: Users,   label: 'Social' },
    { path: '/saved',           icon: Heart,   label: 'Saved' },
  ]},
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-60'} transition-all duration-300 flex flex-col h-screen bg-white dark:bg-[#0f1923] border-r border-gray-100 dark:border-[#2a3a50] relative z-10 flex-shrink-0`}>
      {/* Logo */}
      <div className={`p-4 flex items-center ${collapsed ? 'justify-center' : 'justify-between'} border-b border-gray-100 dark:border-[#2a3a50] flex-shrink-0`}>
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sand-400 to-sand-600 flex items-center justify-center shadow-md flex-shrink-0">
              <PlaneTakeoff size={16} className="text-white"/>
            </div>
            <div>
              <div className="font-display font-bold text-base text-sand-700 dark:text-sand-300 leading-tight">Wanderly</div>
              <div className="text-[10px] text-gray-400">Travel Planner</div>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sand-400 to-sand-600 flex items-center justify-center shadow-md">
            <PlaneTakeoff size={16} className="text-white"/>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a2535] text-gray-400 transition-colors ml-1">
          {collapsed ? <ChevronRight size={14}/> : <ChevronLeft size={14}/>}
        </button>
      </div>

      {/* New Trip */}
      {!collapsed && (
        <div className="px-3 pt-3 flex-shrink-0">
          <button onClick={() => navigate('/trips/new')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-sand-500 to-sand-600 text-white rounded-xl font-medium text-sm hover:from-sand-600 hover:to-sand-700 transition-all shadow-sm">
            <Plus size={15}/> New Trip
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-0.5">
        {NAV.map(({ section, items }) => (
          <div key={section}>
            {!collapsed && (
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 pt-3 pb-1">{section}</div>
            )}
            {items.map(({ path, icon: Icon, label, badge }) => {
              const active = location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));
              return (
                <button key={path} onClick={() => navigate(path)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 group ${active ? 'bg-sand-50 dark:bg-sand-900/20 text-sand-600 dark:text-sand-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a2535] hover:text-gray-700 dark:hover:text-gray-200'}`}>
                  <Icon size={16} className={active ? 'text-sand-500' : 'text-current'} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{label}</span>
                      {badge && <span className="text-[9px] bg-sand-500 text-white px-1.5 py-0.5 rounded-full font-bold">{badge}</span>}
                      {active && <div className="w-1.5 h-1.5 rounded-full bg-sand-500"/>}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-gray-100 dark:border-[#2a3a50] p-2 space-y-0.5 flex-shrink-0">
        <button onClick={toggle}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a2535] transition-colors">
          {dark ? <Sun size={16}/> : <Moon size={16}/>}
          {!collapsed && <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
        <button onClick={() => navigate('/settings')}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a2535] transition-colors">
          <Settings size={16}/>
          {!collapsed && <span>Settings</span>}
        </button>

        {!collapsed && user && (
          <div className="flex items-center gap-2.5 px-2 py-2 mt-1 rounded-xl bg-gray-50 dark:bg-[#1a2535]">
            <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-lg object-cover flex-shrink-0"/>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{user.name}</div>
              <div className="text-[10px] text-gray-400 truncate">{user.email}</div>
            </div>
            <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
              <LogOut size={13}/>
            </button>
          </div>
        )}
        {collapsed && (
          <button onClick={logout}
            className="w-full flex items-center justify-center py-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <LogOut size={16}/>
          </button>
        )}
      </div>
    </aside>
  );
}
