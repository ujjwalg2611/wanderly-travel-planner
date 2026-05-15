import React, { useState } from 'react';
import Layout from '../components/ui/Layout';
import { Users, Plus, Trash2, Split, CheckCircle, ArrowRight, DollarSign, Calculator } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['🍽️ Food','🏨 Hotel','🚗 Transport','🎡 Activity','🛍️ Shopping','📋 Other'];

function avatarUrl(name) {
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`;
}

export default function ExpenseSplitPage() {
  const [members, setMembers] = useState(['You', 'Alex', 'Priya']);
  const [newMember, setNewMember] = useState('');
  const [expenses, setExpenses] = useState([
    { id: 1, title: 'Hotel Booking', amount: 12000, paidBy: 'You',   category: '🏨 Hotel',     splitWith: ['You','Alex','Priya'] },
    { id: 2, title: 'Dinner',        amount: 3600,  paidBy: 'Alex',  category: '🍽️ Food',      splitWith: ['You','Alex','Priya'] },
    { id: 3, title: 'Cab ride',      amount: 800,   paidBy: 'Priya', category: '🚗 Transport', splitWith: ['You','Priya'] },
  ]);
  const [form, setForm] = useState({ title: '', amount: '', paidBy: 'You', category: '🍽️ Food', splitWith: ['You','Alex','Priya'] });
  const [showAdd, setShowAdd] = useState(false);
  const [settled, setSettled] = useState([]);

  const addMember = () => {
    if (!newMember.trim()) return;
    if (members.includes(newMember.trim())) { toast.error('Already added'); return; }
    setMembers(m => [...m, newMember.trim()]);
    setForm(f => ({ ...f, splitWith: [...f.splitWith, newMember.trim()] }));
    setNewMember('');
  };

  const removeMember = (m) => {
    if (m === 'You') { toast.error("Can't remove yourself"); return; }
    setMembers(ms => ms.filter(x => x !== m));
    setExpenses(es => es.map(e => ({ ...e, splitWith: e.splitWith.filter(x => x !== m) })));
  };

  const addExpense = () => {
    if (!form.title || !form.amount || form.splitWith.length === 0) { toast.error('Fill all fields'); return; }
    setExpenses(es => [...es, { ...form, id: Date.now(), amount: parseFloat(form.amount) }]);
    setForm(f => ({ ...f, title: '', amount: '' }));
    setShowAdd(false);
    toast.success('Expense added!');
  };

  const toggleSplit = (m) => {
    setForm(f => ({
      ...f,
      splitWith: f.splitWith.includes(m) ? f.splitWith.filter(x => x !== m) : [...f.splitWith, m]
    }));
  };

  // Calculate balances
  const balances = {};
  members.forEach(m => { balances[m] = 0; });
  expenses.forEach(exp => {
    const perPerson = exp.amount / exp.splitWith.length;
    exp.splitWith.forEach(m => {
      balances[m] = (balances[m] || 0) - perPerson;
    });
    balances[exp.paidBy] = (balances[exp.paidBy] || 0) + exp.amount;
  });

  // Calculate settlements
  const settlements = [];
  const pos = members.filter(m => balances[m] > 0.01).map(m => ({ name: m, amount: balances[m] }));
  const neg = members.filter(m => balances[m] < -0.01).map(m => ({ name: m, amount: Math.abs(balances[m]) }));
  let pi = 0, ni = 0;
  while (pi < pos.length && ni < neg.length) {
    const amt = Math.min(pos[pi].amount, neg[ni].amount);
    settlements.push({ from: neg[ni].name, to: pos[pi].name, amount: amt });
    pos[pi].amount -= amt;
    neg[ni].amount -= amt;
    if (pos[pi].amount < 0.01) pi++;
    if (neg[ni].amount < 0.01) ni++;
  }

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <Layout title="Expense Split">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Members & Expenses */}
        <div className="lg:col-span-2 space-y-5">
          {/* Members */}
          <div className="card p-5">
            <h3 className="font-display font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Users size={18} className="text-sand-500"/> Group Members
            </h3>
            <div className="flex flex-wrap gap-3 mb-4">
              {members.map(m => (
                <div key={m} className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-gray-50 dark:bg-[#243045] border border-gray-200 dark:border-[#2a3a50]">
                  <img src={avatarUrl(m)} alt={m} className="w-7 h-7 rounded-full bg-sand-100"/>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{m}</span>
                  {m !== 'You' && (
                    <button onClick={() => removeMember(m)} className="text-gray-300 hover:text-red-400 transition-colors">
                      <Trash2 size={12}/>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="Add member name..." value={newMember}
                onChange={e => setNewMember(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addMember()}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm focus:border-sand-400"/>
              <button onClick={addMember}
                className="px-4 py-2 bg-sand-500 text-white rounded-xl text-sm font-medium hover:bg-sand-600 transition-colors">
                <Plus size={15}/>
              </button>
            </div>
          </div>

          {/* Expenses list */}
          <div className="card overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-[#2a3a50] flex items-center justify-between">
              <h3 className="font-display font-semibold text-gray-800 dark:text-white">Expenses</h3>
              <button onClick={() => setShowAdd(!showAdd)}
                className="flex items-center gap-2 px-3 py-2 bg-sand-500 text-white rounded-xl text-sm font-medium hover:bg-sand-600 transition-colors">
                <Plus size={14}/> Add
              </button>
            </div>

            {showAdd && (
              <div className="p-5 border-b border-gray-100 dark:border-[#2a3a50] bg-sand-50/30 dark:bg-sand-900/10 space-y-3 animate-fade-in">
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="What was it for?" value={form.title}
                    onChange={e => setForm({...form, title: e.target.value})}
                    className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm focus:border-sand-400"/>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                    <input type="number" placeholder="Amount" value={form.amount}
                      onChange={e => setForm({...form, amount: e.target.value})}
                      className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm focus:border-sand-400"/>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Paid by</label>
                    <select value={form.paidBy} onChange={e => setForm({...form, paidBy: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm">
                      {members.map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Category</label>
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-[#2a3a50] bg-white dark:bg-[#243045] text-gray-800 dark:text-gray-200 text-sm">
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Split with</label>
                  <div className="flex gap-2 flex-wrap">
                    {members.map(m => (
                      <button key={m} onClick={() => toggleSplit(m)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${form.splitWith.includes(m) ? 'bg-sand-500 text-white border-sand-500' : 'border-gray-200 dark:border-[#2a3a50] text-gray-600 dark:text-gray-400'}`}>
                        {m}
                      </button>
                    ))}
                  </div>
                  {form.splitWith.length > 0 && (
                    <div className="text-xs text-gray-400 mt-1.5">
                      ₹{form.amount ? (parseFloat(form.amount) / form.splitWith.length).toFixed(0) : 0} per person
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowAdd(false)}
                    className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-[#2a3a50] text-gray-600 dark:text-gray-400 text-sm hover:bg-gray-50 dark:hover:bg-[#243045]">Cancel</button>
                  <button onClick={addExpense}
                    className="flex-1 py-2 rounded-xl bg-sand-500 text-white text-sm font-medium hover:bg-sand-600 transition-colors">Add Expense</button>
                </div>
              </div>
            )}

            <div className="divide-y divide-gray-50 dark:divide-[#2a3a50]">
              {expenses.map(exp => {
                const perPerson = (exp.amount / exp.splitWith.length).toFixed(0);
                return (
                  <div key={exp.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-[#243045] transition-colors group">
                    <div className="text-2xl w-10 text-center flex-shrink-0">{exp.category.split(' ')[0]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-800 dark:text-gray-200">{exp.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        Paid by <span className="font-medium text-gray-600 dark:text-gray-300">{exp.paidBy}</span>
                        {' · '}Split {exp.splitWith.length} ways (₹{perPerson}/person)
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-800 dark:text-white">₹{exp.amount.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">{exp.category.split(' ').slice(1).join(' ')}</div>
                    </div>
                    <button onClick={() => setExpenses(es => es.filter(e => e.id !== exp.id))}
                      className="text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0">
                      <Trash2 size={14}/>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Summary & Settlements */}
        <div className="space-y-5">
          {/* Total */}
          <div className="card p-5">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Spent</div>
            <div className="font-display text-3xl font-bold text-gray-800 dark:text-white mb-3">₹{total.toLocaleString()}</div>
            <div className="space-y-2">
              {members.map(m => (
                <div key={m} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <img src={avatarUrl(m)} alt={m} className="w-6 h-6 rounded-full"/>
                    <span className="text-gray-600 dark:text-gray-400">{m}</span>
                  </div>
                  <span className={`font-semibold ${balances[m] > 0.01 ? 'text-green-500' : balances[m] < -0.01 ? 'text-red-500' : 'text-gray-400'}`}>
                    {balances[m] > 0.01 ? '+' : ''}₹{Math.abs(balances[m] || 0).toFixed(0)}
                    <span className="text-xs font-normal text-gray-400 ml-1">{balances[m] > 0.01 ? 'gets back' : balances[m] < -0.01 ? 'owes' : 'settled'}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Settlements */}
          <div className="card p-5">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
              <Split size={15} className="text-ocean-500"/> Settlements
            </h4>
            {settlements.length === 0 ? (
              <div className="text-center py-4">
                <CheckCircle size={28} className="mx-auto text-green-400 mb-2"/>
                <p className="text-sm text-gray-500">Everyone's settled up! 🎉</p>
              </div>
            ) : (
              <div className="space-y-3">
                {settlements.map((s, i) => (
                  <div key={i} className={`p-3 rounded-xl border transition-all ${settled.includes(i) ? 'opacity-50 border-gray-100 dark:border-[#2a3a50]' : 'border-orange-100 dark:border-orange-900/30 bg-orange-50 dark:bg-orange-900/10'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <img src={avatarUrl(s.from)} alt={s.from} className="w-7 h-7 rounded-full"/>
                      <ArrowRight size={14} className="text-gray-400"/>
                      <img src={avatarUrl(s.to)} alt={s.to} className="w-7 h-7 rounded-full"/>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{s.from}</span>
                        <span className="text-xs text-gray-400"> pays </span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{s.to}</span>
                      </div>
                      <span className="font-bold text-orange-600 dark:text-orange-400">₹{s.amount.toFixed(0)}</span>
                    </div>
                    {!settled.includes(i) && (
                      <button onClick={() => { setSettled(p => [...p, i]); toast.success('Marked as settled! ✅'); }}
                        className="w-full py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-1.5">
                        <CheckCircle size={12}/> Mark Settled
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Per person summary */}
          <div className="card p-5">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
              <Calculator size={15} className="text-forest-500"/> Per Person
            </h4>
            <div className="space-y-2">
              {members.map(m => {
                const paid = expenses.filter(e => e.paidBy === m).reduce((s, e) => s + e.amount, 0);
                const share = expenses.reduce((s, e) => e.splitWith.includes(m) ? s + e.amount / e.splitWith.length : s, 0);
                return (
                  <div key={m} className="p-3 rounded-xl bg-gray-50 dark:bg-[#243045]">
                    <div className="flex items-center gap-2 mb-1">
                      <img src={avatarUrl(m)} alt={m} className="w-6 h-6 rounded-full"/>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{m}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Paid: <b className="text-gray-700 dark:text-gray-300">₹{paid.toFixed(0)}</b></span>
                      <span>Share: <b className="text-gray-700 dark:text-gray-300">₹{share.toFixed(0)}</b></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
