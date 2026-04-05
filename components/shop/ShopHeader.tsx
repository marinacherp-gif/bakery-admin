'use client'

import { useShopI18n } from '@/lib/shop-i18n'
import { LanguageSwitcher } from './LanguageSwitcher'

export function ShopHeader() {
  const { isRTL } = useShopI18n()

  return (
    <header
      className="fixed top-0 z-40 w-full max-w-[480px] h-14 bg-brown-800 flex items-center justify-between px-4 shadow-sm"
      style={{ left: '50%', transform: 'translateX(-50%)' }}
    >
      {/* Language switcher — sits on the left in RTL (end of line) */}
      <div className={isRTL ? 'order-last' : 'order-first'}>
        <LanguageSwitcher />
      </div>

      {/* Logo — sits on the right in RTL (start of line) */}
      <div className={`flex items-center gap-2 ${isRTL ? 'order-first' : 'order-last'}`}>
        <div className="w-7 h-7 rounded-lg bg-brown-500 flex items-center justify-center">
          <span className="text-cream-100 text-xs font-bold">L</span>
        </div>
        <span className="text-cream-100 font-bold text-base tracking-widest">LABREAD</span>
      </div>
    </header>
  )
}
