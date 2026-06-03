import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { Loader } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const COLORS = ['#3b82f6','#8b5cf6','#ec4899','#f59e0b','#10b981','#06b6d4','#f97316','#84cc16','#ef4444','#a855f7']

export default function StatsPage() {
  const { t } = useTranslation()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch(`/api/stats/conversions?days=${days}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => { setStats(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [days])

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <Loader size={32} className="animate-spin text-blue-400" />
    </div>
  )

  const byType = stats?.byType ?? []
  const byDate = stats?.byDate ?? []

  return (
    <div className="min-h-screen bg-slate-900 text-white py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">{t('stats.title')}</h1>
          <select value={days} onChange={e => setDays(Number(e.target.value))}
            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm">
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            [t('stats.total'),     stats?.totalJobs     ?? 0, 'text-blue-400'],
            [t('stats.completed'), stats?.completedJobs ?? 0, 'text-green-400'],
            [t('stats.failed'),    stats?.failedJobs    ?? 0, 'text-red-400'],
          ].map(([label, val, cls]) => (
            <div key={label} className="bg-slate-800 rounded-xl p-6 text-center">
              <div className={`text-3xl font-bold ${cls}`}>{val}</div>
              <div className="text-slate-400 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>

        {byDate.length > 0 && (
          <div className="bg-slate-800 rounded-xl p-6 mb-6">
            <h2 className="font-semibold mb-4">{t('stats.overtime')}</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={byDate}>
                <XAxis dataKey="date" tick={{ fill:'#94a3b8', fontSize:11 }} />
                <YAxis tick={{ fill:'#94a3b8', fontSize:11 }} />
                <Tooltip contentStyle={{ background:'#1e293b', border:'none', borderRadius:'8px' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {byType.length > 0 && (
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="font-semibold mb-4">{t('stats.byType')}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={byType.slice(0,10)} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={110} label={({type}) => type?.replace(/_/g,' ')}>
                  {byType.slice(0,10).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background:'#1e293b', border:'none', borderRadius:'8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {!stats && (
          <div className="text-center py-20 text-slate-400">No stats available yet.</div>
        )}
      </div>
    </div>
  )
}
