import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Save, Lock } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()
  const [oldPwd, setOldPwd]   = useState('')
  const [newPwd, setNewPwd]   = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving]   = useState(false)

  const changePassword = async e => {
    e.preventDefault()
    if (newPwd !== confirm) { toast.error('Passwords do not match'); return }
    if (newPwd.length < 6)  { toast.error('Password must be at least 6 characters'); return }
    setSaving(true)
    try {
      const token = localStorage.getItem('filer_token')
      const res = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ oldPassword: oldPwd, newPassword: newPwd })
      })
      const data = await res.json()
      if (res.ok) { toast.success('Password changed'); setOldPwd(''); setNewPwd(''); setConfirm('') }
      else toast.error(data.message || 'Failed to change password')
    } catch { toast.error('Request failed') }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white py-10 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-8">Profile</h1>

        <div className="bg-slate-800 rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-slate-300 mb-4">Account Info</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Username</span>
              <span>{user?.username ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Email</span>
              <span>{user?.email || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Role</span>
              <span className="capitalize">{user?.role?.toLowerCase() ?? '—'}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <Lock size={16} />Change Password
          </h2>
          <form onSubmit={changePassword} className="space-y-4">
            {[
              ['Current password', oldPwd, setOldPwd],
              ['New password', newPwd, setNewPwd],
              ['Confirm new password', confirm, setConfirm]
            ].map(([label, val, set]) => (
              <div key={label}>
                <label className="block text-sm text-slate-400 mb-1">{label}</label>
                <input
                  type="password"
                  value={val}
                  onChange={e => set(e.target.value)}
                  required
                  minLength={label === 'Current password' ? 1 : 6}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Save size={16} />{saving ? 'Saving...' : 'Save Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
