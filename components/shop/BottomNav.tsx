'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { useShopI18n } from '@/lib/shop-i18n'
import { Home, Wheat, Cookie, Clock, ShoppingCart } from 'lucide-react'
import clsx from 'clsx'

export function BottomNav() {
  const pathname = usePathname()
  const { itemCount } = useCart()
  const { t } = useShopI18n()

  const tabs = [
    { href: '/shop', label: t('nav.home'), icon: Home, exact: true },
    { href: '/shop/breads', label: t('nav.breads'), icon: Wheat },
    { href: '/shop/pastries', label: t('nav.pastries'), icon: Cookie },
    { href: '/shop/hours', label: t('nav.hours'), icon: Clock },
    { href: '/shop/cart', label: t('nav.cart'), icon: ShoppingCart, badge: itemCount },
  ]

  return (
    <nav
      className="w-full h-16 flex items-center justify-around flex-shrink-0"
      style={{ backgroundColor: '#FAF7F2', borderTop: '1px solid #DDD4C4', boxShadow: '0 -2px 8px rgba(0,0,0,0.04)', position: 'sticky', bottom: 0, zIndex: 40 }}
    >
      {tabs.map(({ href, label, icon: Icon, exact, badge }) => {
        const active = exact ? pathname === href : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              'flex flex-col items-center gap-0.5 pt-1 px-3 relative transition-colors',
              active ? 'text-brown-700' : 'text-brown-300'
            )}
          >
            <div className="relative">
              <Icon size={20} strokeWidth={active ? 2 : 1.5} />
              {badge != null && badge > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brown-600 text-cream-100 text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </div>
            <span className={clsx('text-[10px] font-medium leading-none', active && 'text-brown-700')}>
              {label}
            </span>
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brown-600 rounded-full" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
