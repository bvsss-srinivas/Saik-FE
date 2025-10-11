import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'

export default function ProtectedAdminRoute({ children }) {
  const { admin } = useAdminAuth()
  const location = useLocation()
  if (!admin) return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
  return children
}
