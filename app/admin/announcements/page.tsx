'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Announcement } from '@/lib/supabase'
import { useI18n } from '@/lib/i18n'
import { Plus, Trash2, ToggleLeft, ToggleRight, Megaphone, Calendar } from 'lucide-react'
import clsx from 'clsx'

export default function AnnouncementsPage() {
  const { t } = useI18n()
  const [items, setItems] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [newText, setNewText] = useState('')
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.error('fetch announcements:', error)
    setItems(data ?? [])
    setLoading(false)
  }

  const handleAdd = async () => {
    if (!newText.trim()) return
    setSaving(true)
    const { data, error } = await supabase
      .from('announcements')
      .insert({
        text: newText.trim(),
        is_active: true,
        start_at: startAt ? new Date(startAt).toISOString() : null,
        end_at: endAt ? new Date(endAt).toISOString() : null,
      })
      .select()
      .single()
    if (error) console.error('insert announcement:', error)
    if (data) setItems(prev => [data, ...prev])
    setNewText('')
    setStartAt('')
    setEndAt('')
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    await supabase.from('announcements').delete().eq('id', id)
    setItems(prev => prev.filter(a => a.id !== id))
    setDeletingId(null)
  }

  const handleToggle = async (item: Announcement) => {
    const updated = { ...item, is_active: !item.is_active }
    setItems(prev => prev.map(a => a.id === item.id ? updated : a))
    await supabase.from('announcements').update({ is_active: updated.is_active }).eq('id', item.id)
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  const scheduleLabel = (item: Announcement) => {
    if (!item.start_at && !item.end_at) return null
    const start = item.start_at ? formatDate(item.start_at) : 'Now'
    const end = item.end_at ? formatDate(item.end_at) : 'Forever'
    return `${start} → ${end}`
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brown-100 flex items-center justify-center">
          <Megaphone className="text-brown-500" size={20} />
        </div>
        <div>
          <h1 className="page-title">{t('announcements.title')}</h1>
          <p className="text-sm text-brown-400 mt-0.5">{t('announcements.subtitle')}</p>
        </div>
      </div>

      {/* Add new */}
      <div className="card p-6 mb-6">
        <h2 className="text-sm font-semibold text-brown-700 mb-3">{t('announcements.new')}</h2>
        <textarea
          value={newText}
          onChange={e => setNewText(e.target.value)}
          placeholder={t('announcements.placeholder')}
          rows={2}
          className="input-base resize-none w-full mb-4"
          onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAdd() }}
        />

        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-48">
            <label className="block text-xs font-medium text-brown-500 mb-1.5">
              <Calendar size={12} className="inline mr-1" />
              Start — <span className="font-normal text-brown-400">leave empty for immediate</span>
            </label>
            <input
              type="datetime-local"
              value={startAt}
              onChange={e => setStartAt(e.target.value)}
              className="input-base w-full"
            />
          </div>
          <div className="flex-1 min-w-48">
            <label className="block text-xs font-medium text-brown-500 mb-1.5">
              <Calendar size={12} className="inline mr-1" />
              End — <span className="font-normal text-brown-400">leave empty for forever</span>
            </label>
            <input
              type="datetime-local"
              value={endAt}
              onChange={e => setEndAt(e.target.value)}
              className="input-base w-full"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleAdd}
            disabled={!newText.trim() || saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
              bg-brown-600 hover:bg-brown-700 text-cream-100 text-sm font-medium
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving
              ? <span className="w-4 h-4 border-2 border-cream-200 border-t-transparent rounded-full animate-spin" />
              : <Plus size={16} />
            }
            {t('announcements.add')}
          </button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-brown-300 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {items.length === 0 && (
            <div className="card p-12 text-center">
              <Megaphone className="mx-auto text-brown-200 mb-3" size={32} />
              <p className="text-brown-400 text-sm">{t('announcements.empty')}</p>
            </div>
          )}

          {items.map(item => (
            <div
              key={item.id}
              className={clsx('card p-4 flex gap-4 items-start group', !item.is_active && 'opacity-60')}
            >
              <div className={clsx(
                'mt-1 w-2 h-2 rounded-full flex-shrink-0',
                item.is_active ? 'bg-green-500' : 'bg-brown-200'
              )} />

              <div className="flex-1 min-w-0">
                <p className={clsx(
                  'text-sm leading-relaxed',
                  item.is_active ? 'text-brown-800' : 'text-brown-400 line-through'
                )}>
                  {item.text}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                  <span className="text-xs text-brown-300">Added {formatDate(item.created_at)}</span>
                  {scheduleLabel(item) && (
                    <span className="inline-flex items-center gap-1 text-xs text-brown-500 bg-brown-50 border border-warm-border rounded-full px-2 py-0.5">
                      <Calendar size={10} />
                      {scheduleLabel(item)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleToggle(item)}
                  title={item.is_active ? t('announcements.deactivate') : t('announcements.activate')}
                  className="p-1.5 rounded-lg hover:bg-brown-50 text-brown-400 hover:text-brown-600"
                >
                  {item.is_active
                    ? <ToggleRight size={18} className="text-green-500" />
                    : <ToggleLeft size={18} />
                  }
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  title={t('announcements.delete')}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-brown-300 hover:text-red-500"
                >
                  {deletingId === item.id
                    ? <span className="w-4 h-4 border-2 border-brown-300 border-t-transparent rounded-full animate-spin inline-block" />
                    : <Trash2 size={16} />
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <p className="text-xs text-brown-300 mt-4 text-right">
          {items.filter(i => i.is_active).length} {t('announcements.active')} · {items.filter(i => !i.is_active).length} {t('announcements.inactive')}
        </p>
      )}
    </div>
  )
}
