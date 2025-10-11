import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function SignUp() {
  const { register } = useAuth()
  const [form, setForm] = useState({ username: '', email: '', password: '', country: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/profile'

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      // AuthContext.register expects (name, email, password)
      await register(form.username, form.email, form.password)
      navigate(from, { replace: true })
    } catch (e) {
      setError('Registration failed. Please try again.')
    }
  }

  return (
    <div className="container-responsive page-padding fade-in">
      <div className="mx-auto max-w-md rounded-lg border bg-white p-6 shadow">
        <h1 className="mb-1 text-2xl font-bold">Sign up</h1>
        <p className="mb-6 text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-primary-700 underline">Login</Link>
        </p>
        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block text-sm font-medium">Username</label>
          <input className="input" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />

          <label className="block text-sm font-medium">Email</label>
          <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />

          <label className="block text-sm font-medium">Password</label>
          <input className="input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

          <label className="block text-sm font-medium">Country / Region</label>
          <select className="input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
            <option value="">Select country/region</option>
            <option value="US">United States</option>
            <option value="IN">India</option>
            <option value="GB">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
          </select>

          {error && <div className="rounded-md bg-red-50 p-2 text-sm text-red-700">{error}</div>}
          <button className="btn-primary w-full" type="submit">Create Account</button>
        </form>
      </div>
    </div>
  )
}

