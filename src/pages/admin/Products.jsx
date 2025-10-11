import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import AdminApi from '../../services/adminApi.js'
import ProductModal from '../../components/admin/ProductModal.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import resolveImage from '../../services/image.js'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const { showToast } = useToast()

  useEffect(() => {
    const load = async () => {
      const res = await AdminApi.getProducts()
      // backend returns a Page object for /products; pick content if present
      const payload = res.data
      const list = Array.isArray(payload) ? payload : (payload?.content || [])
      // normalize fields (image vs imageUrl)
      const norm = list.map((p) => ({ ...p, image: p.image || p.imageUrl }))
      setProducts(norm)
    }
    load()
  }, [])

  const onAdd = () => {
    setEditing(null)
    setOpen(true)
  }

  const onEdit = (p) => {
    setEditing(p)
    setOpen(true)
  }

  const onSave = async (payload) => {
    try {
      // payload may be { form, file } from ProductModal
      const { form, file } = payload.form ? payload : { form: payload, file: null }

      // build FormData if file present
      const body = file ? new FormData() : form
      if (file) {
        body.append('image', file)
        body.append('product', JSON.stringify(form))
      }

      if (editing) {
        const p = file ? body : form
        await AdminApi.updateProduct(editing.id, p)
        setProducts((prev) => prev.map((x) => (x.id === editing.id ? { ...x, ...form } : x)))
        if (editing.stock !== form.stock) showToast(`Stock for "${form.name || editing.name}" updated`, 'success')
        else showToast(`Product "${form.name || editing.name}" updated`, 'success')
      } else {
        const res = await AdminApi.createProduct(file ? body : form)
        setProducts((prev) => [res.data, ...prev])
        showToast(`Product "${form.name}" added`, 'success')
      }
      setOpen(false)
    } catch (err) {
      console.error('Save product error:', err)
      const resp = err?.response
      const serverMsg = resp ? (resp.status + ' ' + (typeof resp.data === 'string' ? resp.data : JSON.stringify(resp.data))) : err.message
      showToast(`Failed to save product: ${serverMsg}`, 'error')
    }
  }

  const onDelete = async (id) => {
    try {
      await AdminApi.deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
      showToast('Product deleted', 'success')
    } catch (err) {
      console.error(err)
      showToast('Failed to delete product', 'error')
    }
  }


  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <button className="btn-primary" onClick={onAdd}>Add New Product</button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-gray-600">
              <th>ID</th><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="py-3 text-sm">{p.id}</td>
                <td className="py-3"><img src={resolveImage(p.image)} alt={p.name} className="h-10 w-10 rounded object-cover" /></td>
                <td className="py-3">{p.name}</td>
                <td className="py-3">{p.category}</td>
                <td className="py-3">${(Number(p.price) || 0).toFixed(2)}</td>
                <td className="py-3">{p.stock ?? 10}</td>
                <td className="py-3">
                  <button className="rounded border px-3 py-1 mr-2" onClick={() => onEdit(p)}>Edit</button>
                  <button className="rounded border px-3 py-1 text-red-600" onClick={() => onDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && <ProductModal initial={editing} onClose={() => setOpen(false)} onSave={onSave} />}
    </AdminLayout>
  )
}
