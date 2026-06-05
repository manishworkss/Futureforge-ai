import React from 'react'
import { Link } from 'react-router-dom'
// No social icons imported

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
                F
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                FutureForge
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              AI-driven career pathing and domain recommendations for the modern professional.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#features" className="hover:text-blue-600 transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</a></li>
              <li><Link to="/auth/register" className="hover:text-blue-600 transition-colors">Sign Up</Link></li>
              <li><Link to="/auth/login" className="hover:text-blue-600 transition-colors">Log In</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Resources</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Documentation</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} FutureForge AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
