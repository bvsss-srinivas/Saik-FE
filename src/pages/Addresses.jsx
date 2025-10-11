import React, { useState } from 'react'

export default function Addresses() {
  const [addresses, setAddresses] = useState([
    { id: 'a1', name: 'Home', line1: '123 Main St', city: 'Metropolis', zip: '12345' },
  ])
  const [form, setForm] = useState({ name: '', line1: '', city: '', zip: '' })

  const add = () => {
    const id = Math.random().toString(36).slice(2)
    setAddresses((prev) => [...prev, { id, ...form }])
    setForm({ name: '', line1: '', city: '', zip: '' })
  }
  const remove = (id) => setAddresses((prev) => prev.filter((a) => a.id !== id))

  return (
    <div className="container-responsive py-8">
      <h1 className="mb-4 text-2xl font-bold">Saved Addresses</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded border bg-white p-4">
          <h2 className="mb-2 font-semibold">Add New Address</h2>
          <div className="grid gap-2">
            <input className="rounded border px-3 py-2" placeholder="Label (e.g., Home)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="rounded border px-3 py-2" placeholder="Address Line" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <input className="rounded border px-3 py-2" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              <input className="rounded border px-3 py-2" placeholder="ZIP" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} />
            </div>
            <button className="btn-primary" onClick={add}>Save Address</button>
          </div>
        </div>
        <div className="space-y-3">
          {addresses.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded border bg-white p-3">
              <div>
                <div className="font-medium">{a.name}</div>
                <div className="text-sm text-gray-600">{a.line1}, {a.city} {a.zip}</div>
              </div>
              <button className="rounded border px-3 py-2" onClick={() => remove(a.id)}>Remove</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}



