'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { Users, Plus, Trash2, ShieldCheck } from 'lucide-react'

interface AdminUser {
  id: string
  email: string
  created_at: string
}

export default function UsersPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [newEmail, setNewEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    setLoading(true)
    const { data } = await supabase.from('admin_users').select('*').order('created_at')
    setUsers(data ?? [])
    setLoading(false)
  }

  const handleAdd = async () => {
    const email = newEmail.trim().toLowerCase()
    if (!email || !email.includes('@')) { setError('Enter a valid email'); return }
    if (users.find(u => u.email === email)) { setError('Email already exists'); return }
    setSaving(true)
    setError('')
    const { data, error: err } = await supabase.from('admin_users').insert({ email }).select().single()
    if (err) { setError(err.message); setSaving(false); return }
    if (data) setUsers(prev => [...prev, data])
    setNewEmail('')
    setSaving(false)
  }

  const handleDelete = async (u: AdminUser) => {
    if (u.email === currentUser?.email) { setError("You can't remove yourself"); return }
    setDeletingId(u.id)
    await supabase.from('admin_users').delete().eq('id', u.id)
    setUsers(prev => prev.filter(x => x.id !== u.id))
    setDeletingId(null)
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brown-100 flex items-center justify-center">
          <Users className="text-brown-500" size={20} />
        </div>
        <div>
          <h1 className="page-title">Admin Users</h1>
          <p className="text-sm text-brown-400 mt-0.5">Manage who can access the admin panel</p>
        </div>
      </div>

      {/* Add new */}
      <div className="card p-6 mb-6">
        <h2 className="text-sm font-semibold text-brown-700 mb-3">Add user</h2>
        <div className="flex gap-3">
          <input
            type="email"
            value={newEmail}
            onChange={e => { setNewEmail(e.target.value); setError('') }}
            placeholder="email@example.com"
            className="input-base flex-1"
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <button
            onClick={handleAdd}
            disabled={!newEmail.trim() || saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brown-600 hover:bg-brown-700 text-cream-100 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving
              ? <span className="w-4 h-4 border-2 border-cream-200 border-t-transparent rounded-full animate-spin" />
              : <Plus size={16} />
            }
            Add
          </button>
        </div>
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-brown-300 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-2">
          {users.map(u => (
            <div key={u.id} className="card p-4 flex items-center gap-4 group">
              <div className="w-9 h-9 rounded-full bg-brown-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-brown-600">
                  {u.email[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brown-800 truncate">{u.email}</p>
                <p className="text-xs text-brown-400">Added {formatDate(u.created_at)}</p>
              </div>
              {u.email === currentUser?.email && (
                <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-100 rounded-full px-2 py-0.5 flex-shrink-0">
                  <ShieldCheck size={11} /> You
                </span>
              )}
              <button
                onClick={() => handleDelete(u)}
                disabled={deletingId === u.id || u.email === currentUser?.email}
                title="Remove user"
                className="p-1.5 rounded-lg hover:bg-red-50 text-brown-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-20 disabled:cursor-not-allowed"
              >
                {deletingId === u.id
                  ? <span className="w-4 h-4 border-2 border-brown-300 border-t-transparent rounded-full animate-spin inline-block" />
                  : <Trash2 size={16} />
                }
              </button>
            </div>
          ))}
        </div>
      )}

      {users.length > 0 && (
        <p className="text-xs text-brown-300 mt-4 text-right">{users.length} user{users.length !== 1 ? 's' : ''} with admin access</p>
      )}
    </div>
  )
}
