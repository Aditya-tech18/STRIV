'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ClipboardList, Users, Zap, Trophy, CheckCircle, ChevronRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/primitives'
import { cn, formatNumber } from '@/lib/utils'

const MOCK_QUESTS = [
  {
    id: '1',
    title: 'XYZ Fitness 21-Day Sprint',
    org: 'XYZ Fitness Gym',
    reward: '1-Month Free Subscription',
    duration: 21,
    participants: 892,
    views: 14200,
    completion_pct: 64,
    ad_clicks: 312,
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80',
    is_live: true,
    tasks: [
      { name: 'Run 5 KM every day', icon: '🏃', proof: 'Activity Screenshot' },
      { name: 'Do 60 Push-ups daily', icon: '💪', proof: 'Photo / Video' },
      { name: 'Upload a physique picture', icon: '📸', proof: 'Photo' },
    ],
  },
  {
    id: '2',
    title: 'Morning Ritual Challenge',
    org: 'Premium Grind Kit',
    reward: 'Premium Grind Kit',
    duration: 30,
    participants: 456,
    views: 8500,
    completion_pct: 78,
    ad_clicks: 184,
    thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
    is_live: true,
    tasks: [
      { name: 'Wake up before 6AM', icon: '⏰', proof: 'Screenshot' },
      { name: 'Journal 3 pages', icon: '📓', proof: 'Photo' },
      { name: 'Cold shower 2 minutes', icon: '🚿', proof: 'Video' },
    ],
  },
]

const HOW_IT_WORKS = [
  { step: '1', title: 'Create Quest', desc: 'Define goals, rules, and rewards.', icon: ClipboardList },
  { step: '2', title: 'Invite & Join', desc: 'Share with your professional circle.', icon: Users },
  { step: '3', title: 'Complete Tasks', desc: 'Daily check-ins with proof.', icon: CheckCircle },
  { step: '4', title: 'Win Rewards', desc: 'Earn recognition and capital.', icon: Trophy },
]

type QuestTab = 'explore' | 'my_quests'

export default function QuestsPage() {
  const [tab, setTab] = useState<QuestTab>('explore')

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1 p-1 bg-secondary rounded-xl">
          {[['explore', 'Explore Quests'], ['my_quests', 'My Quests']] .map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id as QuestTab)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
                tab === id ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <Link href="/create/quest">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" /> New Quest
          </Button>
        </Link>
      </div>

      {tab === 'explore' && <ExploreQuests />}
      {tab === 'my_quests' && <MyQuests />}
    </div>
  )
}

function ExploreQuests() {
  return (
    <div>
      {/* How it works */}
      <div className="rounded-2xl border border-border bg-card p-5 mb-6">
        <h2 className="font-black text-lg mb-1">How Quests Work</h2>
        <p className="text-sm text-muted-foreground mb-5">Complete tasks, stay consistent, and earn high-performance rewards.</p>
        <div className="grid grid-cols-2 gap-4">
          {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon }) => (
            <div key={step} className="flex gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#5B3BEB]/10 flex items-center justify-center flex-shrink-0">
                <Icon className="h-5 w-5 text-[#5B3BEB]" />
              </div>
              <div>
                <p className="font-bold text-sm">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Example Quest */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold">Live Quests</h2>
          <span className="text-xs text-muted-foreground">{MOCK_QUESTS.length} active</span>
        </div>
        <div className="space-y-4">
          {MOCK_QUESTS.map((q) => (
            <Link key={q.id} href={`/quests/${q.id}`}>
              <div className="rounded-2xl border border-border bg-card overflow-hidden hover:border-[#5B3BEB]/30 hover:shadow-lg transition-all feed-card">
                <div className="relative h-36 overflow-hidden">
                  <img src={q.thumbnail} alt={q.title} className="w-full h-full object-cover" />
                  {q.is_live && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />LIVE
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-[#5B3BEB] font-semibold mb-0.5">{q.org}</p>
                  <h3 className="font-black text-base mb-1">{q.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    REWARD: <span className="text-amber-600 dark:text-amber-400 font-semibold uppercase">{q.reward}</span>
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-3 text-center">
                    {[
                      { label: 'VIEWS', val: formatNumber(q.views) },
                      { label: 'PARTICIPANTS', val: q.participants },
                      { label: 'COMPLETION %', val: `${q.completion_pct}%` },
                      { label: 'AD CLICKS', val: q.ad_clicks },
                    ].map(({ label, val }) => (
                      <div key={label} className="rounded-xl bg-secondary p-2">
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="font-black text-sm">{val}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    {q.tasks.map((t) => (
                      <div key={t.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{t.icon}</span>
                        <span className="flex-1">{t.name}</span>
                        <span className="text-[#5B3BEB] font-medium">{t.proof}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Why businesses */}
      <div className="rounded-2xl border border-border bg-card p-5 mb-6">
        <h3 className="font-bold mb-4">Why Businesses Use Quests</h3>
        <div className="space-y-4">
          {[
            { icon: '🤝', title: 'Engage community', desc: 'Build deeper connections with your most active users.' },
            { icon: '📈', title: 'Increase visibility', desc: 'Boost brand presence through structured social proof.' },
            { icon: '🔄', title: 'Encourage habits', desc: 'Drive retention by making your service a core daily habit.' },
            { icon: '🏆', title: 'Reward loyalty', desc: 'Automatically identify and reward your top performers.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex gap-3">
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="rounded-2xl bg-[#5B3BEB] text-white p-5 mb-4">
        <div className="inline-flex items-center gap-1 text-[10px] font-black bg-white/20 rounded-full px-2 py-0.5 mb-3 uppercase tracking-wider">
          Current Plan
        </div>
        <h3 className="text-xl font-black mb-0.5">Starter Plan</h3>
        <div className="text-3xl font-black mb-4">₹99<span className="text-base font-normal text-purple-200">/month</span></div>
        <ul className="space-y-2 mb-5">
          {['Upto 2,000 Active Users', 'Unlimited Quests', 'Basic Analytics Dashboard', 'Community Support'].map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-purple-100">
              <CheckCircle className="h-4 w-4 text-white flex-shrink-0" /> {f}
            </li>
          ))}
        </ul>
        <Button className="w-full bg-white text-[#5B3BEB] hover:bg-purple-50">
          Get Started with Starter Plan
        </Button>
      </div>
    </div>
  )
}

function MyQuests() {
  const [activeQuests] = useState(MOCK_QUESTS)

  return (
    <div>
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <p className="text-3xl font-black text-[#5B3BEB]">04</p>
          <p className="text-xs text-muted-foreground mt-1">Active Quests</p>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 rounded-full px-2 py-0.5">+2</span>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <p className="text-3xl font-black text-[#5B3BEB]">1.2k</p>
          <p className="text-xs text-muted-foreground mt-1">Total Leads</p>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 rounded-full px-2 py-0.5">+12%</span>
        </div>
      </div>

      {/* Quest cards */}
      <div className="space-y-4">
        {activeQuests.map((q) => (
          <div key={q.id} className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="relative h-32 overflow-hidden">
              <img src={q.thumbnail} alt={q.title} className="w-full h-full object-cover" />
              {q.is_live && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  LIVE
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold mb-0.5">{q.title}</h3>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mb-3">
                REWARD: {q.reward}
              </p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[['VIEWS', formatNumber(q.views)], ['PARTICIPANTS', q.participants], ['COMPLETION %', `${q.completion_pct}%`], ['AD CLICKS', q.ad_clicks]].map(([l, v]) => (
                  <div key={l} className="text-center bg-secondary rounded-xl p-2">
                    <p className="text-[10px] text-muted-foreground">{l}</p>
                    <p className="font-black text-sm">{v}</p>
                  </div>
                ))}
              </div>
              <Link href={`/quests/${q.id}/analytics`}>
                <Button variant="outline" size="sm" className="w-full">View Analytics</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <Link href="/create/quest">
          <button className="text-sm text-[#5B3BEB] font-semibold flex items-center gap-1 mx-auto hover:underline">
            <Plus className="h-4 w-4" /> Create New Quest
          </button>
        </Link>
      </div>
    </div>
  )
}
