import React from 'react'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'

export default function AdminTopbar() {
  const { admin } = useAdminAuth()
  return (
    <div className="flex items-center justify-between gap-4 border-b bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <button className="md:hidden rounded bg-primary-50 px-2 py-1 text-primary-700">Menu</button>
        <h2 className="text-lg font-semibold text-primary-700">Admin Panel</h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-700">{admin?.name || 'Admin'}</div>
      </div>
    </div>
  )
}
