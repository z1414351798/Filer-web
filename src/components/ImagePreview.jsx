import React, { useEffect, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']

export default function ImagePreview({ fileInfo }) {
  const [show, setShow] = useState(true)
  const [src, setSrc]   = useState(null)

  useEffect(() => {
    if (!fileInfo) { setSrc(null); return }
    if (IMAGE_EXTS.includes((fileInfo.extension || '').toLowerCase())) {
      setSrc(`/api/files/${fileInfo.fileId}/download`)
    } else {
      setSrc(null)
    }
  }, [fileInfo])

  if (!src) return null

  return (
    <div className="card border border-slate-700 overflow-hidden">
      <button
        onClick={() => setShow(s => !s)}
        className="w-full flex items-center justify-between text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Eye size={15} /> Preview
        </span>
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <img
              src={src}
              alt="preview"
              className="w-full max-h-64 object-contain rounded-xl bg-slate-800"
              onError={() => setSrc(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
