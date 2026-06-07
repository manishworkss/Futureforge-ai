import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Bell, Search } from 'lucide-react'
import { FeedbackModule } from '../shared/FeedbackModule'
import { motion } from 'framer-motion'

export const AppLayout = () => {
  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-slate-950 font-sans text-slate-100">
      
      {/* Global Background Gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] mix-blend-screen animate-pulse duration-10000 pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] mix-blend-screen animate-pulse duration-10000 pointer-events-none z-0" style={{ animationDelay: '2s' }}></div>

      <Sidebar />
      
      <div className="relative z-10 flex-1 flex flex-col min-w-0 bg-transparent">
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-white/5 bg-slate-950/40 backdrop-blur-xl px-6 lg:px-8">
          
          {/* Top Search (Decorative) */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-white/5 w-64 focus-within:border-indigo-500/50 transition-colors">
            <Search className="w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search or ask AI..." 
              className="bg-transparent border-0 focus:outline-none text-sm text-white placeholder:text-slate-500 w-full"
            />
          </div>
          <div className="flex-1 md:hidden"></div>

          <div className="flex items-center gap-5">
            <button className="relative text-slate-400 hover:text-indigo-400 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-pink-500 border-2 border-slate-950"></span>
            </button>
            <div className="w-px h-6 bg-slate-800"></div>
            <Avatar className="h-9 w-9 cursor-pointer border border-indigo-500/30 hover:border-indigo-400 transition-colors shadow-[0_0_10px_rgba(79,70,229,0.2)]">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="bg-indigo-600 text-white font-bold">U</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="flex-1 overflow-auto custom-scrollbar relative z-10">
          <Outlet />
        </main>
      </div>
      <FeedbackModule />
    </div>
  )
}

export default AppLayout
