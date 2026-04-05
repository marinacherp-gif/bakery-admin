'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useI18n } from '@/lib/i18n'
import { Sidebar } from '@/components/Sidebar'
import { TopBar } from '@/components/TopBar'
import clsx from 'clsx'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const { isRTL } = useI18n()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100">
        <div className="w-8 h-8 border-2 border-brown-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-warm-gray">
      <Sidebar />
      <TopBar />
      <main className={clsx('min-h-screen pt-14', isRTL ? 'lg:mr-64' : 'lg:ml-64')}>
        <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
