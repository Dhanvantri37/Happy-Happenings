import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'
import EventCard from '../components/EventCard'

export default function Wishlist() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/wishlist')
      .then(({ data }) => setEvents(data))
      .catch(() => toast.error('Failed to load wishlist'))
      .finally(() => setLoading(false))
  }, [])

  const remove = async (eventId) => {
    try {
      await api.post('/wishlist/toggle', { eventId })
      setEvents(prev => prev.filter(e => e._id !== eventId))
      toast.success('Removed from wishlist')
    } catch { toast.error('Failed to remove') }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <p className="section-label mb-2">Your Account</p>
        <h1 className="section-title">My <span className="text-violet-400">Wishlist</span></h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="skeleton aspect-[4/5] rounded-2xl" />)}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-7xl mb-6 animate-float">🤍</div>
          <h3 className="font-display text-2xl font-bold text-white mb-2">Wishlist is Empty</h3>
          <p className="text-slate-500 mb-8">Browse events and tap ❤️ to save them here.</p>
          <Link to="/events" className="btn-primary px-8 py-3.5">Browse Events →</Link>
        </div>
      ) : (
        <>
          <p className="text-slate-500 text-sm mb-6">{events.length} saved event{events.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev, i) => (
              <div key={ev._id} className="relative group">
                <EventCard event={ev} index={i} />
                <button onClick={() => remove(ev._id)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full glass flex items-center justify-center text-rose-400 hover:bg-rose-500/20 transition-all opacity-0 group-hover:opacity-100 z-10">
                  ❤️
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
