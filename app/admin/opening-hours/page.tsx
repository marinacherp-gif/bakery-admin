'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { OpeningHour } from '@/lib/supabase'
import { useI18n } from '@/lib/i18n'
import { Clock, Check } from 'lucide-react'
import clsx from 'clsx'


export default function OpeningHoursPage() {
  const { t } = useI18n()
  const [hours, setHours] = useState<OpeningHour[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchHours()
  }, [])

  const fetchHours = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('opening_hours')
      .select('*')
      .order('day_of_week')
    setHours(data ?? [])
    setLoading(false)
  }

  const update = (dayOfWeek: number, patch: Partial<OpeningHour>) => {
    setHours(prev => prev.map(h => h.day_of_week === dayOfWeek ? { ...h, ...patch } : h))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    await supabase.from('opening_hours').upsert(hours)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-6 h-6 border-2 border-brown-300 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brown-100 flex items-center justify-center">
            <Clock className="text-brown-500" size={20} />
          </div>
          <div>
            <h1 className="page-title">{t('hours.title')}</h1>
            <p className="text-sm text-brown-400 mt-0.5">{t('hours.subtitle')}</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className={clsx(
            'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors',
            saved ? 'bg-green-500 text-white' : 'bg-brown-600 hover:bg-brown-700 text-cream-100',
            saving && 'opacity-70 cursor-not-allowed'
          )}
        >
          {saving
            ? <span className="w-4 h-4 border-2 border-cream-200 border-t-transparent rounded-full animate-spin" />
            : saved ? <Check size={16} /> : null
          }
          {saved ? t('hours.saved') : t('hours.saveChanges')}
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-warm-border bg-cream-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-brown-500 uppercase tracking-wider w-36">{t('hours.day')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-brown-500 uppercase tracking-wider w-28">{t('hours.status')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-brown-500 uppercase tracking-wider">{t('hours.opens')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-brown-500 uppercase tracking-wider">{t('hours.closes')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-border">
              {hours.map(h => (
                <tr key={h.day_of_week} className={clsx('transition-colors', !h.is_open && 'bg-cream-50 opacity-70')}>
                  <td className="px-6 py-4">
                    <span className={clsx('text-sm font-medium', h.is_open ? 'text-brown-800' : 'text-brown-400')}>
                      {t(`day.${h.day_of_week}` as any)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => update(h.day_of_week, { is_open: !h.is_open })}
                      className={clsx(
                        'relative inline-flex w-11 h-6 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brown-400',
                        h.is_open ? 'bg-brown-500' : 'bg-brown-200'
                      )}
                      role="switch"
                      aria-checked={h.is_open}
                    >
                      <span className={clsx(
                        'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
                        h.is_open ? 'translate-x-5' : 'translate-x-0'
                      )} />
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="time"
                      value={h.open_time}
                      disabled={!h.is_open}
                      onChange={e => update(h.day_of_week, { open_time: e.target.value })}
                      className={clsx('input-base w-32', !h.is_open && 'opacity-40 cursor-not-allowed')}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="time"
                      value={h.close_time}
                      disabled={!h.is_open}
                      onChange={e => update(h.day_of_week, { close_time: e.target.value })}
                      className={clsx('input-base w-32', !h.is_open && 'opacity-40 cursor-not-allowed')}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 bg-cream-50 border-t border-warm-border">
          <p className="text-xs text-brown-400">
            {t('hours.daysOpen', { n: hours.filter(h => h.is_open).length })}
          </p>
        </div>
      </div>
    </div>
  )
}
