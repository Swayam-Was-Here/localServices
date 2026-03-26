import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import LandingPage from './pages/LandingPage'
import OnboardingPage from './pages/OnboardingPage'
import CustomerDashboard from './pages/CustomerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ProviderDashboard from './pages/ProviderDashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import PendingApproval from './pages/PendingApproval'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const location = useLocation()
  const noNavFooterRoutes = ['/onboarding', '/dashboard', '/admin', '/provider-dashboard', '/login', '/signup', '/pending-approval']
  const showNavFooter = !noNavFooterRoutes.includes(location.pathname)

  return (
    <>
      {showNavFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/provider-dashboard" element={<ProtectedRoute><ProviderDashboard /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pending-approval" element={<ProtectedRoute><PendingApproval /></ProtectedRoute>} />
      </Routes>
      {showNavFooter && <Footer />}
      <Chatbot />
    </>
  )
}

export default App
