'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Flame, ThumbsUp, MessageCircle, Share2, PlusCircle, Zap } from 'lucide-react'
import { Avatar, Badge } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { cn, formatRelativeTime, formatNumber } from '@/lib/utils'

// Mock data representing real structure from Supabase
const MOCK_POSTS = [
  {
    id: '1',
    user: { full_name: 'Marcus Chen', combat_name: 'marcus.dev', avatar_url: null },
    challenge: { title: '100 Days of Code', category: 'Coding' },
    day: 45,
    streak: 45,
    content: 'Solved 3 Hard problems today focusing on Dynamic Programming. System optimization complete. No shortcuts, just discipline.',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80',
    likes: 128,
    comments: 24,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: '2',
    user: { full_name: 'Elena Rodriguez', combat_name: 'elena.fit', avatar_url: null },
    challenge: { title: '5AM Club', category: 'Fitness' },
    day: 112,
    streak: 112,
    content: 'Upper body hypertrophy session completed. Increased volume by 5% from last week. Consistency is the only metric that matters.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
    likes: 342,
    comments: 15,
    created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
  {
    id: '3',
    user: { full_name: 'Dr. Julian Vance', combat_name: 'dr.julian', avatar_url: null },
    challenge: { title: 'Deep Work Protocol', category: 'Education' },
    day: 89,
    streak: 89,
    content: '50 pages of "Antifragile" and summarized key mental models. Information retention is a habit. Compounding knowledge hourly.',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80',
    likes: 89,
    comments: 8,
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: '4',
    user: { full_name: 'Arjun Sharma', combat_name: 'arjun.codes', avatar_url: null },
    challenge: { title: '365 Days LeetCode', category: 'Coding' },
    day: 124,
    streak: 124,
    content: 'Graph traversal — BFS and DFS patterns locked in. Every day compounds. 241 days remaining on the mission.',
    image: null,
    likes: 203,
    comments: 32,
    created_at: new Date(Date.now() - 7 * 3600000).toISOString(),
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  Coding: 'bg-blue-100 text-blue-700',
  Fitness: 'bg-emerald-100 text-emerald-700',
  Education: 'bg-amber-100 text-amber-700',
}

export default function FeedPage() {
  const [liked, setLiked] = useState<Record<string, boolean>>({})

  return (
    <div className="space-y-0">
      {/* Header actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          <Link href="/explore">
            <Button variant="outline" size="sm" className="gap-1.5">
              <PlusCircle className="h-4 w-4" />
              Join a Challenge
            </Button>
          </Link>
          <Link href="/create">
            <Button size="sm" className="gap-1.5">
              <PlusCircle className="h-4 w-4" />
              Create Challenges
            </Button>
          </Link>
        </div>
      </div>

      {/* Tab */}
      <div className="flex items-center gap-6 border-b border-border mb-6 pb-3">
        <button className="text-sm font-bold text-foreground border-b-2 border-[#5B3BEB] pb-3 -mb-3">
          Growth Feed
        </button>
        <button className="text-sm font-medium text-muted-foreground pb-3 -mb-3 hover:text-foreground transition-colors">
          Recent Activity
        </button>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {MOCK_POSTS.map((post) => (
          <article key={post.id} className="feed-card rounded-2xl border border-border bg-card overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 pb-3">
              <Avatar src={post.user.avatar_url} name={post.user.full_name} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">{post.user.full_name}</span>
                  <span className="text-xs text-muted-foreground">• {formatRelativeTime(post.created_at)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span>{post.challenge.title}</span>
                  {post.challenge.category && (
                    <span className={cn('rounded-full px-2 py-0.5 font-semibold', CATEGORY_COLORS[post.challenge.category] || 'bg-gray-100 text-gray-700')}>
                      {post.challenge.category}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-full px-3 py-1">
                <Flame className="h-3.5 w-3.5 text-amber-500 streak-flame" />
                <span className="text-xs font-black text-amber-600 dark:text-amber-400">DAY {post.day}</span>
              </div>
            </div>

            {/* Content */}
            {post.image && (
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={post.image}
                  alt="Proof"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
            <div className="px-4 py-3">
              <p className="text-sm text-foreground leading-relaxed">{post.content}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 px-4 pb-4">
              <button
                onClick={() => setLiked((p) => ({ ...p, [post.id]: !p[post.id] }))}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors',
                  liked[post.id]
                    ? 'bg-[#5B3BEB]/10 text-[#5B3BEB]'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <ThumbsUp className="h-4 w-4" />
                {formatNumber(post.likes + (liked[post.id] ? 1 : 0))}
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                <MessageCircle className="h-4 w-4" />
                {post.comments}
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition-colors ml-auto">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
