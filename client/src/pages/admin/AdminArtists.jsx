import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import AdminSidebar from '../../components/AdminSidebar'

const GENRES = ['Electronic','Hip-Hop','Rock','Pop','Jazz','Classical','Indie','Metal','R&B','Folk','Bollywood','Other']
const EMPTY = { name:'', genre:'Electronic', bio:'', image:'', socialLinks:{instagram:'',spotify:'',youtube:''} }

export default function AdminArtists() {
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(false)
  const [form,    setForm]    = useState(EMPTY)
  const [editId,  setEditId]  = useState(null)
  const [saving,  setSaving]  = useState(false)

  const load = () => {
    setLoading(true)
    api.get('/artists').then(({ data }) => setArtists(data)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openCreate = () => { setForm(EMPTY); setEditId(null); setModal(true) }
  const openEdit   = a => { setForm({ ...a, socialLinks: a.socialLinks || EMPTY.socialLinks }); setEditId(a._id); setModal(true) }
  const del = async id => {
    if (!window.confirm('Delete artist?')) return
    try { await api.delete(`/artists/${id}`); toast.success('Deleted'); load() }
    catch { toast.error('Delete failed') }
  }
  const submit = async e => {
    e.preventDefault(); setSaving(true)
    try {
      if (editId) await api.put(`/artists/${editId}`, form)
      else        await api.post('/artists', form)
      toast.success(editId ? 'Artist updated!' : 'Artist created!')
      setModal(false); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed') }
    finally { setSaving(false) }
  }

  const f  = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const fs = (k, v) => setForm(p => ({ ...p, socialLinks: { ...p.socialLinks, [k]: v } }))

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex gap-8">
        <AdminSidebar />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <p className="section-label mb-1">Admin</p>
              <h1 className="section-title">Artists</h1>
            </div>
            <button onClick={openCreate} className="btn-primary">+ New Artist</button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3].map(i => <div key={i} className="skeleton h-36 rounded-2xl" />)}
            </div>
          ) : artists.length === 0 ? (
            <div className="text-center py-16 text-slate-600">No artists yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {artists.map(a => (
                <div key={a._id} className="card p-5 hover:border-violet-500/20 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-2xl shrink-0">
                      {a.image ? <img src={a.image} alt={a.name} className="w-full h-full object-cover" onError={e=>{e.target.style.display='none'}} /> : '🎤'}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white truncate">{a.name}</h3>
                      <span className="badge-cat text-xs">{a.genre}</span>
                    </div>
                  </div>
                  {a.bio && <p className="text-slate-500 text-xs line-clamp-2 mb-3">{a.bio}</p>}
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(a)} className="btn-secondary text-xs py-1.5 px-3 flex-1">Edit</button>
                    <button onClick={() => del(a._id)}  className="btn-danger text-xs py-1.5 px-3 flex-1">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 bg-black/70 backdrop-blur-sm overflow-y-auto" onClick={() => setModal(false)}>
          <div className="card w-full max-w-lg p-8 mb-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl font-bold text-white">{editId ? 'Edit Artist' : 'New Artist'}</h2>
              <button onClick={() => setModal(false)} className="text-slate-500 hover:text-white text-2xl">×</button>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="label">Name *</label>
                <input required className="input" value={form.name} onChange={e => f('name', e.target.value)} />
              </div>
              <div>
                <label className="label">Genre *</label>
                <select className="input" value={form.genre} onChange={e => f('genre', e.target.value)}>
                  {GENRES.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Profile Image URL</label>
                <input className="input" placeholder="https://..." value={form.image} onChange={e => f('image', e.target.value)} />
                {form.image && <img src={form.image} alt="preview" className="mt-2 w-16 h-16 rounded-xl object-cover" onError={e=>{e.target.style.display='none'}} />}
              </div>
              <div>
                <label className="label">Bio</label>
                <textarea rows={3} className="input resize-none" maxLength={1000} value={form.bio} onChange={e => f('bio', e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['instagram','spotify','youtube'].map(s => (
                  <div key={s}>
                    <label className="label capitalize">{s}</label>
                    <input className="input text-sm py-2" placeholder={`${s} URL`} value={form.socialLinks[s]} onChange={e => fs(s, e.target.value)} />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                  {saving ? 'Saving…' : editId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
