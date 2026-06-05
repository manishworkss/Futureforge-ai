import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export const OtpVerification = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const email = location.state?.email || "your email"
  
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) return
    
    setIsLoading(true)
    
    // TODO: Connect to backend API for OTP verification
    // POST /api/auth/verify-otp
    
    setTimeout(() => {
      setIsLoading(false)
      // On success, save JWT and redirect to dashboard
      navigate('/dashboard')
    }, 1000)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 px-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200 dark:border-slate-800">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Check your email</CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">
            We've sent a 6-digit verification code to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4 flex flex-col items-center">
          <form onSubmit={handleVerify} className="w-full space-y-6 flex flex-col items-center">
            
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-slate-500">
            Didn't receive the code?{' '}
            <button className="font-medium text-blue-600 hover:underline">
              Click to resend
            </button>
          </div>
          <Link to="/auth/login" className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mx-auto mt-4 underline underline-offset-4">
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default OtpVerification
