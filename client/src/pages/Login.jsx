import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LOGO } from '../utils/logo'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handle = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name.split(' ')[0]}! 🎵`)
      navigate(user.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.')
    } finally { setLoading(false) }
  }

  const fill = (email, password) => setForm({ email, password })

  return (
    <div className="min-h-[88vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <img src={LOGO} alt="HHM" className="w-24 h-24 rounded-full object-cover mx-auto mb-4 ring-4 ring-violet-500/30 shadow-xl shadow-violet-900/40 animate-float" />
          <h1 className="font-script text-3xl text-white mb-1">Welcome Back!</h1>
          <p className="text-slate-500 text-sm">Sign in to your Happy Happenings account</p>
        </div>

        {/* Demo credentials */}
        <div className="card p-4 mb-6 border-violet-500/20">
          <p className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-2">Demo Accounts</p>
          <div className="space-y-1.5">
            <button onClick={() => fill('admin@happyhappenings.music','admin123')}
              className="w-full text-left text-xs text-slate-400 hover:text-white hover:bg-white/5 px-2 py-1.5 rounded-lg transition-colors">
              ⚙️ <span className="text-violet-300 font-mono">admin@happyhappenings.music</span> / admin123
            </button>
            <button onClick={() => fill('arjun@example.com','user123')}
              className="w-full text-left text-xs text-slate-400 hover:text-white hover:bg-white/5 px-2 py-1.5 rounded-lg transition-colors">
              👤 <span className="font-mono">arjun@example.com</span> / user123
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-2">↑ Click to autofill, then Login</p>
        </div>

        <form onSubmit={handle} className="card p-8 space-y-5">
          <div>
            <label className="label">Email</label>
            <input type="email" required value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="input" placeholder="you@example.com" />
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} required value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="input pr-12" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-sm">
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base disabled:opacity-60">
            {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Signing in…</span> : 'Sign In →'}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          New here? <Link to="/register" className="text-violet-400 hover:text-violet-300 font-semibold">Create an account</Link>
        </p>
      </div>
    </div>
  )
}
