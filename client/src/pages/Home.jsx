import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import EventCard from '../components/EventCard'
import { LOGO } from '../utils/logo'

const CATS = [
  { label: 'Concerts',    icon: '🎸', q: 'Concert' },
  { label: 'DJ Nights',   icon: '🎧', q: 'DJ Night' },
  { label: 'Fests',       icon: '🎪', q: 'Fest' },
  { label: 'Live Shows',  icon: '🎤', q: 'Live Performance' },
  { label: 'Acoustic',    icon: '🎵', q: 'Acoustic Night' },
  { label: 'Open Mic',    icon: '🎙', q: 'Open Mic' },
  { label: 'Workshops',   icon: '🎓', q: 'Workshop' },
  { label: 'Free Events', icon: '🆓', q: null, free: true },
]

function StatCard({ value, label, icon }) {
  return (
    <div className="text-center">
      <div className="text-3xl mb-1">{icon}</div>
      <div className="font-display text-3xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">{label}</div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[16/9]" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-5 w-3/4 rounded-lg" />
        <div className="skeleton h-4 w-1/2 rounded-lg" />
        <div className="skeleton h-4 w-2/3 rounded-lg" />
        <div className="skeleton h-8 w-full rounded-xl mt-4" />
      </div>
    </div>
  )
}

export default function Home() {
  const [featured, setFeatured]   = useState([])
  const [free, setFree]           = useState([])
  const [upcoming, setUpcoming]   = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/events?featured=true&status=upcoming'),
      api.get('/events?isFree=true&status=upcoming'),
      api.get('/events?status=upcoming'),
    ]).then(([f, fr, u]) => {
      setFeatured(f.data.slice(0, 3))
      setFree(fr.data.slice(0, 3))
      setUpcoming(u.data.slice(0, 6))
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Animated glow orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-violet-700/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-3/4 left-1/4 w-[300px] h-[300px] bg-violet-900/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '3s' }} />
        </div>

        {/* Sparkle stars */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute text-violet-300/40 text-2xl animate-twinkle pointer-events-none"
            style={{ top: `${10 + i * 10}%`, left: `${5 + i * 12}%`, animationDelay: `${i * 0.4}s`, animationDuration: `${2.5 + i * 0.3}s` }}>
            ✦
          </div>
        ))}

        <div className="relative max-w-7xl mx-auto px-4 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Text */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600/15 border border-violet-500/30 mb-8">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-violet-300 text-xs font-semibold tracking-widest uppercase">India's Premier Music Events Platform</span>
            </div>

            <h1 className="font-display font-black text-white leading-[1.05] mb-6">
              <span className="text-5xl md:text-6xl lg:text-7xl block">Feel the</span>
              <span className="font-script text-6xl md:text-7xl lg:text-8xl bg-gradient-to-r from-violet-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent block mt-1">
                Music ✦
              </span>
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 mb-10">
              Discover electrifying concerts, DJ nights & fests. Book your tickets, get your QR code, and live the experience. From intimate acoustic sessions to massive stadium shows.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/events" className="btn-primary text-base px-8 py-4 animate-glow">
                Explore Events 🎉
              </Link>
              <Link to="/events?isFree=true" className="btn-secondary text-base px-8 py-4">
                🆓 Free Events
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-14 pt-8 border-t border-white/8">
              <StatCard value="500+" label="Events"  icon="🎪" />
              <StatCard value="50K+" label="Fans"    icon="🎵" />
              <StatCard value="100+" label="Artists" icon="🎤" />
            </div>
          </div>

          {/* Right: Floating logo + disco effect */}
          <div className="flex items-center justify-center relative">
            <div className="relative w-72 h-72 md:w-80 md:h-80">
              {/* Glow rings */}
              <div className="absolute inset-0 rounded-full bg-violet-600/20 blur-2xl animate-pulse-slow" />
              <div className="absolute inset-4 rounded-full border border-violet-500/20 animate-spin-slow" />
              <div className="absolute inset-8 rounded-full border border-indigo-500/15" style={{ animation: 'spin 35s linear infinite reverse' }} />

              {/* Logo */}
              <div className="absolute inset-6 rounded-full overflow-hidden ring-4 ring-violet-500/30 shadow-2xl shadow-violet-900/50 animate-float">
                <img src={LOGO} alt="Happy Happenings Music" className="w-full h-full object-cover" />
              </div>

              {/* Orbiting sparkles */}
              {[0, 72, 144, 216, 288].map((deg, i) => (
                <div key={i} className="absolute w-3 h-3 text-yellow-300 animate-twinkle"
                  style={{
                    top: `${50 - 45 * Math.cos((deg * Math.PI) / 180)}%`,
                    left: `${50 + 45 * Math.sin((deg * Math.PI) / 180)}%`,
                    animationDelay: `${i * 0.6}s`,
                    fontSize: i % 2 === 0 ? '12px' : '8px',
                  }}>
                  ✦
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-violet-500/50 to-transparent" />
        </div>
      </section>

      {/* ── CATEGORY CHIPS ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-wrap gap-3 justify-center">
          {CATS.map(({ label, icon, q, free }) => (
            <Link key={label}
              to={free ? '/events?isFree=true' : `/events?category=${encodeURIComponent(q)}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-white/10 hover:border-violet-500/40 text-slate-300 hover:text-white text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-900/20">
              <span>{icon}</span> {label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED EVENTS ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="section-label mb-2">⭐ Handpicked</p>
            <h2 className="section-title">Featured <span className="text-violet-400">Events</span></h2>
          </div>
          <Link to="/events?featured=true" className="btn-secondary text-sm hidden sm:flex">View all →</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((ev, i) => <EventCard key={ev._id} event={ev} index={i} />)}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-12">No featured events yet.</p>
        )}
      </section>

      {/* ── FREE EVENTS BANNER ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="rounded-2xl p-8 relative overflow-hidden border border-emerald-500/20" style={{ background: 'linear-gradient(135deg,rgba(16,185,129,.08) 0%,rgba(6,78,59,.15) 100%)' }}>
          <div className="absolute top-0 right-0 text-[120px] opacity-5 leading-none">🆓</div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-2">No ticket needed</p>
              <h2 className="font-display text-3xl font-bold text-white mb-2">Free Events This Week</h2>
              <p className="text-slate-400 text-sm">Open mics, outdoor jams, and community shows — all completely free.</p>
            </div>
            <div className="flex flex-col gap-4 min-w-[280px]">
              {loading ? (
                <div className="skeleton h-16 rounded-xl" />
              ) : free.length > 0 ? (
                free.map(ev => (
                  <Link key={ev._id} to={`/events/${ev._id}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-emerald-500/15 hover:border-emerald-400/30 transition-all">
                    <img src={ev.image || 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=100&q=60'} alt={ev.title}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-white text-sm font-semibold line-clamp-1">{ev.title}</p>
                      <p className="text-emerald-400 text-xs">{ev.venue?.city} · {ev.time}</p>
                    </div>
                  </Link>
                ))
              ) : <p className="text-slate-500 text-sm">Check back soon!</p>}
            </div>
          </div>
        </div>
      </section>

      {/* ── ALL UPCOMING ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="section-label mb-2">📅 Don't miss out</p>
            <h2 className="section-title">Upcoming <span className="text-violet-400">Shows</span></h2>
          </div>
          <Link to="/events" className="btn-secondary text-sm hidden sm:flex">View all →</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : upcoming.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((ev, i) => <EventCard key={ev._id} event={ev} index={i} />)}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🎵</div>
            <p className="text-slate-400">No events right now. Check back soon!</p>
          </div>
        )}
        <div className="text-center mt-10">
          <Link to="/events" className="btn-secondary px-8 py-3">Browse All Events →</Link>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-y border-violet-500/15 my-12" style={{ background: 'linear-gradient(135deg,rgba(109,40,217,.12) 0%,rgba(79,70,229,.08) 50%,rgba(109,40,217,.12) 100%)' }}>
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg,rgba(139,92,246,.3) 0px,rgba(139,92,246,.3) 1px,transparent 1px,transparent 40px)' }} />
        <div className="relative max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-violet-500/30 mx-auto mb-6 shadow-xl shadow-violet-900/40 animate-float">
            <img src={LOGO} alt="HHM" className="w-full h-full object-cover" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Are You an Artist?</h2>
          <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
            List your events on Happy Happenings Music and reach thousands of passionate music fans across India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://www.instagram.com/happyhappeningsmusic?igsh=MXI1Z2U3ZHloNGZkaA==" target="_blank" rel="noopener noreferrer"
              className="btn-primary px-8 py-3.5 text-base">
              Connect on Instagram →
            </a>
            <a href="mailto:hello@happyhappenings.music" className="btn-secondary px-8 py-3.5 text-base">
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
