'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useI18n } from '@/lib/i18n'
import { useRouter } from 'next/navigation'
import { Megaphone, Clock, ShoppingBasket, Phone, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

export function Sidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { t, isRTL } = useI18n()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const NAV_ITEMS = [
    { href: '/admin/announcements', label: t('nav.announcements'), icon: Megaphone },
    { href: '/admin/opening-hours', label: t('nav.openingHours'), icon: Clock },
    { href: '/admin/items', label: t('nav.items'), icon: ShoppingBasket },
    { href: '/admin/contact', label: t('nav.contact'), icon: Phone },
  ]

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-brown-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brown-400 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-cream-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 10.5V19a1 1 0 001 1h16a1 1 0 001-1v-8.5M3 10.5A2.5 2.5 0 015.5 8h13A2.5 2.5 0 0121 10.5M3 10.5h18M8 8V6a4 4 0 018 0v2" />
            </svg>
          </div>
          <div>
            <div className="text-cream-100 font-semibold text-sm leading-tight">{t('sidebar.bakery')}</div>
            <div className="text-brown-300 text-xs">{t('sidebar.adminPanel')}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="px-3 text-xs font-medium text-brown-400 uppercase tracking-wider mb-2">
          {t('sidebar.menu')}
        </p>
        <ul className="space-y-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    active
                      ? 'bg-brown-500 text-cream-100'
                      : 'text-brown-200 hover:bg-brown-700 hover:text-cream-100'
                  )}
                >
                  <Icon className="flex-shrink-0" size={18} />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

      </nav>

      {/* User + logout */}
      <div className="px-3 py-4 border-t border-brown-700">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          {user?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-brown-400 flex items-center justify-center text-cream-100 text-sm font-semibold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() ?? '?'}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-cream-100 text-sm font-medium truncate">{user?.name}</p>
            <p className="text-brown-300 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
            text-brown-200 hover:bg-brown-700 hover:text-cream-100 transition-colors"
        >
          <LogOut size={16} className="flex-shrink-0" />
          {t('sidebar.signOut')}
        </button>
      </div>
    </div>
  )

  // For RTL (Hebrew), sidebar appears on the right
  const sidePosition = isRTL
    ? 'right-0 left-auto'
    : 'left-0 right-auto'
  const mobileTranslate = isRTL
    ? (mobileOpen ? 'translate-x-0' : 'translate-x-full')
    : (mobileOpen ? 'translate-x-0' : '-translate-x-full')
  const mobileButtonPos = isRTL ? 'right-4 left-auto' : 'left-4 right-auto'

  return (
    <>
      {/* Mobile toggle */}
      <button
        className={clsx('lg:hidden fixed top-4 z-50 p-2 rounded-lg bg-brown-800 text-cream-100 shadow-lg', mobileButtonPos)}
        onClick={() => setMobileOpen(v => !v)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 h-full w-64 bg-brown-800 z-40 transform transition-transform duration-300',
          sidePosition,
          'lg:translate-x-0',
          mobileTranslate
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
