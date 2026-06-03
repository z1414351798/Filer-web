import { useEffect, useState } from 'react'
import { Key, Plus, Trash2, Copy, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ApiKeysPage() {
  const [keys, setKeys]     = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName]     = useState('')
  const [creating, setCreating] = useState(false)

  const token = () => localStorage.getItem('filer_token')

  const fetchKeys = () =>
    fetch('/api/apikeys', { headers: { Authorization: `Bearer ${token()}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.data) setKeys(d.data); setLoading(false) })

  useEffect(() => { fetchKeys() }, [])

  const create = async () => {
    setCreating(true)
    const res = await fetch('/api/apikeys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ name: name || 'API Key' })
    })
    if (res.ok) { toast.success('Key created'); setName(''); fetchKeys() }
    else toast.error('Failed to create key')
    setCreating(false)
  }

  const revoke = async (id) => {
    await fetch(`/api/apikeys/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } })
    toast.success('Key revoked')
    fetchKeys()
  }

  const copy = (val) => { navigator.clipboard.writeText(val); toast.success('Copied!') }

  return (
    <div className="min-h-screen bg-slate-900 text-white py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2"><Key size={24} />API Keys</h1>
        <p className="text-slate-400 text-sm mb-8">Use these keys in the <code className="bg-slate-800 px-1 rounded">X-API-Key</code> header for programmatic access.</p>

        <div className="flex gap-3 mb-8">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Key name (optional)"
            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
          <button onClick={create} disabled={creating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm transition-colors">
            <Plus size={16} />{creating ? 'Creating...' : 'New Key'}
          </button>
        </div>

        {loading ? <Loader size={24} className="animate-spin text-blue-400 mx-auto" /> :
          keys.length === 0 ? <div className="text-center py-10 text-slate-400">No API keys yet</div> :
          <div className="space-y-3">
            {keys.map(k => (
              <div key={k.id} className="bg-slate-800 rounded-lg p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{k.name}</div>
                  <div className="font-mono text-xs text-slate-400 truncate mt-1">{k.keyValue}</div>
                  <div className="text-xs text-slate-500 mt-1">Created {k.createdAt ? new Date(k.createdAt).toLocaleDateString() : '—'}{k.lastUsed ? ` · Last used ${new Date(k.lastUsed).toLocaleDateString()}` : ''}</div>
                </div>
                <button onClick={() => copy(k.keyValue)} className="p-2 hover:text-blue-400 transition-colors" title="Copy"><Copy size={16} /></button>
                <button onClick={() => revoke(k.id)} className="p-2 hover:text-red-400 transition-colors" title="Revoke"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  )
}
