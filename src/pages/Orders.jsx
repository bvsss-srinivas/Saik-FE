import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api.js'

export default function Orders() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [rawResponse, setRawResponse] = React.useState(null)
  const [errorMsg, setErrorMsg] = React.useState(null)

  React.useEffect(() => {
    const load = async () => {
      if (!user) return
      setLoading(true)
      try {
        let res
        try {
          res = await api.get('/orders/me')
        } catch (e) {
          // fallback
          res = await api.get(`/orders/user/${user.id}`)
        }
        // capture raw response for debugging
        setRawResponse(res?.data)
        setErrorMsg(null)
        const data = res.data
        if (Array.isArray(data)) setOrders(data)
        else if (data && Array.isArray(data.content)) setOrders(data.content)
        else if (data && Array.isArray(data.orders)) setOrders(data.orders)
        else if (data && typeof data === 'object' && (data.id || data.orderDate)) setOrders([data])
        else setOrders([])
      } catch (err) {
        console.error('Failed to load orders', err)
        setRawResponse(null)
        setErrorMsg(err?.response?.status + ' ' + (err?.response?.data || err.message || String(err)))
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  if (!user) return <div className="container-responsive py-8">Please log in to see your orders.</div>

  return (
    <div className="container-responsive py-8">
      <h1 className="mb-6 text-2xl font-bold">My Orders</h1>
      {/* Orders summary */}
      {loading ? (
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
              {orders.map((o) => (
                <tr key={o.id} className="border-t hover:bg-gray-50">
                  <td className="py-3">{o.id}</td>
                          <td className="py-3">{new Date(o.orderDate).toLocaleString()}</td>
                          <td className="py-3">
                            <div className="text-sm">{o.items?.length ?? 0} item(s)</div>
                            <div className="text-xs text-gray-600 mt-1">
                              {o.items?.slice(0,3).map((it) => it?.product?.name).filter(Boolean).join(', ')}{o.items && o.items.length > 3 ? ', ...' : ''}
                            </div>
                          </td>
                  <td className="py-3">${(o.totalAmount || 0).toFixed(2)}</td>
                  <td className="py-3">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* End orders page */}
    </div>
  )
}
