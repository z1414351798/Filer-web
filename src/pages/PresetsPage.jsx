import { useEffect, useState } from 'react'
import { listPresets, createPreset, deletePreset } from '../api/filerApi'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Bookmark, Plus, Trash2 } from 'lucide-react'

export default function PresetsPage() {
  const { isAuthenticated } = useAuth()
  const [presets, setPresets] = useState([])
  const [form, setForm] = useState({ name: '', conversionType: '', paramsJson: '{}' })
  const [adding, setAdding] = useState(false)

  const load = () => listPresets().then(setPresets).catch(() => {})

  useEffect(() => { if (isAuthenticated) load() }, [isAuthenticated])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      JSON.parse(form.paramsJson)
    } catch {
      toast.error('Invalid JSON in params')
      return
    }
    setAdding(true)
    try {
      await createPreset(form)
      toast.success('Preset saved')
      setForm({ name: '', conversionType: '', paramsJson: '{}' })
      load()
    } catch { toast.error('Failed to save preset') }
    finally { setAdding(false) }
  }

  const handleDelete = async (id) => {
    await deletePreset(id)
    toast.success('Preset deleted')
    load()
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-400">Sign in to manage your saved presets.</p>
      </div>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center gap-3">
        <Bookmark className="text-indigo-400" size={28} />
        <h1 className="text-2xl font-bold text-white">Saved Presets</h1>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">New Preset</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Preset Name</label>
            <input type="text" required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Conversion Type</label>
            <input type="text" required placeholder="e.g. IMAGE_RESIZE"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              value={form.conversionType}
              onChange={e => setForm(f => ({ ...f, conversionType: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Parameters (JSON)</label>
            <textarea rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
              value={form.paramsJson}
              onChange={e => setForm(f => ({ ...f, paramsJson: e.target.value }))} />
          </div>
          <button type="submit" disabled={adding}
            className="btn-primary flex items-center gap-2 px-5 py-2.5">
            <Plus size={16} /> {adding ? 'Saving...' : 'Save Preset'}
          </button>
        </form>
      </div>

      {presets.length > 0 && (
        <div className="space-y-3">
          {presets.map(p => (
            <div key={p.id} className="card p-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-white">{p.name}</p>
                <p className="text-sm text-indigo-400 mt-0.5">{p.conversionType}</p>
                <pre className="text-xs text-slate-500 mt-1 font-mono">{p.paramsJson}</pre>
              </div>
              <button onClick={() => handleDelete(p.id)}
                className="text-slate-500 hover:text-red-400 transition-colors mt-1">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {presets.length === 0 && (
        <p className="text-center text-slate-500 py-10">No presets yet. Create one above.</p>
      )}
    </main>
  )
}
