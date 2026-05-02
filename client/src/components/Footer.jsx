import { Link } from 'react-router-dom'
import { LOGO } from '../utils/logo'

export default function Footer() {
  return (
    <footer className="border-t border-white/8 mt-24">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-violet-500/30">
                <img src={LOGO} alt="HHM" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-script text-xl text-white leading-none">Happy Happenings</div>
                <div className="text-[10px] font-bold text-violet-400 tracking-[.2em] uppercase">Music</div>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              India's premier music events platform — discover, book, and experience the best concerts, DJ nights, and festivals.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3 mt-4">
              <a href="https://www.instagram.com/happyhappeningsmusic?igsh=MXI1Z2U3ZHloNGZkaA==" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center text-white text-sm hover:scale-110 transition-transform shadow-lg shadow-pink-900/30">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Explore</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/events', label: 'All Events' },
                { to: '/events?isFree=true', label: 'Free Events' },
                { to: '/artists', label: 'Artists' },
                { to: '/events?category=Concert', label: 'Concerts' },
                { to: '/events?category=DJ Night', label: 'DJ Nights' },
                { to: '/events?category=Fest', label: 'Music Fests' },
              ].map(({ to, label }) => (
                <li key={to}><Link to={to} className="text-slate-500 hover:text-violet-300 transition-colors text-sm">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Account</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/login',       label: 'Login' },
                { to: '/register',    label: 'Register' },
                { to: '/my-bookings', label: 'My Bookings' },
                { to: '/wishlist',    label: 'Wishlist' },
                { to: '/profile',     label: 'Profile' },
              ].map(({ to, label }) => (
                <li key={to}><Link to={to} className="text-slate-500 hover:text-violet-300 transition-colors text-sm">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Contact</h4>
            <div className="space-y-3 text-sm text-slate-500">
              <p className="flex items-center gap-2"><span>📧</span><a href="mailto:hello@happyhappenings.music" className="hover:text-violet-300 transition-colors">hello@happyhappenings.music</a></p>
              <p className="flex items-center gap-2"><span>📞</span><span>+91 98765 43210</span></p>
              <p className="flex items-center gap-2"><span>📍</span><span>Mumbai, Maharashtra, India</span></p>
            </div>
            <div className="mt-5 p-3 rounded-xl bg-violet-600/10 border border-violet-500/20">
              <p className="text-xs text-violet-400 font-medium mb-1">🎵 Stay in the loop</p>
              <p className="text-xs text-slate-500">Follow us on Instagram for event drops and exclusive content.</p>
              <a href="https://www.instagram.com/happyhappeningsmusic?igsh=MXI1Z2U3ZHloNGZkaA==" target="_blank" rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-violet-300 hover:text-violet-200 font-medium underline underline-offset-2">
                @happyhappeningsmusic →
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">© {new Date().getFullYear()} Happy Happenings Music. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-slate-600 text-xs">
            <span>Payments secured by</span>
            <span className="font-mono font-bold text-slate-500">Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
