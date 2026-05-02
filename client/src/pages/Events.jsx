import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import api from '../utils/api'
import EventCard from '../components/EventCard'

const CATS = ['All', 'Concert', 'DJ Night', 'Fest', 'Live Performance', 'Acoustic Night', 'Open Mic', 'Workshop']

function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[16/9]" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-5 w-3/4 rounded-lg" />
        <div className="skeleton h-4 w-1/2 rounded-lg" />
        <div className="skeleton h-8 rounded-xl mt-4" />
      </div>
    </div>
  )
}

export default function Events() {
  const [events, setEvents]   = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput]   = useState(searchParams.get('search') || '')

  const category = searchParams.get('category') || 'All'
  const isFree   = searchParams.get('isFree') === 'true'
  const search   = searchParams.get('search') || ''

  const fetchEvents = useCallback(() => {
    setLoading(true)
    const p = new URLSearchParams({ status: 'upcoming' })
    if (category !== 'All') p.set('category', category)
    if (isFree)  p.set('isFree', 'true')
    if (search)  p.set('search', search)
    api.get(`/events?${p}`)
      .then(({ data }) => setEvents(data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [category, isFree, search])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams)
    if (val) p.set(key, val)
    else     p.delete(key)
    setSearchParams(p)
  }

  const handleSearch = e => {
    e.preventDefault()
    setParam('search', searchInput)
  }

  const clearFilters = () => {
    setSearchInput('')
    setSearchParams({})
  }

  const hasFilters = category !== 'All' || isFree || search

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="section-label mb-2">🎵 Discover</p>
        <h1 className="section-title">Live <span className="text-violet-400">Events</span></h1>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="relative mb-8 max-w-lg">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">🔍</span>
        <input className="input pl-11 pr-28" placeholder="Search events, artists, cities…"
          value={searchInput} onChange={e => setSearchInput(e.target.value)} />
        <button type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary text-xs py-1.5 px-4">
          Search
        </button>
      </form>

      {/* Filters row */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {CATS.map(cat => (
            <button key={cat} onClick={() => setParam('category', cat === 'All' ? '' : cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                (cat === 'All' && category === 'All') || category === cat
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30'
                  : 'bg-navy-800/70 text-slate-400 hover:text-white hover:bg-navy-700/70 border border-white/8'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Free toggle */}
        <button onClick={() => setParam('isFree', isFree ? '' : 'true')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
            isFree ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40' : 'bg-navy-800/70 text-slate-400 border-white/8 hover:text-white'
          }`}>
          🆓 Free Only
        </button>

        {hasFilters && (
          <button onClick={clearFilters} className="text-xs text-rose-400 hover:text-rose-300 ml-2 underline underline-offset-2">
            Clear filters
          </button>
        )}
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-slate-600 text-sm mb-6">
          {events.length} event{events.length !== 1 ? 's' : ''} found
          {search && <span> for "<span className="text-violet-400">{search}</span>"</span>}
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev, i) => <EventCard key={ev._id} event={ev} index={i} />)}
        </div>
      ) : (
        <div className="text-center py-28">
          <div className="text-7xl mb-6">🎵</div>
          <h3 className="font-display text-2xl font-bold text-white mb-2">No Events Found</h3>
          <p className="text-slate-500 mb-6">Try a different category, city, or search term.</p>
          <button onClick={clearFilters} className="btn-primary">Browse All Events</button>
        </div>
      )}
    </div>
  )
}
