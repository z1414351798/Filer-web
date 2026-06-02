import React, { useEffect, useState } from 'react'
import { pollJob, downloadUrl } from '../api/filerApi'
import { motion } from 'framer-motion'
import { Download, CheckCircle2, XCircle, Loader2 } from 'lucide-react'

export default function JobTracker({ job: initialJob }) {
  const [job, setJob] = useState(initialJob)

  useEffect(() => {
    if (!initialJob) return
    setJob(initialJob)
    if (initialJob.status === 'COMPLETED' || initialJob.status === 'FAILED') return
    const stop = pollJob(initialJob.jobId, setJob)
    return stop
  }, [initialJob?.jobId])

  if (!job) return null

  const statusColor = {
    PENDING:    'text-amber-400',
    PROCESSING: 'text-brand-400',
    COMPLETED:  'text-green-400',
    FAILED:     'text-red-400',
  }[job.status] ?? 'text-slate-400'

  const StatusIcon = {
    COMPLETED:  CheckCircle2,
    FAILED:     XCircle,
    PROCESSING: Loader2,
    PENDING:    Loader2,
  }[job.status] ?? Loader2

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="card border border-slate-700 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 font-mono">{job.jobId.slice(0, 16)}&hellip;</p>
          <p className="font-semibold text-sm">{job.conversionType?.replace(/_/g, ' ')}</p>
        </div>
        <span className={`flex items-center gap-1.5 text-sm font-semibold ${ statusColor }`}>
          <StatusIcon size={16} className={job.status === 'PROCESSING' || job.status === 'PENDING' ? 'animate-spin' : ''} />
          {job.status}
        </span>
      </div>

      {(job.status === 'PROCESSING' || job.status === 'PENDING') && (
        <div className="space-y-1">
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-brand-500 h-2 rounded-full transition-all duration-700"
              style={{ width: `${job.progress ?? 0}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 text-right">{job.progress ?? 0}%</p>
        </div>
      )}

      {job.status === 'FAILED' && (
        <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{job.errorMessage}</p>
      )}

      {job.status === 'COMPLETED' && job.downloadUrl && (
        <a
          href={job.downloadUrl}
          download
          className="btn-primary flex items-center justify-center gap-2 text-sm"
        >
          <Download size={16} /> Download Result
        </a>
      )}
    </motion.div>
  )
}
