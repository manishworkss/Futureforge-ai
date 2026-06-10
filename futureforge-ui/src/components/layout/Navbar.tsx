import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 shadow-sm overflow-hidden">
              <img src="/logo.jpg" alt="FutureForge Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              FutureForge AI
            </span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-cyan-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-cyan-600 transition-colors">How it works</a>
          <a href="#testimonials" className="hover:text-cyan-600 transition-colors">Testimonials</a>
          <a href="#faq" className="hover:text-cyan-600 transition-colors">FAQ</a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/auth/login">
            <Button variant="ghost" className="hidden sm:flex font-medium hover:text-cyan-700">Log in</Button>
          </Link>
          <Link to="/auth/register">
            <Button className="bg-cyan-600 text-white hover:bg-cyan-700 shadow-sm">Sign up</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
