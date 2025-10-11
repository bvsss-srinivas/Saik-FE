import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import AdminApi from '../../services/adminApi.js'
import { useToast } from '../../context/ToastContext.jsx'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('All')
  

  useEffect(() => {
    const load = async () => {
      const res = await AdminApi.getOrders()
      const payload = res.data
      const list = Array.isArray(payload) ? payload : (payload?.content || payload?.items || [])
      // normalize backend order shape if necessary
      const norm = list.map((o) => ({
        id: o.id ?? o.orderId,
        customer: o.user?.name || o.customer || (o.user?.email || ''),
        items: o.items || [],
        total: o.totalAmount ?? o.total ?? 0,
        status: o.status || 'PLACED',
      }))
      setOrders(norm)
    }
    load()
  }, [])

  const filtered = orders.filter((o) => filter === 'All' ? true : (o.status || '').toString().toUpperCase() === filter.toString().toUpperCase())

  const updateStatus = async (orderId, status) => {
    try {
      await AdminApi.updateOrderStatus(orderId, status)
      setOrders((prev) => prev.map((o) => (o.orderId === orderId ? { ...o, status } : o)))
      showToast(`Order ${orderId} status updated to ${status}`, 'success')
    } catch (err) {
      console.error(err)
      showToast('Failed to update order status', 'error')
    }
  }

  const { showToast } = useToast()

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <div className="flex gap-2">
          {['All', 'Pending', 'Shipped', 'Delivered'].map((s) => (
            <button key={s} className={`rounded px-3 py-1 ${filter === s ? 'bg-primary-600 text-white' : 'border'}`} onClick={() => setFilter(s)}>{s}</button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-gray-600"><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="py-3">{o.id}</td>
                <td className="py-3">{o.customer}</td>
                <td className="py-3">{o.items?.length ?? 0}</td>
                <td className="py-3">${(o.total || 0).toFixed(2)}</td>
                <td className="py-3">{o.status}</td>
                <td className="py-3">
                  <select defaultValue={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="input">
                    <option value="PLACED">Placed</option>
                    <option value="PENDING">Pending</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
