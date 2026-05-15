import React, { useState, useEffect } from 'react';
import Layout from '../components/ui/Layout';
import { loyaltyAPI } from '../services/api';
import { Star, Trophy, Gift, Zap, TrendingUp, CheckCircle, Lock, Award } from 'lucide-react';
import toast from 'react-hot-toast';

const TIER_ICONS = { Explorer: '🧭', Wanderer: '🌿', Globetrotter: '🌍', Legend: '👑' };

function TierCard({ tier, active, current, nextPoints }) {
  return (
    <div className={`card p-5 relative overflow-hidden transition-all duration-300 ${active ? 'ring-2 ring-sand-400 shadow-glow-sand' : 'opacity-70'}`}>
      {active && (
        <div className="absolute top-3 right-3">
          <span className="badge bg-sand-100 dark:bg-sand-900/30 text-sand-600 dark:text-sand-400 text-[10px]">Current</span>
        </div>
      )}
      <div className="text-3xl mb-2">{TIER_ICONS[tier.name]}</div>
      <div className="font-display font-bold text-lg text-gray-800 dark:text-white mb-0.5">{tier.name}</div>
      <div className="text-xs text-gray-400 mb-3">{tier.minPoints.toLocaleString()}+ points</div>
      <div className="space-y-1.5">
        {tier.perks.map((p, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <CheckCircle size={11} className="text-green-500 flex-shrink-0"/>
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LoyaltyPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [earning, setEarning] = useState(null);

  useEffect(() => {
    loyaltyAPI.get().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  const earn = async (action) => {
    setEarning(action);
    try {
      const updated = await loyaltyAPI.earn(action);
      setData(updated);
      const act = data.actions.find(a => a.action === action);
      toast.success(`+${act?.points} points earned! ${act?.icon}`);
    } catch { toast.error('Could not earn points'); }
    finally { setEarning(null); }
  };

  if (loading) return (
    <Layout title="Rewards">
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => <div key={i} className="card h-32 shimmer-bg rounded-2xl"/>)}
      </div>
    </Layout>
  );

  if (!data) return <Layout title="Rewards"><div className="card p-8 text-center text-gray-400">Failed to load rewards</div></Layout>;

  const { tier, nextTier, points, totalEarned, progress, pointsToNext, history, actions, tiers, streak } = data;

  return (
    <Layout title="Rewards">
      {/* Hero points card */}
      <div className="relative rounded-3xl overflow-hidden mb-6 p-8"
        style={{ background: `linear-gradient(135deg, #0f1923 0%, ${tier.color}33 100%)` }}>
        <div className="absolute inset-0 hero-pattern opacity-20"/>
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">{TIER_ICONS[tier.name]}</span>
              <span className="font-semibold text-sm px-3 py-1 rounded-full text-white/80 border border-white/20">{tier.name}</span>
            </div>
            <div className="font-display text-6xl font-bold text-white leading-none mb-1">
              {points.toLocaleString()}
            </div>
            <div className="text-white/60 text-sm">Wanderly Points</div>
          </div>
          <div className="text-right">
            <div className="text-white/60 text-sm mb-1">Total earned</div>
            <div className="text-white font-bold text-2xl">{totalEarned.toLocaleString()}</div>
            <div className="flex items-center gap-1.5 mt-2 text-orange-400 text-sm">
              <Zap size={14}/> {streak}-day streak
            </div>
          </div>
        </div>

        {nextTier && (
          <div className="relative z-10 mt-6">
            <div className="flex items-center justify-between text-sm text-white/60 mb-2">
              <span>{tier.name}</span>
              <span>{pointsToNext.toLocaleString()} pts to {nextTier.name} {TIER_ICONS[nextTier.name]}</span>
            </div>
            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${tier.color}, #c4842a)` }}/>
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Earn points */}
          <div className="card p-6">
            <h3 className="font-display font-semibold text-gray-800 dark:text-white mb-1 flex items-center gap-2">
              <Zap size={18} className="text-sand-500"/> Earn Points
            </h3>
            <p className="text-xs text-gray-400 mb-4">Complete actions to earn Wanderly Points</p>
            <div className="grid grid-cols-2 gap-3">
              {(actions || []).map(({ action, points: pts, label, icon }) => (
                <button key={action} onClick={() => earn(action)} disabled={earning === action}
                  className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-100 dark:border-[#2a3a50] hover:border-sand-200 dark:hover:border-sand-800 hover:bg-sand-50 dark:hover:bg-sand-900/10 transition-all group text-left">
                  <span className="text-2xl">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{label}</div>
                    <div className="text-xs text-sand-500 font-bold">+{pts} pts</div>
                  </div>
                  {earning === action
                    ? <div className="w-4 h-4 border-2 border-sand-300 border-t-sand-600 rounded-full animate-spin"/>
                    : <Zap size={14} className="text-gray-300 group-hover:text-sand-400 transition-colors flex-shrink-0"/>}
                </button>
              ))}
            </div>
          </div>

          {/* History */}
          <div className="card p-6">
            <h3 className="font-display font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-ocean-500"/> Points History
            </h3>
            <div className="space-y-2">
              {(history || []).slice(0, 8).map(h => (
                <div key={h.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-[#2a3a50]/50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{h.label}</div>
                    <div className="text-xs text-gray-400">{new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <span className="text-sm font-bold text-green-500">+{h.points}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {/* Tier progress */}
          <div className="card p-5">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <Trophy size={16} className="text-sand-500"/> Tiers
            </h4>
            <div className="space-y-3">
              {(tiers || []).map(t => (
                <TierCard key={t.name} tier={t} active={t.name === tier?.name} current={points}/>
              ))}
            </div>
          </div>

          {/* Perks */}
          <div className="card p-5">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
              <Gift size={16} className="text-dusk-500"/> Your Perks
            </h4>
            <div className="space-y-2">
              {(tier?.perks || []).map((perk, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-sand-50 dark:bg-sand-900/20">
                  <CheckCircle size={14} className="text-sand-500 flex-shrink-0"/>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{perk}</span>
                </div>
              ))}
              {nextTier && nextTier.perks.map((perk, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-[#243045] opacity-50">
                  <Lock size={14} className="text-gray-400 flex-shrink-0"/>
                  <span className="text-sm text-gray-500">{perk}</span>
                  <span className="ml-auto text-xs text-gray-400">{nextTier.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
