import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import AdminApi from '../../services/adminApi.js'
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { useToast } from '../../context/ToastContext.jsx'

export default function AdminReports() {
  const [reports, setReports] = useState(null)
  const { showToast } = useToast()

  useEffect(() => {
    const load = async () => {
      try {
        const res = await AdminApi.getReports()
        setReports(res.data)
        showToast('Reports loaded', 'success')
      } catch (err) {
        console.error(err)
        showToast('Failed to load reports', 'error')
      }
    }
    load()
  }, [])

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold">Reports & Analytics</h1>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-4 shadow">
          <h3 className="mb-2 font-semibold">Sales by Month</h3>
          <div style={{ height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={reports?.salesByMonth || []}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1E40AF" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow">
          <h3 className="mb-2 font-semibold">Top Products (mock)</h3>
          <div style={{ height: 240 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={[{ name: 'A', value: 40 }, { name: 'B', value: 30 }, { name: 'C', value: 30 }]} dataKey="value" nameKey="name" outerRadius={80}>
                  <Cell fill="#1E40AF" />
                  <Cell fill="#F59E0B" />
                  <Cell fill="#10B981" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 text-right">
            <button className="btn-primary" onClick={() => showToast('Report downloaded', 'success')}>Download report</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
