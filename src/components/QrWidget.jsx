import React, { useState } from 'react'
import { createJob, pollJob, downloadUrl } from '../api/filerApi'
import { QrCode, Download, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function QrWidget() {
  const [text, setText]   = useState('')
  const [size, setSize]   = useState(300)
  const [imgSrc, setImg]  = useState(null)
  const [fileId, setFileId] = useState(null)
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if (!text.trim()) { toast.error('Enter some text or URL'); return }
    setLoading(true)
    setImg(null)
    try {
      const { data } = await createJob({
        conversionType: 'QR_GENERATE',
        qrText: text,
        qrSize: size,
      })
      const job = data.data
      const stop = pollJob(job.jobId, (j) => {
        if (j.status === 'COMPLETED' && j.outputFileId) {
          setImg(`/api/files/${j.outputFileId}/download`)
          setFileId(j.outputFileId)
          setLoading(false)
          stop()
        } else if (j.status === 'FAILED') {
          toast.error(j.errorMessage || 'QR generation failed')
          setLoading(false)
          stop()
        }
      })
    } catch (e) {
      toast.error('Failed to generate QR')
      setLoading(false)
    }
  }

  return (
    <div className="card border border-violet-500/30 space-y-4">
      <p className="font-semibold text-violet-400 flex items-center gap-2">
        <QrCode size={18} /> QR Code Generator
      </p>
      <textarea
        rows={3}
        placeholder="Enter URL, text, vCard…"
        value={text}
        onChange={e => setText(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-violet-500"
      />
      <div className="flex items-center gap-3">
        <label className="text-xs text-slate-400 whitespace-nowrap">Size (px)</label>
        <input
          type="range" min={100} max={600} step={50}
          value={size} onChange={e => setSize(Number(e.target.value))}
          className="flex-1 accent-violet-500"
        />
        <span className="text-xs text-slate-400 w-10 text-right">{size}</span>
      </div>
      <button
        onClick={generate} disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700"
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : <QrCode size={15} />}
        {loading ? 'Generating…' : 'Generate QR'}
      </button>

      {imgSrc && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <img src={imgSrc} alt="QR code" className="rounded-xl border border-slate-700 bg-white p-2" style={{ maxWidth: 200 }} />
          <a href={imgSrc} download="qrcode.png"
            className="flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300">
            <Download size={14} /> Download PNG
          </a>
        </motion.div>
      )}
    </div>
  )
}
