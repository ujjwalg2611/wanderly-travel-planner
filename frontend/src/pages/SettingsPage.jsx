import React, { useState } from 'react';
import Layout from '../components/ui/Layout';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  User, Bell, Shield, Palette, Globe, LogOut, Save,
  Sun, Moon, Camera, Mail, MapPin, FileText, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

const TABS = [
  { key: 'profile',    icon: User,    label: 'Profile' },
  { key: 'appearance', icon: Palette, label: 'Appearance' },
  { key: 'notifications', icon: Bell, label: 'Notifications' },
  { key: 'privacy',    icon: Shield,  label: 'Privacy & Security' },
];

const CURRENCIES = ['USD ($)', 'EUR (€)', 'GBP (£)', 'JPY (¥)', 'INR (₹)', 'AUD (A$)', 'CAD (C$)'];
const LANGUAGES  = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Portuguese', 'Hindi'];

function Toggle({ value, onChange, label, desc }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-[#2a3a50] last:border-0">
      <div>
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</div>
        {desc && <div className="text-xs text-gray-400 mt-0.5">{desc}</div>}
      </div>
      <button onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full relative transition-colors duration-200 flex-shrink-0 ml-4 ${value ? 'bg-sand-500' : 'bg-gray-200 dark:bg-[#2a3a50]'}`}>
        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${value ? 'translate-x-5' : ''}`}/>
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { user, updateProfile, logout } = useAuth();
  const { dark, toggle: toggleDark } = useTheme();
  const [tab, setTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    email: user?.email || '',
  });

  const [prefs, setPrefs] = useState({
    currency: 'USD ($)', language: 'English', units: 'metric',
  });

  const [notifs, setNotifs] = useState({
    tripReminders: true, weatherAlerts: true, budgetAlerts: true,
    socialActivity: false, weeklyDigest: true, newFollowers: true,
    tripComments: true, marketing: false,
  });

  const [privacy, setPrivacy] = useState({
    publicProfile: true, showTrips: true, showExpenses: false,
    allowFollowers: true, twoFactor: false,
  });

  const saveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({ name: profile.name, bio: profile.bio, location: profile.location });
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to save');
    } finally { setSaving(false); }
  };

  return (
    <Layout title="Settings">
      <div className="max-w-3xl mx-auto">
        <div className="flex gap-6">
          {/* Sidebar tabs */}
          <div className="w-48 flex-shrink-0 space-y-1">
            {TABS.map(({ key, icon: Icon, label }) => (
              <button key={key} onClick={() => setTab(key)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === key ? 'bg-sand-50 dark:bg-sand-900/20 text-sand-600 dark:text-sand-400 border border-sand-100 dark:border-sand-900/40' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a2535]'}`}>
                <Icon size={16}/> {label}
              </button>
            ))}
            <button onClick={() => { logout(); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors mt-4">
              <LogOut size={16}/> Sign Out
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-5 animate-fade-in">

            {/* ── PROFILE ── */}
            {tab === 'profile' && (
              <>
                <div className="card p-6">
                  <h3 className="font-display font-semibold text-gray-800 dark:text-white mb-5">Public Profile</h3>

                  {/* Avatar */}
                  <div className="flex items-center gap-5 mb-6">
                    <div className="relative">
                      <img src={user?.avatar} alt={user?.name}
                        className="w-20 h-20 rounded-2xl object-cover bg-sand-100 dark:bg-[#243045] ring-4 ring-sand-100 dark:ring-sand-900/40"/>
                      <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-sand-500 rounded-xl flex items-center justify-center shadow-md hover:bg-sand-600 transition-colors">
                        <Camera size={13} className="text-white"/>
                      </button>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-gray-200">{user?.name}</div>
                      <div className="text-sm text-gray-400">{user?.email}</div>
                      <div className="text-xs text-sand-500 mt-1">Member since 2024</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
                        <div className="relative">
                          <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
                          <input type="text" value={profile.name}
                            onChange={e => setProfile({ ...profile, name: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm focus:border-sand-400 transition-colors"/>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Email</label>
                        <div className="relative">
                          <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
                          <input type="email" value={profile.email} disabled
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-100 dark:border-[#2a3a50] bg-gray-50 dark:bg-[#1a2535] text-gray-400 text-sm cursor-not-allowed"/>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Location</label>
                      <div className="relative">
                        <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <input type="text" placeholder="e.g. San Francisco, CA" value={profile.location}
                          onChange={e => setProfile({ ...profile, location: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm focus:border-sand-400 transition-colors"/>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Bio</label>
                      <div className="relative">
                        <FileText size={14} className="absolute left-3.5 top-3 text-gray-400"/>
                        <textarea rows={3} placeholder="Tell the community about yourself..."
                          value={profile.bio}
                          onChange={e => setProfile({ ...profile, bio: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm focus:border-sand-400 transition-colors resize-none"/>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-5">
                    <button onClick={saveProfile} disabled={saving}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sand-500 to-sand-600 text-white rounded-xl font-medium text-sm hover:from-sand-600 hover:to-sand-700 transition-all shadow-md disabled:opacity-60">
                      {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <><Save size={14}/> Save Changes</>}
                    </button>
                  </div>
                </div>

                {/* Preferences */}
                <div className="card p-6">
                  <h3 className="font-display font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2"><Globe size={16}/> Preferences</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Currency</label>
                      <select value={prefs.currency} onChange={e => setPrefs({ ...prefs, currency: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm">
                        {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Language</label>
                      <select value={prefs.language} onChange={e => setPrefs({ ...prefs, language: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm">
                        {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Units</label>
                      <select value={prefs.units} onChange={e => setPrefs({ ...prefs, units: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm">
                        <option value="metric">Metric (km, °C)</option>
                        <option value="imperial">Imperial (mi, °F)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── APPEARANCE ── */}
            {tab === 'appearance' && (
              <div className="card p-6">
                <h3 className="font-display font-semibold text-gray-800 dark:text-white mb-5">Appearance</h3>

                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</div>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => dark && toggleDark()}
                      className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all ${!dark ? 'border-sand-400 bg-sand-50' : 'border-gray-200 dark:border-[#2a3a50] hover:border-gray-300'}`}>
                      <div className="w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center">
                        <Sun size={20} className="text-yellow-500"/>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-sm text-gray-800 dark:text-gray-200">Light</div>
                        <div className="text-xs text-gray-400">Bright & clean</div>
                      </div>
                      {!dark && <Check size={16} className="ml-auto text-sand-500"/>}
                    </button>
                    <button onClick={() => !dark && toggleDark()}
                      className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all ${dark ? 'border-sand-400 bg-sand-900/20' : 'border-gray-200 dark:border-[#2a3a50] hover:border-gray-300'}`}>
                      <div className="w-10 h-10 rounded-xl bg-[#1a2535] shadow-md flex items-center justify-center">
                        <Moon size={20} className="text-blue-400"/>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-sm text-gray-800 dark:text-gray-200">Dark</div>
                        <div className="text-xs text-gray-400">Easy on the eyes</div>
                      </div>
                      {dark && <Check size={16} className="ml-auto text-sand-500"/>}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Accent Color</div>
                  <div className="flex gap-3">
                    {[
                      { name: 'Sand', bg: 'bg-sand-500' },
                      { name: 'Ocean', bg: 'bg-ocean-500' },
                      { name: 'Forest', bg: 'bg-forest-500' },
                      { name: 'Dusk', bg: 'bg-dusk-500' },
                      { name: 'Coral', bg: 'bg-coral-500' },
                    ].map(({ name, bg }) => (
                      <button key={name} title={name}
                        className={`w-9 h-9 rounded-xl ${bg} hover:scale-110 transition-transform shadow-sm`}/>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {tab === 'notifications' && (
              <div className="card p-6">
                <h3 className="font-display font-semibold text-gray-800 dark:text-white mb-1">Notifications</h3>
                <p className="text-sm text-gray-400 mb-5">Choose what you want to be notified about</p>
                <div>
                  {[
                    { key: 'tripReminders',  label: 'Trip Reminders',    desc: 'Alerts before your trips start' },
                    { key: 'weatherAlerts',  label: 'Weather Alerts',    desc: 'Weather updates for your destinations' },
                    { key: 'budgetAlerts',   label: 'Budget Alerts',     desc: 'Notify when nearing budget limit' },
                    { key: 'socialActivity', label: 'Social Activity',   desc: 'Likes and comments on your trips' },
                    { key: 'newFollowers',   label: 'New Followers',     desc: 'When someone follows you' },
                    { key: 'tripComments',   label: 'Trip Comments',     desc: 'When someone comments on your trips' },
                    { key: 'weeklyDigest',   label: 'Weekly Digest',     desc: 'Weekly summary of your travel activity' },
                    { key: 'marketing',      label: 'Promotions',        desc: 'Deals, tips and travel inspiration' },
                  ].map(({ key, label, desc }) => (
                    <Toggle key={key} value={notifs[key]} label={label} desc={desc}
                      onChange={v => setNotifs({ ...notifs, [key]: v })}/>
                  ))}
                </div>
                <div className="flex justify-end mt-5">
                  <button onClick={() => toast.success('Notification preferences saved!')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sand-500 to-sand-600 text-white rounded-xl font-medium text-sm hover:from-sand-600 hover:to-sand-700 transition-all shadow-md">
                    <Save size={14}/> Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* ── PRIVACY ── */}
            {tab === 'privacy' && (
              <>
                <div className="card p-6">
                  <h3 className="font-display font-semibold text-gray-800 dark:text-white mb-1">Privacy</h3>
                  <p className="text-sm text-gray-400 mb-5">Control your data and visibility</p>
                  {[
                    { key: 'publicProfile', label: 'Public Profile',    desc: 'Allow others to find and view your profile' },
                    { key: 'showTrips',     label: 'Show Trips',        desc: 'Make your trips visible on your profile' },
                    { key: 'showExpenses',  label: 'Show Expenses',     desc: 'Show spending stats on public profile' },
                    { key: 'allowFollowers',label: 'Allow Followers',   desc: 'Let other users follow you' },
                  ].map(({ key, label, desc }) => (
                    <Toggle key={key} value={privacy[key]} label={label} desc={desc}
                      onChange={v => setPrivacy({ ...privacy, [key]: v })}/>
                  ))}
                </div>

                <div className="card p-6">
                  <h3 className="font-display font-semibold text-gray-800 dark:text-white mb-1">Security</h3>
                  <p className="text-sm text-gray-400 mb-5">Keep your account safe</p>
                  <Toggle value={privacy.twoFactor} label="Two-Factor Authentication"
                    desc="Add an extra layer of security to your account"
                    onChange={v => { setPrivacy({ ...privacy, twoFactor: v }); toast.success(v ? '2FA enabled!' : '2FA disabled'); }}/>
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#2a3a50] space-y-2">
                    <button className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2a3a50] text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#243045] transition-colors">
                      Change Password →
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2a3a50] text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#243045] transition-colors">
                      Download My Data →
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/40 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                      Delete Account →
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </Layout>
  );
}
