import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/profile'

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(form.email, form.password)
      navigate(from, { replace: true })
    } catch (e) {
      setError('Login failed. Please try again.')
    }
  }

  return (
    <div className="container-responsive page-padding fade-in">
      <div className="mx-auto max-w-md rounded-lg border bg-white p-6 shadow">
        <h1 className="mb-1 text-2xl font-bold">Login</h1>
        <p className="mb-6 text-sm text-gray-600">
          Don't have an account? <Link to="/signup" className="text-primary-700 underline">Sign up</Link>
        </p>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <div className="rounded-md bg-red-50 p-2 text-sm text-red-700">{error}</div>}
          <button className="btn-primary w-full" type="submit">Login</button>
        </form>
      </div>
    </div>
  )
}



