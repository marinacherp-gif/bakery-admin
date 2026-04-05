'use client'

import { useState, useEffect, useRef } from 'react'
import { useShopI18n, SHOP_LOCALE_LABELS, type ShopLocale } from '@/lib/shop-i18n'
import { ChevronDown } from 'lucide-react'

const FLAGS: Record<ShopLocale, string> = { he: '🇮🇱', en: '🇬🇧', ru: '🇷🇺' }

export function LanguageSwitcher() {
  const { locale, setLocale } = useShopI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1 bg-brown-700 hover:bg-brown-600 text-cream-100 rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
      >
        <span>{FLAGS[locale]}</span>
        <span>{SHOP_LOCALE_LABELS[locale]}</span>
        <ChevronDown size={12} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-warm-border overflow-hidden z-50 min-w-[110px]">
          {(Object.keys(SHOP_LOCALE_LABELS) as ShopLocale[]).map(l => (
            <button
              key={l}
              onClick={() => { setLocale(l); setOpen(false) }}
              className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left transition-colors
                ${locale === l ? 'bg-cream-100 text-brown-800 font-medium' : 'text-brown-600 hover:bg-cream-50'}`}
            >
              <span>{FLAGS[l]}</span>
              <span>{l === 'he' ? 'עברית' : l === 'en' ? 'English' : 'Русский'}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
