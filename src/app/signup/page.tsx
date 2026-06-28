'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Flame, User, Building2, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/types'

// ─── Google SVG ───────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const [role, setRole] = useState<UserRole | null>(null)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { signInGoogle, firebaseUser, isNewUser, loading } = useAuth()
  const router = useRouter()

  // If user is already authenticated redirect them appropriately
  useEffect(() => {
    if (!loading && firebaseUser) {
      router.replace(isNewUser ? '/onboarding' : '/feed')
    }
  }, [loading, firebaseUser, isNewUser, router])

  async function handleGoogle() {
    if (!role) return
    setError(null)
    setGoogleLoading(true)
    try {
      await signInGoogle(role)
      // Redirect is handled by the useEffect above once profile/isNewUser is set
    } catch (e) {
      console.error('[Signup] Google sign-in error:', e)
      setError('Sign-in failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  // ─── Step 1: Role selector ─────────────────────────────────────────────────

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm text-center">
          {/* Logo */}
          <div className="h-16 w-16 rounded-2xl bg-[#5B3BEB] flex items-center justify-center mx-auto mb-6 shadow-[0_0_32px_rgba(91,59,235,0.4)]">
            <Flame className="h-9 w-9 text-white" />
          </div>
          <div className="mb-2 text-xs font-bold text-[#5B3BEB] uppercase tracking-[0.2em]">STRIV</div>
          <h1 className="text-3xl font-black tracking-tight mb-2">India&apos;s Platform for Growth</h1>
          <p className="text-muted-foreground text-sm mb-10">
            Unlock your peak performance through systematic discipline and community-driven quests.
          </p>

          {/* Role cards */}
          <div className="space-y-4 mb-8">
            <RoleCard
              icon={<User className="h-6 w-6 text-[#5B3BEB]" />}
              title="Continue as User"
              description="Build communities, create challenges, grow with consistency"
              onClick={() => setRole('user')}
            />
            <RoleCard
              icon={<Building2 className="h-6 w-6 text-[#5B3BEB]" />}
              title="Continue as Business"
              description="Create challenge campaigns, attract customers, build loyal communities"
              onClick={() => setRole('business')}
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-[#5B3BEB] font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    )
  }

  // ─── Step 2: Sign-in with selected role ────────────────────────────────────

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-[#5B3BEB] flex items-center justify-center mx-auto mb-4 shadow-[0_0_24px_rgba(91,59,235,0.35)]">
            {role === 'user' ? (
              <User className="h-7 w-7 text-white" />
            ) : (
              <Building2 className="h-7 w-7 text-white" />
            )}
          </div>

          {/* Role badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5B3BEB]/10 text-[#5B3BEB] text-xs font-semibold mb-3">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {role === 'user' ? 'User Account' : 'Business Account'}
          </div>

          <h1 className="text-2xl font-black tracking-tight">
            {role === 'user' ? 'Join as User' : 'Join as Business'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {role === 'user'
              ? 'Start your discipline journey today.'
              : 'Run campaigns that drive real loyalty.'}
          </p>
        </div>

        {/* Google button */}
        <button
          id="signup-google-btn"
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border border-border bg-card hover:bg-accent hover:border-[#5B3BEB]/40 transition-all text-sm font-semibold mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {googleLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <GoogleIcon />
          )}
          {googleLoading ? 'Signing in…' : 'Continue with Google'}
        </button>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 text-center mb-4">{error}</p>
        )}

        {/* Back */}
        <button
          onClick={() => { setRole(null); setError(null) }}
          className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
        >
          ← Back
        </button>
      </div>
    </div>
  )
}

// ─── Role card sub-component ──────────────────────────────────────────────────

function RoleCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-5 rounded-2xl border border-border bg-card hover:border-[#5B3BEB]/50 hover:bg-[#5B3BEB]/5 transition-all text-left group"
    >
      <div className="h-12 w-12 rounded-xl bg-[#5B3BEB]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#5B3BEB]/20 transition-colors">
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-bold text-base">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-[#5B3BEB] group-hover:translate-x-1 transition-all" />
    </button>
  )
}
