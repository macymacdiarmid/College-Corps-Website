import { createContext, useContext, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'

interface AuthContextType {
  session: Session | null
  user: Session['user'] | null
  isAdmin: boolean
  isFellow: boolean
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isFellow, setIsFellow] = useState(false)
  const [loading, setLoading] = useState(true)

  async function checkRoles(email: string | undefined) {
    if (!email) { setIsAdmin(false); setIsFellow(false); return }
    const [adminRes, fellowRes] = await Promise.all([
      supabase.from('admin_users').select('email').eq('email', email).maybeSingle(),
      supabase.from('fellow_users').select('email').eq('email', email).maybeSingle(),
    ])
    setIsAdmin(!!adminRes.data)
    setIsFellow(!!fellowRes.data)
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session)
      await checkRoles(data.session?.user?.email)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      await checkRoles(session?.user?.email)
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
  }

  return (
    <AuthContext.Provider value={{
      session,
      user: session?.user ?? null,
      isAdmin,
      isFellow,
      loading,
      signInWithGoogle,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
