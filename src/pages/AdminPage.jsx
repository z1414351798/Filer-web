import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Loader, Users, ShieldOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminPage() {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && user.role !== 'ADMIN') { navigate('/'); return }
    const token = localStorage.getItem('filer_token')
    fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.data) setUsers(d.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><Loader size={32} className="animate-spin text-blue-400" /></div>

  return (
    <div className="min-h-screen bg-slate-900 text-white py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 flex items-center gap-2"><Users size={24} />Admin — Users</h1>
        <div className="bg-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-700 text-slate-300">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Username</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} className={i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-750'}>
                  <td className="px-4 py-3 text-slate-400">{u.id}</td>
                  <td className="px-4 py-3 font-medium">{u.username}</td>
                  <td className="px-4 py-3 text-slate-300">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${u.role === 'ADMIN' ? 'bg-purple-900 text-purple-300' : 'bg-slate-700 text-slate-300'}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <div className="text-center py-10 text-slate-400">No users found</div>}
        </div>
      </div>
    </div>
  )
}
