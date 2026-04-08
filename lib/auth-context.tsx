'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface User {
  email: string
  name: string
  avatar_url?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

function toUser(u: SupabaseUser, allowedEmails: string[]): User | null {
  if (!u.email || !allowedEmails.includes(u.email.toLowerCase())) return null
  return {
    email: u.email!,
    name: u.user_metadata?.full_name || u.user_metadata?.name || u.email!.split('@')[0],
    avatar_url: u.user_metadata?.avatar_url,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      // Fetch allowed emails from DB
      const { data } = await supabase.from('admin_users').select('email')
      const emails = (data ?? []).map((r: { email: string }) => r.email.toLowerCase())

      // Get initial session
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) setUser(toUser(session.user, emails))
      setLoading(false)
    }
    init()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const { data } = await supabase.from('admin_users').select('email')
      const emails = (data ?? []).map((r: { email: string }) => r.email.toLowerCase())
      if (session?.user) {
        setUser(toUser(session.user, emails))
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
