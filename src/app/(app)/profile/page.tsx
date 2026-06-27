'use client'

import { useState } from 'react'
import { GitBranch, Link2, Globe, Flame, TrendingUp, CheckCircle, ExternalLink } from 'lucide-react'
import { Avatar, Badge } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { cn, HEATMAP_COLORS, formatNumber } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

// Generate 26 weeks of heatmap data
function generateHeatmap() {
  const data = []
  const today = new Date()
  for (let w = 25; w >= 0; w--) {
    const week = []
    for (let d = 6; d >= 0; d--) {
      const date = new Date(today)
      date.setDate(date.getDate() - (w * 7 + d))
      const rand = Math.random()
      const count = rand > 0.45 ? Math.floor(rand * 5) : 0
      week.push({ date: date.toISOString().split('T')[0], count })
    }
    data.push(week)
  }
  return data
}

const heatmapData = generateHeatmap()

const ACTIVE_CHALLENGES = [
  { title: '365 DAYS LEETCODE', day: 124, total: 365, consistency: 97, icon: '⌨️', trend: 'up' },
  { title: '90 DAYS RUNNING', day: 42, total: 90, consistency: 94, icon: '🏃', trend: 'up' },
]

const ACHIEVEMENTS = [
  { icon: '🧘', title: '21 Days Meditation', status: 'COMPLETED', date: 'Completed 12 May 2024' },
  { icon: '⌨️', title: '60 Days DSA Challenge', status: 'COMPLETED', date: 'Completed 28 Apr 2024' },
  { icon: '📚', title: '30 Days Reading', status: 'COMPLETED', date: 'Completed 15 Mar 2024' },
]

type ProfileTab = 'FEED' | 'EXPLORE' | 'QUESTS' | 'PROFILE'

export default function ProfilePage() {
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState<ProfileTab>('PROFILE')
  const currentStreak = 124

  const heatLevel = (count: number): 0 | 1 | 2 | 3 | 4 => {
    if (count === 0) return 0
    if (count < 2) return 1
    if (count < 3) return 2
    if (count < 4) return 3
    return 4
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <Avatar
          src={profile?.avatar_url}
          name={profile?.full_name}
          size="xl"
          className="ring-2 ring-[#5B3BEB]/30"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="font-black text-xl">{profile?.full_name || 'Aarav Mehta'}</h1>
            <div className="h-5 w-5 rounded-full bg-[#5B3BEB] flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">@{profile?.combat_name || 'aarav.mehta'}</p>
          <p className="text-sm mt-1 text-foreground/80">
            Building discipline, one day at a time. Code. Learn. Grow. Repeat.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <a href="#" className="flex items-center gap-1 text-xs border border-border rounded-lg px-2 py-1 hover:bg-accent transition-colors">
              <GitBranch className="h-3.5 w-3.5" /> GITHUB
            </a>
            <a href="#" className="flex items-center gap-1 text-xs border border-border rounded-lg px-2 py-1 hover:bg-accent transition-colors">
              <Link2 className="h-3.5 w-3.5" /> LINKEDIN
            </a>
            <a href="#" className="flex items-center gap-1 text-xs border border-border rounded-lg px-2 py-1 hover:bg-accent transition-colors">
              <Globe className="h-3.5 w-3.5" /> PORTFOLIO
            </a>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6 p-4 rounded-2xl border border-border bg-card">
        {[
          { label: 'Followers', value: '2.4k' },
          { label: 'Following', value: '341' },
          { label: 'Challenges', value: '12' },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <div className="text-xl font-black">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>

      {/* Active Challenges */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold">Active Challenges</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Max 3 tracking slots</span>
            <button className="text-xs text-[#5B3BEB] font-semibold hover:underline">Manage</button>
          </div>
        </div>
        <div className="space-y-3">
          {ACTIVE_CHALLENGES.map((ch) => (
            <div key={ch.title} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-[#5B3BEB]/30 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-xl flex-shrink-0">
                {ch.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs uppercase tracking-wide">{ch.title}</p>
                <p className="text-xs text-muted-foreground">Day {ch.day} / {ch.total}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full striv-progress rounded-full"
                      style={{ width: `${(ch.day / ch.total) * 100}%` }}
                    />
                  </div>
                  <span className={cn(
                    'text-[10px] font-black',
                    ch.consistency >= 95 ? 'text-emerald-500' : ch.consistency >= 80 ? 'text-amber-500' : 'text-red-500'
                  )}>
                    {ch.consistency}% CONSISTENCY
                  </span>
                  <TrendingUp className={cn('h-3 w-3', ch.trend === 'up' ? 'text-emerald-500' : 'text-red-500')} />
                </div>
              </div>
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap */}
      <div className="mb-6 p-4 rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold">Consistency Heatmap</h2>
          <span className="text-xs bg-secondary px-2 py-1 rounded-full font-semibold">LeetCode 365</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">📅 Last 6 Months</p>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {heatmapData.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day, di) => (
                <div
                  key={di}
                  title={`${day.date}: ${day.count} activities`}
                  className={cn('heatmap-square rounded-sm transition-colors', HEATMAP_COLORS[heatLevel(day.count)])}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Less</span>
            {[0,1,2,3,4].map((l) => (
              <div key={l} className={cn('h-3 w-3 rounded-sm', HEATMAP_COLORS[l as 0|1|2|3|4])} />
            ))}
            <span>More</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Current Streak:</span>
            <span className="font-black text-sm">{currentStreak}</span>
            <Flame className="h-4 w-4 text-amber-500 streak-flame" />
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="font-bold mb-3">Achievements</h2>
        <div className="space-y-3">
          {ACHIEVEMENTS.map((ach) => (
            <div key={ach.title} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card">
              <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-2xl flex-shrink-0">
                {ach.icon}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">{ach.title}</p>
                <p className="text-xs text-muted-foreground">{ach.date}</p>
              </div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 px-2.5 py-1 rounded-full">
                {ach.status}
              </span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
