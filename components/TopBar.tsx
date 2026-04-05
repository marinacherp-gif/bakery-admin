'use client'

import { useState, useRef, useEffect } from 'react'
import { useI18n, LOCALE_LABELS, type Locale } from '@/lib/i18n'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'

const LOCALE_FLAGS: Record<Locale, string> = {
  en: '🇺🇸',
  he: '🇮🇱',
  ru: '🇷🇺',
}

export function TopBar() {
  const { locale, setLocale, isRTL } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className={clsx(
      'fixed top-0 right-0 z-30 h-14 flex items-center px-6',
      isRTL ? 'lg:right-0 lg:left-64' : 'lg:left-64 lg:right-0',
      'left-0' // full width on mobile
    )}>
      {/* Selector pushed to the far end */}
      <div className={clsx('ml-auto', isRTL && 'ml-0 mr-auto')}>
        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen(v => !v)}
            className={clsx(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium',
              'text-brown-600 hover:bg-brown-50 border border-transparent hover:border-warm-border',
              'transition-all duration-150 select-none'
            )}
          >
            <span className="text-base leading-none">{LOCALE_FLAGS[locale]}</span>
            <span className="hidden sm:inline">{LOCALE_LABELS[locale]}</span>
            <ChevronDown
              size={14}
              className={clsx('text-brown-400 transition-transform duration-200', open && 'rotate-180')}
            />
          </button>

          {open && (
            <div className={clsx(
              'absolute top-full mt-1.5 w-40 py-1 bg-white rounded-xl shadow-lg',
              'border border-warm-border overflow-hidden',
              isRTL ? 'left-0' : 'right-0'
            )}>
              {(Object.keys(LOCALE_LABELS) as Locale[]).map(l => (
                <button
                  key={l}
                  onClick={() => { setLocale(l); setOpen(false) }}
                  className={clsx(
                    'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                    l === locale
                      ? 'bg-cream-100 text-brown-800 font-medium'
                      : 'text-brown-600 hover:bg-cream-50'
                  )}
                >
                  <span className="text-base leading-none">{LOCALE_FLAGS[l]}</span>
                  <span>{LOCALE_LABELS[l]}</span>
                  {l === locale && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brown-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
