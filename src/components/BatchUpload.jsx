import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Upload, X } from 'lucide-react'

export default function BatchUpload({ onUploaded }) {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState({})

  const onDrop = useCallback((accepted) => {
    setFiles(prev => [...prev, ...accepted])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true })

  const remove = (idx) => setFiles(f => f.filter((_, i) => i !== idx))

  const upload = async () => {
    if (!files.length) return
    setUploading(true)
    const results = []
    for (let i = 0; i < files.length; i++) {
      const fd = new FormData()
      fd.append('file', files[i])
      try {
        const res = await axios.post('/api/files/upload', fd, {
          onUploadProgress: (e) =>
            setProgress(p => ({ ...p, [i]: Math.round(e.loaded / e.total * 100) }))
        })
        results.push(res.data.data)
      } catch {
        toast.error(`Failed to upload ${files[i].name}`)
      }
    }
    setUploading(false)
    setFiles([])
    setProgress({})
    onUploaded?.(results)
    toast.success(`${results.length} file(s) uploaded`)
  }

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-indigo-500 bg-indigo-950/30' : 'border-slate-700 hover:border-slate-500'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-2 text-slate-500" size={28} />
        <p className="text-slate-400 text-sm">Drop multiple files or click to browse</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 bg-slate-800 rounded-lg px-3 py-2">
              <span className="flex-1 text-sm text-slate-300 truncate">{f.name}</span>
              {progress[i] !== undefined && (
                <span className="text-xs text-indigo-400">{progress[i]}%</span>
              )}
              <button onClick={() => remove(i)} className="text-slate-500 hover:text-red-400">
                <X size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={upload} disabled={uploading}
            className="btn-primary w-full py-2.5 flex items-center justify-center gap-2">
            <Upload size={16} />
            {uploading ? 'Uploading...' : `Upload ${files.length} file(s)`}
          </button>
        </div>
      )}
    </div>
  )
}
