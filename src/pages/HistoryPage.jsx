import React, { useEffect, useState } from 'react'
import { listJobs, downloadUrl } from '../api/filerApi'
import { Download, RefreshCw, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

const STATUS_STYLES = {
  COMPLETED:  { color: 'text-green-400',  bg: 'bg-green-500/10',  icon: CheckCircle2 },
  FAILED:     { color: 'text-red-400',    bg: 'bg-red-500/10',    icon: XCircle },
  PROCESSING: { color: 'text-brand-400',  bg: 'bg-brand-500/10',  icon: Loader2 },
  PENDING:    { color: 'text-amber-400',  bg: 'bg-amber-500/10',  icon: Clock },
}

export default function HistoryPage() {
  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await listJobs()
      setJobs(data.data ?? [])
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Job History</h2>
        <button onClick={load} className="btn-ghost flex items-center gap-1.5 text-sm">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {loading && jobs.length === 0 ? (
        <div className="text-center py-20 text-slate-500">Loading&hellip;</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 text-slate-500">No jobs yet. Upload a file to get started.</div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job, i) => {
            const s = STATUS_STYLES[job.status] ?? STATUS_STYLES.PENDING
            const Icon = s.icon
            return (
              <motion.div
                key={job.jobId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="card flex items-center gap-4"
              >
                <div className={`w-10 h-10 rounded-xl ${ s.bg } flex items-center justify-center flex-shrink-0`}>
                  <Icon size={18} className={`${ s.color } ${ job.status === 'PROCESSING' || job.status === 'PENDING' ? 'animate-spin' : '' }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{job.conversionType?.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-slate-500 font-mono truncate">{job.jobId}</p>
                  {job.errorMessage && (
                    <p className="text-xs text-red-400 mt-0.5 truncate">{job.errorMessage}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0 space-y-1">
                  <span className={`badge ${ s.bg } ${ s.color }`}>{job.status}</span>
                  {job.progress != null && job.status !== 'COMPLETED' && job.status !== 'FAILED' && (
                    <p className="text-xs text-slate-500">{job.progress}%</p>
                  )}
                  {job.status === 'COMPLETED' && job.downloadUrl && (
                    <a
                      href={job.downloadUrl}
                      download
                      className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300"
                    >
                      <Download size={12} /> Download
                    </a>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
