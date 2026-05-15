import React, { useState } from 'react';
import Layout from '../components/ui/Layout';
import { weatherAPI } from '../services/api';
import { Search, Wind, Droplets, Thermometer, Eye, AlertTriangle, Sun, Cloud, CloudRain } from 'lucide-react';
import toast from 'react-hot-toast';

const POPULAR = ['Paris','Tokyo','Bali','New York','London','Singapore','Dubai','Sydney'];

const CONDITION_THEMES = {
  'Clear':           { bg: 'from-yellow-400 to-orange-400', emoji: '☀️' },
  'Partly Cloudy':   { bg: 'from-blue-400 to-cyan-400',    emoji: '⛅' },
  'Overcast':        { bg: 'from-gray-400 to-slate-500',   emoji: '☁️' },
  'Hot & Humid':     { bg: 'from-orange-500 to-red-400',   emoji: '🌡️' },
  'Humid & Warm':    { bg: 'from-teal-400 to-green-400',   emoji: '🌿' },
  'Windy':           { bg: 'from-cyan-500 to-blue-500',    emoji: '💨' },
  'default':         { bg: 'from-sand-400 to-sand-600',    emoji: '🌤️' },
};

function WeatherCard({ data }) {
  const theme = CONDITION_THEMES[data.condition] || CONDITION_THEMES['default'];
  return (
    <div className={`rounded-3xl p-6 text-white bg-gradient-to-br ${theme.bg} shadow-xl mb-6 relative overflow-hidden`}>
      <div className="absolute inset-0 hero-pattern opacity-10"/>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-white/70 text-sm font-medium mb-1">{data.destination}</div>
            <div className="font-display text-7xl font-bold leading-none">{data.temp}°</div>
            <div className="text-white/80 text-lg mt-1">{data.condition}</div>
            <div className="text-white/60 text-sm">Feels like {data.feels}°C</div>
          </div>
          <div className="text-8xl opacity-80 leading-none">{theme.emoji}</div>
        </div>

        {data.alert && (
          <div className="flex items-center gap-2 bg-red-500/30 border border-red-300/40 rounded-xl px-4 py-2.5 mb-4">
            <AlertTriangle size={16} className="text-red-200 flex-shrink-0"/>
            <span className="text-white text-sm font-medium">{data.alert}</span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Droplets,    label: 'Humidity',  value: `${data.humidity}%` },
            { icon: Wind,        label: 'Wind',       value: `${data.wind} km/h` },
            { icon: Thermometer, label: 'Feels like', value: `${data.feels}°C` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
              <Icon size={16} className="mx-auto mb-1 text-white/80"/>
              <div className="text-white/60 text-[10px] uppercase tracking-wider">{label}</div>
              <div className="text-white font-bold text-sm">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ForecastBar({ day }) {
  return (
    <div className="card p-4 flex items-center justify-between hover:shadow-card-hover transition-all">
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-10">{day.day}</span>
      <span className="text-2xl">{day.icon}</span>
      <div className="flex-1 mx-4">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="text-ocean-500 font-semibold">{day.low}°</span>
          <div className="flex-1 h-1.5 bg-gray-100 dark:bg-[#2a3a50] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 to-orange-400 rounded-full" style={{ width: `${Math.min(100, ((day.high - day.low) / 20) * 100)}%` }}/>
          </div>
          <span className="text-orange-500 font-semibold">{day.high}°</span>
        </div>
      </div>
    </div>
  );
}

export default function WeatherPage() {
  const [search, setSearch] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (dest) => {
    const d = dest || search.trim();
    if (!d) { toast.error('Enter a destination'); return; }
    setLoading(true);
    try {
      const data = await weatherAPI.get(d);
      setWeather({ ...data, destination: d });
    } catch { toast.error('Could not fetch weather'); }
    finally { setLoading(false); }
  };

  return (
    <Layout title="Weather">
      <div className="max-w-2xl mx-auto">
        {/* Search */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input
              type="text"
              placeholder="Search city or destination..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#1a2535] text-gray-800 dark:text-gray-200 text-sm focus:border-sand-400 transition-colors"
            />
          </div>
          <button onClick={() => handleSearch()} disabled={loading}
            className="px-5 py-3 bg-gradient-to-r from-sand-500 to-sand-600 text-white rounded-2xl font-semibold hover:from-sand-600 hover:to-sand-700 transition-all shadow-md disabled:opacity-60">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : 'Search'}
          </button>
        </div>

        {/* Popular cities */}
        <div className="flex flex-wrap gap-2 mb-6">
          {POPULAR.map(c => (
            <button key={c} onClick={() => { setSearch(c); handleSearch(c); }}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1a2535] border border-gray-200 dark:border-[#2a3a50] text-xs font-medium text-gray-600 dark:text-gray-400 hover:border-sand-300 hover:text-sand-600 transition-colors">
              {c}
            </button>
          ))}
        </div>

        {weather ? (
          <div className="animate-slide-up">
            <WeatherCard data={weather}/>

            {/* 5-day forecast */}
            <h3 className="font-display font-semibold text-gray-800 dark:text-white mb-3">5-Day Forecast</h3>
            <div className="space-y-2 mb-6">
              {(weather.forecast || []).map((day, i) => <ForecastBar key={i} day={day}/>)}
            </div>

            {/* Travel advice */}
            <div className="card p-5">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 text-sm">🧳 Packing Advice</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  weather.temp > 28 ? '🩴 Light clothing' : weather.temp > 15 ? '👕 Comfortable layers' : '🧥 Warm jacket',
                  weather.humidity > 80 ? '💧 Moisture-wicking clothes' : '☀️ Sunscreen recommended',
                  weather.wind > 20 ? '🧣 Windproof layer' : '🎒 Standard packing',
                  weather.condition.includes('Rain') || weather.forecast?.some(d => d.icon.includes('🌧')) ? '☔ Pack umbrella' : '😎 Sunglasses',
                ].map((tip, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 dark:bg-[#243045] text-gray-600 dark:text-gray-400">
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-12 text-center">
            <div className="text-7xl mb-4">🌍</div>
            <h3 className="font-display text-xl text-gray-600 dark:text-gray-300 mb-2">Check weather anywhere</h3>
            <p className="text-gray-400 text-sm">Search any destination to see current conditions, forecasts and packing tips</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
