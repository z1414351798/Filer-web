import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, CheckCircle } from 'lucide-react'
import { uploadFile } from '../api/filerApi'
import toast from 'react-hot-toast'

export default function FileUpload({ onUploaded, multiple = false }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploaded, setUploaded] = useState(null)

  const onDrop = async files => {
    const file = files[0]
    if (!file) return
    setUploading(true)
    setProgress(0)
    try {
      const res = await uploadFile(file, setProgress)
      setUploaded(res.data.data)
      onUploaded && onUploaded(res.data.data)
      toast.success('File uploaded!')
    } catch (e) {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple })

  return (
    <div>
      <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${isDragActive ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}>
        <input {...getInputProps()} />
        {uploading ? (
          <div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-sm text-gray-500">Uploading... {progress}%</p>
          </div>
        ) : uploaded ? (
          <div className="flex items-center justify-center gap-2 text-green-600">
            <CheckCircle size={20} /><span className="text-sm font-medium">{uploaded.originalName}</span>
          </div>
        ) : (
          <div className="text-gray-500">
            <Upload size={36} className="mx-auto mb-2 text-indigo-400" />
            <p className="font-medium">Drop file here or click to browse</p>
            <p className="text-xs mt-1">Supports all common formats up to 500MB</p>
          </div>
        )}
      </div>
    </div>
  )
}
