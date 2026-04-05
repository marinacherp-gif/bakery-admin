'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useI18n } from '@/lib/i18n'

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth()
  const { t } = useI18n()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.replace('/admin/announcements')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100">
        <div className="w-8 h-8 border-2 border-brown-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream-100 px-4">
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-brown-400 via-brown-300 to-brown-200" />

      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brown-700 shadow-lg mb-4">
            <svg className="w-8 h-8 text-cream-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 10.5V19a1 1 0 001 1h16a1 1 0 001-1v-8.5M3 10.5A2.5 2.5 0 015.5 8h13A2.5 2.5 0 0121 10.5M3 10.5h18M8 8V6a4 4 0 018 0v2" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-brown-800">{t('login.title')}</h1>
          <p className="text-sm text-brown-400 mt-1">{t('login.subtitle')}</p>
        </div>

        <div className="card p-8">
          <h2 className="text-lg font-medium text-brown-700 mb-1">{t('login.signIn')}</h2>
          <p className="text-sm text-brown-400 mb-6">{t('login.signInDesc')}</p>

          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg
              border border-warm-border bg-white hover:bg-cream-100 text-brown-700 font-medium text-sm
              shadow-sm active:scale-[0.98] transition-all duration-150"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {t('login.signInWithGoogle')}
          </button>

          <p className="text-xs text-brown-300 text-center mt-4">{t('login.restricted')}</p>
        </div>

        <p className="text-center text-xs text-brown-300 mt-6">
          © {new Date().getFullYear()} Bakery Admin
        </p>
      </div>
    </div>
  )
}
