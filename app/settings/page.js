'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Save, 
  Settings as SettingsIcon,
  Globe,
  Wallet,
  Shield,
  Trash2,
  AlertTriangle
} from 'lucide-react'
import { useFinance } from '../FinanceContext'
import { Toast } from '../components/UI'

export default function SettingsPage() {
  const { budget, currency, updateSettings, resetData, mounted, toast, showToast } = useFinance()
  const [localBudget, setLocalBudget] = useState(budget)
  const [localCurrency, setLocalCurrency] = useState(currency)

  useEffect(() => {
    setLocalBudget(budget)
    setLocalCurrency(currency)
  }, [budget, currency])

  const handleSave = () => {
    if (localBudget <= 0) {
      showToast('Budget must be greater than 0', 'error')
      return
    }
    updateSettings(localBudget, localCurrency)
  }

  if (!mounted) return null

  return (
    <main className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 animate-fade-in">
      <header>
        <h2 className="text-4xl font-black tracking-tight text-white mb-2">System Architecture</h2>
        <p className="text-gray-400 font-medium text-lg">Optimize your financial intelligence parameters.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* General Settings */}
          <div className="glass-card p-8 space-y-8 bg-[#161b2250]">
            <div className="flex items-center gap-3 border-b border-white/5 pb-6">
              <div className="p-2.5 rounded-xl bg-[#00ff881a]">
                <SettingsIcon className="text-[#00ff88]" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Global Configuration</h3>
                <p className="text-xs text-gray-500 font-medium">Define your base financial limits and localization.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Monthly Intelligence Budget</label>
                <div className="relative">
                  <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input 
                    type="number" 
                    value={localBudget}
                    onChange={(e) => setLocalBudget(parseFloat(e.target.value))}
                    className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-lg font-bold focus:border-[#00ff88] focus:bg-[#00ff8805] outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Currency Localization</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <select 
                    value={localCurrency}
                    onChange={(e) => setLocalCurrency(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-[#161b22] border border-white/10 rounded-2xl text-lg font-bold focus:border-[#00ff88] outline-none appearance-none cursor-pointer"
                  >
                    <option value="USD">USD - United States Dollar</option>
                    <option value="EUR">EUR - Euro Zone</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="PKR">PKR - Pakistani Rupee</option>
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="AED">AED - UAE Dirham</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                onClick={handleSave}
                className="flex items-center gap-3 px-10 py-4 bg-[#00ff88] text-black font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_20px_rgba(0,255,136,0.2)]"
              >
                <Save size={20} />
                UPDATE SYSTEM
              </button>
            </div>
          </div>

          {/* Privacy */}
          <div className="glass-card p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-6">
              <div className="p-2.5 rounded-xl bg-blue-500/10">
                <Shield className="text-blue-400" size={24} />
              </div>
              <h3 className="text-xl font-bold">Privacy & Neural Access</h3>
            </div>
            <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
              <div>
                <p className="text-md font-bold text-white">AI Real-time Analysis</p>
                <p className="text-sm text-gray-500 font-medium">Allow Llama 3.3 to process encrypted transaction headers.</p>
              </div>
              <div className="w-14 h-7 bg-[#00ff88] rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-5 h-5 bg-black rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Danger Zone */}
          <div className="glass-card p-8 border-red-500/30 bg-red-500/[0.02]">
            <div className="flex items-center gap-3 border-b border-red-500/10 pb-6 mb-6">
              <div className="p-2.5 rounded-xl bg-red-500/10">
                <AlertTriangle className="text-red-500" size={24} />
              </div>
              <h3 className="text-xl font-bold text-red-500">Danger Zone</h3>
            </div>
            <p className="text-sm text-gray-400 font-medium mb-8 leading-relaxed">
              Factory reset will purge all local cached transactions and revert intelligence parameters to factory defaults. This action is IRREVERSIBLE.
            </p>
            <button 
              onClick={resetData}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-500/10 text-red-500 border border-red-500/30 rounded-2xl font-black hover:bg-red-500/20 active:scale-[0.98] transition-all"
            >
              <Trash2 size={20} /> 
              FACTORY RESET
            </button>
          </div>

          <div className="glass-card p-8 text-center space-y-4">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">System Info</p>
            <div className="space-y-1">
              <p className="text-sm font-bold text-gray-300">FIN-IQ Engine v2.4.0</p>
              <p className="text-[10px] text-gray-600 font-mono">Build: LLAMA-3.3-VERSATILE-2025</p>
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => {}} />}
    </main>
  )
}
