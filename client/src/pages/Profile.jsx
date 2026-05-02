import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { LOGO } from '../utils/logo'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('profile')

  const save = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.put('/auth/profile', form)
      updateUser(data.user)
      toast.success('Profile updated! ✅')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-10">
        <p className="section-label mb-2">Your Account</p>
        <h1 className="section-title">Profile <span className="text-violet-400">Settings</span></h1>
      </div>

      {/* Avatar */}
      <div className="card p-8 mb-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-violet-900/40">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-navy-800 ${user?.role === 'admin' ? 'bg-violet-500' : 'bg-emerald-500'}`} />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-white">{user?.name}</h2>
          <p className="text-slate-400 text-sm">{user?.email}</p>
          <span className={`badge mt-2 inline-block ${user?.role === 'admin' ? 'badge-paid' : 'badge-success'}`}>
            {user?.role === 'admin' ? '⚙️ Admin' : '🎵 Music Fan'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-navy-800/60 rounded-xl">
        {['profile', 'security'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all capitalize ${tab === t ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
            {t === 'profile' ? '👤 Profile' : '🔒 Security'}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <form onSubmit={save} className="card p-8 space-y-5">
          <div>
            <label className="label">Full Name</label>
            <input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Email <span className="text-slate-600 normal-case font-normal">(cannot change)</span></label>
            <input className="input opacity-50 cursor-not-allowed" value={user?.email} disabled />
          </div>
          <div>
            <label className="label">Phone</label>
            <input type="tel" className="input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 disabled:opacity-60">
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      )}

      {tab === 'security' && (
        <div className="card p-8">
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="font-display text-xl font-bold text-white mb-2">Password Management</h3>
            <p className="text-slate-500 text-sm mb-6">Contact support to change your password.</p>
            <a href="mailto:admin@happyhappenings.music" className="btn-secondary px-6">
              📧 Contact Support
            </a>
          </div>
          <div className="mt-6 pt-6 border-t border-white/[0.07]">
            <p className="text-xs text-slate-600 text-center">
              Account created: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : 'N/A'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
