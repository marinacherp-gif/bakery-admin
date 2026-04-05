'use client'

import { LanguageSwitcher } from './LanguageSwitcher'

export function ShopHeader() {
  return (
    <header className="w-full h-14 flex items-center justify-between px-4 flex-shrink-0" style={{ backgroundColor: '#F0EBE0', borderBottom: '1px solid #DDD4C4' }}>
      {/* Language switcher — left side (in RTL this is the "end") */}
      <LanguageSwitcher />

      {/* Logo — right side (in RTL this is the "start") */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpeg" alt="LABREAD" className="w-full h-full object-cover" />
        </div>
        <span className="font-bold text-base tracking-widest" style={{ color: '#3B2010' }}>LABREAD</span>
      </div>
    </header>
  )
}
