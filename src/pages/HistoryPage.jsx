import { useEffect, useState } from 'react'
import { listJobs, downloadUrl } from '../api/filerApi'
import { Clock, Download, CheckCircle, XCircle, Loader } from 'lucide-react'

const STATUS_ICON = {
  COMPLETED: <CheckCircle size={16} className="text-emerald-400" />,
  FAILED: <XCircle size={16} className="text-red-400" />,
  PROCESSING: <Loader size={16} className="text-indigo-400 animate-spin" />,
  PENDING: <Loader size={16} className="text-slate-400" />,
}

const STATUS_BADGE = {
  COMPLETED: 'bg-emerald-900/40 text-emerald-400 border border-emerald-800',
  FAILED: 'bg-red-900/40 text-red-400 border border-red-800',
  PROCESSING: 'bg-indigo-900/40 text-indigo-400 border border-indigo-800',
  PENDING: 'bg-slate-800 text-slate-400 border border-slate-700',
}

export default function HistoryPage() {
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    listJobs().then(setJobs).catch(() => {})
  }, [])

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center gap-3">
        <Clock className="text-indigo-400" size={28} />
        <h1 className="text-2xl font-bold text-white">Conversion History</h1>
      </div>

      {jobs.length === 0 ? (
        <p className="text-center text-slate-500 py-20">No conversions yet.</p>
      ) : (
        <div className="space-y-3">
          {jobs.map(job => (
            <div key={job.jobId} className="card p-4 flex items-center gap-4">
              {STATUS_ICON[job.status] ?? STATUS_ICON.PENDING}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{job.conversionType}</p>
                <p className="text-xs text-slate-500 mt-0.5">{job.jobId}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${STATUS_BADGE[job.status] ?? STATUS_BADGE.PENDING}`}>
                {job.status}
              </span>
              {job.status === 'COMPLETED' && job.outputFileId && (
                <a href={downloadUrl(job.outputFileId)} download
                  className="btn-primary flex items-center gap-1.5 px-3 py-1.5 text-sm">
                  <Download size={14} /> Download
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
