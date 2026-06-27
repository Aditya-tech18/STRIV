'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImagePlus, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Label, Select } from '@/components/ui/primitives'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toaster'

const PROOF_TYPES = [
  { id: 'github', label: 'GitHub Commits', icon: '⌨️' },
  { id: 'workout', label: 'Morning Workout Photo', icon: '🏋️' },
  { id: 'screenshot', label: 'Screenshot', icon: '📸' },
  { id: 'video', label: 'Video Update', icon: '🎥' },
  { id: 'text', label: 'Text Update', icon: '📝' },
]

const DURATIONS = ['7 Days', '14 Days', '21 Days', '30 Days', '60 Days', '75 Days', '90 Days', '100 Days', '180 Days', '365 Days']

type Tab = 'Basic' | 'Personal Branding' | 'Business'

export default function CreateChallengePage() {
  const [tab, setTab] = useState<Tab>('Basic')
  const [title, setTitle] = useState('')
  const [orgName, setOrgName] = useState('')
  const [duration, setDuration] = useState('30 Days')
  const [privacy, setPrivacy] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC')
  const [rules, setRules] = useState('')
  const [selectedProofs, setSelectedProofs] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { profile } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  function toggleProof(id: string) {
    setSelectedProofs((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id])
  }

  async function handleCreate() {
    if (!title.trim()) { toast('Please enter a challenge title', 'error'); return }
    if (!profile) { toast('Please sign in first', 'error'); return }
    setLoading(true)
    try {
      const durationDays = parseInt(duration)
      const { data, error } = await supabase
        .from('challenges')
        .insert({
          title,
          organization_name: orgName || null,
          duration_days: durationDays,
          is_private: privacy === 'PRIVATE',
          rules_description: rules,
          proof_types: selectedProofs,
          created_by: profile.id,
        })
        .select()
        .single()

      if (error) throw error
      toast('Challenge created!', 'success')
      router.push(`/challenges/${data.id}`)
    } catch (e: any) {
      toast(e.message || 'Failed to create challenge', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-black tracking-tight">StreakX Creator</h1>
        <button className="text-muted-foreground hover:text-foreground">⚙️</button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-6">
        {(['Basic', 'Personal Branding', 'Business'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px',
              tab === t
                ? 'border-[#5B3BEB] text-[#5B3BEB]'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Basic' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-black mb-1">Challenge Setup</h2>
            <p className="text-sm text-muted-foreground">Design a system that tracks progress with clarity and discipline.</p>
          </div>

          {/* Image upload */}
          <div>
            <Label>Challenge Image</Label>
            <div className="aspect-[16/9] rounded-2xl border-2 border-dashed border-border bg-muted flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#5B3BEB]/50 hover:bg-[#5B3BEB]/5 transition-colors">
              <ImagePlus className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Tap to change image</span>
            </div>
          </div>

          <div>
            <Label>Challenge Title</Label>
            <Input
              placeholder="e.g. 75 Day Hard Dev"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Label>Organization Name</Label>
            <Input
              placeholder="e.g. BuildSpace Collective"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Duration (Days)</Label>
              <div className="relative">
                <Select value={duration} onChange={(e) => setDuration(e.target.value)}>
                  {DURATIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div>
              <Label>Privacy</Label>
              <div className="flex rounded-xl border border-border overflow-hidden h-10">
                {(['PUBLIC', 'PRIVATE'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPrivacy(p)}
                    className={cn(
                      'flex-1 text-xs font-bold transition-colors',
                      privacy === p ? 'bg-[#5B3BEB] text-white' : 'bg-background text-muted-foreground hover:bg-accent'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Label>Rules & Description</Label>
            <Textarea
              placeholder="Outline the expectations and daily commitments..."
              className="min-h-28"
              value={rules}
              onChange={(e) => setRules(e.target.value)}
            />
          </div>

          {/* Proof types */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="mb-0">Default Real Proof</Label>
              <div className="h-5 w-5 rounded-full bg-[#5B3BEB] flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Participants must submit one of the following to count the day:
            </p>
            <div className="space-y-2">
              {PROOF_TYPES.map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => toggleProof(id)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-left',
                    selectedProofs.includes(id)
                      ? 'border-[#5B3BEB] bg-[#5B3BEB]/5'
                      : 'border-border bg-background hover:border-[#5B3BEB]/30'
                  )}
                >
                  <span className="text-lg">{icon}</span>
                  <span className="text-sm font-medium flex-1">{label}</span>
                  <div className={cn(
                    'h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors',
                    selectedProofs.includes(id) ? 'bg-[#5B3BEB] border-[#5B3BEB]' : 'border-border'
                  )}>
                    {selectedProofs.includes(id) && <span className="text-white text-xs">✓</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleCreate} loading={loading} size="lg" className="w-full">
            Create Challenge 🚀
          </Button>
        </div>
      )}

      {tab === 'Business' && <BusinessChallengeTab />}
      {tab === 'Personal Branding' && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-4xl mb-4">🎨</p>
          <p className="font-semibold">Personal Branding</p>
          <p className="text-sm mt-1">Customize how your challenge appears to the community.</p>
        </div>
      )}
    </div>
  )
}

function BusinessChallengeTab() {
  const [tier, setTier] = useState<'starter' | 'growth' | 'enterprise'>('starter')

  const tiers = [
    {
      id: 'starter' as const,
      name: 'STARTER',
      price: '₹99',
      reach: '20,000 users reach',
      features: ['Featured Challenge badge', 'Business Profile'],
    },
    {
      id: 'growth' as const,
      name: 'GROWTH',
      price: '₹299',
      reach: '50,000 users reach',
      features: ['Homepage Banner Placement', 'Advanced Business Dashboard'],
    },
    {
      id: 'enterprise' as const,
      name: 'ENTERPRISE',
      price: 'Contact Sales',
      reach: 'Unlimited National Campaign',
      features: ['API & Webhook Access', 'Dedicated Account Manager'],
    },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-black mb-1">Business Challenge Marketing</h2>
        <p className="text-sm text-muted-foreground">Convert advertisements into active communities.</p>
      </div>

      <div><Label>Business Name</Label><Input placeholder="e.g. Acme Corp" /></div>
      <div><Label>Challenge Title</Label><Input placeholder="e.g. 30 Day Productivity Sprint" /></div>
      <div><Label>Website URL</Label><Input placeholder="https://acme.com" type="url" /></div>

      <div>
        <Label>Select Promotion Tier</Label>
        <div className="space-y-3">
          {tiers.map((t) => (
            <button
              key={t.id}
              onClick={() => setTier(t.id)}
              className={cn(
                'w-full p-4 rounded-2xl border-2 text-left transition-all',
                tier === t.id ? 'border-[#5B3BEB] bg-[#5B3BEB]/5' : 'border-border hover:border-[#5B3BEB]/30'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-black text-sm">{t.name}</span>
                <span className="font-black text-[#5B3BEB]">{t.price}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{t.reach}</p>
              <ul className="space-y-0.5">
                {t.features.map((f) => (
                  <li key={f} className="text-xs flex items-center gap-1.5 text-muted-foreground">
                    <span className="text-emerald-500">✓</span>{f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </div>

      <Button size="lg" className="w-full">Continue →</Button>
    </div>
  )
}
