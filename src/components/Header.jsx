import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Layers, History } from 'lucide-react'

export default function Header() {
  const { pathname } = useLocation()
  const nav = [
    { to: '/',        label: 'Convert',  icon: Layers },
    { to: '/history', label: 'History',  icon: History },
  ]
  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <Layers size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Filer</span>
        </Link>
        <nav className="flex gap-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${ pathname === to
                  ? 'bg-brand-600/20 text-brand-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' }`}
            >
              <Icon size={15} />{label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
