import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Compass, LayoutDashboard, Target, MessageSquare, User, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export const Sidebar = ({ className, onNavigate }: SidebarProps) => {
  const location = useLocation()

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Career Analysis', href: '/analysis', icon: Compass },
    { name: 'Roadmap', href: '/roadmap', icon: Target },
    { name: 'AI Mentor', href: '/chat', icon: MessageSquare },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  return (
    <div className={cn("relative z-20 flex h-full w-64 flex-col border-r border-slate-200 bg-white shadow-sm shrink-0", className)}>
      
      {/* Brand Header */}
      <div className="flex h-16 items-center px-6 border-b border-slate-200 bg-white shrink-0">
        <Link to="/" className="flex items-center gap-3" onClick={onNavigate}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 shadow-sm overflow-hidden shrink-0">
            <img src="/logo.jpg" alt="FutureForge Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 truncate">
            FutureForge
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-6 bg-white">
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
                onClick={onNavigate}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
                  isActive 
                    ? "bg-blue-50 text-blue-700 border border-blue-100 shadow-sm" 
                    : "text-slate-600 border border-transparent hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon className={cn(
                  "h-4 w-4 shrink-0 transition-colors duration-300",
                  isActive ? "text-blue-600" : "text-slate-400 group-hover:text-blue-600"
                )} />
                <span className="truncate">{link.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
      
      {/* Bottom Actions */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 mt-auto shrink-0">
        <button 
          onClick={() => {
            localStorage.removeItem('accessToken')
            window.location.href = '/auth/login'
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 border border-transparent hover:bg-red-50 hover:border-red-100 hover:text-red-600 transition-all duration-300 group"
        >
          <LogOut className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-red-500 transition-colors" />
          <span className="truncate">Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
