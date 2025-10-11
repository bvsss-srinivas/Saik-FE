import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'

const items = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/reports', label: 'Reports' },
]

export default function AdminSidebar() {
  const { logout } = useAdminAuth()
  const navigate = useNavigate()

  const doLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <aside className="hidden md:block w-64 shrink-0 bg-white text-gray-800 border-r">
      <div className="h-full p-4">
        <div className="mb-6 flex items-center gap-2">
          <div className="h-9 w-9 rounded bg-primary-600 flex items-center justify-center text-white font-bold">A</div>
          <div className="text-lg font-semibold text-primary-700">Admin</div>
        </div>
        <nav className="space-y-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) => `block rounded px-3 py-2 text-sm flex items-center justify-between ${isActive ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600' : 'hover:bg-gray-50'}`}>
              <span>{it.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout moved to admin topbar/profile menu */}
      </div>
    </aside>
  )
}
