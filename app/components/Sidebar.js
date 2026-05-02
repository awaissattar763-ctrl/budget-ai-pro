'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  History, 
  Settings, 
  BrainCircuit 
} from 'lucide-react'

const SidebarItem = ({ icon: Icon, label, href, active }) => (
  <Link 
    href={href}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group ${
      active 
        ? 'text-[#00ff88]' 
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    {active && (
      <div className="absolute inset-0 bg-[#00ff8810] border border-[#00ff8830] rounded-xl shadow-[0_0_15px_rgba(0,255,136,0.1)]" />
    )}
    <Icon size={20} className={active ? "drop-shadow-[0_0_5px_rgba(0,255,136,0.5)]" : ""} />
    <span className="font-bold relative">{label}</span>
    {active && (
      <div className="absolute left-[-1.5rem] w-1.5 h-6 bg-[#00ff88] rounded-r-full shadow-[0_0_10px_rgba(0,255,136,0.8)]" />
    )}
  </Link>
)

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-black/40 backdrop-blur-md border-r border-[#00ff8820] flex flex-col p-6 h-screen sticky top-0 z-50">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-xl bg-[#00ff88] flex items-center justify-center text-black shadow-[0_0_20px_rgba(0,255,136,0.4)]">
          <BrainCircuit size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tighter">FIN-IQ</h1>
      </div>

      <nav className="flex-1 space-y-4">
        <SidebarItem 
          icon={LayoutDashboard} 
          label="Dashboard" 
          href="/" 
          active={pathname === '/'} 
        />
        <SidebarItem 
          icon={History} 
          label="History" 
          href="/history" 
          active={pathname === '/history'} 
        />
        <SidebarItem 
          icon={Settings} 
          label="Settings" 
          href="/settings" 
          active={pathname === '/settings'} 
        />
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="glass-card p-5 bg-[#00ff8805] border-[#00ff8810] backdrop-blur-sm">
          <p className="text-[10px] text-[#00ff88] mb-2 uppercase font-black tracking-[0.1em]">AI Neural Network</p>
          <div className="h-1.5 w-full bg-white/5 rounded-full mb-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#00ff88] to-[#3b82f6] w-3/4 rounded-full animate-pulse"></div>
          </div>
          <button className="w-full py-2.5 text-xs font-black text-black bg-[#00ff88] rounded-xl hover:scale-[1.02] transition-all shadow-[0_5px_15px_rgba(0,255,136,0.2)]">
            UPGRADE PRO
          </button>
        </div>
      </div>
    </aside>
  )
}
