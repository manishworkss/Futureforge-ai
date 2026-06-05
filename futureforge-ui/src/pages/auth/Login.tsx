import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Eye, EyeOff } from 'lucide-react'

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = () => {
    // Redirect to backend OAuth2 endpoint
    window.location.href = 'http://localhost:8080/oauth2/authorization/google'
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#5A6EE0] to-[#59BAF8] flex items-center justify-center p-4 sm:p-8">
      
      {/* The main container matching the presentation style */}
      <div className="w-full max-w-[1100px] h-[700px] bg-transparent flex items-center justify-between gap-12">
        
        {/* Left Side: The actual tilted mockup card containing the login UI */}
        <div className="relative w-full lg:w-[65%] h-[90%] md:h-[600px] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row transform lg:-rotate-2 transition-transform duration-500 hover:rotate-0">
          
          {/* Image Panel (Lighthouse/Sea) */}
          <div 
            className="w-full md:w-[40%] h-48 md:h-full bg-cover bg-center"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1506501139174-099022df5260?q=80&w=2071&auto=format&fit=crop')" 
            }}
          />

          {/* Form Panel */}
          <div className="w-full md:w-[60%] p-8 sm:p-12 flex flex-col justify-center bg-white">
            
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-yellow-400 shadow-sm" />
              <span className="font-bold text-xl text-slate-900 tracking-tight">FutureForge AI</span>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">Nice to see you again</h1>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              
              {/* Login Field */}
              <div className="space-y-2">
                <Label htmlFor="login" className="text-xs font-medium text-slate-600 ml-1">Login</Label>
                <Input 
                  id="login" 
                  type="text" 
                  placeholder="Email or phone number" 
                  className="bg-slate-100/80 border-0 h-12 text-sm focus-visible:ring-1 focus-visible:ring-slate-300 rounded-xl"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-medium text-slate-600 ml-1">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter password" 
                    className="bg-slate-100/80 border-0 h-12 text-sm focus-visible:ring-1 focus-visible:ring-slate-300 rounded-xl pr-10"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between pt-1 pb-4">
                <div className="flex items-center space-x-2">
                  <Switch id="remember-me" className="data-[state=checked]:bg-[#0D7AF5]" />
                  <Label htmlFor="remember-me" className="text-xs text-slate-600 font-medium cursor-pointer">Remember me</Label>
                </div>
                <Link to="/forgot-password" className="text-xs font-medium text-[#0D7AF5] hover:underline">
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button */}
              <Button className="w-full h-12 bg-[#0D7AF5] hover:bg-[#0b66cc] text-white rounded-xl text-sm font-semibold transition-all">
                Sign in
              </Button>

              {/* Google Button */}
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleGoogleLogin} 
                className="w-full h-12 bg-[#2D2D2D] hover:bg-black text-white hover:text-white border-0 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-3"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Or sign in with Google
              </Button>
            </form>

            <div className="mt-8 text-center text-xs font-medium text-slate-500">
              Dont have an account?{' '}
              <Link to="/auth/register" className="text-[#0D7AF5] hover:underline">
                Sign up now
              </Link>
            </div>
            
          </div>
        </div>

        {/* Right Side: The Presentation Text (Hidden on smaller screens) */}
        <div className="hidden lg:flex flex-col text-white w-[30%]">
          <h2 className="text-6xl font-bold mb-8 leading-tight">Welcome<br />back</h2>
          <ul className="space-y-4 text-xl">
            <li className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-white"></span>
              Resume your roadmap
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-white"></span>
              Update your skills
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-white"></span>
              Talk to your AI Mentor
            </li>
          </ul>
          
          <div className="mt-12">
            <div className="inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-black text-white px-8 py-4 rounded-full font-bold text-lg cursor-pointer transition-colors shadow-xl">
              <span>🎯</span> Continue Journey
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Login
