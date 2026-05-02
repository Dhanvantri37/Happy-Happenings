import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import AdminSidebar from '../../components/AdminSidebar'

const STATUS_CLS = { paid:'badge-success', pending:'badge-warn', failed:'badge-danger', refunded:'badge bg-slate-500/20 text-slate-400 border border-slate-500/20' }

export default function AdminBookings() {
  const [bookings,   setBookings]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [filter,     setFilter]     = useState('all')
  const [scanId,     setScanId]     = useState('')
  const [scanResult, setScanResult] = useState(null)
  const [scanning,   setScanning]   = useState(false)

  useEffect(() => {
    setLoading(true)
    api.get('/bookings/all')
      .then(({ data }) => setBookings(data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false))
  }, [])

  const validate = async () => {
    if (!scanId.trim()) return
    setScanning(true); setScanResult(null)
    try {
      const { data } = await api.post(`/bookings/validate/${scanId.trim().toUpperCase()}`)
      setScanResult({ ok: true, msg: data.message, booking: data.booking })
      toast.success(data.message)
      setBookings(prev => prev.map(b => b.bookingId === scanId.trim().toUpperCase() ? { ...b, isValidated: true } : b))
    } catch (err) {
      const msg = err.response?.data?.message || 'Validation failed'
      setScanResult({ ok: false, msg, booking: err.response?.data?.booking })
      toast.error(msg)
    } finally { setScanning(false) }
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.paymentStatus === filter)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex gap-8">
        <AdminSidebar />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <p className="section-label mb-1">Admin</p>
              <h1 className="section-title">Bookings</h1>
            </div>
            <span className="text-slate-500 text-sm">{filtered.length} records</span>
          </div>

          {/* Ticket scanner */}
          <div className="card p-5 mb-6 border-violet-500/20">
            <h3 className="font-semibold text-white text-sm mb-3">🔍 Venue Ticket Scanner</h3>
            <div className="flex gap-3">
              <input className="input flex-1 font-mono text-sm" placeholder="Enter Booking ID (e.g. HHM-A1B2C3D4)"
                value={scanId} onChange={e => setScanId(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && validate()} />
              <button onClick={validate} disabled={scanning || !scanId.trim()} className="btn-primary px-5 disabled:opacity-50">
                {scanning ? '…' : 'Validate'}
              </button>
            </div>
            {scanResult && (
              <div className={`mt-3 p-3 rounded-xl border text-sm ${scanResult.ok ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
                {scanResult.msg}
                {scanResult.booking && (
                  <div className="mt-1 text-xs text-slate-400">
                    {scanResult.booking.event?.title} · {scanResult.booking.attendeeName}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {['all','paid','pending','failed','refunded'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-xl text-sm font-semibold capitalize transition-all ${filter===f ? 'bg-violet-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}>
                {f}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-600">No bookings found.</div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/[0.07]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.07] text-xs text-slate-600 uppercase tracking-wider">
                    {['Booking ID','User','Event','Tickets','Amount','Status','Validated','Date'].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filtered.map(b => (
                    <tr key={b._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 font-mono text-violet-400 text-xs">{b.bookingId}</td>
                      <td className="px-4 py-3">
                        <p className="text-white font-medium">{b.user?.name}</p>
                        <p className="text-slate-600 text-xs">{b.user?.email}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-300 max-w-[140px] truncate">{b.event?.title || '—'}</td>
                      <td className="px-4 py-3 text-slate-400">{b.tickets?.reduce((s,t) => s+t.quantity, 0)} ticket(s)</td>
                      <td className="px-4 py-3 text-white font-semibold">
                        {b.totalAmount === 0 ? <span className="badge-free text-xs">Free</span> : `₹${b.totalAmount.toLocaleString('en-IN')}`}
                      </td>
                      <td className="px-4 py-3"><span className={STATUS_CLS[b.paymentStatus] || 'badge-warn'}>{b.paymentStatus}</span></td>
                      <td className="px-4 py-3">
                        {b.isValidated ? <span className="text-emerald-400 text-xs">✅ Yes</span> : <span className="text-slate-700 text-xs">No</span>}
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">
                        {new Date(b.createdAt).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
