'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { X, Upload, Plus, Trash2, ChevronLeft, ChevronRight, Globe, Lock, Info, Camera, FileText, Activity, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Label } from '@/components/ui/primitives'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toaster'
import Link from 'next/link'

type Step = 1 | 2 | 3

interface Task {
  id: string
  task_name: string
  description: string
  proof_type: string
  is_mandatory: boolean
}

const PROOF_TYPES = [
  { id: 'Photo', label: 'Photo', icon: Camera },
  { id: 'Video', label: 'Video', icon: ImageIcon },
  { id: 'Activity Screenshot', label: 'Activity Sch', icon: Activity },
  { id: 'Text', label: 'Text', icon: FileText },
]

function StepIndicator({ current, total }: { current: Step; total: number }) {
  return (
    <div className="flex items-center gap-0">
      {Array.from({ length: total }, (_, i) => {
        const step = (i + 1) as Step
        const done = current > step
        const active = current === step
        return (
          <div key={i} className="flex items-center">
            <div
              className={cn(
                'h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all',
                done
                  ? 'bg-[#5B3BEB] border-[#5B3BEB] text-white'
                  : active
                  ? 'border-[#5B3BEB] text-[#5B3BEB] bg-background'
                  : 'border-border text-muted-foreground bg-background'
              )}
            >
              {done ? '✓' : step}
            </div>
            {i < total - 1 && (
              <div className={cn('h-0.5 w-10 transition-colors', done ? 'bg-[#5B3BEB]' : 'bg-border')} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function CreateQuestPage() {
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const { profile } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  // Step 1 fields
  const [orgName, setOrgName] = useState('')
  const [bannerUrl, setBannerUrl] = useState('')
  const [destinationUrl, setDestinationUrl] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reward, setReward] = useState('')
  const [proofRules, setProofRules] = useState('')
  const [visibility, setVisibility] = useState<'public' | 'private'>('public')

  // Step 2 fields
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', task_name: '', description: '', proof_type: 'Photo', is_mandatory: true },
  ])

  // Step 3 fields (review handled inline)

  const totalDays = startDate && endDate
    ? Math.max(0, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000))
    : 0

  function addTask() {
    setTasks(prev => [
      ...prev,
      { id: Date.now().toString(), task_name: '', description: '', proof_type: 'Photo', is_mandatory: true },
    ])
  }

  function updateTask(id: string, field: keyof Task, value: string | boolean) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  function removeTask(id: string) {
    if (tasks.length === 1) return
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  async function handleSubmit() {
    if (!profile) { toast('Please sign in first', 'error'); return }
    if (!orgName.trim()) { toast('Organization name required', 'error'); return }
    if (tasks.some(t => !t.task_name.trim())) { toast('All task names are required', 'error'); return }

    setLoading(true)
    try {
      const { data: quest, error: questErr } = await supabase
        .from('quests')
        .insert({
          org_name: orgName,
          banner_url: bannerUrl || null,
          destination_url: destinationUrl || null,
          thumbnail_url: thumbnail || null,
          start_date: startDate || null,
          end_date: endDate || null,
          duration_days: totalDays || 21,
          reward: reward || null,
          is_public: visibility === 'public',
          created_by: profile.id,
        })
        .select()
        .single()

      if (questErr) throw questErr

      // Insert tasks
      const taskRows = tasks
        .filter(t => t.task_name.trim())
        .map((t, i) => ({
          quest_id: quest.id,
          task_name: t.task_name,
          description: t.description || null,
          proof_type: t.proof_type,
          is_mandatory: t.is_mandatory,
          order_index: i,
        }))

      if (taskRows.length > 0) {
        const { error: taskErr } = await supabase.from('quest_tasks').insert(taskRows)
        if (taskErr) throw taskErr
      }

      toast('Quest created successfully! 🎯', 'success')
      router.push('/quests')
    } catch (e: any) {
      toast(e.message || 'Failed to create quest', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/quests" className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-accent transition-colors">
            <X className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-black">Create Challenge</h1>
        </div>
        <button
          onClick={() => toast('Draft saved', 'success')}
          className="text-sm font-semibold text-[#5B3BEB] hover:underline"
        >
          Save Draft
        </button>
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-between mb-8">
        <StepIndicator current={step} total={3} />
        <div className="text-xs text-muted-foreground font-medium">
          {step === 1 ? 'Basic Info' : step === 2 ? 'Add Tasks' : 'Rewards'}
        </div>
      </div>

      {/* STEP 1: Basic Info */}
      {step === 1 && (
        <div className="space-y-6">
          {/* 1. Organization Details */}
          <section>
            <h2 className="text-base font-black mb-4 flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-[#5B3BEB] text-white text-xs flex items-center justify-center font-black">1</span>
              Organization Details
            </h2>

            <div className="space-y-4">
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Organization / Brand Name</Label>
                <Input
                  placeholder="Enter your organization or brand name"
                  value={orgName}
                  onChange={e => setOrgName(e.target.value)}
                />
              </div>

              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Ad / Banner Image</Label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-[#5B3BEB]/50 hover:bg-[#5B3BEB]/5 transition-colors cursor-pointer">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Upload banner or promotional image</span>
                  <span className="text-xs text-muted-foreground">Recommended: 1200 x 628px (Max 5MB)</span>
                </div>
              </div>

              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Destination Link</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                    </svg>
                  </div>
                  <Input
                    className="pl-9"
                    placeholder="https://your-website.com or an..."
                    value={destinationUrl}
                    onChange={e => setDestinationUrl(e.target.value)}
                    type="url"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">When users click on your banner, they will be redirected to this link.</p>
              </div>
            </div>
          </section>

          {/* 2. Quest Thumbnail & Duration */}
          <section>
            <h2 className="text-base font-black mb-4 flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-[#5B3BEB] text-white text-xs flex items-center justify-center font-black">2</span>
              Quest Thumbnail & Duration
            </h2>

            <div className="space-y-4">
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Quest Thumbnail</Label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center gap-2 hover:border-[#5B3BEB]/50 hover:bg-[#5B3BEB]/5 transition-colors cursor-pointer">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Upload thumbnail</span>
                  <span className="text-xs text-muted-foreground">600 x 400px (Max 2MB)</span>
                </div>
              </div>

              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Quest Duration</Label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <input
                      type="date"
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      placeholder="Start Date"
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#5B3BEB]/50"
                    />
                  </div>
                  <div>
                    <input
                      type="date"
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      placeholder="End Date"
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#5B3BEB]/50"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary rounded-xl">
                  <span className="text-sm text-muted-foreground">Total Duration</span>
                  <span className="text-2xl font-black">{totalDays} Days</span>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Rewards */}
          <section>
            <h2 className="text-base font-black mb-4 flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-[#5B3BEB] text-white text-xs flex items-center justify-center font-black">3</span>
              Rewards
            </h2>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Rewards / Prizes</Label>
              <Textarea
                placeholder="Describe the rewards or prizes for participants. Example: Top 3 participants will get a 1-month free subscription to our gym."
                className="min-h-24"
                value={reward}
                onChange={e => setReward(e.target.value)}
                maxLength={300}
              />
              <p className="text-xs text-muted-foreground text-right mt-1">{reward.length} / 300</p>
            </div>
          </section>

          {/* 4. Proof Rules */}
          <section>
            <h2 className="text-base font-black mb-4 flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-[#5B3BEB] text-white text-xs flex items-center justify-center font-black">4</span>
              Rules for Uploading Proof
            </h2>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Tell participants how they should upload their proof</Label>
              <Textarea
                placeholder="Example: Upload a screenshot, photo, or any tracking proof. Make sure it is clear and genuine. Fake proofs will lead to disqualification."
                className="min-h-24"
                value={proofRules}
                onChange={e => setProofRules(e.target.value)}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right mt-1">{proofRules.length} / 500</p>

              {/* Tips box */}
              <div className="mt-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Tips for good rules</span>
                </div>
                <ul className="space-y-1">
                  {[
                    'Be clear and specific about what proof is accepted',
                    'Mention file type and size if any',
                    'Highlight consequences for fake or invalid proofs',
                  ].map(tip => (
                    <li key={tip} className="flex items-start gap-2 text-xs text-blue-600 dark:text-blue-400">
                      <span className="mt-0.5">✓</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 5. Visibility */}
          <section>
            <h2 className="text-base font-black mb-4 flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-[#5B3BEB] text-white text-xs flex items-center justify-center font-black">5</span>
              Quest Visibility
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => setVisibility('public')}
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left',
                  visibility === 'public' ? 'border-[#5B3BEB] bg-[#5B3BEB]/5' : 'border-border hover:border-[#5B3BEB]/30'
                )}
              >
                <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center', visibility === 'public' ? 'bg-[#5B3BEB]/10' : 'bg-secondary')}>
                  <Globe className={cn('h-5 w-5', visibility === 'public' ? 'text-[#5B3BEB]' : 'text-muted-foreground')} />
                </div>
                <div>
                  <p className="font-bold text-sm">Public</p>
                  <p className="text-xs text-muted-foreground">Anyone can discover and join your quest instantly.</p>
                </div>
              </button>

              <button
                onClick={() => setVisibility('private')}
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left',
                  visibility === 'private' ? 'border-[#5B3BEB] bg-[#5B3BEB]/5' : 'border-border hover:border-[#5B3BEB]/30'
                )}
              >
                <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center', visibility === 'private' ? 'bg-[#5B3BEB]/10' : 'bg-secondary')}>
                  <Lock className={cn('h-5 w-5', visibility === 'private' ? 'text-[#5B3BEB]' : 'text-muted-foreground')} />
                </div>
                <div>
                  <p className="font-bold text-sm">Private</p>
                  <p className="text-xs text-muted-foreground">People need to send a request. You decide who to accept.</p>
                </div>
              </button>
            </div>
          </section>

          {/* Footer */}
          <div className="flex gap-3 pt-2 pb-4">
            <Button variant="outline" className="flex-1" onClick={() => router.back()}>
              Save as Draft
            </Button>
            <Button className="flex-1" onClick={() => setStep(2)}>
              Next: Add Tasks →
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Add Tasks */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Plan info */}
          <div className="p-4 rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-muted-foreground">YOUR PLAN</span>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950 rounded-full px-2 py-0.5">ACTIVE</span>
            </div>
            <p className="font-black text-lg">₹99 <span className="text-sm font-normal text-muted-foreground">/month</span></p>
            <div className="mt-2 space-y-0.5">
              {['Upto 2,500 Active Users', 'Unlimited Quests', 'Basic Analytics'].map(f => (
                <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="text-[#5B3BEB]">✓</span> {f}
                </div>
              ))}
            </div>
            <button className="text-xs text-[#5B3BEB] font-semibold mt-2 hover:underline">View Plan Details</button>
          </div>

          {/* Quest preview */}
          <div className="p-4 rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quest Preview</span>
              <button className="text-muted-foreground hover:text-foreground">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            </div>
            <div className="aspect-video rounded-xl bg-muted overflow-hidden mb-3">
              {thumbnail ? (
                <img src={thumbnail} alt="Quest" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-8 w-8" />
                </div>
              )}
            </div>
            <p className="font-bold">{orgName || 'Your Organization'}</p>
            <p className="text-xs text-muted-foreground">{totalDays || 21} Day Challenge</p>
            {reward && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-[#5B3BEB] font-semibold">🏆 {reward.slice(0, 50)}</span>
              </div>
            )}
          </div>

          {/* Need help */}
          <div className="p-4 rounded-xl bg-secondary border border-border">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">💡</span>
              <span className="text-sm font-semibold">Need help?</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">Learn how to create effective tasks that keep participants engaged.</p>
            <button className="text-xs text-[#5B3BEB] font-semibold hover:underline">View Guide</button>
          </div>

          {/* Add Tasks section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-black">2. Add Tasks</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Break your quest into simple, actionable tasks.</p>
              </div>
              <Button size="sm" onClick={addTask} className="gap-1.5">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </div>

            <div className="space-y-4">
              {tasks.map((task, idx) => (
                <div key={task.id} className="p-4 rounded-2xl border border-border bg-card space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {idx === 0 ? '🏃' : idx === 1 ? '💪' : idx === 2 ? '📸' : '⚡'}
                      </span>
                      <span className="text-sm font-bold text-muted-foreground">Task {idx + 1}</span>
                    </div>
                    {tasks.length > 1 && (
                      <button
                        onClick={() => removeTask(task.id)}
                        className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Task Name</Label>
                    <Input
                      placeholder={`e.g. ${idx === 0 ? 'Run 5 KM every day' : idx === 1 ? 'Do 60 Push-ups daily' : 'Upload a physique picture'}`}
                      value={task.task_name}
                      onChange={e => updateTask(task.id, 'task_name', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Description (optional)</Label>
                    <Textarea
                      placeholder={`Participants must ${idx === 0 ? 'run at least 5 kilometers daily.' : idx === 1 ? 'complete 60 push-ups in a day. You can do it in...' : 'upload your physique picture every day to track...'}`}
                      className="min-h-16 text-sm"
                      value={task.description}
                      onChange={e => updateTask(task.id, 'description', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Proof Type</Label>
                    <select
                      value={task.proof_type}
                      onChange={e => updateTask(task.id, 'proof_type', e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#5B3BEB]/50"
                    >
                      {PROOF_TYPES.map(pt => (
                        <option key={pt.id} value={pt.id}>{pt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Is this task mandatory?</Label>
                    <select
                      value={task.is_mandatory ? 'yes' : 'no'}
                      onChange={e => updateTask(task.id, 'is_mandatory', e.target.value === 'yes')}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#5B3BEB]/50"
                    >
                      <option value="yes">Yes, required</option>
                      <option value="no">No, optional</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addTask}
              className="w-full mt-4 py-3 rounded-2xl border-2 border-dashed border-border hover:border-[#5B3BEB]/50 hover:bg-[#5B3BEB]/5 transition-all flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground hover:text-[#5B3BEB]"
            >
              <Plus className="h-4 w-4" />
              Add Another Task
            </button>
          </section>

          {/* Tips */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🎯</span>
              <span className="text-sm font-bold text-amber-800 dark:text-amber-300">Tips for Great Tasks</span>
            </div>
            <ul className="space-y-1">
              {[
                'Keep tasks clear and simple',
                'Make sure tasks are measurable',
                'Ensure tasks align with your quest goal',
                'Avoid too many tasks (3-5 is ideal)',
              ].map(tip => (
                <li key={tip} className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400">
                  <span>✓</span> {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-2 pb-4">
            <Button variant="outline" onClick={() => setStep(1)} className="flex-1 gap-1.5">
              <ChevronLeft className="h-4 w-4" />
              Previous: Basic Info
            </Button>
            <Button className="flex-1 gap-1.5" onClick={() => setStep(3)}>
              Next: Rewards
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Review & Submit */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-black mb-1">Review Your Quest</h2>
            <p className="text-sm text-muted-foreground">Check everything before publishing.</p>
          </div>

          {/* Summary card */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="aspect-video bg-muted flex items-center justify-center">
              {thumbnail ? (
                <img src={thumbnail} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No thumbnail uploaded</p>
                </div>
              )}
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="font-black text-lg">{orgName || 'Quest Title'}</p>
                <p className="text-sm text-muted-foreground">{totalDays || 21} Day Challenge</p>
              </div>
              {reward && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl">
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">🏆 Reward: {reward}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tasks ({tasks.filter(t => t.task_name).length})</p>
                <div className="space-y-2">
                  {tasks.filter(t => t.task_name).map((task, i) => (
                    <div key={task.id} className="flex items-center gap-3 text-sm">
                      <span className="h-6 w-6 rounded-full bg-[#5B3BEB]/10 text-[#5B3BEB] text-xs font-bold flex items-center justify-center">{i + 1}</span>
                      <span className="flex-1">{task.task_name}</span>
                      <span className="text-xs text-muted-foreground">{task.proof_type}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <div className={cn('h-5 w-5 rounded-full flex items-center justify-center', visibility === 'public' ? 'bg-emerald-100 dark:bg-emerald-950' : 'bg-secondary')}>
                  {visibility === 'public' ? <Globe className="h-3 w-3 text-emerald-600" /> : <Lock className="h-3 w-3 text-muted-foreground" />}
                </div>
                <span className="text-xs text-muted-foreground capitalize">{visibility} quest</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-2 pb-4">
            <Button variant="outline" onClick={() => setStep(2)} className="gap-1.5">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              loading={loading}
            >
              🚀 Publish Quest
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
