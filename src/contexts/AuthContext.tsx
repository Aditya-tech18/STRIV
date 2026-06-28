'use client'

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { type User } from 'firebase/auth'
import {
  onAuthChange,
  signInWithGoogle,
  signOut as firebaseSignOut,
} from '@/lib/firebase/config'
import { createAuthenticatedClient, createClient } from '@/lib/supabase/client'
import { type UserProfile, type UserRole } from '@/types'

// ─── Context shape ────────────────────────────────────────────────────────────

interface AuthContextType {
  firebaseUser: User | null
  profile: UserProfile | null
  loading: boolean
  isNewUser: boolean
  supabaseClient: ReturnType<typeof createAuthenticatedClient> | ReturnType<typeof createClient>
  signInGoogle: (role?: UserRole) => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)

  const supabaseRef = useRef<ReturnType<typeof createAuthenticatedClient> | ReturnType<typeof createClient>>(
    createClient()
  )

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const buildSupabaseClient = useCallback(async (user: User) => {
    try {
      const token = await user.getIdToken(/* forceRefresh */ false)
      supabaseRef.current = createAuthenticatedClient(token)
    } catch {
      supabaseRef.current = createClient()
    }
  }, [])

  const fetchProfile = useCallback(async (uid: string) => {
    const { data, error } = await supabaseRef.current
      .from('users')
      .select('*')
      .eq('firebase_uid', uid)
      .maybeSingle()

    if (error) {
      console.error('[AuthContext] fetchProfile error:', error.message)
      return null
    }
    return data as UserProfile | null
  }, [])

  // ─── Firebase auth state listener ─────────────────────────────────────────

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        setFirebaseUser(user)
        await buildSupabaseClient(user)
        
        const existingProfile = await fetchProfile(user.uid)
        
        if (!existingProfile) {
          setIsNewUser(true)
          setProfile(null)
        } else {
          setProfile(existingProfile)
          // Also set isNewUser=true if they haven't finished onboarding (no username)
          setIsNewUser(!existingProfile.username)
        }
      } else {
        setFirebaseUser(null)
        setProfile(null)
        setIsNewUser(false)
        supabaseRef.current = createClient()
      }

      setLoading(false)
    })

    return unsubscribe
  }, [buildSupabaseClient, fetchProfile])

  // ─── Public API ───────────────────────────────────────────────────────────

  const signInGoogle = useCallback(
    async (role?: UserRole) => {
      const user = await signInWithGoogle()

      // Immediately build authenticated client so the upsert works
      await buildSupabaseClient(user)

      // UPSERT into users table
      const { error } = await supabaseRef.current
        .from('users')
        .upsert({
          firebase_uid: user.uid,
          email: user.email,
          full_name: user.displayName, // Mapping display_name to full_name based on DB schema
          avatar_url: user.photoURL,
          role: role ?? 'user',
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        }, { onConflict: 'firebase_uid' })
        
      if (error) {
        console.error('[AuthContext] signInGoogle upsert error:', error.message)
      }

      const saved = await fetchProfile(user.uid)
      
      setFirebaseUser(user)
      setProfile(saved)
      setIsNewUser(!saved?.username)
    },
    [buildSupabaseClient, fetchProfile]
  )

  const signOut = useCallback(async () => {
    await firebaseSignOut()
    setFirebaseUser(null)
    setProfile(null)
    setIsNewUser(false)
    supabaseRef.current = createClient()
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!firebaseUser) return
    const data = await fetchProfile(firebaseUser.uid)
    if (data) {
      setProfile(data)
      setIsNewUser(!data.username)
    }
  }, [firebaseUser, fetchProfile])

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        profile,
        loading,
        isNewUser,
        supabaseClient: supabaseRef.current,
        signInGoogle,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
