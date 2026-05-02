import { createContext, useContext, useState } from 'react'
import api from '../utils/api'

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hhm_user')) } catch { return null }
  })

  const persist = (token, u) => {
    localStorage.setItem('hhm_token', token)
    localStorage.setItem('hhm_user', JSON.stringify(u))
    setUser(u)
  }

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    persist(data.token, data.user)
    return data.user
  }

  const register = async (name, email, password, phone) => {
    const { data } = await api.post('/auth/register', { name, email, password, phone })
    persist(data.token, data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('hhm_token')
    localStorage.removeItem('hhm_user')
    setUser(null)
  }

  const updateUser = updates => {
    const u = { ...user, ...updates }
    localStorage.setItem('hhm_user', JSON.stringify(u))
    setUser(u)
  }

  return (
    <Ctx.Provider value={{ user, login, register, logout, updateUser, isAdmin: user?.role === 'admin' }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAuth = () => { const c = useContext(Ctx); if (!c) throw new Error('useAuth outside AuthProvider'); return c }
