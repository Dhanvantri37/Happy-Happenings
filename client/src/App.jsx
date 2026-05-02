import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'

import Navbar    from './components/Navbar'
import Footer    from './components/Footer'

import Home       from './pages/Home'
import Events     from './pages/Events'
import EventDetail from './pages/EventDetail'
import BookingPage from './pages/BookingPage'
import MyBookings  from './pages/MyBookings'
import Wishlist    from './pages/Wishlist'
import Profile     from './pages/Profile'
import Artists     from './pages/Artists'
import Login       from './pages/Login'
import Register    from './pages/Register'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminEvents    from './pages/admin/AdminEvents'
import AdminArtists   from './pages/admin/AdminArtists'
import AdminBookings  from './pages/admin/AdminBookings'
import AdminUsers     from './pages/admin/AdminUsers'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo({ top: 0, behavior: 'smooth' }), [pathname])
  return null
}

function Guard({ children, admin = false }) {
  const { user, isAdmin } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (admin && !isAdmin) return <Navigate to="/" replace />
  return children
}

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 page-wrap">
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/events"     element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/artists"    element={<Artists />} />
          <Route path="/login"      element={<Login />} />
          <Route path="/register"   element={<Register />} />
          <Route path="/book/:id"       element={<Guard><BookingPage /></Guard>} />
          <Route path="/my-bookings"    element={<Guard><MyBookings /></Guard>} />
          <Route path="/wishlist"       element={<Guard><Wishlist /></Guard>} />
          <Route path="/profile"        element={<Guard><Profile /></Guard>} />
          <Route path="/admin"          element={<Guard admin><AdminDashboard /></Guard>} />
          <Route path="/admin/events"   element={<Guard admin><AdminEvents /></Guard>} />
          <Route path="/admin/artists"  element={<Guard admin><AdminArtists /></Guard>} />
          <Route path="/admin/bookings" element={<Guard admin><AdminBookings /></Guard>} />
          <Route path="/admin/users"    element={<Guard admin><AdminUsers /></Guard>} />
          <Route path="*"           element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollTop />
        <Toaster position="top-right" toastOptions={{
          style: { background: '#0c0c20', color: '#e2e8f0', border: '1px solid rgba(124,58,237,.35)', borderRadius: '12px', fontSize: '14px' },
          success: { iconTheme: { primary: '#8b5cf6', secondary: '#e2e8f0' } },
          error:   { iconTheme: { primary: '#f43f5e', secondary: '#e2e8f0' } },
        }} />
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  )
}
