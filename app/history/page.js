'use client'
import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  Trash2, 
  Search, 
  ArrowLeft,
  ChevronRight,
  Download,
  Inbox,
  XCircle,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { useFinance } from '../FinanceContext'
import { Skeleton, Toast } from '../components/UI'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

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

export default function HistoryPage() {
  const { txns, deleteTxn, currency, mounted, toast, showToast } = useFinance()
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  React.useEffect(() => {
    if (mounted) {
      setTimeout(() => setLoading(false), 1000)
    }
  }, [mounted])

  const filteredTxns = useMemo(() => {
    return txns.filter(t => {
      const matchesFilter = filter === 'All' || t.category === filter
      const matchesSearch = t.desc.toLowerCase().includes(search.toLowerCase())
      return matchesFilter && matchesSearch
    })
  }, [txns, filter, search])

  const exportToPDF = () => {
    setExporting(true)
    try {
      const doc = new jsPDF()
      
      // Header
      doc.setFillColor(13, 17, 23)
      doc.rect(0, 0, 210, 40, 'F')
      doc.setTextColor(0, 255, 136)
      doc.setFontSize(22)
      doc.text('FIN-IQ NEURAL LEDGER', 14, 25)
      
      doc.setTextColor(156, 163, 175)
      doc.setFontSize(10)
      doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 33)
      doc.text(`Total Transactions: ${filteredTxns.length}`, 160, 33)

      const tableData = filteredTxns.map(t => [
        t.date,
        t.desc,
        t.category,
        t.amount > 0 ? `+${fmt(t.amount, currency)}` : fmt(t.amount, currency)
      ])

      doc.autoTable({
        startY: 45,
        head: [['Date', 'Description', 'Category', 'Amount']],
        body: tableData,
        headStyles: { fillColor: [22, 27, 34], textColor: [0, 255, 136], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [249, 250, 251], opacity: 0.02 },
        styles: { fontSize: 9, cellPadding: 4 },
        margin: { top: 45 }
      })

      doc.save(`FIN-IQ_Ledger_${new Date().toISOString().split('T')[0]}.pdf`)
      showToast('PDF Exported Successfully')
    } catch (error) {
      showToast('Export failed', 'error')
    } finally {
      setExporting(false)
    }
  }

  if (!mounted) return null

  return (
    <main className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Link href="/" className="hover:text-[#00ff88] transition-colors flex items-center gap-1 text-sm font-bold uppercase tracking-widest">
              <ArrowLeft size={14} /> Back to Hub
            </Link>
            <ChevronRight size={14} />
            <span className="text-sm font-bold text-gray-300 uppercase tracking-widest">Reserves Archive</span>
          </div>
          <h2 className="text-4xl font-black tracking-tight text-white">Neural Ledger</h2>
          <p className="text-gray-400 font-medium">System total: {txns.length} records processed.</p>
        </div>
        <button 
          onClick={exportToPDF}
          disabled={exporting || txns.length === 0}
          className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-black hover:bg-white/10 hover:border-[#00ff8830] transition-all disabled:opacity-50"
        >
          {exporting ? <Loader2 size={18} className="animate-spin text-[#00ff88]" /> : <Download size={18} className="text-[#00ff88]" />}
          {exporting ? 'GENERATING PDF...' : 'EXPORT DATA ARCHIVE'}
        </button>
      </header>

      <div className="glass-card p-8 space-y-8 bg-[#161b2230]">
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00ff88] transition-colors" size={20} />
            <input type="text" placeholder="Filter by description or neural header..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium focus:border-[#00ff88] focus:bg-[#00ff8805] outline-none transition-all" />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 xl:pb-0 scrollbar-hide">
            {['All', ...CATEGORIES.map(c => c.label)].map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all border ${filter === cat ? 'bg-[#00ff881a] border-[#00ff8855] text-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.1)]' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}>{cat}</button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] border-b border-white/5 bg-white/[0.03]">
                <th className="px-8 py-5">System Resource</th>
                <th className="px-8 py-5">Classification</th>
                <th className="px-8 py-5">Timestamp</th>
                <th className="px-8 py-5 text-right">Magnitude</th>
                <th className="px-8 py-5 text-right">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-8 py-6"><Skeleton className="h-6 w-48" /></td>
                    <td className="px-8 py-6"><Skeleton className="h-6 w-24" /></td>
                    <td className="px-8 py-6"><Skeleton className="h-6 w-32" /></td>
                    <td className="px-8 py-6 text-right"><Skeleton className="h-6 w-20 ml-auto" /></td>
                    <td className="px-8 py-6 text-right"><Skeleton className="h-6 w-10 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredTxns.map((t) => {
                const cat = CAT_MAP[t.category] || CAT_MAP['Other']
                return (
                  <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={t.id} className="group hover:bg-[#00ff8805] transition-all">
                    <td className="px-8 py-6"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl shadow-inner group-hover:bg-[#00ff881a] transition-colors">{cat.icon}</div><div><p className="font-bold text-white text-sm">{t.desc}</p><p className="text-[10px] text-gray-600 font-mono">{t.id}</p></div></div></td>
                    <td className="px-8 py-6"><span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 text-gray-500 group-hover:border-[#00ff8830] group-hover:text-[#00ff88] transition-all bg-white/[0.02]">{t.category}</span></td>
                    <td className="px-8 py-6 text-sm font-bold text-gray-500">{t.date}</td>
                    <td className={`px-8 py-6 text-right font-black text-lg ${t.amount > 0 ? 'text-[#00ff88]' : 'text-white'}`}>{t.amount > 0 ? '+' : ''}{fmt(t.amount, currency)}</td>
                    <td className="px-8 py-6 text-right"><button onClick={() => deleteTxn(t.id)} className="p-3 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-gray-700 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button></td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
          {!loading && filteredTxns.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 animate-fade-in"><div className="p-8 rounded-full bg-white/5 border border-white/10"><Inbox size={64} className="text-gray-700" /></div><div className="space-y-2"><h4 className="text-2xl font-black text-white">No Neural Records Found</h4><p className="text-gray-500 font-medium">Modify your search parameters or classifications to view hidden data.</p></div><button onClick={() => { setFilter('All'); setSearch(''); }} className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-black transition-all flex items-center gap-2"><XCircle size={18} /> CLEAR NEURAL FILTERS</button></div>
          )}
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => {}} />}
    </main>
  )
}
