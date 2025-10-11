import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useToast } from './ToastContext.jsx'
import api from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const toast = useToast()
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }, [user])

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password })
      const { token, userId } = res.data
      if (token) {
        localStorage.setItem('token', token)
      }
      // fetch user details
      let userObj = null
      try {
        const ures = await api.get(`/users/${userId}`)
        userObj = ures.data
      } catch (e) {
        // fallback to minimal user
        userObj = { id: userId, email }
      }
      setUser(userObj)
      try { toast?.showToast('Logged in successfully', 'success') } catch (e) {}
      return userObj
    } catch (e) {
      throw e
    }
  }

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password })
      const { token, userId } = res.data
      if (token) {
        localStorage.setItem('token', token)
      }
      let userObj = null
      try {
        const ures = await api.get(`/users/${userId}`)
        userObj = ures.data
      } catch (e) {
        userObj = { id: userId, name, email }
      }
      setUser(userObj)
      try { toast?.showToast('Account created', 'success') } catch (e) {}
      return userObj
    } catch (e) {
      throw e
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    try { toast?.showToast('Logged out', 'info') } catch (e) {}
  }

  const value = useMemo(() => ({ user, login, register, logout }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}



