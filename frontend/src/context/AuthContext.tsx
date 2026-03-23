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
  signOut: () => void
}

const ROLE_KEY = 'cc_role'

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  // Seed from cache so role is correct immediately on return visits
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem(ROLE_KEY) === 'admin')
  const [isFellow, setIsFellow] = useState(() => localStorage.getItem(ROLE_KEY) === 'fellow')
  const [loading, setLoading] = useState(true)

  async function checkRoles(email: string | undefined, attempt = 1): Promise<void> {
    if (!email) {
      setIsAdmin(false)
      setIsFellow(false)
      localStorage.removeItem(ROLE_KEY)
      return
    }
    try {
      const queryTimeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 6000)
      )
      const [adminRes, fellowRes] = await Promise.race([
        Promise.all([
          supabase.from('admin_users').select('email').eq('email', email).maybeSingle(),
          supabase.from('fellow_users').select('email').eq('email', email).maybeSingle(),
        ]),
        queryTimeout,
      ])
      const admin = !!adminRes.data
      const fellow = !!fellowRes.data
      setIsAdmin(admin)
      setIsFellow(fellow)
      if (admin) localStorage.setItem(ROLE_KEY, 'admin')
      else if (fellow) localStorage.setItem(ROLE_KEY, 'fellow')
      else localStorage.removeItem(ROLE_KEY)
    } catch {
      // Retry up to 3 times with increasing delay (DB cold start)
      if (attempt < 3) {
        setTimeout(() => checkRoles(email, attempt + 1), attempt * 3000)
      }
    }
  }

  useEffect(() => {
    // Give Supabase free tier up to 30s to wake the database on first visit
    const timeout = setTimeout(() => setLoading(false), 30000)

    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session)
      await checkRoles(data.session?.user?.email)
      clearTimeout(timeout)
      setLoading(false)
    }).catch(() => { clearTimeout(timeout); setLoading(false) })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      await checkRoles(session?.user?.email)
      clearTimeout(timeout)
      setLoading(false)
    })
    return () => { clearTimeout(timeout); subscription.unsubscribe() }
  }, [])

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  // Clear the session directly from localStorage — bypasses the hanging Supabase API call
  const signOut = () => {
    localStorage.removeItem(ROLE_KEY)
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sb-')) localStorage.removeItem(key)
    })
    supabase.auth.signOut().catch(() => {}) // fire and forget
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
