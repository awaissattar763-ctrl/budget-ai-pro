import React from 'react'

export const Skeleton = ({ className, variant = 'rect' }) => {
  const baseClass = "animate-pulse bg-white/5 rounded-xl"
  const variantClass = variant === 'circle' ? 'rounded-full' : 'rounded-xl'
  
  return <div className={`${baseClass} ${variantClass} ${className}`} />
}

export const Toast = ({ message, type, onClose }) => {
  const bgClass = type === 'error' ? 'bg-red-500' : type === 'info' ? 'bg-blue-500' : 'bg-[#00ff88]'
  const textClass = type === 'success' ? 'text-black' : 'text-white'

  return (
    <div className={`fixed bottom-6 right-6 ${bgClass} ${textClass} px-6 py-3 rounded-xl shadow-2xl z-[100] flex items-center gap-3 animate-fade-in font-bold`}>
      <span>{message}</span>
      <button onClick={onClose} className="opacity-50 hover:opacity-100">✕</button>
    </div>
  )
}
