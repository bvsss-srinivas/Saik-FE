import React from 'react'
import AdminSidebar from './AdminSidebar.jsx'
import AdminTopbar from './AdminTopbar.jsx'

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1">
          <AdminTopbar />
          <main className="p-4">{children}</main>
        </div>
      </div>
    </div>
  )
}
