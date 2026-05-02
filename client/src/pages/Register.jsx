import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LOGO } from '../utils/logo'
import toast from 'react-hot-toast'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handle = async e => {
    e.preventDefault()
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.phone)
      toast.success('Welcome to Happy Happenings! 🎉')
      navigate('/events')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.')
    } finally { setLoading(false) }
  }

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="min-h-[88vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-10">
          <img src={LOGO} alt="HHM" className="w-24 h-24 rounded-full object-cover mx-auto mb-4 ring-4 ring-violet-500/30 shadow-xl shadow-violet-900/40 animate-float" />
          <h1 className="font-script text-3xl text-white mb-1">Join the Music</h1>
          <p className="text-slate-500 text-sm">Create your Happy Happenings account — it's free</p>
        </div>

        <form onSubmit={handle} className="card p-8 space-y-5">
          <div>
            <label className="label">Full Name</label>
            <input type="text" required value={form.name} onChange={e => f('name', e.target.value)}
              className="input" placeholder="Your name" minLength={2} />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" required value={form.email} onChange={e => f('email', e.target.value)}
              className="input" placeholder="you@example.com" />
          </div>
          <div>
            <label className="label">Phone <span className="text-slate-600 normal-case font-normal">(optional)</span></label>
            <input type="tel" value={form.phone} onChange={e => f('phone', e.target.value)}
              className="input" placeholder="+91 98765 43210" />
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} required value={form.password}
                onChange={e => f('password', e.target.value)}
                className="input pr-12" placeholder="Min. 6 characters" minLength={6} />
              <button type="button" onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base disabled:opacity-60">
            {loading
              ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account…</span>
              : 'Create Account 🎵'}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          Already have an account? <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
