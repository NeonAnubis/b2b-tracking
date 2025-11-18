'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabaseAuth } from '@/lib/supabase-auth'
import { useAuthStore } from '@/lib/store/auth-store'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
})

// Safe tracking helper
function safeTrack(eventType: string, data?: any) {
  try {
    if (typeof window !== 'undefined' && (window as any).b2bTracker?.track) {
      (window as any).b2bTracker.track(eventType, data)
    }
  } catch (error) {
    console.warn('[Auth] Tracking error:', error)
  }
}

function safeIdentify(email: string | null | undefined, data?: any) {
  try {
    if (email && typeof window !== 'undefined' && (window as any).b2bTracker?.identify) {
      (window as any).b2bTracker.identify(email, data)
    }
  } catch (error) {
    console.warn('[Auth] Identity tracking error:', error)
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, setUser, setIsLoading } = useAuthStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active sessions
    supabaseAuth.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
      setLoading(false)

      // Track if user is already logged in
      if (session?.user) {
        safeIdentify(session.user.email, {
          userId: session.user.id,
          signedIn: true
        })
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabaseAuth.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [setUser, setIsLoading])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      email,
      password,
    })

    if (!error && data.user) {
      setUser(data.user)

      // Track sign in event
      safeIdentify(data.user.email, {
        userId: data.user.id,
        event: 'sign_in'
      })
      safeTrack('user_sign_in', {
        userId: data.user.id,
        email: data.user.email
      })
    }

    return { error }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabaseAuth.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/marketplace`
      }
    })

    if (!error && data.user) {
      setUser(data.user)

      // Track sign up event with metadata
      safeIdentify(data.user.email, {
        userId: data.user.id,
        event: 'sign_up',
        ...metadata
      })
      safeTrack('user_sign_up', {
        userId: data.user.id,
        email: data.user.email,
        ...metadata
      })
    }

    return { error }
  }

  const signOut = async () => {
    // Track sign out before clearing session
    if (user) {
      safeTrack('user_sign_out', {
        userId: user.id,
        email: user.email
      })
    }

    await supabaseAuth.auth.signOut()
    setUser(null)
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
