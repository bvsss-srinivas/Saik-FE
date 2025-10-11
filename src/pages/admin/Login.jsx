import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminApi } from '../../services/adminApi.js'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const navigate = useNavigate()
  const { login } = useAdminAuth()
  const { showToast } = useToast()

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await AdminApi.login(form)
      login(res.data)
      showToast('Logged in as admin', 'success')
      navigate('/admin/dashboard')
    } catch (e) {
      console.error('Login error:', e)
      // prefer backend error message when available; stringify objects for readability
  const resp = e?.response
  const serverMsg = resp ? (typeof resp.data === 'string' ? resp.data : JSON.stringify(resp.data)) : null
  const msg = serverMsg || e.message || 'Login failed'
  showToast(`Login failed: ${msg}`, 'error')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold">Admin Login</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button className="btn-primary w-full" type="submit">Login</button>
        </form>
      </div>
    </div>
  )
}
