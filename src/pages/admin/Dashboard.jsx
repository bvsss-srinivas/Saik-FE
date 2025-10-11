import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import { AdminApi } from '../../services/adminApi.js'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useToast } from '../../context/ToastContext.jsx'

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null)
  const [orders, setOrders] = useState([])
  useEffect(() => {
    const load = async () => {
      try {
        const s = await AdminApi.getSummary()
        const payload = s.data
        setSummary(payload)
        const r = await AdminApi.getRecentOrders()
        // admin API now returns OrderResponse[]; accept many shapes
        const rdata = r.data
        const rlist = Array.isArray(rdata) ? rdata : (rdata?.content || rdata?.orders || [])
        setOrders(rlist)
        showToast('Dashboard loaded', 'success')
      } catch (err) {
        console.error(err)
        showToast('Failed to load dashboard', 'error')
      }
    }
    load()
  }, [])

  const { showToast } = useToast()


  return (
    <AdminLayout>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow"> <div className="text-sm">Total Sales</div><div className="mt-2 text-xl font-bold">${summary?.totalSales?.toFixed(2) || '0.00'}</div></div>
        <div className="rounded-2xl bg-white p-4 shadow"> <div className="text-sm">Orders</div><div className="mt-2 text-xl font-bold">{summary?.orders || 0}</div></div>
        <div className="rounded-2xl bg-white p-4 shadow"> <div className="text-sm">Users</div><div className="mt-2 text-xl font-bold">{summary?.users || 0}</div></div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl bg-white p-4 shadow">
          <h3 className="mb-2 font-semibold">Sales (last months)</h3>
          <div style={{ height: 200 }}>
            <ResponsiveContainer>
              <LineChart data={summary?.salesByMonth || []}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#1E40AF" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow">
          <h3 className="mb-2 font-semibold">Recent Orders</h3>
          <div className="space-y-2">
            {orders.map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded border p-2">
                <div>
                  <div className="font-medium">Order #{o.id}</div>
                  <div className="text-sm text-gray-500">User: {o.userId ?? 'N/A'}</div>
                </div>
                <div className="text-sm">{o.status}</div>
                <div className="font-semibold">${(o.totalAmount || o.total || 0).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
