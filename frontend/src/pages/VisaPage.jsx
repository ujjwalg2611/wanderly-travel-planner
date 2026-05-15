import React, { useState } from 'react';
import Layout from '../components/ui/Layout';
import { visaAPI } from '../services/api';
import { FileText, Search, Clock, DollarSign, CheckCircle, AlertTriangle, XCircle, Globe, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const PASSPORT_COUNTRIES = ['India','USA','UK','Canada','Australia','Germany','France','Japan','Singapore','UAE','China','Brazil'];
const DESTINATIONS = ['France','Japan','UAE','Thailand','UK','USA','Singapore','Bali (Indonesia)','Maldives','Italy','Spain','Greece','Switzerland','New Zealand','South Africa'];

const DIFF_CONFIG = {
  'None':       { color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400', icon: CheckCircle, label: 'No visa needed' },
  'Very Easy':  { color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',   icon: CheckCircle,    label: 'Very easy' },
  'Easy':       { color: 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400',         icon: CheckCircle,    label: 'Easy process' },
  'Medium':     { color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400', icon: AlertTriangle,  label: 'Some paperwork' },
  'Hard':       { color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400', icon: AlertTriangle,  label: 'Complex process' },
  'Very Hard':  { color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',             icon: XCircle,        label: 'Difficult process' },
};

function DocChecklist({ docs }) {
  const [checked, setChecked] = useState({});
  const toggle = (i) => setChecked(c => ({ ...c, [i]: !c[i] }));
  const done = Object.values(checked).filter(Boolean).length;
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200">Document Checklist</h4>
        <span className="text-xs font-semibold text-sand-600 dark:text-sand-400">{done}/{docs.length} ready</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 dark:bg-[#2a3a50] rounded-full mb-3 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-sand-400 to-green-500 rounded-full transition-all duration-500"
          style={{ width: `${docs.length ? (done/docs.length)*100 : 0}%` }}/>
      </div>
      <div className="space-y-2">
        {docs.map((doc, i) => (
          <label key={i} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${checked[i] ? 'border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-900/10' : 'border-gray-100 dark:border-[#2a3a50] hover:bg-gray-50 dark:hover:bg-[#243045]'}`}>
            <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 border-2 transition-all ${checked[i] ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-[#2a3a50]'}`}
              onClick={() => toggle(i)}>
              {checked[i] && <CheckCircle size={12} className="text-white fill-white"/>}
            </div>
            <span className={`text-sm ${checked[i] ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>{doc}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function VisaPage() {
  const [passport, setPassport] = useState('India');
  const [destination, setDestination] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const handleCheck = async () => {
    if (!destination) { toast.error('Select a destination'); return; }
    setLoading(true);
    try {
      const data = await visaAPI.check(passport, destination);
      setResult(data);
    } catch { toast.error('Check failed. Try again.'); }
    finally { setLoading(false); }
  };

  const diff = result ? DIFF_CONFIG[result.difficulty] || DIFF_CONFIG['Medium'] : null;
  const DiffIcon = diff?.icon;

  return (
    <Layout title="Visa Checker">
      <div className="max-w-4xl mx-auto">

        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden mb-8 p-8"
          style={{ background: 'linear-gradient(135deg, #0f1923 0%, #1a3050 100%)' }}>
          <div className="absolute inset-0 hero-pattern opacity-20"/>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Globe size={20} className="text-sand-400"/>
              <span className="text-sand-400 text-sm font-semibold tracking-wider uppercase">Visa Intelligence</span>
            </div>
            <h2 className="font-display text-3xl font-bold text-white mb-2">Instant Visa Requirements</h2>
            <p className="text-gray-400">Check visa type, fees, documents, and processing time instantly for any passport–destination pair.</p>
          </div>
        </div>

        {/* Search card */}
        <div className="card p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Your Passport</label>
              <select value={passport} onChange={e => setPassport(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm focus:border-sand-400 transition-colors">
                {PASSPORT_COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Destination Country</label>
              <select value={destination} onChange={e => setDestination(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm focus:border-sand-400 transition-colors">
                <option value="">Select destination...</option>
                {DESTINATIONS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <button onClick={handleCheck} disabled={loading || !destination}
              className="flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-sand-500 to-sand-600 text-white rounded-xl font-semibold hover:from-sand-600 hover:to-sand-700 transition-all shadow-md disabled:opacity-50">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <><Search size={17}/> Check Visa</>}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="grid md:grid-cols-2 gap-5 animate-slide-up">
            {/* Left: Overview */}
            <div className="card p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-gray-400 mb-1">{result.passport} → {result.destination}</div>
                  <h3 className="font-display text-2xl font-bold text-gray-800 dark:text-white">{result.type}</h3>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold ${diff?.color}`}>
                  {DiffIcon && <DiffIcon size={14}/>} {diff?.label}
                </div>
              </div>

              <div className={`p-4 rounded-2xl border-2 ${result.required ? 'border-orange-200 dark:border-orange-900/40 bg-orange-50 dark:bg-orange-900/10' : 'border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-900/10'}`}>
                <div className="flex items-center gap-2">
                  {result.required
                    ? <AlertTriangle size={18} className="text-orange-500"/>
                    : <CheckCircle size={18} className="text-green-500"/>}
                  <span className={`font-semibold ${result.required ? 'text-orange-700 dark:text-orange-400' : 'text-green-700 dark:text-green-400'}`}>
                    {result.required ? 'Visa Required' : 'Visa Free Entry'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: DollarSign, label: 'Visa Fee', value: result.fee, color: 'text-sand-500' },
                  { icon: Clock,       label: 'Processing', value: result.processing, color: 'text-ocean-500' },
                  { icon: FileText,    label: 'Validity', value: result.validity, color: 'text-forest-500' },
                  { icon: Globe,       label: 'Difficulty', value: result.difficulty, color: 'text-dusk-500' },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-[#243045]">
                    <Icon size={16} className={`${color} flex-shrink-0 mt-0.5`}/>
                    <div>
                      <div className="text-xs text-gray-400">{label}</div>
                      <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tips accordion */}
              <div className="border border-gray-100 dark:border-[#2a3a50] rounded-xl overflow-hidden">
                <button onClick={() => setShowTips(!showTips)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-[#243045] text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span>💡 Insider Tips</span>
                  {showTips ? <ChevronUp size={15}/> : <ChevronDown size={15}/>}
                </button>
                {showTips && (
                  <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed animate-fade-in">
                    {result.tips}
                  </div>
                )}
              </div>

              <a href={result.embassyUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 border border-sand-200 dark:border-sand-800 text-sand-600 dark:text-sand-400 rounded-xl text-sm font-medium hover:bg-sand-50 dark:hover:bg-sand-900/20 transition-colors">
                Official Embassy Info <ExternalLink size={13}/>
              </a>
            </div>

            {/* Right: Checklist */}
            <div className="card p-6">
              <DocChecklist docs={result.docs}/>
              {/* Quick countries */}
              <div className="mt-6 pt-5 border-t border-gray-100 dark:border-[#2a3a50]">
                <div className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wider">Check another destination</div>
                <div className="flex flex-wrap gap-2">
                  {DESTINATIONS.filter(d => d !== destination).slice(0, 8).map(d => (
                    <button key={d} onClick={() => { setDestination(d); }}
                      className="px-3 py-1.5 rounded-xl text-xs border border-gray-200 dark:border-[#2a3a50] text-gray-600 dark:text-gray-400 hover:border-sand-300 hover:text-sand-600 transition-colors">
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {!result && (
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { flag: '🇯🇵', country: 'Japan', passport: 'India', badge: 'Easy', color: 'bg-lime-50 dark:bg-lime-900/20 text-lime-700 dark:text-lime-400' },
              { flag: '🇺🇸', country: 'USA', passport: 'India', badge: 'Very Hard', color: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' },
              { flag: '🇦🇪', country: 'UAE', passport: 'India', badge: 'Very Easy', color: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' },
            ].map(({ flag, country, passport: p, badge, color }) => (
              <button key={country} onClick={() => { setPassport(p); setDestination(country); }}
                className="card p-5 text-center hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group">
                <div className="text-4xl mb-2">{flag}</div>
                <div className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{country}</div>
                <div className="text-xs text-gray-400 mb-2">from {p} passport</div>
                <span className={`badge text-xs ${color}`}>{badge}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
