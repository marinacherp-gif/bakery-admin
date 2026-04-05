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
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1.5">{t('contact.phone')}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              <input
                type="tel"
                value={info.phone}
                onChange={e => set('phone', e.target.value)}
                placeholder={t('contact.phonePlaceholder')}
                className="input-base pl-9"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1.5">{t('contact.email')}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                type="email"
                value={info.email}
                onChange={e => set('email', e.target.value)}
                placeholder={t('contact.emailPlaceholder')}
                className="input-base pl-9"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1.5">{t('contact.address')}</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-brown-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <textarea
                value={info.address}
                onChange={e => set('address', e.target.value)}
                placeholder={t('contact.addressPlaceholder')}
                rows={2}
                className="input-base pl-9 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="card p-6 space-y-5 mb-6">
          <h2 className="text-sm font-semibold text-brown-700">
            {t('contact.social')}{' '}
            <span className="font-normal text-brown-300">({t('contact.optional')})</span>
          </h2>

          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1.5">{t('contact.instagram')}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400 text-sm">instagram.com/</span>
              <input
                type="text"
                value={info.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\/?/, '')}
                onChange={e => set('instagram', e.target.value ? `https://instagram.com/${e.target.value}` : '')}
                placeholder="yourbakery"
                className="input-base pl-[7.5rem]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1.5">{t('contact.facebook')}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400 text-sm">facebook.com/</span>
              <input
                type="text"
                value={info.facebook.replace(/^https?:\/\/(www\.)?facebook\.com\/?/, '')}
                onChange={e => set('facebook', e.target.value ? `https://facebook.com/${e.target.value}` : '')}
                placeholder="yourbakery"
                className="input-base pl-[7.5rem]"
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
