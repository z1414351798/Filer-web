import { useEffect, useState } from 'react'
import axios from 'axios'
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react'

const STATUS_ICON = {
  UP: <CheckCircle size={18} className="text-green-500" />,
  DEGRADED: <XCircle size={18} className="text-yellow-500" />,
}

function statusIcon(val) {
  if (typeof val === 'string' && val.startsWith('UP')) return <CheckCircle size={16} className="text-green-400" />
  if (typeof val === 'string' && val.startsWith('DOWN')) return <XCircle size={16} className="text-red-400" />
  return null
}

export default function HealthPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/health')
      setData(res.data.data)
    } catch (e) {
      setData({ overall: 'DOWN', error: e.message })
    } finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">System Health</h1>
        <button onClick={fetch} disabled={loading}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {data ? (
        <div className="card p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <span className="font-semibold text-white">Overall</span>
            <span className={`flex items-center gap-2 font-bold ${data.overall === 'UP' ? 'text-green-400' : 'text-yellow-400'}`}>
              {STATUS_ICON[data.overall] || null} {data.overall}
            </span>
          </div>
          {Object.entries(data).filter(([k]) => k !== 'overall').map(([service, status]) => (
            <div key={service} className="flex items-center justify-between py-1">
              <span className="text-slate-300 capitalize">{service}</span>
              <span className={`flex items-center gap-2 text-sm ${String(status).startsWith('UP') ? 'text-green-400' : 'text-red-400'}`}>
                {statusIcon(status)} {String(status)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-10 text-center text-slate-500">
          {loading ? 'Checking services...' : 'No data'}
        </div>
      )}

      <div className="mt-6 card p-4 text-sm text-slate-400">
        <p className="font-medium text-slate-300 mb-2">API Documentation</p>
        <p>Interactive API docs are available at <a href="/swagger-ui/index.html" target="_blank"
          className="text-indigo-400 hover:text-indigo-300 underline">/swagger-ui/index.html</a></p>
      </div>
    </main>
  )
}
