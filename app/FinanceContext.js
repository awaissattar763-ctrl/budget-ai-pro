'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'

const FinanceContext = createContext()

const SEED = [
  // MAY (Current)
  { id: 'm1', desc: 'SaaS Subscription', amount: 800, category: 'Income', date: '2026-05-01' },
  { id: 'm2', desc: 'Current Expenses', amount: -300, category: 'Other', date: '2026-05-02' },
  
  // APRIL (Peak)
  { id: 'a1', desc: 'Enterprise License Sale', amount: 5000, category: 'Income', date: '2026-04-10' },
  { id: 'a2', desc: 'Freelance Dev Team', amount: -2000, category: 'Bills', date: '2026-04-15' },
  { id: 'a3', desc: 'Office Rent & Utilities', amount: -1300, category: 'Bills', date: '2026-04-28' },
  
  // MARCH (Growth)
  { id: 'ma1', desc: 'Client Retainer', amount: 2500, category: 'Income', date: '2026-03-01' },
  { id: 'ma2', desc: 'Premium UI Kit', amount: -200, category: 'Shopping', date: '2026-03-12' },
  { id: 'ma3', desc: 'Marketing & Ads', amount: -600, category: 'Shopping', date: '2026-03-20' },
  
  // FEBRUARY (Startup)
  { id: 'f1', desc: 'Project Deposit: Fintech App', amount: 3000, category: 'Income', date: '2026-02-05' },
  { id: 'f2', desc: 'New Hardware Setup', amount: -1500, category: 'Shopping', date: '2026-02-10' },
  { id: 'f3', desc: 'Cloud Server Yearly', amount: -400, category: 'Bills', date: '2026-02-15' },
]

export function FinanceProvider({ children }) {
  const [txns, setTxns] = useState([])
  const [budget, setBudget] = useState(3000)
  const [currency, setCurrency] = useState('USD')
  const [mounted, setMounted] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const savedTxns = localStorage.getItem('fin_iq_txns')
    const savedBudget = localStorage.getItem('fin_iq_budget')
    const savedCurrency = localStorage.getItem('fin_iq_currency')
    
    if (savedTxns && JSON.parse(savedTxns).length > 0) {
      setTxns(JSON.parse(savedTxns))
    } else {
      setTxns(SEED)
    }
    
    if (savedBudget) setBudget(parseFloat(savedBudget))
    if (savedCurrency) setCurrency(savedCurrency)
    
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('fin_iq_txns', JSON.stringify(txns))
      localStorage.setItem('fin_iq_budget', budget.toString())
      localStorage.setItem('fin_iq_currency', currency)
    }
  }, [txns, budget, currency, mounted])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const addTxn = (txn) => {
    if (!txn.desc || !txn.amount) {
      showToast('Description and amount are required', 'error')
      return false
    }
    setTxns(prev => [txn, ...prev])
    showToast('Transaction added successfully')
    return true
  }

  const deleteTxn = (id) => {
    setTxns(prev => prev.filter(t => t.id !== id))
    showToast('Transaction deleted', 'info')
  }

  const updateSettings = (newBudget, newCurrency) => {
    setBudget(newBudget)
    setCurrency(newCurrency)
    showToast('Settings updated successfully')
  }

  const resetData = () => {
    setTxns(SEED)
    setBudget(3000)
    setCurrency('USD')
    showToast('Neural Stream Reset Successful', 'success')
  }

  return (
    <FinanceContext.Provider value={{
      txns, addTxn, deleteTxn,
      budget, setBudget,
      currency, setCurrency,
      updateSettings,
      resetData,
      mounted,
      toast, showToast
    }}>
      {children}
    </FinanceContext.Provider>
  )
}

export const useFinance = () => useContext(FinanceContext)
