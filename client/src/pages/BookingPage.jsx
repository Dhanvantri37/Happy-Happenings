import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const FALLBACK = 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=60'

export default function BookingPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [event, setEvent]       = useState(null)
  const [loading, setLoading]   = useState(true)
  const [quantities, setQty]    = useState({})
  const [step, setStep]         = useState(1)   // 1:select 2:details 3:pay 4:success
  const [booking, setBooking]   = useState(null)
  const [processing, setProc]   = useState(false)
  const [attendee, setAttendee] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' })

  useEffect(() => {
    api.get(`/events/${id}`)
      .then(({ data }) => {
        setEvent(data)
        const init = {}
        data.ticketTiers?.forEach(t => { init[t.name] = 0 })
        setQty(init)
      })
      .catch(() => { toast.error('Event not found'); navigate('/events') })
      .finally(() => setLoading(false))
  }, [id])

  const totalAmount  = event?.ticketTiers?.reduce((s, t) => s + (quantities[t.name] || 0) * t.price, 0) || 0
  const totalTickets = Object.values(quantities).reduce((s, v) => s + v, 0)

  const changeQty = (name, delta) => {
    const tier = event.ticketTiers.find(t => t.name === name)
    const cur  = quantities[name] || 0
    const next = Math.max(0, Math.min(10, cur + delta))
    if (next > tier.availableSeats) { toast.error(`Only ${tier.availableSeats} seats left`); return }
    setQty(q => ({ ...q, [name]: next }))
  }

  const confirmBooking = async (paymentId = '', razorpayOrderId = '') => {
    const tickets = event.ticketTiers
      .filter(t => quantities[t.name] > 0)
      .map(t => ({ tierName: t.name, quantity: quantities[t.name], pricePerTicket: t.price }))
    try {
      const { data } = await api.post('/bookings', {
        eventId: event._id, tickets, totalAmount, paymentId, razorpayOrderId,
        attendeeName: attendee.name, attendeeEmail: attendee.email, attendeePhone: attendee.phone,
      })
      setBooking(data)
      setStep(4)
      toast.success('🎉 Booking confirmed!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed')
    } finally { setProc(false) }
  }

  const handlePay = async () => {
    if (totalTickets === 0) { toast.error('Select at least one ticket'); return }
    setProc(true)

    // Free booking — skip payment
    if (totalAmount === 0) {
      await confirmBooking()
      return
    }

    try {
      const { data: order } = await api.post('/payments/create-order', { amount: totalAmount })

      // Demo mode
      if (order.demoMode) {
        await confirmBooking(`pay_demo_${Date.now()}`, order.id)
        return
      }

      // Real Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
        amount: order.amount,
        currency: 'INR',
        name: 'Happy Happenings Music',
        description: event.title,
        image: '/logo.png',
        order_id: order.id,
        prefill: { name: attendee.name, email: attendee.email, contact: attendee.phone },
        theme: { color: '#7c3aed' },
        handler: async res => {
          const { data: v } = await api.post('/payments/verify', {
            razorpay_order_id: res.razorpay_order_id,
            razorpay_payment_id: res.razorpay_payment_id,
            razorpay_signature: res.razorpay_signature,
          })
          if (v.verified) await confirmBooking(v.paymentId, order.id)
          else toast.error('Payment verification failed')
        },
        modal: { ondismiss: () => setProc(false) },
      }
      new window.Razorpay(options).open()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment error')
      setProc(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  /* ── SUCCESS SCREEN ─────────────────────────────────────────────────────── */
  if (step === 4 && booking) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-8xl mb-6 animate-float">🎫</div>
      <h1 className="font-display text-4xl font-bold text-white mb-2">Booking Confirmed!</h1>
      <p className="text-slate-400 mb-8">Your ticket is ready. Have an amazing time! 🎵</p>

      <div className="ticket p-6 mb-6">
        {/* Dashed divider */}
        <div className="mb-4 pb-4 border-b border-dashed border-violet-500/30">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Booking ID</p>
          <p className="font-mono text-violet-400 text-xl font-bold">{booking.bookingId}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <p className="text-slate-500 text-xs mb-0.5">Event</p>
            <p className="text-white font-semibold">{booking.event?.title}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-0.5">Attendee</p>
            <p className="text-white font-semibold">{booking.attendeeName}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-0.5">Tickets</p>
            <p className="text-white font-semibold">{booking.tickets?.map(t => `${t.tierName} ×${t.quantity}`).join(', ')}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-0.5">Total Paid</p>
            <p className="text-violet-300 font-bold text-lg font-display">
              {booking.totalAmount === 0 ? 'FREE' : `₹${booking.totalAmount.toLocaleString('en-IN')}`}
            </p>
          </div>
        </div>

        {/* QR */}
        {booking.qrCode && (
          <div className="flex flex-col items-center mt-4 pt-4 border-t border-dashed border-violet-500/30">
            <p className="text-xs text-slate-500 mb-3">Show this QR code at the venue entrance</p>
            <div className="p-3 bg-white rounded-2xl inline-block shadow-xl shadow-violet-900/30">
              <img src={booking.qrCode} alt="Ticket QR" className="w-44 h-44" />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={() => navigate('/my-bookings')} className="btn-primary px-8 py-3">View My Bookings →</button>
        <button onClick={() => navigate('/events')} className="btn-secondary px-8 py-3">Browse More Events</button>
      </div>
    </div>
  )

  /* ── BOOKING FLOW ──────────────────────────────────────────────────────── */
  const steps = ['Select Tickets', 'Your Details', 'Payment']

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Link to={`/events/${id}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-violet-300 transition-colors text-sm mb-8">
        ← Back to Event
      </Link>

      {/* Progress stepper */}
      <div className="flex items-center gap-2 mb-10">
        {steps.map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 ${step > i + 1 ? 'cursor-pointer' : ''}`}
              onClick={() => step > i + 1 && setStep(i + 1)}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step > i + 1 ? 'bg-emerald-600 text-white' : step === i + 1 ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40' : 'bg-navy-800 text-slate-600 border border-white/10'
              }`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${step === i + 1 ? 'text-white' : 'text-slate-600'}`}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-8 h-px mx-1 ${step > i + 1 ? 'bg-emerald-500' : 'bg-white/10'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Main content */}
        <div className="md:col-span-2 space-y-5">

          {/* Event mini-card */}
          <div className="card p-4 flex gap-4 items-center">
            <img src={event.image || FALLBACK} alt={event.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" onError={e => { e.target.src = FALLBACK }} />
            <div>
              <h2 className="font-display font-bold text-white text-lg">{event.title}</h2>
              <p className="text-slate-400 text-sm">📅 {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {event.time}</p>
              <p className="text-slate-400 text-sm">📍 {event.venue?.name}, {event.venue?.city}</p>
            </div>
          </div>

          {/* Step 1 – Select Tickets */}
          {step === 1 && (
            <div className="card p-6">
              <h3 className="font-display text-xl font-bold text-white mb-5">Select Tickets</h3>
              <div className="space-y-4">
                {event.ticketTiers?.map(tier => (
                  <div key={tier.name} className={`p-4 rounded-xl border transition-all ${tier.availableSeats > 0 ? 'border-white/10 hover:border-violet-500/20' : 'border-white/5 opacity-40'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-white">{tier.name}</span>
                          {tier.price === 0 && <span className="badge-free text-xs">FREE</span>}
                        </div>
                        {tier.perks && <p className="text-xs text-slate-500">{tier.perks}</p>}
                        <p className="text-xs text-slate-600 mt-0.5">{tier.availableSeats} seats left</p>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <span className="font-display text-2xl font-bold text-violet-300 min-w-[70px] text-right">
                          {tier.price === 0 ? <span className="text-emerald-400 text-base">FREE</span> : `₹${tier.price.toLocaleString('en-IN')}`}
                        </span>
                        {tier.availableSeats > 0 && (
                          <div className="flex items-center gap-2">
                            <button onClick={() => changeQty(tier.name, -1)}
                              className="w-8 h-8 rounded-lg bg-navy-700 hover:bg-navy-600 text-white font-bold transition-colors border border-white/10">−</button>
                            <span className="w-6 text-center text-white font-mono font-semibold">{quantities[tier.name] || 0}</span>
                            <button onClick={() => changeQty(tier.name, 1)}
                              className="w-8 h-8 rounded-lg bg-violet-700 hover:bg-violet-600 text-white font-bold transition-colors">+</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 – Attendee Details */}
          {step === 2 && (
            <div className="card p-6">
              <h3 className="font-display text-xl font-bold text-white mb-5">Your Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="label">Full Name *</label>
                  <input className="input" value={attendee.name} onChange={e => setAttendee(a => ({ ...a, name: e.target.value }))} placeholder="As on ID" required />
                </div>
                <div>
                  <label className="label">Email Address *</label>
                  <input className="input" type="email" value={attendee.email} onChange={e => setAttendee(a => ({ ...a, email: e.target.value }))} placeholder="your@email.com" required />
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input className="input" type="tel" value={attendee.phone} onChange={e => setAttendee(a => ({ ...a, phone: e.target.value }))} placeholder="+91 98765 43210" />
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-4">Your QR ticket will be linked to this information.</p>
            </div>
          )}

          {/* Step 3 – Payment summary */}
          {step === 3 && (
            <div className="card p-6">
              <h3 className="font-display text-xl font-bold text-white mb-5">Payment Summary</h3>
              <div className="space-y-3">
                {event.ticketTiers?.filter(t => quantities[t.name] > 0).map(t => (
                  <div key={t.name} className="flex justify-between text-sm text-slate-300">
                    <span>{t.name} × {quantities[t.name]}</span>
                    <span>{t.price === 0 ? 'FREE' : `₹${(t.price * quantities[t.name]).toLocaleString('en-IN')}`}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/8 mt-4 pt-4 flex justify-between font-bold text-lg">
                <span className="text-white">Total</span>
                <span className="text-violet-300 font-display">
                  {totalAmount === 0 ? 'FREE' : `₹${totalAmount.toLocaleString('en-IN')}`}
                </span>
              </div>

              {totalAmount > 0 && (
                <div className="mt-4 p-3 rounded-xl bg-navy-800/60 border border-white/8 text-xs text-slate-500">
                  <p className="font-semibold text-slate-400 mb-1">🔒 Secure Payment via Razorpay</p>
                  <p>Demo mode: Payment is auto-confirmed. No real money is charged.</p>
                </div>
              )}
              {totalAmount === 0 && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
                  🆓 This is a free event — no payment required!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="md:col-span-1">
          <div className="card p-5 sticky top-24">
            <h3 className="font-semibold text-white text-sm mb-4">Order Summary</h3>

            {totalTickets === 0 ? (
              <p className="text-slate-600 text-sm">No tickets selected yet.</p>
            ) : (
              <div className="space-y-2 mb-4">
                {event.ticketTiers?.filter(t => quantities[t.name] > 0).map(t => (
                  <div key={t.name} className="flex justify-between text-sm">
                    <span className="text-slate-400">{t.name} ×{quantities[t.name]}</span>
                    <span className="text-white">{t.price === 0 ? 'FREE' : `₹${(t.price * quantities[t.name]).toLocaleString('en-IN')}`}</span>
                  </div>
                ))}
                <div className="border-t border-white/8 pt-2 flex justify-between font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-violet-300 font-display text-lg">
                    {totalAmount === 0 ? 'FREE' : `₹${totalAmount.toLocaleString('en-IN')}`}
                  </span>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            {step === 1 && (
              <button onClick={() => { if (totalTickets === 0) { toast.error('Select at least one ticket'); return } setStep(2) }}
                disabled={totalTickets === 0}
                className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed">
                Continue →
              </button>
            )}
            {step === 2 && (
              <div className="space-y-2">
                <button onClick={() => setStep(1)} className="btn-secondary w-full text-sm">← Back</button>
                <button onClick={() => { if (!attendee.name || !attendee.email) { toast.error('Name and email required'); return } setStep(3) }} className="btn-primary w-full">
                  Review Order →
                </button>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-2">
                <button onClick={() => setStep(2)} className="btn-secondary w-full text-sm">← Back</button>
                <button onClick={handlePay} disabled={processing} className="btn-primary w-full disabled:opacity-60">
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing…
                    </span>
                  ) : totalAmount === 0 ? 'Confirm Free Booking 🎫' : `Pay ₹${totalAmount.toLocaleString('en-IN')} 💳`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
