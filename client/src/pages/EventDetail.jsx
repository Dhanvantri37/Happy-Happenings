import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const FALLBACK = 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80'

function StarRating({ rating, onRate, interactive = false }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button"
          onClick={() => interactive && onRate && onRate(n)}
          onMouseEnter={() => interactive && setHover(n)}
          onMouseLeave={() => interactive && setHover(0)}
          className={`text-xl transition-all ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} ${n <= (hover || rating) ? 'text-yellow-400' : 'text-slate-600'}`}>
          ★
        </button>
      ))}
    </div>
  )
}

export default function EventDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [event, setEvent]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [wishlist, setWishlist] = useState([])
  const [wishlisted, setWishlisted] = useState(false)
  const [review, setReview]   = useState({ rating: 5, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    api.get(`/events/${id}`)
      .then(({ data }) => setEvent(data))
      .catch(() => toast.error('Event not found'))
      .finally(() => setLoading(false))
    if (user) {
      api.get('/wishlist')
        .then(({ data }) => {
          setWishlist(data)
          setWishlisted(data.some(e => e._id === id))
        }).catch(() => {})
    }
  }, [id, user])

  const toggleWishlist = async () => {
    if (!user) { toast.error('Please login first'); return }
    try {
      const { data } = await api.post('/wishlist/toggle', { eventId: id })
      setWishlisted(data.wishlisted)
      toast.success(data.wishlisted ? '❤️ Added to wishlist' : 'Removed from wishlist')
    } catch { toast.error('Failed to update wishlist') }
  }

  const handleReview = async e => {
    e.preventDefault()
    setSubmittingReview(true)
    try {
      const { data } = await api.post(`/events/${id}/reviews`, review)
      setEvent(prev => ({
        ...prev,
        reviews: [data, ...prev.reviews.filter(r => r.user?._id !== user._id)],
      }))
      toast.success('Review submitted! 🌟')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit review') }
    finally { setSubmittingReview(false) }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!event) return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <div className="text-6xl mb-4">😕</div>
        <h2 className="font-display text-3xl font-bold text-white mb-4">Event Not Found</h2>
        <Link to="/events" className="btn-primary">Browse Events</Link>
      </div>
    </div>
  )

  const date       = new Date(event.date)
  const isPast     = date < new Date()
  const totalAvail = event.ticketTiers?.reduce((s, t) => s + t.availableSeats, 0) ?? 0
  const totalSeats = event.ticketTiers?.reduce((s, t) => s + t.totalSeats, 0) ?? 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link to="/events" className="inline-flex items-center gap-2 text-slate-500 hover:text-violet-300 transition-colors text-sm mb-8">
        ← Back to Events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Hero image */}
          <div className="relative rounded-2xl overflow-hidden aspect-[16/9]">
            <img src={event.image || FALLBACK} alt={event.title}
              className="w-full h-full object-cover"
              onError={e => { e.target.src = FALLBACK }} />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-transparent" />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="badge-cat">{event.category}</span>
              {event.isFree && <span className="badge-free">🆓 FREE</span>}
              {event.isFeatured && <span className="badge bg-yellow-500/20 text-yellow-300 border border-yellow-500/25">⭐ Featured</span>}
            </div>

            {/* Wishlist */}
            <button onClick={toggleWishlist}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all ${
                wishlisted ? 'bg-rose-500/80 border-rose-400 text-white' : 'bg-black/40 border-white/20 text-white hover:bg-rose-500/40'
              }`}>
              {wishlisted ? '♥' : '♡'}
            </button>

            {/* Title overlay */}
            <div className="absolute bottom-5 left-5 right-5">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-lg">
                {event.title}
              </h1>
            </div>
          </div>

          {/* Quick meta chips */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon: '📅', text: date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) },
              { icon: '🕗', text: `${event.time}${event.endTime ? ` – ${event.endTime}` : ''}` },
              { icon: '📍', text: `${event.venue?.name}, ${event.venue?.city}` },
              ...(event.ageLimit ? [{ icon: '🔞', text: event.ageLimit }] : []),
              ...(event.dressCode ? [{ icon: '👗', text: event.dressCode }] : []),
            ].map(({ icon, text }, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-navy-800/60 border border-white/8 text-sm text-slate-300">
                <span>{icon}</span><span>{text}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="card p-6">
            <h2 className="font-display text-xl font-bold text-white mb-4">About This Event</h2>
            <p className="text-slate-400 leading-relaxed whitespace-pre-line">{event.description}</p>
            {event.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {event.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs border border-violet-500/20">#{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Artist */}
          {event.artist && (
            <div className="card p-6">
              <h2 className="font-display text-xl font-bold text-white mb-4">Performing Artist</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-violet-600 to-indigo-700 flex-shrink-0 flex items-center justify-center text-2xl">
                  {event.artist.image
                    ? <img src={event.artist.image} alt={event.artist.name} className="w-full h-full object-cover" />
                    : '🎤'}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{event.artist.name}</h3>
                  <span className="badge-cat mt-1 inline-block">{event.artist.genre}</span>
                  {event.artist.bio && <p className="text-slate-500 text-sm mt-2 line-clamp-2">{event.artist.bio}</p>}
                  {event.artist.socialLinks?.instagram && (
                    <a href={event.artist.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 mt-2">
                      Instagram →
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold text-white">Reviews</h2>
              {event.avgRating && (
                <div className="flex items-center gap-2">
                  <StarRating rating={Math.round(event.avgRating)} />
                  <span className="text-white font-bold">{event.avgRating}</span>
                  <span className="text-slate-500 text-sm">({event.reviews?.length})</span>
                </div>
              )}
            </div>

            {/* Write review */}
            {user && (
              <form onSubmit={handleReview} className="mb-6 p-4 rounded-xl bg-navy-800/50 border border-white/8">
                <p className="text-sm font-semibold text-slate-300 mb-3">Leave a review</p>
                <StarRating rating={review.rating} interactive onRate={r => setReview(v => ({ ...v, rating: r }))} />
                <textarea className="input mt-3 resize-none h-20 text-sm"
                  placeholder="Share your experience…"
                  value={review.comment}
                  onChange={e => setReview(v => ({ ...v, comment: e.target.value }))} />
                <button type="submit" disabled={submittingReview} className="btn-primary mt-3 text-sm py-2 px-5 disabled:opacity-60">
                  {submittingReview ? 'Submitting…' : 'Submit Review'}
                </button>
              </form>
            )}

            {event.reviews?.length > 0 ? (
              <div className="space-y-4">
                {event.reviews.map(r => (
                  <div key={r._id} className="p-4 rounded-xl bg-navy-800/40 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                          {r.user?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span className="text-sm font-medium text-white">{r.user?.name || 'Anonymous'}</span>
                      </div>
                      <StarRating rating={r.rating} />
                    </div>
                    {r.comment && <p className="text-slate-400 text-sm">{r.comment}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 text-sm">No reviews yet. Be the first!</p>
            )}
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-display text-xl font-bold text-white mb-5">Ticket Tiers</h2>

            {event.ticketTiers?.length > 0 ? (
              <div className="space-y-3 mb-5">
                {event.ticketTiers.map(tier => (
                  <div key={tier._id}
                    className={`p-4 rounded-xl border transition-colors ${
                      tier.availableSeats > 0 ? 'border-white/10 hover:border-violet-500/30' : 'border-white/5 opacity-50'
                    }`}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <span className="font-semibold text-white text-sm">{tier.name}</span>
                        {tier.perks && <p className="text-xs text-slate-500 mt-0.5">{tier.perks}</p>}
                      </div>
                      <span className="font-display text-xl font-bold text-violet-300">
                        {tier.price === 0 ? <span className="text-emerald-400">FREE</span> : `₹${tier.price.toLocaleString('en-IN')}`}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      {tier.availableSeats > 0 ? `${tier.availableSeats} seats available` : '⚠️ Sold out'}
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-slate-500 text-sm mb-5">No ticket info available.</p>}

            {/* Availability bar */}
            {totalSeats > 0 && (
              <div className="mb-5">
                <div className="flex justify-between text-xs text-slate-600 mb-1.5">
                  <span>Availability</span><span>{totalAvail}/{totalSeats} left</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all"
                    style={{ width: `${(totalAvail / totalSeats) * 100}%` }} />
                </div>
              </div>
            )}

            {/* CTA */}
            {isPast ? (
              <div className="text-center py-3 rounded-xl bg-navy-800/60 text-slate-500 text-sm">This event has ended</div>
            ) : totalAvail === 0 ? (
              <div className="text-center py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">Sold Out</div>
            ) : user ? (
              <button onClick={() => navigate(`/book/${event._id}`)} className="btn-primary w-full py-3.5 text-base">
                Book Tickets 🎫
              </button>
            ) : (
              <div className="space-y-3">
                <Link to="/login" className="btn-primary w-full py-3.5 text-base block text-center">Login to Book</Link>
                <p className="text-center text-xs text-slate-600">
                  New here? <Link to="/register" className="text-violet-400 hover:text-violet-300">Create account</Link>
                </p>
              </div>
            )}

            {/* Share / Wishlist */}
            <div className="mt-4 pt-4 border-t border-white/8 flex gap-3">
              <button onClick={toggleWishlist}
                className={`flex-1 btn-ghost text-sm py-2.5 rounded-xl border ${wishlisted ? 'border-rose-500/30 text-rose-400' : 'border-white/8'}`}>
                {wishlisted ? '♥ Wishlisted' : '♡ Wishlist'}
              </button>
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!') }}
                className="flex-1 btn-ghost text-sm py-2.5 rounded-xl border border-white/8">
                🔗 Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
