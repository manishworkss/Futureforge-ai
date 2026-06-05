import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export const OAuth2RedirectHandler = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Parse query parameters
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    const error = params.get('error')

    if (token) {
      // Save token (e.g., localStorage or Context)
      localStorage.setItem('accessToken', token)
      
      // Redirect to dashboard
      navigate('/dashboard', { replace: true })
    } else {
      // Handle error or missing token
      console.error('OAuth2 login failed:', error)
      navigate('/auth/login', { replace: true, state: { error: error || 'Login failed' } })
    }
  }, [location, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Authenticating...</p>
      </div>
    </div>
  )
}

export default OAuth2RedirectHandler
