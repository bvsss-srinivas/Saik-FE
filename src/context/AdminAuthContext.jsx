import React, { createContext, useContext, useState, useMemo } from 'react'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('admin')
    return saved ? JSON.parse(saved) : null
  })

  const login = (data) => {
    // store the real token that backend returns under 'token' so
    // the shared api instance picks it up (api.js reads localStorage.getItem('token'))
    const token = data?.token || data?.authToken || null
    if (token) {
      localStorage.setItem('token', token)
    }
    localStorage.setItem('admin', JSON.stringify(data))
    setAdmin(data)
  }

  const logout = () => {
    // remove both legacy adminToken and the real token used by api.js
    localStorage.removeItem('adminToken')
    localStorage.removeItem('token')
    localStorage.removeItem('admin')
    setAdmin(null)
  }

  const value = useMemo(() => ({ admin, login, logout }), [admin])

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}

export default AdminAuthContext
