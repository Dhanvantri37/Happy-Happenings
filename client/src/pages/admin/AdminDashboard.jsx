import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import AdminSidebar from '../../components/AdminSidebar'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function StatCard({ icon, label, value, sub, color = 'from-violet-600 to-indigo-600' }) {
  return (
    <div className="card p-6 hover:border-violet-500/20 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-lg shadow-lg`}>{icon}</div>
        <span className="text-xs text-slate-600 uppercase tracking-wider">{label}</span>
      </div>
      <div className="font-display text-3xl font-bold text-white">{value}</div>
      {sub && <p className="text-xs text-slate-600 mt-1">{sub}</p>}
    </div>
  )
}

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/analytics')
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex gap-8">
        <AdminSidebar />
        <div className="flex-1 min-w-0">
          <div className="mb-8">
            <p className="section-label mb-1">Admin Panel</p>
            <h1 className="section-title">Dashboard</h1>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[1,2,3,4].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}
            </div>
          ) : data && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard icon="👥" label="Users"        value={data.totalUsers}       color="from-indigo-600 to-violet-600" />
                <StatCard icon="🎪" label="Events"       value={data.totalEvents}      color="from-violet-600 to-purple-600" />
                <StatCard icon="🎤" label="Artists"      value={data.totalArtists}     color="from-purple-600 to-pink-600" />
                <StatCard icon="🎫" label="Tickets Sold" value={data.totalTicketsSold} color="from-pink-600 to-rose-600" />
              </div>

              {/* Revenue hero */}
              <div className="card p-6 mb-8 border-violet-500/20 bg-gradient-to-r from-violet-900/30 to-indigo-900/20">
                <p className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-1">Total Revenue</p>
                <div className="font-display text-5xl font-bold text-white">
                  ₹{(data.totalRevenue || 0).toLocaleString('en-IN')}
                </div>
                <p className="text-slate-500 text-sm mt-2">From {data.totalBookings} total bookings</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Revenue by event */}
                <div className="card p-6">
                  <h2 className="font-display text-lg font-bold text-white mb-5">Top Events by Revenue</h2>
                  {data.revenueByEvent?.length ? (
                    <div className="space-y-4">
                      {data.revenueByEvent.map((item, i) => {
                        const max = data.revenueByEvent[0]?.revenue || 1
                        return (
                          <div key={i}>
                            <div className="flex justify-between text-sm mb-1.5">
                              <span className="text-slate-300 truncate max-w-[65%]">
                                <span className="text-violet-500 font-bold mr-2">#{i+1}</span>{item.title}
                              </span>
                              <span className="text-white font-semibold shrink-0">₹{item.revenue.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all"
                                style={{ width: `${(item.revenue / max) * 100}%` }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : <p className="text-slate-600 text-sm">No paid bookings yet.</p>}
                </div>

                {/* Monthly trend */}
                <div className="card p-6">
                  <h2 className="font-display text-lg font-bold text-white mb-5">Monthly Bookings</h2>
                  {data.monthlyData?.length ? (
                    <div className="space-y-3">
                      {data.monthlyData.map((m, i) => {
                        const maxCount = Math.max(...data.monthlyData.map(x => x.count))
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <span className="text-slate-500 text-xs w-8 shrink-0">{MONTHS[(m._id.m || 1) - 1]}</span>
                            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 rounded-full"
                                style={{ width: `${(m.count / maxCount) * 100}%` }} />
                            </div>
                            <span className="text-slate-400 text-xs w-6 text-right">{m.count}</span>
                          </div>
                        )
                      })}
                    </div>
                  ) : <p className="text-slate-600 text-sm">No data for last 6 months.</p>}
                </div>
              </div>

              {/* Category breakdown */}
              {data.categoryBreakdown?.length > 0 && (
                <div className="card p-6 mb-8">
                  <h2 className="font-display text-lg font-bold text-white mb-5">Events by Category</h2>
                  <div className="flex flex-wrap gap-3">
                    {data.categoryBreakdown.map(c => (
                      <div key={c._id} className="badge-cat px-4 py-2 text-sm">
                        {c._id} <span className="ml-2 font-bold text-white">{c.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick links */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { to: '/admin/events',   label: 'Manage Events',   icon: '🎪' },
                  { to: '/admin/artists',  label: 'Manage Artists',  icon: '🎤' },
                  { to: '/admin/bookings', label: 'View Bookings',   icon: '🎫' },
                  { to: '/admin/users',    label: 'View Users',      icon: '👥' },
                ].map(({ to, label, icon }) => (
                  <Link key={to} to={to} className="card-hover p-5 text-center group">
                    <div className="text-3xl mb-2">{icon}</div>
                    <p className="text-sm text-slate-400 group-hover:text-white transition-colors">{label}</p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
