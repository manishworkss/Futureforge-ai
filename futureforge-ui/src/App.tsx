import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from './pages/auth/Login'
import { Register } from './pages/auth/Register'
import { OtpVerification } from './pages/auth/OtpVerification'
import { OAuth2RedirectHandler } from './pages/auth/OAuth2RedirectHandler'

import { Landing } from './pages/Landing'
import { AppLayout } from './components/layout/AppLayout'
import { Dashboard } from './pages/Dashboard'
import { Profile } from './pages/profile/Profile'
import { DomainRecommendation } from './pages/domains/DomainRecommendation'
import { CareerAnalysis } from './pages/analysis/CareerAnalysis'
import { Roadmap } from './pages/roadmap/Roadmap'
import { Assessment } from './pages/roadmap/Assessment'
import { Chat } from './pages/chat/Chat'
import { Toaster } from './components/ui/sonner'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        
        {/* Auth Routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/otp" element={<OtpVerification />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        
        {/* Protected Routes */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/domains" element={<DomainRecommendation />} />
          <Route path="/analysis" element={<CareerAnalysis />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/roadmap/assessment" element={<Assessment />} />
          <Route path="/chat" element={<Chat />} />
        </Route>
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="bottom-right" richColors />
    </BrowserRouter>
  )
}

export default App
