import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Eye, EyeOff, Sparkles, ArrowRight, BrainCircuit } from 'lucide-react'
import { motion } from 'framer-motion'
import api from '@/lib/api'

export const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google'
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await api.post('/api/auth/login', { email, password, rememberMe });
      const { token } = response.data.data;
      if (token) {
        localStorage.setItem('accessToken', token);
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Login failed', error);
      alert('Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 sm:p-8 overflow-hidden font-sans">
      
      {/* Animated Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-400/20 blur-[120px] mix-blend-multiply animate-pulse duration-10000"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-400/20 blur-[120px] mix-blend-multiply animate-pulse duration-10000" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[20%] right-[10%] w-[20%] h-[30%] rounded-full bg-cyan-300/20 blur-[100px] mix-blend-multiply animate-pulse duration-10000" style={{ animationDelay: '4s' }}></div>

      <div className="relative w-full max-w-[1200px] min-h-[700px] bg-white/80 backdrop-blur-2xl border border-slate-200 rounded-[2.5rem] shadow-[0_0_80px_-20px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col lg:flex-row">
        
        {/* Left Side: Form Panel */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-12"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 shadow-lg shadow-cyan-500/30 overflow-hidden">
              <img src="/logo.jpg" alt="FutureForge Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-2xl text-slate-900 tracking-tight">FutureForge AI</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Welcome back</h1>
            <p className="text-slate-600 mb-8 text-sm">Enter your credentials to access your personalized AI workspace.</p>
          </motion.div>

          <motion.form 
            className="space-y-5" 
            onSubmit={handleLogin}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-2">
              <Label htmlFor="login" className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">Email Address</Label>
              <Input 
                id="login" 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 h-14 text-base focus-visible:ring-cyan-500 rounded-xl transition-all"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Password</Label>
                <Link to="/forgot-password" className="text-xs font-medium text-cyan-600 hover:text-cyan-500 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 h-14 text-base focus-visible:ring-cyan-500 rounded-xl pr-12 transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2 pb-4">
              <Switch id="remember-me" checked={rememberMe} onCheckedChange={setRememberMe} className="data-[state=checked]:bg-cyan-500 border-slate-200" />
              <Label htmlFor="remember-me" className="text-sm text-slate-600 cursor-pointer">Remember me for 30 days</Label>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-14 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-base font-semibold shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)] hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.7)] transition-all group">
              {isLoading ? 'Authenticating...' : 'Sign in to workspace'}
              {!isLoading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </Button>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase tracking-widest font-medium">Or continue with</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              onClick={handleGoogleLogin} 
              className="w-full h-14 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-3 shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </Button>
          </motion.form>

          <motion.div 
            className="mt-8 text-center text-sm font-medium text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-cyan-600 hover:text-cyan-500 hover:underline transition-colors">
              Create one now
            </Link>
          </motion.div>
        </div>

        {/* Right Side: Visual Showcase */}
        <div className="hidden lg:flex w-1/2 relative bg-slate-50 border-l border-slate-200 overflow-hidden items-center justify-center">
          {/* Abstract Grid Background */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d412_1px,transparent_1px),linear-gradient(to_bottom,#06b6d412_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="relative z-10 w-full max-w-md p-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100/50 border border-cyan-200 text-cyan-700 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" /> AI-Powered Career Growth
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">Your intelligent <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500">career co-pilot</span></h2>
              
              <div className="space-y-5 mt-10">
                {[
                  { title: 'Personalized roadmaps', desc: 'Step-by-step guides tailored to your exact dream role.' },
                  { title: 'Real-time skill analysis', desc: 'Identify gaps and learn exactly what matters.' },
                  { title: '24/7 AI Mentorship', desc: 'Get unstuck instantly with your dedicated AI guide.' }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
                    className="flex gap-4 items-start p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-cyan-200 hover:shadow-md transition-all"
                  >
                    <div className="mt-1 w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                    <div>
                      <h3 className="text-slate-900 font-semibold">{item.title}</h3>
                      <p className="text-slate-500 text-sm mt-1">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Decorative glowing sphere */}
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="absolute top-1/4 -right-20 w-64 h-64 bg-gradient-to-br from-cyan-400/30 to-teal-500/30 rounded-full blur-3xl pointer-events-none"
          ></motion.div>
        </div>

      </div>
    </div>
  )
}

export default Login
