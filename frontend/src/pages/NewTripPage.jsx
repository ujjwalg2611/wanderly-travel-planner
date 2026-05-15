import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/ui/Layout';
import { tripsAPI } from '../services/api';
import {
  MapPin, Calendar, Users, Wallet, Tag, Globe, CheckCircle,
  ArrowRight, ArrowLeft, Sparkles, PlaneTakeoff
} from 'lucide-react';
import toast from 'react-hot-toast';

const INTERESTS = [
  { key: 'adventure', emoji: '🧗', label: 'Adventure', desc: 'Hiking, climbing, extreme sports' },
  { key: 'culture',   emoji: '🏛️', label: 'Culture',   desc: 'Museums, history, heritage' },
  { key: 'nature',    emoji: '🌿', label: 'Nature',    desc: 'Parks, wildlife, landscapes' },
  { key: 'food',      emoji: '🍜', label: 'Food',      desc: 'Local cuisine, food tours' },
  { key: 'relaxation',emoji: '🧘', label: 'Relax',     desc: 'Spa, beaches, wellness' },
  { key: 'shopping',  emoji: '🛍️', label: 'Shopping',  desc: 'Markets, malls, boutiques' },
  { key: 'nightlife', emoji: '🎶', label: 'Nightlife', desc: 'Clubs, bars, entertainment' },
  { key: 'photography',emoji:'📸', label: 'Photography',desc: 'Scenic spots, photo walks' },
];

const STEPS = ['Destination', 'Dates & Budget', 'Interests', 'Review'];

export default function NewTripPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', destination: '', startDate: '', endDate: '',
    budget: 2000, travelersCount: 2, interests: [], description: '', isPublic: false,
  });

  const toggleInterest = (key) =>
    setForm(f => ({
      ...f,
      interests: f.interests.includes(key)
        ? f.interests.filter(x => x !== key)
        : [...f.interests, key],
    }));

  const days = form.startDate && form.endDate
    ? Math.max(1, Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / 86400000) + 1)
    : 0;

  const next = () => setStep(s => Math.min(s + 1, 3));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const canNext = [
    form.destination.trim().length > 0,
    form.startDate && form.endDate && new Date(form.endDate) >= new Date(form.startDate),
    form.interests.length > 0,
    true,
  ][step];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const trip = await tripsAPI.create(form);
      toast.success('Trip created & itinerary generated! 🎉');
      navigate(`/trips/${trip.id}`);
    } catch {
      toast.error('Failed to create trip');
    } finally { setLoading(false); }
  };

  return (
    <Layout title="Plan New Trip">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  i < step ? 'bg-green-500 text-white shadow-md' :
                  i === step ? 'bg-gradient-to-br from-sand-400 to-sand-600 text-white shadow-md shadow-sand-200' :
                  'bg-gray-100 dark:bg-[#1a2535] text-gray-400'
                }`}>
                  {i < step ? <CheckCircle size={16}/> : i + 1}
                </div>
                <span className={`text-xs font-medium ${i === step ? 'text-sand-600 dark:text-sand-400' : 'text-gray-400'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all duration-500 ${i < step ? 'bg-green-400' : 'bg-gray-200 dark:bg-[#2a3a50]'}`}/>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="card p-8 animate-fade-in">

          {/* Step 0 – Destination */}
          {step === 0 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-gray-800 dark:text-white mb-1">Where are you going?</h2>
              <p className="text-gray-400 text-sm mb-6">Enter your dream destination to get started</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Destination *</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-sand-400"/>
                    <input
                      type="text" placeholder="e.g. Paris, France"
                      value={form.destination}
                      onChange={e => setForm({ ...form, destination: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-base focus:border-sand-400 transition-colors"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Trip Name (optional)</label>
                  <input
                    type="text" placeholder="e.g. Summer Adventure 2025"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-base focus:border-sand-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Description (optional)</label>
                  <textarea
                    rows={3} placeholder="Tell us about your trip..."
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm focus:border-sand-400 transition-colors resize-none"
                  />
                </div>

                {/* Quick destination suggestions */}
                <div>
                  <div className="text-xs text-gray-400 mb-2">Popular destinations</div>
                  <div className="flex flex-wrap gap-2">
                    {['Bali, Indonesia','Tokyo, Japan','Paris, France','New York, USA','Rome, Italy','Santorini, Greece'].map(d => (
                      <button key={d} type="button"
                        onClick={() => setForm({ ...form, destination: d })}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${form.destination === d ? 'bg-sand-500 text-white border-sand-500' : 'border-gray-200 dark:border-[#2a3a50] text-gray-600 dark:text-gray-400 hover:border-sand-300 hover:text-sand-600'}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1 – Dates & Budget */}
          {step === 1 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-gray-800 dark:text-white mb-1">When & How Much?</h2>
              <p className="text-gray-400 text-sm mb-6">Set your travel dates and budget</p>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Start Date *</label>
                    <div className="relative">
                      <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                      <input type="date" required value={form.startDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={e => setForm({ ...form, startDate: e.target.value })}
                        className="w-full pl-10 pr-4 py-3.5 rounded-2xl border-2 border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm focus:border-sand-400 transition-colors"/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">End Date *</label>
                    <div className="relative">
                      <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                      <input type="date" required value={form.endDate}
                        min={form.startDate || new Date().toISOString().split('T')[0]}
                        onChange={e => setForm({ ...form, endDate: e.target.value })}
                        className="w-full pl-10 pr-4 py-3.5 rounded-2xl border-2 border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm focus:border-sand-400 transition-colors"/>
                    </div>
                  </div>
                </div>

                {days > 0 && (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-sand-50 dark:bg-sand-900/20 border border-sand-100 dark:border-sand-900/40">
                    <PlaneTakeoff size={16} className="text-sand-500"/>
                    <span className="text-sand-700 dark:text-sand-300 text-sm font-medium">
                      {days} day{days > 1 ? 's' : ''} trip · {Math.floor(form.budget / days)} per day budget
                    </span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Total Budget: <span className="text-sand-600">${form.budget.toLocaleString()}</span>
                  </label>
                  <input type="range" min={200} max={20000} step={100} value={form.budget}
                    onChange={e => setForm({ ...form, budget: parseInt(e.target.value) })}
                    className="w-full accent-sand-500"/>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>$200</span><span>$20,000</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Number of Travelers</label>
                  <div className="flex gap-3">
                    {[1,2,3,4,5,6].map(n => (
                      <button key={n} type="button"
                        onClick={() => setForm({ ...form, travelersCount: n })}
                        className={`w-12 h-12 rounded-2xl text-sm font-bold transition-all border-2 ${form.travelersCount === n ? 'bg-sand-500 text-white border-sand-500 shadow-md' : 'border-gray-200 dark:border-[#2a3a50] text-gray-600 dark:text-gray-400 hover:border-sand-300'}`}>
                        {n}{n === 6 ? '+' : ''}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 – Interests */}
          {step === 2 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-gray-800 dark:text-white mb-1">What do you love?</h2>
              <p className="text-gray-400 text-sm mb-6">Select your interests so we can personalise your itinerary</p>

              <div className="grid grid-cols-2 gap-3">
                {INTERESTS.map(({ key, emoji, label, desc }) => {
                  const active = form.interests.includes(key);
                  return (
                    <button key={key} type="button" onClick={() => toggleInterest(key)}
                      className={`relative flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${active ? 'border-sand-400 bg-sand-50 dark:bg-sand-900/20 shadow-md' : 'border-gray-200 dark:border-[#2a3a50] hover:border-sand-200 dark:hover:border-sand-800'}`}>
                      <span className="text-2xl">{emoji}</span>
                      <div>
                        <div className={`font-semibold text-sm ${active ? 'text-sand-700 dark:text-sand-300' : 'text-gray-700 dark:text-gray-300'}`}>{label}</div>
                        <div className="text-xs text-gray-400">{desc}</div>
                      </div>
                      {active && (
                        <CheckCircle size={16} className="absolute top-2.5 right-2.5 text-sand-500 fill-sand-100"/>
                      )}
                    </button>
                  );
                })}
              </div>

              {form.interests.length > 0 && (
                <div className="mt-4 p-3 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/40 text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
                  <CheckCircle size={15}/>
                  {form.interests.length} interest{form.interests.length > 1 ? 's' : ''} selected — great choice!
                </div>
              )}
            </div>
          )}

          {/* Step 3 – Review */}
          {step === 3 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-gray-800 dark:text-white mb-1">Review Your Trip</h2>
              <p className="text-gray-400 text-sm mb-6">Everything look good? We'll generate your AI itinerary instantly.</p>

              {/* Hero preview */}
              <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
                <img
                  src={`https://source.unsplash.com/800x400/?${encodeURIComponent(form.destination)},travel`}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="trip-card-overlay absolute inset-0"/>
                <div className="absolute bottom-4 left-5">
                  <h3 className="font-display text-2xl font-bold text-white">{form.title || `Trip to ${form.destination}`}</h3>
                  <div className="flex items-center gap-1 text-white/70 text-sm mt-0.5">
                    <MapPin size={12}/> {form.destination}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { icon: MapPin,    label: 'Destination', value: form.destination },
                  { icon: Calendar,  label: 'Duration',    value: `${days} days` },
                  { icon: Wallet,    label: 'Budget',      value: `$${form.budget.toLocaleString()}` },
                  { icon: Users,     label: 'Travelers',   value: form.travelersCount },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-[#243045]">
                    <div className="w-9 h-9 rounded-xl bg-sand-100 dark:bg-sand-900/30 flex items-center justify-center">
                      <Icon size={16} className="text-sand-500"/>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">{label}</div>
                      <div className="font-semibold text-sm text-gray-800 dark:text-gray-200">{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {form.interests.length > 0 && (
                <div className="mb-5">
                  <div className="text-xs text-gray-400 mb-2">Selected interests</div>
                  <div className="flex flex-wrap gap-2">
                    {form.interests.map(i => {
                      const info = INTERESTS.find(x => x.key === i);
                      return (
                        <span key={i} className="badge bg-sand-100 dark:bg-sand-900/30 text-sand-700 dark:text-sand-300 px-3 py-1">
                          {info?.emoji} {info?.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-[#243045] transition-colors">
                <div className={`w-11 h-6 rounded-full relative transition-colors ${form.isPublic ? 'bg-sand-500' : 'bg-gray-200 dark:bg-[#2a3a50]'}`}
                  onClick={() => setForm({ ...form, isPublic: !form.isPublic })}>
                  <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${form.isPublic ? 'translate-x-5' : ''}`}/>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Share with community</div>
                  <div className="text-xs text-gray-400">Other travelers can discover and like your trip</div>
                </div>
              </label>

              <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-sand-50 to-ocean-50 dark:from-sand-900/20 dark:to-ocean-900/20 border border-sand-100 dark:border-[#2a3a50] flex items-center gap-3">
                <Sparkles size={18} className="text-sand-500 flex-shrink-0"/>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong className="text-sand-600 dark:text-sand-400">AI itinerary</strong> will be auto-generated with morning, afternoon & evening activities for each day.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => step === 0 ? navigate('/trips') : prev()}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 dark:border-[#2a3a50] text-gray-600 dark:text-gray-400 font-medium text-sm hover:bg-gray-50 dark:hover:bg-[#1a2535] transition-colors">
            <ArrowLeft size={16}/> {step === 0 ? 'Cancel' : 'Back'}
          </button>

          {step < 3 ? (
            <button onClick={next} disabled={!canNext}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sand-500 to-sand-600 text-white font-semibold text-sm hover:from-sand-600 hover:to-sand-700 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed">
              Continue <ArrowRight size={16}/>
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sand-500 to-sand-600 text-white font-semibold text-sm hover:from-sand-600 hover:to-sand-700 transition-all shadow-md disabled:opacity-60">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Generating...</>
                : <><Sparkles size={16}/> Generate Itinerary</>
              }
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
