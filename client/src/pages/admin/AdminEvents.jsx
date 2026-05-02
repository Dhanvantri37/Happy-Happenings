import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import AdminSidebar from '../../components/AdminSidebar'

const EMPTY = {
  title: '', description: '', category: 'Concert', date: '', time: '8:00 PM', endTime: '',
  venue: { name: '', city: '', address: '' }, image: '', artist: '',
  isFeatured: false, isFree: false, ageLimit: 'All Ages', dressCode: '', tags: '',
  status: 'upcoming',
  ticketTiers: [{ name: 'General', price: 500, totalSeats: 100, availableSeats: 100, perks: '' }],
}
const CATS = ['Concert','DJ Night','Fest','Live Performance','Workshop','Open Mic','Acoustic Night']

export default function AdminEvents() {
  const [events,  setEvents]  = useState([])
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(false)
  const [form,    setForm]    = useState(EMPTY)
  const [editId,  setEditId]  = useState(null)
  const [saving,  setSaving]  = useState(false)
  const [filter,  setFilter]  = useState('upcoming')

  const load = () => {
    setLoading(true)
    Promise.all([
      api.get(`/events?status=${filter}`),
      api.get('/artists'),
    ]).then(([ev, ar]) => { setEvents(ev.data); setArtists(ar.data) })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }
  useEffect(load, [filter])

  const openCreate = () => { setForm(EMPTY); setEditId(null); setModal(true) }
  const openEdit   = ev => {
    setForm({
      ...ev,
      date:   ev.date ? ev.date.split('T')[0] : '',
      artist: ev.artist?._id || ev.artist || '',
      tags:   (ev.tags || []).join(', '),
      venue:  ev.venue || { name: '', city: '', address: '' },
    })
    setEditId(ev._id); setModal(true)
  }

  const del = async id => {
    if (!window.confirm('Delete this event?')) return
    try { await api.delete(`/events/${id}`); toast.success('Deleted'); load() }
    catch { toast.error('Delete failed') }
  }

  const setTier = (i, k, v) => {
    const tiers = [...form.ticketTiers]
    tiers[i] = { ...tiers[i], [k]: k === 'name' || k === 'perks' ? v : Number(v) }
    if (k === 'totalSeats' && !editId) tiers[i].availableSeats = Number(v)
    setForm(p => ({ ...p, ticketTiers: tiers }))
  }
  const addTier = () => setForm(p => ({ ...p, ticketTiers: [...p.ticketTiers, { name: 'VIP', price: 1000, totalSeats: 50, availableSeats: 50, perks: '' }] }))
  const remTier = i => setForm(p => ({ ...p, ticketTiers: p.ticketTiers.filter((_, j) => j !== i) }))

  const submit = async e => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = {
        ...form,
        tags:   form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        artist: form.artist || null,
        isFree: form.ticketTiers.every(t => t.price === 0),
      }
      if (editId) await api.put(`/events/${editId}`, payload)
      else        await api.post('/events', payload)
      toast.success(editId ? 'Event updated!' : 'Event created!')
      setModal(false); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed') }
    finally { setSaving(false) }
  }

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const fv = (k, v) => setForm(p => ({ ...p, venue: { ...p.venue, [k]: v } }))

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex gap-8">
        <AdminSidebar />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <p className="section-label mb-1">Admin</p>
              <h1 className="section-title">Events</h1>
            </div>
            <button onClick={openCreate} className="btn-primary">+ New Event</button>
          </div>

          {/* Filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {['upcoming','ongoing','completed','cancelled'].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-4 py-1.5 rounded-xl text-sm font-semibold capitalize transition-all ${filter===s ? 'bg-violet-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}>
                {s}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>
          ) : events.length === 0 ? (
            <div className="text-center py-16 text-slate-600">No events found.</div>
          ) : (
            <div className="space-y-3">
              {events.map(ev => (
                <div key={ev._id} className="card p-5 flex items-center gap-4 hover:border-violet-500/20 transition-all">
                  {ev.image && <img src={ev.image} alt={ev.title} className="w-16 h-16 rounded-xl object-cover shrink-0 hidden sm:block" onError={e => { e.target.style.display='none' }} />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <h3 className="font-semibold text-white truncate">{ev.title}</h3>
                      {ev.isFeatured && <span className="badge bg-yellow-500/15 text-yellow-400 border border-yellow-500/20">⭐</span>}
                      {ev.isFree && <span className="badge-free text-xs">Free</span>}
                    </div>
                    <p className="text-slate-500 text-xs">{new Date(ev.date).toLocaleDateString('en-IN')} · {ev.venue?.city} · {ev.category}</p>
                    <p className="text-slate-600 text-xs">{ev.totalAvailable ?? '?'} seats left</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => openEdit(ev)} className="btn-secondary text-xs py-1.5 px-3">Edit</button>
                    <button onClick={() => del(ev._id)} className="btn-danger text-xs py-1.5 px-3">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 bg-black/70 backdrop-blur-sm overflow-y-auto" onClick={() => setModal(false)}>
          <div className="card w-full max-w-2xl p-8 mb-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl font-bold text-white">{editId ? 'Edit Event' : 'New Event'}</h2>
              <button onClick={() => setModal(false)} className="text-slate-500 hover:text-white text-2xl leading-none">×</button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="label">Title *</label>
                  <input required className="input" value={form.title} onChange={e => f('title', e.target.value)} />
                </div>
                <div>
                  <label className="label">Category *</label>
                  <select className="input" value={form.category} onChange={e => f('category', e.target.value)}>
                    {CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Artist</label>
                  <select className="input" value={form.artist} onChange={e => f('artist', e.target.value)}>
                    <option value="">— No artist —</option>
                    {artists.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Date *</label>
                  <input required type="date" className="input" value={form.date} onChange={e => f('date', e.target.value)} />
                </div>
                <div>
                  <label className="label">Start Time *</label>
                  <input required className="input" placeholder="8:00 PM" value={form.time} onChange={e => f('time', e.target.value)} />
                </div>
                <div>
                  <label className="label">End Time</label>
                  <input className="input" placeholder="11:00 PM" value={form.endTime} onChange={e => f('endTime', e.target.value)} />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select className="input" value={form.status} onChange={e => f('status', e.target.value)}>
                    {['upcoming','ongoing','completed','cancelled'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Venue Name *</label>
                  <input required className="input" value={form.venue.name} onChange={e => fv('name', e.target.value)} />
                </div>
                <div>
                  <label className="label">City *</label>
                  <input required className="input" value={form.venue.city} onChange={e => fv('city', e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Venue Address</label>
                  <input className="input" value={form.venue.address} onChange={e => fv('address', e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Image URL</label>
                  <input className="input" placeholder="https://..." value={form.image} onChange={e => f('image', e.target.value)} />
                </div>
                <div>
                  <label className="label">Age Limit</label>
                  <input className="input" placeholder="All Ages / 18+" value={form.ageLimit} onChange={e => f('ageLimit', e.target.value)} />
                </div>
                <div>
                  <label className="label">Dress Code</label>
                  <input className="input" placeholder="Casual / Smart Casual" value={form.dressCode} onChange={e => f('dressCode', e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Tags <span className="text-slate-600 normal-case font-normal">(comma separated)</span></label>
                  <input className="input" placeholder="bass, festival, electronic" value={form.tags} onChange={e => f('tags', e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Description *</label>
                  <textarea required rows={4} className="input resize-none" value={form.description} onChange={e => f('description', e.target.value)} />
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isFeatured} onChange={e => f('isFeatured', e.target.checked)} className="accent-violet-500 w-4 h-4" />
                    <span className="text-sm text-slate-300">Featured</span>
                  </label>
                </div>
              </div>

              {/* Ticket Tiers */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <label className="label mb-0">Ticket Tiers</label>
                  <button type="button" onClick={addTier} className="text-violet-400 hover:text-violet-300 text-xs font-semibold">+ Add Tier</button>
                </div>
                <div className="space-y-3">
                  {form.ticketTiers.map((tier, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                        <div>
                          <label className="text-xs text-slate-600 mb-1 block">Name</label>
                          <input className="input text-sm py-2" value={tier.name} onChange={e => setTier(i,'name',e.target.value)} />
                        </div>
                        <div>
                          <label className="text-xs text-slate-600 mb-1 block">Price (₹)</label>
                          <input type="number" min="0" className="input text-sm py-2" value={tier.price} onChange={e => setTier(i,'price',e.target.value)} />
                        </div>
                        <div>
                          <label className="text-xs text-slate-600 mb-1 block">Total Seats</label>
                          <input type="number" min="1" className="input text-sm py-2" value={tier.totalSeats} onChange={e => setTier(i,'totalSeats',e.target.value)} />
                        </div>
                        <div className="flex items-end">
                          <button type="button" onClick={() => remTier(i)} className="w-full btn-danger text-xs py-2">Remove</button>
                        </div>
                      </div>
                      <input className="input text-xs py-2" placeholder="Perks (optional)" value={tier.perks} onChange={e => setTier(i,'perks',e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                  {saving ? 'Saving…' : editId ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
