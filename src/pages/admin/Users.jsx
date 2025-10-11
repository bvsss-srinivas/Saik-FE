import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import AdminApi from '../../services/adminApi.js'
import { useToast } from '../../context/ToastContext.jsx'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [viewing, setViewing] = useState(null)
  const { showToast } = useToast()

  useEffect(() => {
    const load = async () => {
      const res = await AdminApi.getUsers()
      const payload = res.data
      const list = Array.isArray(payload) ? payload : (payload?.content || [])
      setUsers(list)
    }
    load()
  }, [])


  const block = async (id) => {
    try {
      // find current user to know current blocked state
      const cur = users.find((u) => u.id === id)
      const newBlocked = !cur?.blocked
      await AdminApi.blockUser(id, newBlocked)
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, blocked: newBlocked } : u)))
      showToast(newBlocked ? 'User blocked' : 'User unblocked', 'success')
    } catch (err) {
      console.error(err)
      showToast('Failed to block user', 'error')
    }
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold">User Management</h1>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-gray-600"><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Orders</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="py-3">{u.id}</td>
                <td className="py-3">{u.name}</td>
                <td className="py-3">{u.email}</td>
                <td className="py-3">{u.role}</td>
                <td className="py-3">{u.orders}</td>
                <td className="py-3">
                  <button className="rounded border px-3 py-1 mr-2" onClick={() => setViewing(u)}>View</button>
                  <button className="rounded border px-3 py-1 text-red-600" onClick={() => block(u.id)}>{u.blocked ? 'Unblock' : 'Block'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded bg-white p-4">
            <h3 className="font-semibold">User - {viewing.name}</h3>
            <div className="mt-2 text-sm text-gray-600">Email: {viewing.email}</div>
            <div className="mt-4 text-right"><button className="btn-primary" onClick={() => setViewing(null)}>Close</button></div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
