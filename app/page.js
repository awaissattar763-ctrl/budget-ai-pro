'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  TrendingDown, 
  TrendingUp, 
  Wallet, 
  BrainCircuit, 
  BarChart3,
  Search,
  Bell,
  Loader2,
  AlertCircle,
  BarChart as BarChartIcon
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { useFinance } from './FinanceContext'
import { Skeleton, Toast } from './components/UI'

const fmt = (n, curr = 'USD') => new Intl.NumberFormat('en-US', { style: 'currency', currency: curr }).format(n)

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

const MetricCard = ({ title, value, subtext, icon: Icon, trend, color = '#00ff88', loading }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Icon size={64} style={{ color }} /></div>
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-opacity-10" style={{ backgroundColor: `${color}22` }}><Icon size={20} style={{ color }} /></div>
      <span className="text-sm font-medium text-gray-400">{title}</span>
    </div>
    <div className="flex flex-col">
      {loading ? <Skeleton className="h-8 w-32" /> : <span className="text-2xl font-black tracking-tight">{value}</span>}
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

export default function FinancialDashboard() {
  const { txns, addTxn, budget, currency, mounted, toast } = useFinance()
  const [insight, setInsight] = useState('')
  const [loading, setLoading] = useState(false)
  const [chartLoading, setChartLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ desc: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0], type: 'expense' })

  useEffect(() => {
    if (mounted) {
      setTimeout(() => setChartLoading(false), 2000)
    }
  }, [mounted])

  const income = useMemo(() => txns.filter(t => t.amount > 0).reduce((a, t) => a + t.amount, 0), [txns])
  const expenses = useMemo(() => txns.filter(t => t.amount < 0).reduce((a, t) => a + Math.abs(t.amount), 0), [txns])
  const balance = income - expenses
  const burnRate = useMemo(() => expenses / 30, [expenses])
  const predictedSavings = useMemo(() => (income * 0.2) + (Math.random() * 50), [income])

  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const result = []
    const now = new Date()
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const m = d.getMonth()
      const y = d.getFullYear()
      
      const monthlyTxns = txns.filter(t => {
        const td = new Date(t.date)
        return td.getMonth() === m && td.getFullYear() === y
      })
      
      result.push({
        name: months[m],
        spend: Math.abs(monthlyTxns.filter(t => t.amount < 0).reduce((a, b) => a + b.amount, 0)),
        income: monthlyTxns.filter(t => t.amount > 0).reduce((a, b) => a + b.amount, 0)
      })
    }
    return result
  }, [txns])

  const hasChartData = useMemo(() => chartData.some(d => d.spend > 0 || d.income > 0), [chartData])

  const getAIInsights = async () => {
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions: txns, budget }),
      })
      const data = await res.json()
      if (data.insight) setInsight(data.insight)
      else if (data.error) setError(data.error)
    } catch (err) {
      setError("AI Neural Link Offline. Please check your connectivity or API limits.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (mounted && txns.length > 0) {
      const timer = setTimeout(getAIInsights, 2000)
      return () => clearTimeout(timer)
    }
  }, [txns.length, mounted])

  const handleAddTxn = (e) => {
    e.preventDefault()
    const amt = parseFloat(form.amount)
    if (isNaN(amt) || amt <= 0) return
    const finalAmt = amt * (form.type === 'expense' ? -1 : 1)
    const success = addTxn({ ...form, id: uid(), amount: finalAmt })
    if (success) setForm({ ...form, desc: '', amount: '' })
  }

  const renderInsight = () => {
    if (error) return (
      <div className="flex flex-col items-center justify-center p-4 text-center space-y-3">
        <AlertCircle className="text-red-500" size={32} />
        <p className="text-sm text-gray-400 font-medium">{error}</p>
        <button onClick={getAIInsights} className="text-xs font-bold text-[#00ff88] hover:underline">Retry Analysis</button>
      </div>
    )
    if (!insight) return "Initialize AI Neural Link to unlock predictive financial intelligence."
    const lines = insight.split('\n').filter(l => l.trim().length > 0)
    return (
      <div className="space-y-4">
        {lines.map((line, i) => {
          const parts = line.split('**')
          return (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className="flex gap-3">
              <div className="mt-2 w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.6)] flex-shrink-0" />
              <p className="text-sm leading-relaxed text-gray-300">
                {parts.map((part, pi) => pi % 2 === 1 ? <span key={pi} className="font-bold text-white">{part}</span> : part)}
              </p>
            </motion.div>
          )
        })}
      </div>
    )
  }

  if (!mounted) return null

  return (
    <main className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-white mb-1">Financial Intelligence</h2>
          <p className="text-gray-500 font-medium">Enterprise-grade monitoring powered by Llama 3.3</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00ff88] transition-colors" size={18} /><input type="text" placeholder="Neural Search..." className="pl-12 pr-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm w-72 focus:border-[#00ff88] focus:bg-[#00ff8805] outline-none transition-all" /></div>
          <button className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00ff8830] transition-all relative group"><Bell size={20} className="text-gray-400 group-hover:text-[#00ff88]" /><span className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#00ff88] rounded-full border-2 border-[#0a0b0e] shadow-[0_0_8px_rgba(0,255,136,0.6)]"></span></button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <MetricCard title="Net Liquidity" value={fmt(balance, currency)} subtext="Global Reserve" icon={Wallet} trend={+12.5} color="#00ff88" loading={chartLoading} />
        <MetricCard title="Burn Velocity" value={fmt(burnRate, currency)} subtext="Daily Expenditure" icon={TrendingDown} trend={-4.2} color="#3b82f6" loading={chartLoading} />
        <MetricCard title="AI Projected Growth" value={fmt(predictedSavings, currency)} subtext="Target Architecture" icon={BrainCircuit} color="#8b5cf6" loading={chartLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8 bg-[#161b2230]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#00ff881a]"><BarChart3 className="text-[#00ff88]" size={20} /></div>
              Cash Flow Architecture
            </h3>
          </div>
          
          <div className="w-full h-[350px] relative">
            {!mounted || chartLoading ? (
              <Skeleton className="h-full w-full" />
            ) : hasChartData ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData} key={txns.length} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 12, fontWeight: 600}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 12, fontWeight: 600}} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} contentStyle={{ backgroundColor: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />
                  <Bar dataKey="income" fill="#00ff88" radius={[6, 6, 0, 0]} barSize={32} />
                  <Bar dataKey="spend" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 opacity-40">
                <BarChartIcon size={64} className="text-gray-600" />
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">No Analytics Data Available</p>
              </div>
            )}
          </div>
        </div>

        <div className="glass-card p-8 flex flex-col bg-[#8b5cf605] border-[#8b5cf620]">
          <h3 className="text-xl font-bold flex items-center gap-3 mb-8 text-purple-400">
            <div className="p-2 rounded-xl bg-purple-500/10"><BrainCircuit size={20} /></div>
            FIN-IQ Cognitive Analysis
          </h3>
          <div className="flex-1 flex flex-col">
            <div className="flex-1 mb-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full space-y-6">
                  <div className="relative"><Loader2 className="w-12 h-12 text-purple-500 animate-spin" /><div className="absolute inset-0 blur-xl bg-purple-500/30 animate-pulse" /></div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Synthesizing Data...</p>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">{renderInsight()}</div>
              )}
            </div>
            <button onClick={getAIInsights} disabled={loading} className="w-full py-4 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-sm font-black rounded-2xl border border-purple-500/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <BrainCircuit size={18} />}
              {loading ? 'GENERATING INSIGHTS...' : 'REFRESH ANALYSIS'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold flex items-center gap-3 mb-8"><div className="p-2 rounded-xl bg-[#10b9811a] text-[#10b981]"><Plus size={20} /></div>Quick Data Entry</h3>
          <form onSubmit={handleAddTxn} className="space-y-6">
            <div className="grid grid-cols-2 gap-6"><input type="text" value={form.desc} onChange={(e) => setForm({...form, desc: e.target.value})} placeholder="Description" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:border-[#00ff88] outline-none transition-all" /><input type="number" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} placeholder="Amount" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:border-[#00ff88] outline-none transition-all" /></div>
            <div className="grid grid-cols-2 gap-6"><select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full px-6 py-4 bg-[#161b22] border border-white/10 rounded-2xl text-sm focus:border-[#00ff88] outline-none cursor-pointer">{CATEGORIES.map(c => <option key={c.label} value={c.label}>{c.icon} {c.label}</option>)}</select><input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:border-[#00ff88] outline-none" /></div>
            <div className="flex gap-4"><button type="button" onClick={() => setForm({...form, type: 'expense'})} className={`flex-1 py-4 rounded-2xl text-sm font-black border transition-all ${form.type === 'expense' ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'border-white/5 text-gray-600 hover:text-gray-400'}`}>EXPENSE</button><button type="button" onClick={() => setForm({...form, type: 'income'})} className={`flex-1 py-4 rounded-2xl text-sm font-black border transition-all ${form.type === 'income' ? 'bg-green-500/10 border-green-500/50 text-green-500' : 'border-white/5 text-gray-600 hover:text-gray-400'}`}>INCOME</button></div>
            <button type="submit" className="w-full py-4 bg-[#00ff88] text-black font-black rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3"><Plus size={20} /> LOG TRANSACTION</button>
          </form>
        </div>
        <div className="glass-card p-8 bg-[#00ff8802]">
           <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6"><h3 className="text-xl font-bold">Reserves Ledger</h3><button className="text-xs text-[#00ff88] font-black tracking-widest hover:underline uppercase">View Full Archive</button></div>
           <div className="space-y-4">{txns.slice(0, 4).map((t) => { const cat = CAT_MAP[t.category] || CAT_MAP['Other']; return ( <div key={t.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl shadow-inner">{cat.icon}</div><div><p className="font-bold text-white text-sm">{t.desc}</p><p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{t.date}</p></div></div><p className={`font-black text-md ${t.amount > 0 ? 'text-[#00ff88]' : 'text-white opacity-80'}`}>{t.amount > 0 ? '+' : ''}{fmt(t.amount, currency)}</p></div> ) })}</div>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => {}} />}
    </main>
  )
}
