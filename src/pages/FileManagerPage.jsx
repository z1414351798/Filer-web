import { useEffect, useState } from 'react'
import axios from 'axios'
import { Trash2, Download, RefreshCw, FileIcon, Image, FileText, Film, Music } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

function fileIcon(mime) {
  if (!mime) return <FileIcon size={16} className="text-slate-400" />
  if (mime.startsWith('image')) return <Image size={16} className="text-indigo-400" />
  if (mime.includes('pdf')) return <FileText size={16} className="text-red-400" />
  if (mime.startsWith('video')) return <Film size={16} className="text-purple-400" />
  if (mime.startsWith('audio')) return <Music size={16} className="text-green-400" />
  return <FileIcon size={16} className="text-slate-400" />
}

function fmtSize(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + ' KB'
  return (bytes/1024/1024).toFixed(1) + ' MB'
}

export default function FileManagerPage() {
  const { isAuthenticated } = useAuth()
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/files/my', {
        headers: { Authorization: `Bearer ${localStorage.getItem('filer_token')}` }
      })
      setFiles(res.data.data || [])
    } catch { toast.error('Could not load files') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const del = async (fileId) => {
    if (!confirm('Delete this file?')) return
    try {
      await axios.delete(`/api/files/${fileId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('filer_token')}` }
      })
      toast.success('Deleted')
      setFiles(f => f.filter(x => x.fileId !== fileId))
    } catch { toast.error('Delete failed') }
  }

  const share = async (fileId) => {
    try {
      const res = await axios.post(`/api/files/${fileId}/share`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('filer_token')}` }
      })
      const url = window.location.origin + '/api/share/' + res.data.data.token
      await navigator.clipboard.writeText(url)
      toast.success('Share link copied!')
    } catch { toast.error('Could not create share link') }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">My Files</h1>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {files.length === 0 ? (
        <div className="card p-12 text-center text-slate-500">
          {loading ? 'Loading...' : 'No files yet. Upload a file to get started.'}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-700">
              <tr className="text-slate-400 text-xs">
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Size</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Uploaded</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map(f => (
                <tr key={f.fileId} className="border-b border-slate-800 hover:bg-slate-800/30">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2 text-white">
                      {fileIcon(f.mimeType)}
                      <span className="truncate max-w-[200px]">{f.originalName}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{fmtSize(f.fileSize)}</td>
                  <td className="px-4 py-3 text-slate-400">{f.extension || '—'}</td>
                  <td className="px-4 py-3 text-slate-400">{new Date(f.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <a href={`/api/files/${f.fileId}/download`}
                        className="text-indigo-400 hover:text-indigo-300" title="Download" download>
                        <Download size={15} />
                      </a>
                      <button onClick={() => share(f.fileId)}
                        className="text-slate-400 hover:text-white text-xs border border-slate-700 px-2 py-0.5 rounded">
                        Share
                      </button>
                      <button onClick={() => del(f.fileId)}
                        className="text-red-400 hover:text-red-300" title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
