'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { type User } from 'firebase/auth'
import { onAuthChange, signInWithGoogle, signOut, getIdToken } from '@/lib/firebase/config'
import { createClient } from '@/lib/supabase/client'
import { type UserProfile } from '@/types'

interface AuthContextType {
  firebaseUser: User | null
  profile: UserProfile | null
  loading: boolean
  signInGoogle: () => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchProfile = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', uid)
      .single()
    if (data) setProfile(data as UserProfile)
  }, [supabase])

  const upsertProfile = useCallback(async (user: User) => {
    const { data } = await supabase
      .from('users')
      .upsert(
        {
          id: user.uid,
          email: user.email,
          full_name: user.displayName,
          avatar_url: user.photoURL,
          last_login: new Date().toISOString(),
        },
        { onConflict: 'id', ignoreDuplicates: false }
      )
      .select()
      .single()
    if (data) setProfile(data as UserProfile)
  }, [supabase])

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setFirebaseUser(user)
      if (user) {
        await upsertProfile(user)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [upsertProfile])

  const signInGoogle = useCallback(async () => {
    const user = await signInWithGoogle()
    await upsertProfile(user)
  }, [upsertProfile])

  const logout = useCallback(async () => {
    await signOut()
    setProfile(null)
  }, [])

  const refreshProfile = useCallback(async () => {
    if (firebaseUser) await fetchProfile(firebaseUser.uid)
  }, [firebaseUser, fetchProfile])

  return (
    <AuthContext.Provider
      value={{ firebaseUser, profile, loading, signInGoogle, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
