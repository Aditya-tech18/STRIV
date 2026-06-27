'use client'

import { useState } from 'react'
import { Bell, Heart, MessageCircle, UserPlus, Zap, Trophy, AtSign, Megaphone, CheckCheck } from 'lucide-react'
import { Avatar } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { cn, formatRelativeTime } from '@/lib/utils'

const ICON_MAP: Record<string, any> = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  challenge_joined: Zap,
  quest_joined: Zap,
  reward_claimed: Trophy,
  mention: AtSign,
  announcement: Megaphone,
}

const COLOR_MAP: Record<string, string> = {
  like: 'bg-red-100 text-red-500 dark:bg-red-950',
  comment: 'bg-blue-100 text-blue-500 dark:bg-blue-950',
  follow: 'bg-[#5B3BEB]/10 text-[#5B3BEB]',
  challenge_joined: 'bg-amber-100 text-amber-500 dark:bg-amber-950',
  quest_joined: 'bg-emerald-100 text-emerald-500 dark:bg-emerald-950',
  reward_claimed: 'bg-amber-100 text-amber-500 dark:bg-amber-950',
  mention: 'bg-purple-100 text-purple-500 dark:bg-purple-950',
  announcement: 'bg-slate-100 text-slate-500 dark:bg-slate-800',
}

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'like',
    message: 'Marcus Chen liked your Day 87 proof post',
    from_user: { full_name: 'Marcus Chen', avatar_url: null },
    is_read: false,
    created_at: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: '2',
    type: 'follow',
    message: 'Elena Rodriguez started following you',
    from_user: { full_name: 'Elena Rodriguez', avatar_url: null },
    is_read: false,
    created_at: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: '3',
    type: 'comment',
    message: 'Dr. Julian Vance commented: "Incredible consistency! Keep going 🔥"',
    from_user: { full_name: 'Dr. Julian Vance', avatar_url: null },
    is_read: false,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: '4',
    type: 'challenge_joined',
    message: '12 new members joined your "90 Days Running" challenge',
    from_user: null,
    is_read: true,
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: '5',
    type: 'reward_claimed',
    message: 'You claimed the reward for "XYZ Fitness Quest". Check your email!',
    from_user: null,
    is_read: true,
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: '6',
    type: 'mention',
    message: 'Arjun Sharma mentioned you in a post: "@aarav.mehta this is insane progress!"',
    from_user: { full_name: 'Arjun Sharma', avatar_url: null },
    is_read: true,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: '7',
    type: 'announcement',
    message: '🎉 STRIV hit 50,000 active streaks this week! You\'re part of history.',
    from_user: null,
    is_read: true,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
]

export default function AlertsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const unreadCount = notifications.filter((n) => !n.is_read).length

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
  }

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n))
  }

  const filtered = filter === 'unread'
    ? notifications.filter((n) => !n.is_read)
    : notifications

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Alerts</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground">{unreadCount} unread notifications</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs text-[#5B3BEB] font-semibold hover:underline"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-secondary rounded-xl mb-5 w-fit">
        {[['all', 'All'], ['unread', `Unread ${unreadCount > 0 ? `(${unreadCount})` : ''}`]].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setFilter(id as 'all' | 'unread')}
            className={cn(
              'px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors',
              filter === id ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold">No notifications</p>
            <p className="text-sm text-muted-foreground">You're all caught up!</p>
          </div>
        )}

        {filtered.map((n) => {
          const Icon = ICON_MAP[n.type] || Bell
          const colorClass = COLOR_MAP[n.type] || 'bg-secondary text-muted-foreground'

          return (
            <button
              key={n.id}
              onClick={() => markRead(n.id)}
              className={cn(
                'w-full flex items-start gap-3 p-4 rounded-2xl border transition-all text-left',
                n.is_read
                  ? 'border-border bg-card'
                  : 'border-[#5B3BEB]/20 bg-[#5B3BEB]/5 dark:bg-[#5B3BEB]/10'
              )}
            >
              {/* Icon or avatar */}
              {n.from_user ? (
                <div className="relative flex-shrink-0">
                  <Avatar src={n.from_user.avatar_url} name={n.from_user.full_name} size="md" />
                  <div className={cn('absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center', colorClass)}>
                    <Icon className="h-3 w-3" />
                  </div>
                </div>
              ) : (
                <div className={cn('h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0', colorClass)}>
                  <Icon className="h-5 w-5" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className={cn('text-sm leading-snug', !n.is_read && 'font-semibold')}>
                  {n.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(n.created_at)}</p>
              </div>

              {!n.is_read && (
                <div className="h-2.5 w-2.5 rounded-full bg-[#5B3BEB] flex-shrink-0 mt-1" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
