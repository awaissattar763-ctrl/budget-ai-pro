'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  History, 
  Settings, 
  Plus, 
  TrendingDown, 
  TrendingUp, 
  Wallet, 
  BrainCircuit, 
  PieChart as PieIcon, 
  BarChart3,
  Trash2,
  ChevronRight,
  Search,
  Bell,
  Menu,
  X
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts'

// ── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

const CATEGORIES = [
  { label: 'Food', icon: '🍔', color: '#00ff88' },
  { label: 'Transport', icon: '🚗', color: '#3b82f6' },
  { label: 'Shopping', icon: '🛍️', color: '#f59e0b' },
  { label: 'Health', icon: '💊', color: '#ef4444' },
  { label: 'Entertainment', icon: '🎮', color: '#8b5cf6' },
  { label: 'Bills', icon: '📄', color: '#ec4899' },
  { label: 'Income', icon: '💰', color: '#10b981' },
  { label: 'Other', icon: '📦', color: '#64748b' },
]

const CAT_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.label, c]))

const uid = () => Math.random().toString(36).slice(2, 9)

const SEED = [
  { id: uid(), desc: 'Tech Office Rent', amount: -1200, category: 'Bills', date: '2025-04-28' },
  { id: uid(), desc: 'Cloud Services', amount: -250, category: 'Bills', date: '2025-04-27' },
  { id: uid(), desc: 'Client Project A', amount: 4500, category: 'Income', date: '2025-04-25' },
  { id: uid(), desc: 'Hardware Upgrade', amount: -850, category: 'Shopping', date: '2025-04-22' },
  { id: uid(), desc: 'Business Dinner', amount: -120, category: 'Food', date: '2025-04-20' },
  { id: uid(), desc: 'AI Subscription', amount: -40, category: 'Entertainment', date: '2025-04-18' },
  { id: uid(), desc: 'Commute', amount: -45, category: 'Transport', date: '2025-04-15' },
  { id: uid(), desc: 'Freelance Gig', amount: 800, category: 'Income', date: '2025-04-08' },
]

// ── Components ───────────────────────────────────────────────────────────────

const MetricCard = ({ title, value, subtext, icon: Icon, trend, color = 'var(--accent-neon)' }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden group"
  >
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <Icon size={64} style={{ color }} />
    </div>
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-opacity-10" style={{ backgroundColor: `${color}22` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <span className="text-sm font-medium text-gray-400">{title}</span>
    </div>
    <div className="flex flex-col">
      <span className="text-2xl font-bold tracking-tight">{value}</span>
      <div className="flex items-center gap-2 mt-1">
        {trend && (
          <span className={`text-xs font-bold ${trend > 0 ? 'text-green-400' : 'text-red-400'} flex items-center`}>
            {trend > 0 ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
            {Math.abs(trend)}%
          </span>
        )}
        <span className="text-xs text-gray-500">{subtext}</span>
      </div>
    </div>
  </motion.div>
)

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-[#00ff881a] text-[#00ff88] border border-[#00ff8826]' 
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
)

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function FinancialDashboard() {
  const [txns, setTxns] = useState(SEED)
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [insight, setInsight] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [form, setForm] = useState({ desc: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0], type: 'expense' })

  // Derived Data
  const income = useMemo(() => txns.filter(t => t.amount > 0).reduce((a, t) => a + t.amount, 0), [txns])
  const expenses = useMemo(() => txns.filter(t => t.amount < 0).reduce((a, t) => a + Math.abs(t.amount), 0), [txns])
  const balance = income - expenses
  const burnRate = useMemo(() => expenses / 30, [expenses])
  const predictedSavings = useMemo(() => (income * 0.2) + (Math.random() * 50), [income])

  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    return months.map((m, i) => ({
      name: m,
      spend: Math.abs(txns.filter(t => t.amount < 0 && new Date(t.date).getMonth() === (new Date().getMonth() - (5 - i))).reduce((a, b) => a + b.amount, 0)) || Math.random() * 1000 + 500,
      income: txns.filter(t => t.amount > 0 && new Date(t.date).getMonth() === (new Date().getMonth() - (5 - i))).reduce((a, b) => a + b.amount, 0) || Math.random() * 2000 + 3000
    }))
  }, [txns])

  const categoryData = useMemo(() => {
    return CATEGORIES.filter(c => c.label !== 'Income').map(c => ({
      name: c.label,
      value: txns.filter(t => t.category === c.label && t.amount < 0).reduce((a, b) => a + Math.abs(b.amount), 0),
      color: c.color
    })).filter(d => d.value > 0)
  }, [txns])

  const getAIInsights = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions: txns, budget: 3000 }),
      })
      const data = await res.json()
      setInsight(data.insight)
    } catch (error) {
      setInsight("Unable to connect to AI Brain. Check configuration.")
    } finally {
      setLoading(false)
    }
  }

  // Effect: Update insights when transactions change
  useEffect(() => {
    const timer = setTimeout(() => {
      getAIInsights()
    }, 1500)
    return () => clearTimeout(timer)
  }, [txns.length])

  const handleAddTxn = (e) => {
    e.preventDefault()
    if (!form.desc || !form.amount) return
    const amt = parseFloat(form.amount) * (form.type === 'expense' ? -1 : 1)
    setTxns([{ ...form, id: uid(), amount: amt }, ...txns])
    setForm({ ...form, desc: '', amount: '' })
  }

  return (
    <div className="flex min-h-screen bg-[#0a0b0e] text-gray-100 font-sans">
      <style>{`
        .glass-card {
          background: rgba(22, 27, 34, 0.4);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 1.25rem;
        }
        .neon-accent { color: #00ff88; }
        .bg-neon-accent { background-color: #00ff88; }
        .sidebar-item-active { background: rgba(0, 255, 136, 0.1); color: #00ff88; border-right: 2px solid #00ff88; }
        input, select { background: rgba(255,255,255,0.05) !important; border: 1px solid rgba(255,255,255,0.1) !important; color: white !important; }
        input:focus { border-color: #00ff88 !important; outline: none; }
      `}</style>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0d1117] border-r border-white/5 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-neon-accent flex items-center justify-center text-black shadow-[0_0_20px_rgba(0,255,136,0.3)]">
              <BrainCircuit size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tighter">FIN-IQ</h1>
          </div>

          <nav className="flex-1 space-y-2">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} />
            <SidebarItem icon={History} label="History" active={activeTab === 'History'} onClick={() => setActiveTab('History')} />
            <SidebarItem icon={Settings} label="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} />
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="glass-card p-4">
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">Pro Plan</p>
              <div className="h-1.5 w-full bg-white/5 rounded-full mb-3 overflow-hidden">
                <div className="h-full bg-neon-accent w-3/4 rounded-full"></div>
              </div>
              <button className="w-full py-2 text-xs font-bold text-black bg-neon-accent rounded-lg hover:brightness-110 transition-all">
                Upgrade Intelligence
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Intelligence Dashboard</h2>
            <p className="text-gray-400">Welcome back, analyze your financial flow today.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm w-64"
              />
            </div>
            <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-neon-accent rounded-full border-2 border-[#0a0b0e]"></span>
            </button>
          </div>
        </header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard 
            title="Total Net Worth" 
            value={fmt(balance)} 
            subtext="Available Liquidity" 
            icon={Wallet} 
            trend={+12.5} 
            color="#00ff88"
          />
          <MetricCard 
            title="Monthly Burn Rate" 
            value={fmt(burnRate)} 
            subtext="Avg. Daily Outflow" 
            icon={TrendingDown} 
            trend={-4.2} 
            color="#3b82f6"
          />
          <MetricCard 
            title="AI-Predicted Savings" 
            value={fmt(predictedSavings)} 
            subtext="Projected for Next Month" 
            icon={BrainCircuit} 
            color="#8b5cf6"
          />
        </div>

        {/* Charts & AI Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6 min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="text-neon-accent" size={20} />
                Cash Flow Analytics
              </h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs rounded-lg bg-neon-accent/10 text-neon-accent border border-neon-accent/20">Monthly</button>
                <button className="px-3 py-1 text-xs rounded-lg text-gray-500 hover:text-white transition-all">Weekly</button>
              </div>
            </div>
            <div className="flex-1 w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff88" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#161b22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#e6edf3' }}
                  />
                  <Bar dataKey="income" fill="#00ff88" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="spend" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6 flex flex-col">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <BrainCircuit className="text-purple-400" size={20} />
              AI Intelligence
            </h3>
            <div className="flex-1 space-y-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <div className="w-12 h-12 border-2 border-neon-accent border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-500">Analyzing patterns...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-sm leading-relaxed text-purple-100">
                    {insight ? insight : "Add more transactions to unlock AI-powered financial optimization tips."}
                  </div>
                  <div className="p-4 rounded-2xl bg-neon-accent/5 border border-neon-accent/10">
                    <p className="text-xs text-neon-accent font-bold uppercase mb-2">Strategy of the week</p>
                    <p className="text-sm text-gray-300 italic">"Automating your savings immediately after income reduces the likelihood of impulse spending by 35%."</p>
                  </div>
                  <button 
                    onClick={getAIInsights}
                    disabled={loading}
                    className="w-full py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs font-bold rounded-xl border border-purple-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <BrainCircuit size={14} />
                    {loading ? 'Analyzing...' : 'Get AI Insights'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Categories & Transactions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spending by Category */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <PieIcon className="text-blue-400" size={20} />
              Spending Distribution
            </h3>
            <div className="flex items-center justify-between">
              <div className="w-1/2 h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-3">
                {categoryData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-gray-400">{item.name}</span>
                    </div>
                    <span className="font-bold">{fmt(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add Transaction Form */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <Plus className="text-green-400" size={20} />
              Quick Transaction
            </h3>
            <form onSubmit={handleAddTxn} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 uppercase font-bold">Description</label>
                  <input 
                    type="text" 
                    value={form.desc}
                    onChange={(e) => setForm({...form, desc: e.target.value})}
                    placeholder="e.g. AWS Bill" 
                    className="w-full px-4 py-2 rounded-xl text-sm" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 uppercase font-bold">Amount</label>
                  <input 
                    type="number" 
                    value={form.amount}
                    onChange={(e) => setForm({...form, amount: e.target.value})}
                    placeholder="0.00" 
                    className="w-full px-4 py-2 rounded-xl text-sm" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 uppercase font-bold">Category</label>
                  <select 
                    value={form.category}
                    onChange={(e) => setForm({...form, category: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl text-sm"
                  >
                    {CATEGORIES.map(c => <option key={c.label} value={c.label}>{c.icon} {c.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 uppercase font-bold">Date</label>
                  <input 
                    type="date" 
                    value={form.date}
                    onChange={(e) => setForm({...form, date: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl text-sm" 
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <button 
                  type="button"
                  onClick={() => setForm({...form, type: 'expense'})}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${form.type === 'expense' ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'border-white/5 text-gray-500'}`}
                >
                  Expense
                </button>
                <button 
                  type="button"
                  onClick={() => setForm({...form, type: 'income'})}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${form.type === 'income' ? 'bg-green-500/10 border-green-500/50 text-green-500' : 'border-white/5 text-gray-500'}`}
                >
                  Income
                </button>
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-neon-accent text-black font-bold rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Log Transaction
              </button>
            </form>
          </div>
        </div>

        {/* History Table */}
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Transaction History</h3>
            <button className="text-xs text-neon-accent font-bold flex items-center gap-1">
              Export CSV <ChevronRight size={14} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-gray-500 uppercase font-bold border-b border-white/5">
                  <th className="px-6 py-4">Transaction</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {txns.slice(0, 8).map((t) => {
                  const cat = CAT_MAP[t.category] || CAT_MAP['Other']
                  return (
                    <motion.tr 
                      key={t.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group hover:bg-white/[0.02] transition-all"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">
                            {cat.icon}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{t.desc}</p>
                            <p className="text-xs text-gray-500">{t.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-white/10 text-gray-400">
                          {t.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{t.date}</td>
                      <td className={`px-6 py-4 text-right font-bold ${t.amount > 0 ? 'text-neon-accent' : 'text-gray-100'}`}>
                        {t.amount > 0 ? '+' : ''}{fmt(t.amount)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setTxns(txns.filter(txn => txn.id !== t.id))}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-gray-600 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
