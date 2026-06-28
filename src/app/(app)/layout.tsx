'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Flame } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Navbar } from '@/components/layout/Navbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { firebaseUser, profile, isNewUser, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    // Not authenticated → send to login
    if (!firebaseUser) {
      router.replace('/login')
      return
    }

    // Authenticated but profile not yet setup (no username) → send to onboarding
    if (isNewUser || (profile && !profile.username)) {
      router.replace('/onboarding')
    }
  }, [loading, firebaseUser, profile, isNewUser, router])

  // ─── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-[#5B3BEB] flex items-center justify-center shadow-[0_0_32px_rgba(91,59,235,0.4)] animate-pulse">
          <Flame className="h-7 w-7 text-white" />
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-[#5B3BEB] animate-bounce"
              style={{ animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
      </div>
    )
  }

  // ─── Not authenticated (redirect is in flight) ─────────────────────────────
  if (!firebaseUser) return null

  // ─── Needs onboarding (redirect is in flight) ──────────────────────────────
  if (isNewUser || (profile && !profile.username)) return null

  // ─── Authenticated & fully set up ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="lg:pl-64 pb-20 lg:pb-0 pt-14 lg:pt-0">
        <div className="max-w-3xl mx-auto px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
