import React, { useState } from 'react'
import { Navigate, useLocation, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api.js'

const menu = [
  'Account overview',
  'My orders',
  'Premier Delivery',
  'My details',
  'Change password',
  'Address book',
  'Payment methods',
  'Contact preferences',
  'Social accounts',
  'Gift cards & vouchers',
  'Need help?',
]

export default function Profile() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [active, setActive] = useState(0)
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)

  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />

  React.useEffect(() => {
      const loadOrders = async () => {
      if (active !== 1) return
      setLoadingOrders(true)
      try {
        if (!user?.id) {
          console.warn('[Profile] user.id is missing; /orders/me will be used where possible')
        }
        // prefer authenticated /orders/me endpoint which derives user from token
        let res
        try {
          res = await api.get('/orders/me')
        } catch (e) {
          // fallback to explicit user id endpoint
          res = await api.get(`/orders/user/${user.id}`)
        }
        // debug: log response shape to help diagnose client/server mismatches
        console.debug('[Profile] orders response:', res?.data)
        // API may return an array or a pageable object { content: [], totalElements, ... }
        const data = res.data
        if (Array.isArray(data)) setOrders(data)
        else if (data && Array.isArray(data.content)) setOrders(data.content)
        else if (data && Array.isArray(data.orders)) setOrders(data.orders)
        else if (data && typeof data === 'object') {
          // sometimes API returns an object with single order fields when only one order exists
          // coerce to array if it looks like an order
          if (data.id || data.orderDate) setOrders([data])
          else setOrders([])
        } else setOrders([])
      } catch (e) {
        console.debug('Failed to load user orders', e?.message || e)
        setOrders([])
      } finally {
        setLoadingOrders(false)
      }
    }
    loadOrders()
  }, [active, user])

  const initials = (user.name || 'U').split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="container-responsive py-8">
      <h1 className="mb-6 text-center text-2xl font-bold tracking-widest">MY ACCOUNT</h1>

      <div className="grid gap-6 md:grid-cols-[260px,1fr]">
        <aside className="h-fit rounded-lg bg-white p-0">
          <div className="border-b p-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 flex items-center justify-center rounded-full bg-black text-white text-lg font-bold">{initials}</div>
              <div>
                <div className="text-sm text-gray-600">Hi,</div>
                <div className="font-semibold">{user.name}</div>
              </div>
            </div>
          </div>
          <nav className="divide-y">
            {menu.map((m, i) => (
              <div key={m} className={`px-4 py-3 ${i === active ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600' : 'hover:bg-gray-50'}`}>
                <button className="w-full text-left text-sm flex items-center gap-3" onClick={() => setActive(i)}>
                  <span className="w-6 text-center">{i === 0 ? '🏠' : '📄'}</span>
                  <span className="flex-1">{m}</span>
                </button>
              </div>
            ))}
            <div className="px-4 py-3">
              <button className="w-full text-left text-sm" onClick={handleLogout}>Sign out</button>
            </div>
          </nav>
        </aside>

        <main className="rounded-lg bg-white p-6">
          {/* Render content by active tab */}
          {active === 0 && (
            <div>
              <h2 className="text-lg font-semibold">Account overview</h2>
              <p className="mt-2 text-sm text-gray-600">Name: {user.name}</p>
              <p className="text-sm text-gray-600">Email: {user.email}</p>
            </div>
          )}

          {active === 1 && (
            <div>
              <h2 className="text-lg font-semibold">My orders</h2>
              {loadingOrders ? (
                <div>Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="rounded-md border p-6 text-center">You have no orders yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="text-left text-sm text-gray-600"><th>ID</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {
                        // guard: ensure we always map over an array
                        (() => {
                          const safeOrders = Array.isArray(orders) ? orders : (orders && typeof orders === 'object' ? [orders] : [])
                          return safeOrders.map((o) => (
                            <tr key={o.id} className="border-t">
                              <td className="py-3">{o.id}</td>
                              <td className="py-3">{new Date(o.orderDate).toLocaleString()}</td>
                              <td className="py-3">{o.items?.length ?? 0}</td>
                              <td className="py-3">${(o.totalAmount || 0).toFixed(2)}</td>
                              <td className="py-3">{o.status}</td>
                            </tr>
                          ))
                        })()
                      }
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {active === 2 && <div>Premier Delivery (mock)</div>}

          {active === 3 && (
            <div>
              <h2 className="text-lg font-semibold">My details</h2>
              <p className="mt-2 text-sm text-gray-600">Edit your personal details here.</p>
            </div>
          )}

          {active === 4 && <div>Change password (mock)</div>}
          {active === 5 && <div>Address book (mock)</div>}

          {active === 6 && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold">PAYMENT METHODS</h2>
                <button className="rounded border px-4 py-2 text-sm">ADD NEW PAYMENT METHOD</button>
              </div>

              <div className="space-y-4">
                <div className="rounded border p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="h-8 w-12 flex items-center justify-center rounded bg-gray-100 text-xs font-medium">VISA</div>
                      <div>
                        <div className="font-medium">VISA Debit (9332)</div>
                        <div className="text-sm text-gray-600">Exp: 08/21<br />Baymard Institute Asp.</div>
                        <div className="text-xs text-gray-400 mt-2">This is your default payment method</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">DELETE</div>
                  </div>
                </div>

                <div className="rounded border p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="h-8 w-12 flex items-center justify-center rounded bg-gray-100 text-xs font-medium">VISA</div>
                      <div>
                        <div className="font-medium">VISA Debit (3207)</div>
                        <div className="text-sm text-gray-600">Exp: 06/18<br />John Newman</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">DELETE</div>
                  </div>
                  <div className="mt-3 rounded-sm bg-yellow-50 p-3 text-sm text-yellow-800">This card has expired.</div>
                </div>
              </div>
            </div>
          )}

          {active === 7 && <div>Contact preferences (mock)</div>}
          {active === 8 && <div>Social accounts (mock)</div>}
          {active === 9 && <div>Gift cards & vouchers (mock)</div>}
          {active === 10 && <div>Need help? (mock)</div>}
        </main>
      </div>
    </div>
  )
}


