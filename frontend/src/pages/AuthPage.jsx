import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PlaneTakeoff, Eye, EyeOff, ArrowRight, Compass } from 'lucide-react';
import toast from 'react-hot-toast';

const destinations = ['Santorini', 'Kyoto', 'Bali', 'Patagonia', 'Machu Picchu', 'Amalfi Coast'];

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      toast.success(`Welcome${mode === 'register' ? `, ${form.name}` : ' back'}! 🌍`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally { setLoading(false); }
  };

  const demoLogin = async () => {
    setLoading(true);
    try {
      // Register demo user if needed
      try { await register('Alex Traveler', 'demo@wanderly.com', 'demo1234'); }
      catch { await login('demo@wanderly.com', 'demo1234'); }
      toast.success('Welcome to Wanderly! 🌍');
      navigate('/dashboard');
    } catch { toast.error('Demo login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-3/5 relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f1923 0%, #1a2535 50%, #0d2a4a 100%)' }}>

        {/* BG pattern */}
        <div className="absolute inset-0 hero-pattern opacity-30"/>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(196,132,42,0.15) 0%, transparent 60%)' }}/>

        {/* Floating destination cards */}
        <div className="absolute inset-0 overflow-hidden">
          {destinations.map((d, i) => (
            <div key={d} className="absolute glass-dark rounded-2xl px-4 py-2.5 border border-white/10 animate-float"
              style={{ top: `${15 + (i * 14)}%`, left: `${5 + (i % 2 === 0 ? 5 : 55)}%`, animationDelay: `${i * 0.8}s`, animationDuration: `${4 + i * 0.5}s` }}>
              <div className="flex items-center gap-2">
                <Compass size={12} className="text-sand-400"/>
                <span className="text-white/80 text-xs font-medium">{d}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sand-400 to-sand-600 flex items-center justify-center shadow-glow-sand">
            <PlaneTakeoff size={22} className="text-white"/>
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-white">Wanderly</div>
            <div className="text-sand-400/80 text-xs font-body tracking-wider uppercase">Your Journey Awaits</div>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <h1 className="font-display text-5xl font-bold text-white leading-tight mb-4">
            Plan Your<br/>
            <span className="gradient-text">Perfect Journey</span>
          </h1>
          <p className="text-gray-400 text-lg font-body mb-8 leading-relaxed max-w-md">
            AI-powered travel planning, real-time collaboration, and smart recommendations—all in one beautiful app.
          </p>
          <div className="flex items-center gap-6">
            {[['50K+', 'Travelers'], ['120+', 'Countries'], ['1M+', 'Itineraries']].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-2xl font-bold text-sand-400">{n}</div>
                <div className="text-gray-500 text-sm">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Review */}
        <div className="relative z-10 glass rounded-2xl p-4 border border-white/10 max-w-sm">
          <div className="flex items-center gap-3 mb-2">
            <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=sarah" alt="" className="w-9 h-9 rounded-full bg-sand-200"/>
            <div>
              <div className="text-white text-sm font-medium">Sarah M.</div>
              <div className="text-yellow-400 text-xs">★★★★★</div>
            </div>
          </div>
          <p className="text-gray-400 text-sm italic">"Wanderly planned my entire Southeast Asia trip in minutes. Absolutely magical!"</p>
        </div>
      </div>

      {/* Right panel - Auth form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 bg-white dark:bg-[#0f1923]">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sand-400 to-sand-600 flex items-center justify-center">
              <PlaneTakeoff size={18} className="text-white"/>
            </div>
            <span className="font-display text-xl font-bold text-sand-600">Wanderly</span>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {mode === 'login' ? 'Welcome back' : 'Start exploring'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {mode === 'login' ? 'Sign in to your account' : 'Create your free account today'}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex bg-gray-100 dark:bg-[#1a2535] rounded-xl p-1 mb-6">
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${mode === m ? 'bg-white dark:bg-[#243045] text-sand-600 dark:text-sand-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                <input type="text" placeholder="Alex Traveler" required
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#1a2535] text-gray-800 dark:text-gray-200 text-sm placeholder-gray-400 transition-colors focus:border-sand-400"/>
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Email</label>
              <input type="email" placeholder="you@example.com" required
                value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#1a2535] text-gray-800 dark:text-gray-200 text-sm placeholder-gray-400 transition-colors focus:border-sand-400"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} placeholder="••••••••" required minLength={6}
                  value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#1a2535] text-gray-800 dark:text-gray-200 text-sm placeholder-gray-400 transition-colors focus:border-sand-400"/>
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-sand-500 to-sand-600 hover:from-sand-600 hover:to-sand-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-glow-sand disabled:opacity-60 mt-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
              ) : (
                <>{mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={16}/></>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200 dark:bg-[#2a3a50]"/>
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-[#2a3a50]"/>
          </div>

          <button onClick={demoLogin} disabled={loading}
            className="w-full py-3 border-2 border-dashed border-sand-300 dark:border-sand-700 rounded-xl text-sm font-medium text-sand-600 dark:text-sand-400 hover:bg-sand-50 dark:hover:bg-sand-900/20 transition-colors flex items-center justify-center gap-2">
            <Compass size={16}/>
            Try Demo Account
          </button>
        </div>
      </div>
    </div>
  );
}
