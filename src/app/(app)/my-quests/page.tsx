'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, Menu, Plus, BarChart2, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn, formatNumber } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

const MOCK_QUESTS = [
  {
    id: '1',
    title: 'XYZ Fitness 21-Day Sprint',
    reward: '1-Month Free Subscription',
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80',
    is_live: true,
    views: 14200,
    participants: 892,
    completion_pct: 64,
    ad_clicks: 312,
  },
  {
    id: '2',
    title: 'Morning Ritual Challenge',
    reward: 'Premium Grind Kit',
    thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
    is_live: true,
    views: 8500,
    participants: 456,
    completion_pct: 78,
    ad_clicks: 184,
  },
]

const PARTNER_DATA = {
  title: 'The Obsidian Run Quest',
  quest_views: 14200,
  participants: 3892,
  claims: 1204,
  redemptions: 856,
  views_change: 12,
  participants_change: 8,
  claims_change: 24,
  redemptions_change: 15,
  funnel: [
    { label: 'Quest Views', pct: 100 },
    { label: 'Join Quest', pct: 27.4 },
    { label: 'Task 1 → Task 3', pct: 12.1 },
    { label: 'Reward Claimed', pct: 8.4 },
  ],
  avg_completion_time: '4.2d',
  drop_off_task2: '18.2%',
  impressions: 245000,
  ad_clicks: 8200,
}

export default function MyQuestsPage() {
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null)
  const [tab, setTab] = useState<'created' | 'analytics'>('created')

  const activeQuests = MOCK_QUESTS.filter(q => q.is_live).length
  const totalLeads = MOCK_QUESTS.reduce((sum, q) => sum + q.participants, 0)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between p-1 mb-6">
        <div className="flex items-center gap-2">
          <Menu className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-base font-black uppercase tracking-wider">My Quests</h1>
        </div>
        <Bell className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-5">
        {(['created', 'analytics'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-4 py-2.5 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px',
              tab === t ? 'border-[#5B3BEB] text-[#5B3BEB]' : 'border-transparent text-muted-foreground'
            )}
          >
            {t === 'created' ? 'Created Quests' : 'Analytics Overview'}
          </button>
        ))}
      </div>

      {tab === 'created' && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl border border-border bg-card">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Active Quests</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black">{String(activeQuests).padStart(2, '0')}</span>
                <span className="text-xs text-emerald-500 font-bold mb-1">+2</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl border border-border bg-card">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Leads</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black">{formatNumber(totalLeads)}</span>
                <span className="text-xs text-emerald-500 font-bold mb-1">+12%</span>
              </div>
            </div>
          </div>

          {/* Quest cards */}
          {MOCK_QUESTS.map(q => (
            <div key={q.id} className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="relative aspect-video">
                <img src={q.thumbnail} alt={q.title} className="w-full h-full object-cover" />
                {q.is_live && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold rounded-full px-2.5 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    LIVE
                  </div>
                )}
                <button className="absolute top-3 right-3 h-7 w-7 flex items-center justify-center bg-black/50 rounded-full text-white">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="p-4">
                <p className="font-bold mb-0.5">{q.title}</p>
                <p className="text-xs text-[#5B3BEB] font-bold mb-3">REWARD: {q.reward.toUpperCase()}</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    ['VIEWS', formatNumber(q.views)],
                    ['PARTICIPANTS', String(q.participants)],
                    ['COMPLETION %', `${q.completion_pct}%`],
                    ['AD CLICKS', String(q.ad_clicks)],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="font-bold">{val}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedQuestId(q.id)}
                  className="w-full py-2.5 rounded-xl border-2 border-[#5B3BEB] text-[#5B3BEB] text-sm font-bold hover:bg-[#5B3BEB] hover:text-white transition-all"
                >
                  VIEW ANALYTICS
                </button>
              </div>
            </div>
          ))}

          <Link href="/create-quest" className="block">
            <button className="w-full py-3.5 rounded-2xl border-2 border-dashed border-border hover:border-[#5B3BEB]/50 hover:bg-[#5B3BEB]/5 transition-all flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground hover:text-[#5B3BEB]">
              <Plus className="h-4 w-4" />
              Create New Quest
            </button>
          </Link>
        </div>
      )}

      {tab === 'analytics' && (
        <div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: 'Total Views', value: formatNumber(22700) },
              { label: 'Total Participants', value: formatNumber(totalLeads) },
              { label: 'Total Leads', value: formatNumber(totalLeads) },
              { label: 'Avg. Completion', value: '71%' },
            ].map(({ label, value }) => (
              <div key={label} className="p-4 rounded-2xl border border-border bg-card">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-black mt-1">{value}</p>
              </div>
            ))}
          </div>
          <div className="text-center py-8 text-muted-foreground">
            <BarChart2 className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Detailed analytics coming soon</p>
          </div>
        </div>
      )}

      {/* Partner Dashboard Modal */}
      {selectedQuestId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end lg:items-center justify-center">
          <div className="w-full max-w-lg bg-card rounded-t-3xl lg:rounded-3xl border border-border overflow-y-auto max-h-[92vh]">
            <PartnerDashboard onClose={() => setSelectedQuestId(null)} />
          </div>
        </div>
      )}
    </div>
  )
}

function PartnerDashboard({ onClose }: { onClose: () => void }) {
  const d = PARTNER_DATA

  return (
    <div>
      <div className="relative">
        <div className="aspect-video relative overflow-hidden bg-gray-900">
          <img
            src="https://images.unsplash.com/photo-1552422535-c45813c61732?w=600&q=80"
            alt="Quest"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-5">
            <span className="inline-block text-xs font-bold bg-[#5B3BEB] text-white rounded-full px-2.5 py-0.5 mb-2 w-fit">
              PARTNER DASHBOARD
            </span>
            <h2 className="text-xl font-black text-white">{d.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Core Performance */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Core Performance</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Quest Views', value: formatNumber(d.quest_views), change: `+${d.views_change}%` },
              { label: 'Participants', value: formatNumber(d.participants), change: `+${d.participants_change}%` },
              { label: 'Claims', value: formatNumber(d.claims), change: `+${d.claims_change}%` },
              { label: 'Redemptions', value: formatNumber(d.redemptions), change: `+${d.redemptions_change}%` },
            ].map(({ label, value, change }) => (
              <div key={label} className="p-3 rounded-xl border border-border bg-background">
                <p className="text-xs text-muted-foreground">{label}</p>
                <div className="flex items-end justify-between mt-1">
                  <span className="text-xl font-black">{value}</span>
                  <span className="text-xs text-emerald-500 font-bold">{change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Conversion Funnel</p>
          <div className="space-y-3">
            {d.funnel.map(({ label, pct }) => (
              <div key={label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span>{label}</span>
                  <span className="font-bold">{pct}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#5B3BEB] rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl border border-border bg-background">
            <p className="text-xs text-muted-foreground">Avg Completion Time</p>
            <p className="text-2xl font-black text-[#5B3BEB] mt-1">{d.avg_completion_time}</p>
            <p className="text-xs text-emerald-500">-0.5d vs baseline</p>
          </div>
          <div className="p-3 rounded-xl border border-border bg-background">
            <p className="text-xs text-muted-foreground">Drop-Off Task 2</p>
            <p className="text-2xl font-black text-red-500 mt-1">{d.drop_off_task2}</p>
            <p className="text-xs text-red-400">+2% risk increase</p>
          </div>
        </div>

        {/* Ad Performance */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ad Performance</p>
            <button className="text-xs text-[#5B3BEB] font-semibold">Export CSV</button>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="p-3 rounded-xl border border-border bg-background">
              <p className="text-xs text-muted-foreground">Impressions</p>
              <p className="text-xl font-black mt-1">{formatNumber(d.impressions)}</p>
            </div>
            <div className="p-3 rounded-xl border border-border bg-background">
              <p className="text-xs text-muted-foreground">Clicks</p>
              <p className="text-xl font-black mt-1">{formatNumber(d.ad_clicks)}</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-secondary h-24 flex items-center justify-center mb-3">
            <span className="text-xs text-muted-foreground">📊 Live Heatmap Indicator</span>
          </div>
          <div className="p-3 rounded-xl border border-border bg-background flex items-center gap-3">
            <div className="h-10 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
              <img
                src="https://images.unsplash.com/photo-1552422535-c45813c61732?w=80&q=60"
                alt="Banner"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Top Performing Banner</p>
              <p className="text-sm font-bold">Velo-Elite Speed Series</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-[#5B3BEB]">3.4%</p>
              <p className="text-xs text-muted-foreground">CTR</p>
            </div>
          </div>
        </div>

        <div className="pb-2">
          <Button variant="outline" className="w-full" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}
