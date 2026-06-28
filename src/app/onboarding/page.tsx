'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Flame, CheckCircle2, ArrowRight, Loader2, AlertCircle, Dumbbell, Code2, BookOpen, Briefcase, Heart, Sparkles, Globe } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

// ─── Goal options config ───────────────────────────────────────────────────────

type GoalType = 'Fitness' | 'Coding' | 'Study' | 'Health' | 'Business'

const GOALS: Array<{ value: GoalType; label: string; description: string; icon: React.ReactNode; color: string }> = [
  {
    value: 'Fitness',
    label: 'Fitness',
    description: 'Workouts, nutrition & physical performance',
    icon: <Dumbbell className="h-6 w-6" />,
    color: '#FF6B35',
  },
  {
    value: 'Coding',
    label: 'Coding',
    description: 'Daily commits, projects & skill-building',
    icon: <Code2 className="h-6 w-6" />,
    color: '#3BDFEB',
  },
  {
    value: 'Study',
    label: 'Study',
    description: 'Courses, books & continuous education',
    icon: <BookOpen className="h-6 w-6" />,
    color: '#EBCB3B',
  },
  {
    value: 'Business',
    label: 'Business',
    description: 'Entrepreneurship, sales & growth',
    icon: <Briefcase className="h-6 w-6" />,
    color: '#5B3BEB',
  },
  {
    value: 'Health',
    label: 'Health',
    description: 'Sleep, mindfulness & wellness habits',
    icon: <Heart className="h-6 w-6" />,
    color: '#EB3B7B',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function validateUsername(name: string): string | null {
  if (name.length < 3) return 'Must be at least 3 characters'
  if (name.length > 20) return 'Must be 20 characters or less'
  if (!/^[a-zA-Z0-9_]+$/.test(name)) return 'Only letters, numbers, and underscores allowed'
  return null
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const { firebaseUser, profile, supabaseClient, refreshProfile, loading } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState<1 | 2>(1)
  const [username, setUsername] = useState('')
  const [nameError, setNameError] = useState<string | null>(null)
  const [checkingName, setCheckingName] = useState(false)
  const [nameAvailable, setNameAvailable] = useState<boolean | null>(null)
  
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Redirect if already fully set up or not logged in
  useEffect(() => {
    if (loading) return
    if (!firebaseUser) {
      router.replace('/login')
      return
    }
    if (profile?.username) {
      // Already onboarded
      router.replace('/feed')
    }
  }, [loading, firebaseUser, profile, router])

  // Pre-fill username from display name
  useEffect(() => {
    if (profile?.full_name && !username) {
      const suggested = profile.full_name
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '')
        .slice(0, 20)
      setUsername(suggested)
    }
  }, [profile, username])

  // ─── Username uniqueness check (debounced) ─────────────────────────────────

  const checkUsername = useCallback(
    async (name: string) => {
      const err = validateUsername(name)
      if (err) {
        setNameError(err)
        setNameAvailable(null)
        return
      }

      setNameError(null)
      setCheckingName(true)
      setNameAvailable(null)

      try {
        const { data } = await supabaseClient
          .from('users')
          .select('id')
          .eq('username', name)
          .maybeSingle()

        setNameAvailable(!data)
        if (data) setNameError('Username is already taken')
      } catch {
        setNameError('Could not check availability')
      } finally {
        setCheckingName(false)
      }
    },
    [supabaseClient]
  )

  // Debounce the name check by 500 ms
  useEffect(() => {
    if (!username) return
    const t = setTimeout(() => checkUsername(username), 500)
    return () => clearTimeout(t)
  }, [username, checkUsername])

  // ─── Save & complete onboarding ───────────────────────────────────────────

  async function handleComplete() {
    if (!firebaseUser || !selectedGoal || !username || nameError || !nameAvailable) return

    setSaving(true)
    setSaveError(null)

    try {
      const { error } = await supabaseClient
        .from('users')
        .update({
          username: username.toLowerCase(),
          bio: `Goal: ${selectedGoal}`,
        })
        .eq('firebase_uid', firebaseUser.uid)

      if (error) throw error

      await refreshProfile()
      router.replace('/feed')
    } catch (e: unknown) {
      console.error('[Onboarding] save error:', e)
      setSaveError(e instanceof Error ? e.message : 'Something went wrong. Try again.')
    } finally {
      setSaving(false)
    }
  }

  // ─── Loading splash ────────────────────────────────────────────────────────

  if (loading || (!firebaseUser && !loading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#5B3BEB] border-t-transparent" />
      </div>
    )
  }

  // ─── Step 1: Choose username ────────────────────────────────────────────

  if (step === 1) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="h-12 w-12 rounded-2xl bg-[#5B3BEB] flex items-center justify-center mx-auto mb-5 shadow-[0_0_24px_rgba(91,59,235,0.35)]">
              <Flame className="h-7 w-7 text-white" />
            </div>
            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="h-2 w-8 rounded-full bg-[#5B3BEB]" />
              <div className="h-2 w-2 rounded-full bg-border" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Choose your username</h1>
            <p className="text-muted-foreground text-sm mt-1">
              This is how the STRIV community will know you.
            </p>
          </div>

          {/* Username input */}
          <div className="mb-2">
            <label htmlFor="username-input" className="block text-sm font-semibold mb-2">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm select-none">@</span>
              <input
                id="username-input"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))
                  setNameAvailable(null)
                  setNameError(null)
                }}
                placeholder="your_username"
                maxLength={20}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                className={[
                  'w-full h-12 pl-8 pr-10 rounded-xl border text-sm font-semibold bg-card transition-colors outline-none',
                  'focus:ring-2 focus:ring-[#5B3BEB]/30',
                  nameError
                    ? 'border-red-500 focus:border-red-500'
                    : nameAvailable === true
                    ? 'border-green-500 focus:border-green-500'
                    : 'border-border focus:border-[#5B3BEB]',
                ].join(' ')}
              />
              {/* Status icon */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {checkingName && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
                {!checkingName && nameAvailable === true && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
                {!checkingName && nameError && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
          </div>

          {/* Status message */}
          <div className="min-h-[20px] mb-6">
            {nameError && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {nameError}
              </p>
            )}
            {!nameError && nameAvailable === true && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                @{username} is available!
              </p>
            )}
            {!nameError && !nameAvailable && !checkingName && username.length >= 3 && (
              <p className="text-xs text-muted-foreground">Checking availability…</p>
            )}
          </div>

          {/* Next button */}
          <button
            id="onboarding-next-btn"
            disabled={!nameAvailable || !!nameError || checkingName}
            onClick={() => setStep(2)}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-[#5B3BEB] text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#4A2DD4] active:bg-[#3A1EC4] transition-colors shadow-[0_4px_16px_rgba(91,59,235,0.35)] mb-4"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  // ─── Step 2: Choose goal ───────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-6 sm:py-10 text-center">
        <div className="h-12 w-12 rounded-2xl bg-[#5B3BEB] flex items-center justify-center mx-auto mb-5 shadow-[0_0_24px_rgba(91,59,235,0.35)]">
          <Flame className="h-7 w-7 text-white" />
        </div>
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="h-2 w-2 rounded-full bg-border" />
          <div className="h-2 w-8 rounded-full bg-[#5B3BEB]" />
        </div>
        <h1 className="text-2xl font-black tracking-tight">What&apos;s your primary goal?</h1>
        <p className="text-muted-foreground text-sm mt-1">
          We&apos;ll personalise your feed and challenge recommendations.
        </p>
      </div>

      {/* Goals grid */}
      <div className="flex-1 px-4 pb-6 max-w-lg mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {GOALS.map((g) => {
            const active = selectedGoal === g.value
            return (
              <button
                key={g.value}
                id={`goal-${g.value.toLowerCase()}`}
                onClick={() => setSelectedGoal(g.value)}
                className={[
                  'flex items-start gap-3 p-4 rounded-2xl border text-left transition-all',
                  active
                    ? 'border-[#5B3BEB] bg-[#5B3BEB]/8 shadow-[0_0_0_1px_#5B3BEB]'
                    : 'border-border bg-card hover:border-[#5B3BEB]/40 hover:bg-[#5B3BEB]/4',
                ].join(' ')}
              >
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{
                    backgroundColor: active ? `${g.color}22` : `${g.color}11`,
                    color: g.color,
                  }}
                >
                  {g.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-sm">{g.label}</p>
                    {active && <CheckCircle2 className="h-3.5 w-3.5 text-[#5B3BEB]" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{g.description}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Save error */}
        {saveError && (
          <p className="text-sm text-red-500 text-center mb-4">{saveError}</p>
        )}

        {/* Complete button */}
        <button
          id="onboarding-complete-btn"
          disabled={saving || !selectedGoal}
          onClick={handleComplete}
          className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-[#5B3BEB] text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#4A2DD4] active:bg-[#3A1EC4] transition-colors shadow-[0_4px_16px_rgba(91,59,235,0.35)] mb-4"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Setting up your profile…
            </>
          ) : (
            <>
              Enter STRIV
              <Flame className="h-4 w-4" />
            </>
          )}
        </button>

        {/* Back */}
        <button
          onClick={() => setStep(1)}
          disabled={saving}
          className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2 disabled:opacity-40"
        >
          ← Back
        </button>
      </div>
    </div>
  )
}
