import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Compass, LayoutDashboard, Target, MessageSquare, User, LogOut } from 'lucide-react'
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
    <div className="flex h-full w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="flex h-16 items-center px-6 border-b border-slate-200 dark:border-slate-800">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
            F
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            FutureForge
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-4">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = location.pathname.startsWith(link.href)
            return (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  isActive 
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" 
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            )
          })}
        </nav>
      </div>
      
      <div className="border-t border-slate-200 dark:border-slate-800 p-4">
        <button 
          onClick={() => {
            localStorage.removeItem('accessToken')
            window.location.href = '/auth/login'
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-red-600 transition-all dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  )
}
