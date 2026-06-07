import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { motion } from 'framer-motion'
import { BrainCircuit, MailCheck, ArrowRight } from 'lucide-react'
import api from '@/lib/api'

export const OtpVerification = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const email = location.state?.email || "your email"
  
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) return
    
    setIsLoading(true)
    
    try {
      const response = await api.post('/api/auth/verify-otp', {
        email,
        otp,
        fullName: location.state?.fullName || '',
        password: location.state?.password || '',
        confirmPassword: location.state?.password || ''
      });
      
      const { token } = response.data.data;
      if (token) {
        localStorage.setItem('accessToken', token);
      }
      
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to verify OTP', error);
      alert('Invalid or expired verification code. Please try again.');
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 sm:p-8 overflow-hidden font-sans">
      
      {/* Animated Background Gradients */}
      <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-600/30 blur-[120px] mix-blend-screen animate-pulse duration-10000"></div>
      <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] mix-blend-screen animate-pulse duration-10000" style={{ animationDelay: '2s' }}></div>

      <div className="relative w-full max-w-md bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_0_80px_-20px_rgba(79,70,229,0.3)] overflow-hidden">
        
        <div className="p-8 sm:p-10 flex flex-col items-center justify-center relative z-10 text-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="mb-8"
          >
            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-slate-800/50 border border-slate-700 shadow-xl mx-auto">
              <MailCheck className="w-10 h-10 text-indigo-400" />
              <div className="absolute top-0 right-0 w-4 h-4 bg-indigo-500 rounded-full border-2 border-slate-900 animate-ping"></div>
              <div className="absolute top-0 right-0 w-4 h-4 bg-indigo-500 rounded-full border-2 border-slate-900"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full"
          >
            <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Check your email</h1>
            <p className="text-slate-400 mb-8 text-sm px-4">
              We've sent a 6-digit verification code to <br/>
              <strong className="text-indigo-300 font-medium">{email}</strong>
            </p>
          </motion.div>

          <motion.form 
            className="w-full space-y-8 flex flex-col items-center" 
            onSubmit={handleVerify}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-slate-950/50 p-2 rounded-2xl border border-slate-800">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} className="w-12 h-14 text-xl font-bold bg-slate-900 border-slate-700 text-white rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                  <InputOTPSlot index={1} className="w-12 h-14 text-xl font-bold bg-slate-900 border-slate-700 text-white rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                  <InputOTPSlot index={2} className="w-12 h-14 text-xl font-bold bg-slate-900 border-slate-700 text-white rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </InputOTPGroup>
                <div className="mx-2 text-slate-500">-</div>
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={3} className="w-12 h-14 text-xl font-bold bg-slate-900 border-slate-700 text-white rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                  <InputOTPSlot index={4} className="w-12 h-14 text-xl font-bold bg-slate-900 border-slate-700 text-white rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                  <InputOTPSlot index={5} className="w-12 h-14 text-xl font-bold bg-slate-900 border-slate-700 text-white rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading || otp.length !== 6} 
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-base font-semibold shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] hover:shadow-[0_0_25px_-5px_rgba(79,70,229,0.7)] transition-all group disabled:opacity-50 disabled:shadow-none"
            >
              {isLoading ? "Verifying..." : "Verify Account"}
              {!isLoading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </motion.form>

          <motion.div 
            className="mt-8 text-center text-sm text-slate-400 flex flex-col items-center gap-4 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div>
              Didn't receive the code?{' '}
              <button className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Resend code
              </button>
            </div>
            
            <div className="w-full border-t border-slate-800 pt-4">
              <Link to="/auth/login" className="text-slate-500 hover:text-white transition-colors text-xs font-medium uppercase tracking-wider">
                Back to login
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default OtpVerification
