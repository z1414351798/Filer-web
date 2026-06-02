import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, File as FileIcon, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { uploadFile } from '../api/filerApi'
import toast from 'react-hot-toast'

const MAX_MB = 200

export default function UploadZone({ onFileUploaded }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadedFile, setUploadedFile] = useState(null)

  const onDrop = useCallback(async (accepted) => {
    const file = accepted[0]
    if (!file) return
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`Max file size is ${MAX_MB} MB`)
      return
    }
    setUploading(true)
    setProgress(0)
    try {
      const { data } = await uploadFile(file, setProgress)
      const info = data.data
      setUploadedFile({ name: file.name, ...info })
      onFileUploaded(info)
      toast.success('File uploaded!')
    } catch (e) {
      toast.error(e.response?.data?.message ?? 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [onFileUploaded])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, multiple: false, disabled: uploading
  })

  const reset = () => { setUploadedFile(null); onFileUploaded(null) }

  return (
    <div>
      <AnimatePresence mode="wait">
        {!uploadedFile ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
              ${ isDragActive
                ? 'border-brand-500 bg-brand-600/10'
                : 'border-slate-700 hover:border-brand-500 hover:bg-slate-800/50' }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className={`mx-auto mb-4 ${ isDragActive ? 'text-brand-400' : 'text-slate-500' }`} size={48} />
            {uploading ? (
              <div className="space-y-3">
                <p className="text-slate-300 font-medium">Uploading&hellip; {progress}%</p>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-brand-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : (
              <>
                <p className="text-slate-300 font-semibold text-lg mb-1">
                  {isDragActive ? 'Drop it here!' : 'Drag & drop your file'}
                </p>
                <p className="text-slate-500 text-sm">or click to browse &mdash; up to {MAX_MB} MB</p>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="uploaded"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="card flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-600/20 flex items-center justify-center flex-shrink-0">
              <FileIcon className="text-brand-400" size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{uploadedFile.name}</p>
              <p className="text-sm text-slate-400">
                {(uploadedFile.fileSize / 1024).toFixed(1)} KB &bull; {uploadedFile.extension?.toUpperCase()}
              </p>
            </div>
            <button onClick={reset} className="text-slate-500 hover:text-red-400 transition-colors">
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
