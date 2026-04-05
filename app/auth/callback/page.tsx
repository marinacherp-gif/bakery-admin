'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        subscription.unsubscribe()
        router.replace('/admin/announcements')
      }
    })

    // Also check if session already exists (e.g. hash/code already processed)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/admin/announcements')
    })

    return () => subscription.unsubscribe()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-100">
      <div className="w-8 h-8 border-2 border-brown-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
