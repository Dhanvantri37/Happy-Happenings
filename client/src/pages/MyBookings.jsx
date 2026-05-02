import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'

const STATUS = {
  paid:     { label: 'Paid',     cls: 'badge-success' },
  pending:  { label: 'Pending',  cls: 'badge-warn' },
  failed:   { label: 'Failed',   cls: 'badge-danger' },
  refunded: { label: 'Refunded', cls: 'badge bg-slate-500/20 text-slate-400 border border-slate-500/20' },
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [qrModal, setQrModal]   = useState(null)
  const [cancelling, setCancelling] = useState(null)

  const load = () => {
    setLoading(true)
    api.get('/bookings/user')
      .then(({ data }) => setBookings(data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const cancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return
    setCancelling(bookingId)
    try {
      await api.put(`/bookings/cancel/${bookingId}`)
      toast.success('Booking cancelled.')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed')
    } finally { setCancelling(null) }
  }

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
      <div className="skeleton h-10 w-48 rounded-xl mb-8" />
      {[1,2,3].map(i => <div key={i} className="skeleton h-40 rounded-2xl" />)}
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <p className="section-label mb-2">Your Account</p>
        <h1 className="section-title">My <span className="text-violet-400">Bookings</span></h1>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-7xl mb-6 animate-float">🎫</div>
          <h3 className="font-display text-2xl font-bold text-white mb-2">No Bookings Yet</h3>
          <p className="text-slate-500 mb-8">Book your first event and your ticket will appear here!</p>
          <Link to="/events" className="btn-primary px-8 py-3.5">Explore Events →</Link>
        </div>
      ) : (
        <div className="space-y-5">
          {bookings.map(b => {
            const ev   = b.event
            const date = ev ? new Date(ev.date) : null
            const st   = STATUS[b.paymentStatus] || STATUS.pending
            const canCancel = b.paymentStatus === 'paid' && !b.isValidated

            return (
              <div key={b._id} className="card p-6 hover:border-violet-500/20 transition-all">
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* Image */}
                  {ev?.image && (
                    <Link to={`/events/${ev._id}`} className="shrink-0">
                      <div className="w-full sm:w-28 h-24 rounded-xl overflow-hidden bg-navy-700">
                        <img src={ev.image} alt={ev.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </div>
                    </Link>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                      <Link to={`/events/${ev?._id}`} className="font-display text-lg font-bold text-white hover:text-violet-300 transition-colors">
                        {ev?.title || 'Event Deleted'}
                      </Link>
                      <div className="flex items-center gap-2 flex-wrap">
                        {b.isFreeBooking && <span className="badge-free">Free</span>}
                        <span className={st.cls}>{st.label}</span>
                        {b.isValidated && <span className="badge-success">✓ Used</span>}
                      </div>
                    </div>

                    {date && (
                      <p className="text-slate-400 text-sm mb-1">
                        📅 {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {ev?.venue && ` · 📍 ${ev.venue.name}, ${ev.venue.city}`}
                      </p>
                    )}
                    <p className="text-slate-600 text-xs font-mono mb-3">ID: {b.bookingId}</p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {b.tickets?.map((t, i) => (
                        <span key={i} className="badge bg-white/5 text-slate-400 border border-white/10">
                          {t.tierName} × {t.quantity}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <span className="font-display text-xl text-violet-300 font-bold">
                        {b.totalAmount === 0 ? 'Free' : `₹${b.totalAmount.toLocaleString('en-IN')}`}
                      </span>
                      <div className="flex gap-2">
                        {b.qrCode && (
                          <button onClick={() => setQrModal(b)} className="btn-secondary text-xs py-1.5 px-3">
                            🔍 View QR
                          </button>
                        )}
                        {canCancel && (
                          <button onClick={() => cancel(b._id)}
                            disabled={cancelling === b._id}
                            className="btn-danger text-xs py-1.5 px-3 disabled:opacity-50">
                            {cancelling === b._id ? '…' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {b.isValidated && (
                  <div className="mt-4 pt-4 border-t border-white/[0.05] text-xs text-emerald-400 flex items-center gap-1.5">
                    ✅ Ticket validated at venue — hope you had a great time!
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* QR Modal */}
      {qrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setQrModal(null)}>
          <div className="card p-8 max-w-sm w-full text-center" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-2xl font-bold text-white mb-1">Your Ticket</h3>
            <p className="text-slate-400 text-sm mb-6">{qrModal.event?.title}</p>
            <div className="bg-white rounded-2xl p-4 inline-block mb-5 shadow-xl">
              <img src={qrModal.qrCode} alt="QR" className="w-48 h-48" />
            </div>
            <p className="font-mono text-violet-400 text-sm font-bold mb-1">{qrModal.bookingId}</p>
            <p className="text-slate-600 text-xs mb-6">Show this at the venue entrance</p>
            <button onClick={() => setQrModal(null)} className="btn-secondary w-full">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
