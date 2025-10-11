import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import CategoryBar from './CategoryBar.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { items } = useCart()
  const { items: wishlist } = useWishlist()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const onSearch = (e) => {
    e.preventDefault()
    console.log('Search:', query)
  }
  const location = useLocation()
  const hideCategory = location.pathname.startsWith('/admin')
  const isAdmin = location.pathname.startsWith('/admin')
  const adminAuth = useAdminAuth()
  const admin = adminAuth?.admin
  const adminLogout = adminAuth?.logout ?? (() => { localStorage.removeItem('adminToken'); localStorage.removeItem('admin'); navigate('/admin/login') })
  const [adminMenuOpen, setAdminMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 bg-white shadow">
  <div className="container-responsive flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            {/* compact SVG mark */}
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="shadow-md rounded-full">
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6D28D9" />
                  <stop offset="100%" stopColor="#4F46E5" />
                </linearGradient>
              </defs>
              <rect width="48" height="48" rx="12" fill="url(#g1)" />
              <path d="M14 30c0-6 10-6 10-12s-10-6-10-12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <text x="26" y="33" fill="white" fontSize="12" fontWeight="600" textAnchor="middle">X</text>
            </svg>
            <span className="text-lg font-semibold text-primary-700">ShopX</span>
          </Link>

          {!isAdmin && (
            <form onSubmit={onSearch} className="hidden md:block">
              <div className="flex overflow-hidden rounded-md border shadow-sm">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products"
                  className="input w-64"
                />
                <button className="btn-primary">Search</button>
              </div>
            </form>
          )}
        </div>

        <nav className="flex items-center gap-4">
          {isAdmin ? (
            // Admin-specific nav: show admin profile + dropdown, no cart/wishlist
            <div className="relative">
              <button onClick={() => setAdminMenuOpen((s) => !s)} className="flex items-center gap-2">
                <div className="inline-block h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-medium">{admin?.name?.charAt(0) || 'A'}</div>
                <div className="hidden sm:block text-sm text-primary-700">{admin?.name || 'Admin'}</div>
              </button>
              {adminMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-md border bg-white shadow-md">
                  <button className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50" onClick={() => { navigate('/admin/dashboard'); setAdminMenuOpen(false) }}>Dashboard</button>
                  <button className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-red-600" onClick={() => { adminLogout(); navigate('/admin/login') }}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={() => navigate('/wishlist')} className="relative btn-ghost p-2" title="Wishlist" aria-label="Wishlist">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-6.716-4.35-9.2-7.01C-0.14 10.9 3.2 6 7 6c2.2 0 3.5 1.3 5 3 1.5-1.7 2.8-3 5-3 3.8 0 7.14 4.9 4.2 7.99C18.716 16.65 12 21 12 21z"/></svg>
                {wishlist.length > 0 && (
                  <span className="badge absolute -right-2 -top-2">{wishlist.length}</span>
                )}
              </button>

              <button onClick={() => navigate('/cart')} className="relative btn-ghost p-2" title="Cart" aria-label="Cart">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4h-2l-1 2h2l3.6 7.59-1.35 2.45A1 1 0 0 0 10 18h8v-2h-7.42a1 1 0 0 1-.92-.62L9.1 11h7.45a1 1 0 0 0 .92-.62l1.8-4.18L20 4H7z"/></svg>
                {items.length > 0 && (
                  <span className="badge absolute -right-2 -top-2">{items.length}</span>
                )}
              </button>

              <div>
                {!user ? (
                  <div className="flex gap-2">
                    <button className="btn-primary" onClick={() => navigate('/login')}>Login</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3">
                      <Link to="/orders" className="hidden sm:inline-flex items-center gap-2 text-sm">Orders</Link>
                      <Link to="/profile" className="hidden sm:inline-flex items-center gap-2 link-underline">
                        <span className="inline-block h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">{user.name?.charAt(0) || 'U'}</span>
                        <span className="text-sm">Hi, {user.name}</span>
                      </Link>
                    </div>
                    <button className="btn-ghost" onClick={logout}>Logout</button>
                  </div>
                )}
              </div>
            </>
          )}
        </nav>
      </div>
      {!hideCategory && <CategoryBar />}
    </header>
  )
}


