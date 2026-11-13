import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const getHref = (hash: string) => {
    return location.pathname === '/' ? hash : `/${hash}`;
  };

  const navLinks = [
    { label: 'Features', hash: '#features' },
    { label: 'How it works', hash: '#how-it-works' },
    { label: 'Testimonials', hash: '#testimonials' },
    { label: 'FAQ', hash: '#faq' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img 
              src="/logo-brand.png" 
              alt="FutureForge AI" 
              className="h-9 sm:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105" 
            />
          </Link>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <a 
              key={link.hash} 
              href={getHref(link.hash)} 
              className="hover:text-cyan-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop & Mobile Actions */}
        <div className="flex items-center gap-3">
          <Link to="/auth/login">
            <Button variant="ghost" className="hidden sm:inline-flex font-medium text-slate-700 hover:text-cyan-700">
              Log in
            </Button>
          </Link>
          <Link to="/auth/register">
            <Button className="bg-cyan-600 text-white hover:bg-cyan-500 shadow-xs font-semibold px-4">
              Get Started
            </Button>
          </Link>

          {/* Mobile Navigation Sheet */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-700 hover:bg-slate-100 h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[360px] p-6 bg-white border-slate-200">
                <SheetHeader className="text-left border-b border-slate-100 pb-4">
                  <SheetTitle className="flex items-center gap-2 text-lg font-bold">
                    <img src="/logo-brand.png" alt="FutureForge AI" className="h-8 w-auto object-contain" />
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col space-y-4 py-6">
                  {navLinks.map((link) => (
                    <a
                      key={link.hash}
                      href={getHref(link.hash)}
                      onClick={() => setMobileOpen(false)}
                      className="text-base font-medium text-slate-700 hover:text-cyan-600 transition-colors py-2 border-b border-slate-50"
                    >
                      {link.label}
                    </a>
                  ))}
                  
                  <div className="pt-4 flex flex-col gap-3">
                    <Link to="/auth/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full justify-center border-slate-200 text-slate-800">
                        Log in
                      </Button>
                    </Link>
                    <Link to="/auth/register" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full justify-center bg-cyan-600 hover:bg-cyan-500 text-white shadow-xs font-medium">
                        Create Free Account <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

      </div>
    </nav>
  )
}

export default Navbar;
