import React, { useState } from 'react'
import axios from 'axios'
import { Info, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FileInfoPanel({ fileInfo }) {
  const [data, setData]     = useState(null)
  const [open, setOpen]     = useState(false)
  const [loading, setLoading] = useState(false)

  if (!fileInfo) return null

  const isImage = ['jpg','jpeg','png','gif','bmp','webp'].includes(
      (fileInfo.extension || '').toLowerCase())
  const isPdf = fileInfo.extension?.toLowerCase() === 'pdf'
  if (!isImage && !isPdf) return null

  const load = async () => {
    if (data) { setOpen(o => !o); return }
    setLoading(true)
    try {
      const url = isImage
        ? `/api/info/${fileInfo.fileId}/image`
        : `/api/info/${fileInfo.fileId}/pdf`
      const res = await axios.get(url)
      setData(res.data.data)
      setOpen(true)
    } catch {}
    setLoading(false)
  }

  return (
    <div className="card border border-slate-700">
      <button onClick={load} className="w-full flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 font-medium text-slate-300">
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Info size={15} />}
          File Info {isImage ? '(EXIF / dimensions)' : '(PDF metadata)'}
        </span>
        {open ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
      </button>
      <AnimatePresence>
        {open && data && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <MetaTree data={data} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MetaTree({ data, depth = 0 }) {
  if (typeof data !== 'object' || data === null) {
    return <span className="text-slate-300 text-xs">{String(data)}</span>
  }
  return (
    <div className={`space-y-1 ${depth > 0 ? 'pl-3 border-l border-slate-700 ml-1' : ''}`}>
      {Object.entries(data).map(([k, v]) => (
        <div key={k} className="flex gap-2 text-xs">
          <span className="text-slate-500 font-mono min-w-max">{k}:</span>
          {typeof v === 'object' && v !== null
            ? <MetaTree data={v} depth={depth + 1} />
            : <span className="text-slate-300 break-all">{String(v ?? '')}</span>}
        </div>
      ))}
    </div>
  )
}
