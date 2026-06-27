'use client'

import { useState } from 'react'
import { BarChart2, TrendingUp, Users, Eye, MousePointer, Trophy, Share2, Download } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Button } from '@/components/ui/Button'
import { cn, formatNumber, HEATMAP_COLORS } from '@/lib/utils'

const ENGAGEMENT_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  views: 2000 + Math.random() * 3000 + i * 100,
  joins: 400 + Math.random() * 600 + i * 20,
}))

const TRAFFIC_DATA = [
  { name: 'Home Feed', value: 60, color: '#5B3BEB' },
  { name: 'Explore', value: 25, color: '#7B5CF0' },
  { name: 'Search', value: 15, color: '#A78BFA' },
]

const TASK_PERFORMANCE = [
  { name: 'Morning Hydration', pct: 92 },
  { name: '15min Mobility', pct: 78 },
  { name: 'No Screens < 1hr', pct: 45 },
]

const TOP_PERFORMERS = [
  { name: 'Alex Rivera', streak: 34, rank: 1 },
  { name: 'Sarah Chen', streak: 22, rank: 2 },
  { name: 'Jordan Blake', streak: 21, rank: 3 },
]

function generateHeatmap() {
  return Array.from({ length: 26 }, () =>
    Array.from({ length: 7 }, () => Math.random() > 0.35 ? Math.floor(Math.random() * 5) : 0)
  )
}

const heatmap = generateHeatmap()
const heatLevel = (c: number): 0|1|2|3|4 => c === 0 ? 0 : c < 2 ? 1 : c < 3 ? 2 : c < 4 ? 3 : 4

export default function StatsPage() {
  const [range, setRange] = useState<'7D' | '30D' | '90D'>('30D')

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black bg-[#5B3BEB] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">PREMIUM</span>
            <span className="text-xs font-black bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full uppercase tracking-wider">PUBLIC</span>
          </div>
          <h1 className="text-xl font-black tracking-tight">30-Day Peak Flow</h1>
        </div>
        <button className="flex items-center gap-1.5 text-sm text-muted-foreground border border-border rounded-xl px-3 py-2 hover:bg-accent transition-colors">
          <Share2 className="h-4 w-4" /> Share
        </button>
      </div>

      {/* Hero metrics */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: 'Total Views', value: '142.8k', icon: Eye, trend: '+12%', color: 'text-foreground' },
          { label: 'People Joined', value: '28.4k', icon: Users, trend: '+8%', color: 'text-foreground' },
          { label: 'Active Posters', value: '4.2k', icon: TrendingUp, trend: '+5%', color: 'text-emerald-500' },
          { label: 'Ad Clicks', value: '1.2k', icon: MousePointer, trend: 'CTR 0.8%', color: 'text-foreground', premium: true },
        ].map(({ label, value, icon: Icon, trend, color, premium }) => (
          <div key={label} className={cn('rounded-2xl border bg-card p-4', premium ? 'border-[#5B3BEB]/30 bg-[#5B3BEB]/5' : 'border-border')}>
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className={cn('text-2xl font-black', color)}>{value}</p>
            <div className="flex items-center gap-1 mt-1">
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{trend}</span>
              {premium && <span className="text-[9px] font-bold bg-[#5B3BEB] text-white px-1.5 py-0.5 rounded-full ml-1">PREMIUM</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Completion donut */}
      <div className="rounded-2xl border border-border bg-card p-5 mb-4 flex items-center gap-5">
        <div className="relative h-20 w-20 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--secondary))" strokeWidth="3" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#5B3BEB" strokeWidth="3"
              strokeDasharray={`${85 * 100 / 100} 100`} strokeLinecap="round" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-black">85%</span>
        </div>
        <div>
          <p className="font-bold">Completion</p>
          <p className="text-sm text-muted-foreground">Participants successfully finished all milestones.</p>
        </div>
      </div>

      {/* Quick insight */}
      <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4 mb-5 flex items-start gap-3">
        <span className="text-lg">💡</span>
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-0.5">Quick Insight</p>
          <p className="text-sm font-medium">Most users join between 7 PM and 10 PM.</p>
        </div>
      </div>

      {/* Engagement chart */}
      <div className="rounded-2xl border border-border bg-card p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">30-Day Engagement</h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1"><span className="h-2 w-4 bg-[#5B3BEB] rounded-full inline-block" />Views</span>
            <span className="flex items-center gap-1"><span className="h-2 w-4 bg-[#A78BFA] rounded-full inline-block" />Joins</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={ENGAGEMENT_DATA}>
            <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', fontSize: 12 }}
              formatter={(v: number) => formatNumber(v)}
            />
            <Line type="monotone" dataKey="views" stroke="#5B3BEB" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="joins" stroke="#A78BFA" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Traffic sources */}
      <div className="rounded-2xl border border-border bg-card p-5 mb-4">
        <h3 className="font-bold mb-4">Traffic Sources</h3>
        <div className="flex items-center gap-6">
          <PieChart width={100} height={100}>
            <Pie data={TRAFFIC_DATA} cx={50} cy={50} innerRadius={30} outerRadius={46} dataKey="value" strokeWidth={0}>
              {TRAFFIC_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
          </PieChart>
          <div className="space-y-3 flex-1">
            {TRAFFIC_DATA.map(({ name, value, color }) => (
              <div key={name} className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                <span className="text-sm flex-1">{name}</span>
                <span className="font-bold text-sm">{value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Participant funnel */}
      <div className="rounded-2xl border border-border bg-card p-5 mb-4">
        <h3 className="font-bold mb-4">Participant Funnel</h3>
        <div className="space-y-3">
          {[
            { label: 'Viewed (100%)', value: '142.8k', width: '100%', color: 'bg-[#5B3BEB]' },
            { label: 'Joined (20%)', value: '28.4k', width: '20%', color: 'bg-[#7B5CF0]' },
            { label: 'Completed (12%)', value: '17.1k', width: '12%', color: 'bg-[#A78BFA]' },
          ].map(({ label, value, width, color }) => (
            <div key={label}>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{label}</span><span>{value}</span>
              </div>
              <div className="h-7 bg-secondary rounded-lg overflow-hidden">
                <div className={cn('h-full rounded-lg flex items-center px-2', color)} style={{ width }}>
                  {parseFloat(width) > 15 && <span className="text-white text-xs font-bold">{label.split(' ')[0]}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task performance */}
      <div className="rounded-2xl border border-border bg-card p-5 mb-4">
        <h3 className="font-bold mb-4">Task Performance</h3>
        <div className="space-y-3">
          {TASK_PERFORMANCE.map(({ name, pct }) => (
            <div key={name}>
              <div className="flex justify-between text-sm mb-1">
                <span>{name}</span>
                <span className={cn('font-bold', pct >= 80 ? 'text-emerald-500' : pct >= 60 ? 'text-amber-500' : 'text-red-500')}>
                  {pct}%
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full', pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500')}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community consistency heatmap */}
      <div className="rounded-2xl border border-border bg-card p-5 mb-4">
        <h3 className="font-bold mb-3">Community Consistency</h3>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {heatmap.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((count, di) => (
                <div key={di} className={cn('h-3 w-3 rounded-sm', HEATMAP_COLORS[heatLevel(count)])} />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
          <span>Less</span>
          {[0,1,2,3,4].map((l) => <div key={l} className={cn('h-2.5 w-2.5 rounded-sm', HEATMAP_COLORS[l as 0|1|2|3|4])} />)}
          <span>More</span>
        </div>
      </div>

      {/* Top performers */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Top Performers</h3>
          <Trophy className="h-5 w-5 text-amber-500" />
        </div>
        <div className="space-y-3">
          {TOP_PERFORMERS.map(({ name, streak, rank }) => (
            <div key={name} className="flex items-center gap-3">
              <div className={cn(
                'h-7 w-7 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0',
                rank === 1 ? 'bg-amber-100 text-amber-600' : rank === 2 ? 'bg-slate-100 text-slate-600' : 'bg-orange-100 text-orange-600'
              )}>
                {rank}
              </div>
              <div className="h-9 w-9 rounded-full bg-[#5B3BEB] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{name}</p>
                <p className="text-xs text-muted-foreground">{streak}-DAY STREAK</p>
              </div>
              <div className="h-8 w-8 rounded-full border-2 border-[#5B3BEB]/20 flex items-center justify-center">
                <span className="text-xs">🏆</span>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full text-center text-xs text-[#5B3BEB] font-semibold mt-4 hover:underline">
          View Full Leaderboard
        </button>
      </div>
    </div>
  )
}
