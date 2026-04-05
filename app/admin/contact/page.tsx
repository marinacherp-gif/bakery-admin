'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { ContactInfo } from '@/lib/supabase'
import { useI18n } from '@/lib/i18n'
import { Phone, Check } from 'lucide-react'
import clsx from 'clsx'

const EMPTY: Omit<ContactInfo, 'id'> = { phone: '', email: '', address: '', instagram: '', facebook: '' }

export default function ContactPage() {
  const { t } = useI18n()
  const [info, setInfo] = useState<ContactInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('contact_info').select('*').single().then(({ data }) => {
      setInfo(data ?? ({ ...EMPTY, id: '' } as ContactInfo))
      setLoading(false)
    })
  }, [])

  const set = <K extends keyof ContactInfo>(key: K, value: ContactInfo[K]) => {
    setInfo(prev => prev ? { ...prev, [key]: value } : prev)
    setSaved(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!info) return
    setSaving(true)
    if (info.id) {
      const { data } = await supabase
        .from('contact_info')
        .update({ phone: info.phone, email: info.email, address: info.address, instagram: info.instagram, facebook: info.facebook })
        .eq('id', info.id)
        .select()
        .single()
      if (data) setInfo(data)
    } else {
      const { data } = await supabase
        .from('contact_info')
        .insert({ phone: info.phone, email: info.email, address: info.address, instagram: info.instagram, facebook: info.facebook })
        .select()
        .single()
      if (data) setInfo(data)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (loading || !info) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-6 h-6 border-2 border-brown-300 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brown-100 flex items-center justify-center">
          <Phone className="text-brown-500" size={20} />
        </div>
        <div>
          <h1 className="page-title">{t('contact.title')}</h1>
          <p className="text-sm text-brown-400 mt-0.5">{t('contact.subtitle')}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="max-w-xl">
        <div className="card p-6 space-y-5 mb-6">
          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1.5">{t('contact.phone')}</label>
            <input
              type="tel"
              value={info.phone}
              onChange={e => set('phone', e.target.value)}
              placeholder={t('contact.phonePlaceholder')}
              className="input-base w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1.5">{t('contact.email')}</label>
            <input
              type="email"
              value={info.email}
              onChange={e => set('email', e.target.value)}
              placeholder={t('contact.emailPlaceholder')}
              className="input-base w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1.5">{t('contact.address')}</label>
            <textarea
              value={info.address}
              onChange={e => set('address', e.target.value)}
              placeholder={t('contact.addressPlaceholder')}
              rows={2}
              className="input-base resize-none w-full"
            />
          </div>
        </div>

        <div className="card p-6 space-y-5 mb-6">
          <h2 className="text-sm font-semibold text-brown-700">
            {t('contact.social')}{' '}
            <span className="font-normal text-brown-300">({t('contact.optional')})</span>
          </h2>

          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1.5">{t('contact.instagram')}</label>
            <div className="flex rounded-lg border border-warm-border overflow-hidden focus-within:ring-2 focus-within:ring-brown-200 focus-within:border-brown-400">
              <span className="flex items-center px-3 bg-cream-100 text-brown-400 text-sm border-r border-warm-border whitespace-nowrap flex-shrink-0">
                instagram.com/
              </span>
              <input
                type="text"
                value={info.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\/?/, '')}
                onChange={e => set('instagram', e.target.value ? `https://instagram.com/${e.target.value}` : '')}
                placeholder="yourbakery"
                className="flex-1 px-3 py-2 text-sm text-brown-800 bg-white outline-none min-w-0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1.5">{t('contact.facebook')}</label>
            <div className="flex rounded-lg border border-warm-border overflow-hidden focus-within:ring-2 focus-within:ring-brown-200 focus-within:border-brown-400">
              <span className="flex items-center px-3 bg-cream-100 text-brown-400 text-sm border-r border-warm-border whitespace-nowrap flex-shrink-0">
                facebook.com/
              </span>
              <input
                type="text"
                value={info.facebook.replace(/^https?:\/\/(www\.)?facebook\.com\/?/, '')}
                onChange={e => set('facebook', e.target.value ? `https://facebook.com/${e.target.value}` : '')}
                placeholder="yourbakery"
                className="flex-1 px-3 py-2 text-sm text-brown-800 bg-white outline-none min-w-0"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className={clsx(
              'flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors',
              saved ? 'bg-green-500 text-white' : 'bg-brown-600 hover:bg-brown-700 text-cream-100',
              saving && 'opacity-70 cursor-not-allowed'
            )}
          >
            {saving
              ? <span className="w-4 h-4 border-2 border-cream-200 border-t-transparent rounded-full animate-spin" />
              : saved ? <Check size={16} /> : null
            }
            {saved ? t('contact.saved') : t('contact.saveChanges')}
          </button>
        </div>
      </form>
    </div>
  )
}
