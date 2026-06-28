import React, { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Bell, Search, Menu, LayoutDashboard, Compass, Target, MessageSquare, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="fixed inset-0 flex w-full overflow-hidden bg-white font-sans text-slate-900">
      
      {/* Global Background Gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-cyan-400/20 blur-[120px] mix-blend-multiply animate-pulse duration-10000 pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-teal-400/20 blur-[120px] mix-blend-multiply animate-pulse duration-10000 pointer-events-none z-0" style={{ animationDelay: '2s' }}></div>

      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex" />
      
      <div className="relative z-10 flex-1 flex flex-col min-w-0 bg-transparent h-full">
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white/95 backdrop-blur-xl px-3 sm:px-6 lg:px-8 shadow-sm">
          
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Nav Trigger */}
            <div className="md:hidden flex items-center">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-900 font-semibold text-xs shadow-sm transition-all active:scale-95">
                    <Menu className="w-4 h-4 text-cyan-600" />
                    <span>Menu</span>
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64 border-r-0">
                  <Sidebar className="w-full h-full border-r-0" onNavigate={() => setIsMobileMenuOpen(false)} />
                </SheetContent>
              </Sheet>
            </div>

            {/* Mobile Brand Title */}
            <Link to="/" className="md:hidden flex items-center gap-2 font-bold text-slate-900">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 shadow-sm overflow-hidden shrink-0">
                <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-bold tracking-tight text-slate-900">FutureForge</span>
            </Link>
          </div>

          {/* Top Search (Decorative) */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 w-64 focus-within:border-cyan-500/50 transition-colors">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search or ask AI..." 
              className="bg-transparent border-0 focus:outline-none text-sm text-slate-900 placeholder:text-slate-400 w-full"
            />
          </div>
          
          <div className="flex items-center gap-3 sm:gap-5">
            <button className="relative text-slate-500 hover:text-cyan-500 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-teal-500 border-2 border-white"></span>
            </button>
            <div className="hidden sm:block w-px h-6 bg-slate-200"></div>
            <Avatar className="h-8 w-8 sm:h-9 sm:w-9 cursor-pointer border border-cyan-500/30 hover:border-cyan-500 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="bg-cyan-600 text-white font-bold">U</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative z-10 [-webkit-overflow-scrolling:touch] pb-20 md:pb-0">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation Tab Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-white/95 backdrop-blur-xl border-t border-slate-200 py-2 px-1 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
          {[
            { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
            { name: 'Analysis', href: '/analysis', icon: Compass },
            { name: 'Roadmap', href: '/roadmap', icon: Target },
            { name: 'Mentor Chat', href: '/chat', icon: MessageSquare },
            { name: 'Profile', href: '/profile', icon: User },
          ].map((item) => {
            const Icon = item.icon
            const isActive = location.pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all",
                  isActive ? "text-cyan-600 font-bold scale-105" : "text-slate-500 hover:text-slate-900"
                )}
              >
                <div className={cn("p-1.5 rounded-xl", isActive && "bg-cyan-50")}>
                  <Icon className={cn("w-5 h-5", isActive && "text-cyan-600")} />
                </div>
                <span className="text-[11px] font-medium mt-0.5 tracking-tight whitespace-nowrap">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default AppLayout
