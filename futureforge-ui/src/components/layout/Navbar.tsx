import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
              F
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              FutureForge AI
            </span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it works</a>
          <a href="#testimonials" className="hover:text-blue-600 transition-colors">Testimonials</a>
          <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/auth/login">
            <Button variant="ghost" className="hidden sm:flex font-medium">Log in</Button>
          </Link>
          <Link to="/auth/register">
            <Button className="bg-blue-600 text-white hover:bg-blue-700">Sign up</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
