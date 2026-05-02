import { useState, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const GENRE_COLORS = {
  Electronic: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  'Hip-Hop':  'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Indie:      'text-green-400 bg-green-500/10 border-green-500/20',
  Rock:       'text-rose-400 bg-rose-500/10 border-rose-500/20',
  Pop:        'text-pink-400 bg-pink-500/10 border-pink-500/20',
  Jazz:       'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Bollywood:  'text-orange-400 bg-orange-500/10 border-orange-500/20',
  Classical:  'text-purple-400 bg-purple-500/10 border-purple-500/20',
}

export default function Artists() {
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')

  useEffect(() => {
    api.get('/artists')
      .then(({ data }) => setArtists(data))
      .catch(() => toast.error('Failed to load artists'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = artists.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.genre.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <p className="section-label mb-2">Discover</p>
          <h1 className="section-title">Our <span className="text-violet-400">Artists</span></h1>
        </div>
        <div className="relative w-full sm:w-64">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
          <input className="input pl-9 text-sm" placeholder="Search artists…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-64 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🎤</div>
          <p className="text-slate-500">No artists found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(artist => {
            const gc = GENRE_COLORS[artist.genre] || 'text-violet-400 bg-violet-500/10 border-violet-500/20'
            return (
              <div key={artist._id} className="card-hover group p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-3xl shrink-0 shadow-lg shadow-violet-900/30 group-hover:shadow-violet-700/40 transition-all">
                    {artist.image
                      ? <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" onError={e => { e.target.style.display='none' }} />
                      : '🎤'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-xl font-bold text-white group-hover:text-violet-300 transition-colors">{artist.name}</h3>
                    <span className={`badge border mt-1 ${gc}`}>{artist.genre}</span>
                  </div>
                </div>
                {artist.bio && (
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-4">{artist.bio}</p>
                )}
                <div className="flex gap-2 pt-3 border-t border-white/[0.06]">
                  {artist.socialLinks?.instagram && (
                    <a href={artist.socialLinks.instagram} target="_blank" rel="noreferrer"
                      className="btn-ghost text-xs py-1.5 px-3 gap-1">📸 Instagram</a>
                  )}
                  {artist.socialLinks?.spotify && (
                    <a href={artist.socialLinks.spotify} target="_blank" rel="noreferrer"
                      className="btn-ghost text-xs py-1.5 px-3 gap-1">🎵 Spotify</a>
                  )}
                  {artist.socialLinks?.youtube && (
                    <a href={artist.socialLinks.youtube} target="_blank" rel="noreferrer"
                      className="btn-ghost text-xs py-1.5 px-3 gap-1">▶️ YouTube</a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
