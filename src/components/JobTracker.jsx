import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Loader, Download, Wifi, WifiOff } from 'lucide-react'
import { downloadUrl, getJob } from '../api/filerApi'
import { useWebSocket } from '../hooks/useWebSocket'

export default function JobTracker({ jobId }) {
  const [job, setJob] = useState(null)
  const [usePoll, setUsePoll] = useState(false)

  const { connected } = useWebSocket(jobId, (update) => {
    setJob(update)
  })

  // Fallback polling when WebSocket not connected after 2s
  useEffect(() => {
    if (!jobId) return
    const fallbackTimer = setTimeout(() => {
      if (!connected) setUsePoll(true)
    }, 2000)
    return () => clearTimeout(fallbackTimer)
  }, [jobId, connected])

  useEffect(() => {
    if (!usePoll || !jobId) return
    let active = true
    const poll = async () => {
      try {
        const data = await getJob(jobId)
        if (active) setJob(data)
        if (data.status === 'COMPLETED' || data.status === 'FAILED') return
        setTimeout(poll, 1500)
      } catch {}
    }
    poll()
    return () => { active = false }
  }, [usePoll, jobId])

  if (!jobId || !job) return null

  const progress = job.progress ?? 0
  const isDone = job.status === 'COMPLETED'
  const isFailed = job.status === 'FAILED'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="card p-5 mt-4 space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isFailed ? (
              <XCircle className="text-red-400" size={20} />
            ) : isDone ? (
              <CheckCircle className="text-emerald-400" size={20} />
            ) : (
              <Loader className="text-indigo-400 animate-spin" size={20} />
            )}
            <span className="font-medium text-white">
              {isFailed ? 'Conversion failed' : isDone ? 'Done!' : 'Converting...'}
            </span>
          </div>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            {connected ? <Wifi size={12} className="text-emerald-400" /> : <WifiOff size={12} />}
            {connected ? 'live' : 'polling'}
          </span>
        </div>

        {!isDone && !isFailed && (
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-2 bg-indigo-500 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        )}

        {isFailed && job.errorMessage && (
          <p className="text-sm text-red-400">{job.errorMessage}</p>
        )}

        {isDone && job.outputFileId && (
          <a
            href={downloadUrl(job.outputFileId)}
            className="btn-primary flex items-center justify-center gap-2 py-2.5"
            download
          >
            <Download size={16} />
            Download result
          </a>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
