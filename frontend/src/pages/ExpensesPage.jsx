import React, { useState, useEffect } from 'react';
import Layout from '../components/ui/Layout';
import { tripsAPI, expensesAPI } from '../services/api';
import { Plus, Trash2, Wallet, TrendingUp, PieChart, Receipt } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import toast from 'react-hot-toast';

const CATEGORIES = ['hotel', 'food', 'transport', 'activities', 'shopping', 'other'];
const CATEGORY_COLORS = { hotel: '#c4842a', food: '#2c9eef', transport: '#22c55e', activities: '#d946ef', shopping: '#f59e0b', other: '#94a3b8' };
const CATEGORY_EMOJIS = { hotel: '🏨', food: '🍽️', transport: '🚗', activities: '🎡', shopping: '🛍️', other: '📋' };

function AddExpenseModal({ trips, onAdd, onClose }) {
  const [form, setForm] = useState({ tripId: trips[0]?.id || '', title: '', amount: '', category: 'food', date: new Date().toISOString().split('T')[0], notes: '', paidBy: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tripId) { toast.error('Select a trip'); return; }
    setLoading(true);
    try {
      const exp = await expensesAPI.add(form.tripId, form);
      onAdd(exp);
      toast.success('Expense added!');
      onClose();
    } catch { toast.error('Failed to add expense'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1a2535] rounded-3xl w-full max-w-md shadow-2xl animate-slide-up">
        <div className="p-6 border-b border-gray-100 dark:border-[#2a3a50]">
          <h2 className="font-display text-xl font-bold text-gray-800 dark:text-white">Add Expense 💰</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Trip</label>
            <select value={form.tripId} onChange={e => setForm({...form, tripId: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm">
              {trips.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Title</label>
              <input type="text" placeholder="Hotel booking" required value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Amount ($)</label>
              <input type="number" step="0.01" required placeholder="0.00" value={form.amount}
                onChange={e => setForm({...form, amount: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm"/>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm">
                {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_EMOJIS[c]} {c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Date</label>
              <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm"/>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Paid By</label>
            <input type="text" placeholder="Your name" value={form.paidBy}
              onChange={e => setForm({...form, paidBy: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm"/>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-[#2a3a50] text-gray-600 dark:text-gray-400 font-medium text-sm hover:bg-gray-50 dark:hover:bg-[#243045]">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sand-500 to-sand-600 text-white font-semibold text-sm hover:from-sand-600 hover:to-sand-700 disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <><Plus size={14}/> Add Expense</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ExpensesPage() {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState('all');
  const [expenses, setExpenses] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripsAPI.getAll().then(t => {
      setTrips(t);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedTrip !== 'all' && trips.length) {
      expensesAPI.get(selectedTrip).then(r => setExpenses(r.expenses || []));
    } else {
      setExpenses([]);
    }
  }, [selectedTrip, trips]);

  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const pieData = Object.entries(byCategory).map(([name, value]) => ({ name, value }));
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const selectedTripData = trips.find(t => t.id === selectedTrip);
  const budget = selectedTripData?.budget || 0;

  return (
    <Layout title="Expense Tracker">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2 items-center">
          <select value={selectedTrip} onChange={e => setSelectedTrip(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#1a2535] text-gray-700 dark:text-gray-300 text-sm">
            <option value="all">All Trips</option>
            {trips.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>
        <button onClick={() => setShowAdd(true)} disabled={trips.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sand-500 to-sand-600 text-white rounded-xl font-medium text-sm hover:from-sand-600 hover:to-sand-700 transition-all shadow-md disabled:opacity-50">
          <Plus size={16}/> Add Expense
        </button>
      </div>

      {selectedTrip === 'all' ? (
        <div className="card p-16 text-center">
          <Wallet size={48} className="mx-auto text-gray-300 mb-4"/>
          <h3 className="font-display text-xl text-gray-500 mb-2">Select a trip to view expenses</h3>
          <p className="text-gray-400">Choose a trip from the dropdown to track and manage expenses</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Summary */}
          <div className="space-y-4">
            <div className="card p-5">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 text-sm flex items-center gap-2"><PieChart size={14}/> Budget Overview</h4>
              <div className="text-center mb-2">
                <div className="text-3xl font-display font-bold text-gray-800 dark:text-white">${total.toFixed(2)}</div>
                <div className="text-xs text-gray-400 mt-0.5">of ${budget} budget</div>
              </div>
              {budget > 0 && (
                <div className="budget-bar mb-3">
                  <div className="budget-fill" style={{ width: `${Math.min(100, (total/budget)*100)}%` }}/>
                </div>
              )}
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Spent</span><span className="font-semibold text-red-500">${total.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Remaining</span><span className="font-semibold text-green-500">${Math.max(0, budget - total).toFixed(2)}</span></div>
              </div>
            </div>

            {pieData.length > 0 && (
              <div className="card p-5">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 text-sm">By Category</h4>
                <ResponsiveContainer width="100%" height={160}>
                  <RechartsPie>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
                      {pieData.map((entry, i) => <Cell key={i} fill={CATEGORY_COLORS[entry.name] || '#94a3b8'}/>)}
                    </Pie>
                    <Tooltip formatter={v => [`$${v.toFixed(2)}`, '']}/>
                  </RechartsPie>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {pieData.map(({ name, value }) => (
                    <div key={name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: CATEGORY_COLORS[name] }}/>
                        <span className="capitalize text-gray-600 dark:text-gray-400">{CATEGORY_EMOJIS[name]} {name}</span>
                      </div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">${value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Expense list */}
          <div className="lg:col-span-2">
            <div className="card overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-[#2a3a50] flex items-center justify-between">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2"><Receipt size={14}/> Transactions ({expenses.length})</h4>
              </div>
              {expenses.length === 0 ? (
                <div className="p-12 text-center">
                  <Receipt size={32} className="mx-auto text-gray-300 mb-3"/>
                  <p className="text-gray-400">No expenses yet. Add your first expense!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50 dark:divide-[#2a3a50]">
                  {expenses.map(exp => (
                    <div key={exp.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-[#243045] transition-colors">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background: `${CATEGORY_COLORS[exp.category]}20` }}>
                        {CATEGORY_EMOJIS[exp.category]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 dark:text-gray-200 text-sm truncate">{exp.title}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{exp.date} · Paid by {exp.paidBy || 'You'}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-semibold text-gray-800 dark:text-gray-200">${exp.amount.toFixed(2)}</div>
                        <div className="text-xs capitalize" style={{ color: CATEGORY_COLORS[exp.category] }}>{exp.category}</div>
                      </div>
                      <button onClick={() => {
                        expensesAPI.delete(selectedTrip, exp.id);
                        setExpenses(e => e.filter(x => x.id !== exp.id));
                        toast.success('Removed');
                      }} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 ml-2">
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showAdd && (
        <AddExpenseModal trips={trips} onAdd={e => setExpenses(prev => [...prev, e])} onClose={() => setShowAdd(false)}/>
      )}
    </Layout>
  );
}
