import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { listJobs } from '../api/filerApi'
import { BarChart2 } from 'lucide-react'

const COLORS = ['#6366f1','#22d3ee','#f59e0b','#10b981','#f43f5e','#8b5cf6','#06b6d4','#84cc16']

export default function StatsPage() {
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    listJobs().then(setJobs).catch(() => {})
  }, [])

  const byType = jobs.reduce((acc, j) => {
    acc[j.conversionType] = (acc[j.conversionType] || 0) + 1
    return acc
  }, {})

  const byStatus = jobs.reduce((acc, j) => {
    acc[j.status] = (acc[j.status] || 0) + 1
    return acc
  }, {})

  const typeData = Object.entries(byType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name: name.replace(/_/g, ' '), count }))

  const statusData = Object.entries(byStatus)
    .map(([name, value]) => ({ name, value }))

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <div className="flex items-center gap-3">
        <BarChart2 className="text-indigo-400" size={28} />
        <h1 className="text-2xl font-bold text-white">Conversion Stats</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Jobs', value: jobs.length },
          { label: 'Completed', value: byStatus['COMPLETED'] || 0 },
          { label: 'Failed', value: byStatus['FAILED'] || 0 }
        ].map(({ label, value }) => (
          <div key={label} className="card p-6">
            <p className="text-slate-400 text-sm">{label}</p>
            <p className="text-3xl font-bold text-white mt-1">{value}</p>
          </div>
        ))}
      </div>

      {typeData.length > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Top Conversion Types</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={typeData} margin={{ bottom: 60 }}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }}
                angle={-30} textAnchor="end" interval={0} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                labelStyle={{ color: '#f1f5f9' }} itemStyle={{ color: '#a5b4fc' }} />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {statusData.length > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Status Breakdown</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name"
                cx="50%" cy="50%" outerRadius={100} label>
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
              <Legend wrapperStyle={{ color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </main>
  )
}
