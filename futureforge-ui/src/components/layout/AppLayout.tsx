import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Bell, Search, Menu } from 'lucide-react'
import { motion } from 'framer-motion'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-white font-sans text-slate-900">
      
      {/* Global Background Gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-cyan-400/20 blur-[120px] mix-blend-multiply animate-pulse duration-10000 pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-teal-400/20 blur-[120px] mix-blend-multiply animate-pulse duration-10000 pointer-events-none z-0" style={{ animationDelay: '2s' }}></div>

      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex" />
      
      <div className="relative z-10 flex-1 flex flex-col min-w-0 bg-transparent">
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white/80 backdrop-blur-xl px-4 lg:px-8">
          
          {/* Mobile Nav Trigger */}
          <div className="md:hidden flex items-center">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="p-2 -ml-2 text-slate-600 hover:text-slate-900">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 border-r-0">
                <Sidebar className="w-full h-full border-r-0" onNavigate={() => setIsMobileMenuOpen(false)} />
              </SheetContent>
            </Sheet>
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
          
          <div className="flex-1 md:hidden"></div>

          <div className="flex items-center gap-4 sm:gap-5">
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

        <main className="flex-1 overflow-auto custom-scrollbar relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
