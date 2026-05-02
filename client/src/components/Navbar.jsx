import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LOGO } from '../utils/logo'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close menus on outside click
  useEffect(() => {
    const handler = () => setUserMenuOpen(false)
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  const handleLogout = () => {
    logout()
    toast.success('See you at the next show! 🎵')
    navigate('/')
    setMobileOpen(false)
    setUserMenuOpen(false)
  }

  const navLink = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${isActive ? 'text-violet-300' : 'text-slate-400 hover:text-white'}`

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-navy-900/95 backdrop-blur-xl border-b border-white/8 shadow-xl shadow-black/30' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-violet-500/40 group-hover:ring-violet-400/70 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-violet-500/30">
              <img src={LOGO} alt="HHM Logo" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block">
              <div className="font-script text-lg text-white leading-none group-hover:text-violet-200 transition-colors">Happy Happenings</div>
              <div className="text-[10px] font-semibold text-violet-400 tracking-[.2em] uppercase leading-none mt-0.5">Music</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/"        end className={navLink}>Home</NavLink>
            <NavLink to="/events"      className={navLink}>Events</NavLink>
            <NavLink to="/artists"     className={navLink}>Artists</NavLink>
            {user && <>
              <NavLink to="/my-bookings" className={navLink}>My Bookings</NavLink>
              <NavLink to="/wishlist"    className={navLink}>Wishlist</NavLink>
            </>}
            {isAdmin && (
              <NavLink to="/admin" className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${isActive ? 'text-violet-300' : 'text-violet-400 hover:text-violet-200'}`}>
                ⚡ Admin
              </NavLink>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-navy-800/70 border border-white/8 hover:border-violet-500/30 transition-all group"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{user.name.split(' ')[0]}</span>
                  <svg className={`w-3 h-3 text-slate-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 card border border-white/10 py-1 shadow-2xl shadow-black/50">
                    <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors">👤 Profile</Link>
                    <Link to="/my-bookings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors">🎫 My Bookings</Link>
                    <Link to="/wishlist" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors">♡ Wishlist</Link>
                    {isAdmin && <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-violet-300 hover:text-violet-200 hover:bg-white/5 transition-colors">⚡ Admin Panel</Link>}
                    <div className="border-t border-white/8 my-1" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-white/5 transition-colors">↩ Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login"    className="btn-ghost text-sm px-4 py-2">Login</Link>
                <Link to="/register" className="btn-primary text-sm px-5 py-2.5">Sign Up Free</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setMobileOpen(o => !o)}>
            <div className="w-5 space-y-1.5">
              <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-white/8 space-y-1 animate-fade-up">
            {[
              { to: '/',           label: 'Home',       end: true },
              { to: '/events',     label: 'Events' },
              { to: '/artists',    label: 'Artists' },
              ...(user ? [
                { to: '/my-bookings', label: 'My Bookings' },
                { to: '/wishlist',    label: 'Wishlist' },
                { to: '/profile',     label: 'Profile' },
              ] : []),
              ...(isAdmin ? [{ to: '/admin', label: '⚡ Admin Panel' }] : []),
            ].map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-violet-600/20 text-violet-300' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                {label}
              </NavLink>
            ))}
            <div className="pt-3 border-t border-white/8 flex flex-col gap-2">
              {user ? (
                <button onClick={handleLogout} className="btn-danger w-full text-sm py-2.5">↩ Logout</button>
              ) : (
                <>
                  <Link to="/login"    onClick={() => setMobileOpen(false)} className="btn-secondary w-full text-center text-sm py-2.5">Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary  w-full text-center text-sm py-2.5">Sign Up Free</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
