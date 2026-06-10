import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Compass, LayoutDashboard, Target, MessageSquare, User, LogOut, BrainCircuit } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Sidebar = () => {
  const location = useLocation()

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Career Analysis', href: '/analysis', icon: Compass },
    { name: 'Roadmap', href: '/roadmap', icon: Target },
    { name: 'AI Mentor', href: '/chat', icon: MessageSquare },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  return (
    <div className="relative z-20 flex h-full w-64 flex-col border-r border-slate-200 bg-white/60 backdrop-blur-xl">
      
      {/* Brand Header */}
      <div className="flex h-16 items-center px-6 border-b border-slate-200">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 shadow-[0_0_10px_rgba(6,182,212,0.3)] overflow-hidden">
            <img src="/logo.jpg" alt="FutureForge Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            FutureForge
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-6">
        <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Main Navigation
        </div>
        <nav className="grid gap-1.5 px-3">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = location.pathname.startsWith(link.href)
            return (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
                  isActive 
                    ? "bg-cyan-50 text-cyan-600 border border-cyan-100 shadow-[0_0_15px_-3px_rgba(6,182,212,0.15)]" 
                    : "text-slate-600 border border-transparent hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon className={cn(
                  "h-4 w-4 transition-colors duration-300",
                  isActive ? "text-cyan-500" : "text-slate-400 group-hover:text-cyan-500"
                )} />
                {link.name}
              </Link>
            )
          })}
        </nav>
      </div>
      
      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        <button 
          onClick={() => {
            localStorage.removeItem('accessToken')
            window.location.href = '/auth/login'
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 border border-transparent hover:bg-red-50 hover:border-red-100 hover:text-red-600 transition-all duration-300 group"
        >
          <LogOut className="h-4 w-4 text-slate-400 group-hover:text-red-500 transition-colors" />
          Disconnect
        </button>
      </div>
    </div>
  )
}

export default Sidebar
