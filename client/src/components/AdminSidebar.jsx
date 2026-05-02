import { NavLink } from 'react-router-dom'
import { LOGO } from '../utils/logo'

const links = [
  { to: '/admin',          icon: '📊', label: 'Dashboard',  end: true },
  { to: '/admin/events',   icon: '🎪', label: 'Events' },
  { to: '/admin/artists',  icon: '🎤', label: 'Artists' },
  { to: '/admin/bookings', icon: '🎫', label: 'Bookings' },
  { to: '/admin/users',    icon: '👥', label: 'Users' },
]

export default function AdminSidebar() {
  return (
    <aside className="w-52 shrink-0 hidden md:block">
      <div className="card p-4 sticky top-24">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/8">
          <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-violet-500/40">
            <img src={LOGO} alt="HHM" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">HHM Admin</div>
            <div className="text-[10px] text-violet-400 uppercase tracking-wider">Control Panel</div>
          </div>
        </div>
        <nav className="space-y-1">
          {links.map(({ to, icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="text-base">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  )
}
