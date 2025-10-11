import React, { useEffect, useState } from 'react'

export default function ProductModal({ initial = null, onClose, onSave }) {
  const [form, setForm] = useState({ name: '', description: '', category: '', price: 0, stock: 0, image: '' })
  const [file, setFile] = useState(null)

  useEffect(() => {
    if (initial) setForm(initial)
  }, [initial])

  const onFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setFile(file)
    setForm((s) => ({ ...s, image: url }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold">{initial ? 'Edit' : 'Add'} Product</h3>
        <div className="grid gap-3">
          <div>
            <label className="block text-sm font-medium">Product Name</label>
            <input className="input mt-1" placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium">Category</label>
            <input className="input mt-1" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea className="input h-24 mt-1" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium">No of Items</label>
              <input className="input mt-1" placeholder="no of Items" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm font-medium">Price</label>
              <input className="input mt-1" placeholder="price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Picture</label>
            <div className="mt-1 flex items-center gap-3">
              <input type="file" onChange={onFile} />
              {form.image && <img src={form.image} alt="preview" className="h-12 w-12 rounded object-cover" />}
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button className="rounded border px-4 py-2" onClick={onClose}>Cancel</button>
            <button className="btn-primary" onClick={() => onSave({ form, file })}>Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}
