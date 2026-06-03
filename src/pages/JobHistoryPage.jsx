import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, RefreshCw, Clock, CheckCircle, XCircle, Loader } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const STATUS_ICON = {
  COMPLETED: <CheckCircle size={16} className="text-green-400" />,
  FAILED:    <XCircle    size={16} className="text-red-400" />,
  PENDING:   <Clock      size={16} className="text-yellow-400" />,
  PROCESSING:<Loader     size={16} className="text-blue-400 animate-spin" />,
}

export default function JobHistoryPage() {
  const { t } = useTranslation()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/jobs', { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) setJobs(await res.json())
    } catch (_) {}
    setLoading(false)
  }

  useEffect(() => { fetchJobs() }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-white py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">{t('jobs.title')}</h1>
          <button onClick={fetchJobs} className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm">
            <RefreshCw size={16} />Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader size={32} className="animate-spin text-blue-400" /></div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 text-slate-400">No jobs yet. Convert a file to get started!</div>
        ) : (
          <div className="space-y-2">
            {jobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-slate-800 rounded-lg p-4 flex items-center gap-4"
              >
                <div className="flex-shrink-0">{STATUS_ICON[job.status] ?? STATUS_ICON.PENDING}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{job.conversionType?.replace(/_/g,' ')}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{new Date(job.createdAt).toLocaleString()}</div>
                  {job.errorMessage && <div className="text-xs text-red-400 mt-1 truncate">{job.errorMessage}</div>}
                </div>
                <div className="flex-shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    job.status === 'COMPLETED' ? 'bg-green-900 text-green-300' :
                    job.status === 'FAILED'    ? 'bg-red-900 text-red-300' :
                    'bg-slate-700 text-slate-300'
                  }`}>{job.status}</span>
                </div>
                {job.outputFileId && (
                  <a
                    href={`/api/files/${job.outputFileId}/download`}
                    className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    download
                  >
                    <Download size={14} />Download
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
