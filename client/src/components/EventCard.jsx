import { Link } from 'react-router-dom'

const CAT_COLORS = {
  'Concert':         'bg-violet-500/15 text-violet-300 border-violet-500/25',
  'DJ Night':        'bg-cyan-500/15    text-cyan-300    border-cyan-500/25',
  'Fest':            'bg-amber-500/15   text-amber-300   border-amber-500/25',
  'Live Performance':'bg-rose-500/15    text-rose-300    border-rose-500/25',
  'Workshop':        'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  'Open Mic':        'bg-sky-500/15     text-sky-300     border-sky-500/25',
  'Acoustic Night':  'bg-pink-500/15    text-pink-300    border-pink-500/25',
}

const FALLBACKS = [
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=70',
  'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600&q=70',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=70',
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&q=70',
]

export default function EventCard({ event, index = 0 }) {
  const img      = event.image || FALLBACKS[index % FALLBACKS.length]
  const minPrice = event.minPrice ?? event.ticketTiers?.[0]?.price ?? 0
  const date     = new Date(event.date)
  const catClass = CAT_COLORS[event.category] || 'bg-slate-500/15 text-slate-300 border-slate-500/25'

  return (
    <Link to={`/events/${event._id}`} className="group block h-full">
      <div className="card-hover h-full flex flex-col">

        {/* Image */}
        <div className="relative overflow-hidden aspect-[16/9]">
          <img src={img} alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={e => { e.target.src = FALLBACKS[0] }} />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent" />

          {/* Category */}
          <div className="absolute top-3 left-3">
            <span className={`badge border ${catClass} text-xs`}>{event.category}</span>
          </div>

          {/* Free or Featured */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
            {event.isFree     && <span className="badge-free">🆓 FREE</span>}
            {event.isFeatured && <span className="badge bg-gold/20 text-yellow-300 border border-yellow-500/25">⭐</span>}
          </div>

          {/* Date overlay */}
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-center">
            <div className="text-xs text-slate-400">{date.toLocaleString('en-IN', { month: 'short' }).toUpperCase()}</div>
            <div className="text-lg font-bold text-white leading-none">{date.getDate()}</div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col flex-1 gap-3">
          <div>
            <h3 className="font-display font-bold text-white text-lg leading-snug group-hover:text-violet-200 transition-colors line-clamp-2">
              {event.title}
            </h3>
            {event.artist && (
              <p className="text-violet-400 text-sm mt-1 font-medium">🎤 {event.artist.name}</p>
            )}
          </div>

          <div className="space-y-1 text-sm text-slate-500">
            <p className="flex items-center gap-1.5">
              <span>📅</span>
              {date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              {event.time && <span className="text-slate-600">• {event.time}</span>}
            </p>
            <p className="flex items-center gap-1.5 line-clamp-1">
              <span>📍</span> {event.venue?.name}, {event.venue?.city}
            </p>
          </div>

          {/* Availability bar */}
          {event.ticketTiers?.length > 0 && (() => {
            const total = event.ticketTiers.reduce((s, t) => s + t.totalSeats, 0)
            const avail = event.ticketTiers.reduce((s, t) => s + t.availableSeats, 0)
            const pct   = total ? (avail / total) * 100 : 0
            return (
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>{avail} seats left</span>
                  <span>{Math.round(pct)}% available</span>
                </div>
                <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${pct < 20 ? 'bg-rose-500' : pct < 50 ? 'bg-amber-500' : 'bg-violet-500'}`}
                    style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })()}

          {/* Price + CTA */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/8">
            <div>
              <div className="text-xs text-slate-600">From</div>
              <div className="font-display text-xl font-bold text-white">
                {event.isFree ? <span className="text-emerald-400">FREE</span> : `₹${minPrice.toLocaleString('en-IN')}`}
              </div>
            </div>
            <div className="btn-primary text-xs py-2 px-4 pointer-events-none">Book Now →</div>
          </div>
        </div>
      </div>
    </Link>
  )
}
