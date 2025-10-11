import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api.js'

export default function EditProfile() {
  const { user } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' })
  const [message, setMessage] = useState('')

  const save = async () => {
  await api.put(`/users/update/${user?.id}`, form)
    setMessage('Profile updated (mock)')
  }

  return (
    <div className="container-responsive py-8">
      <h1 className="mb-4 text-2xl font-bold">Edit Personal Info</h1>
      <div className="max-w-lg space-y-3 rounded-lg border bg-white p-4">
        <input className="w-full rounded border px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="w-full rounded border px-3 py-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <button className="btn-primary" onClick={save}>Save</button>
        {message && <div className="rounded bg-green-50 p-2 text-green-700">{message}</div>}
      </div>
    </div>
  )
}



