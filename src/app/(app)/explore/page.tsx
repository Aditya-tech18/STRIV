'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Users, Calendar, CheckCircle, Crown, Lock } from 'lucide-react'
import { Input, Badge } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { cn, formatNumber, CATEGORY_COLORS } from '@/lib/utils'
import type { ChallengeCategory } from '@/types'

const FILTERS = ['Trending', 'Premium', 'Near Me', 'My Communities']
const CATEGORIES: ChallengeCategory[] = [
  'Fitness', 'Coding', 'Education', 'Cooking', 'Entertainment', 'Business', 'Health', 'Lifestyle', 'Other'
]

const FEATURED = [
  {
    id: '1',
    title: 'Mastering Machine Learning',
    org: 'By Dr. Julian Voss',
    participants: 1200,
    duration: 90,
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&q=80',
    is_premium: true,
    is_verified: true,
    category: 'Coding' as ChallengeCategory,
  },
  {
    id: '2',
    title: 'Elite Peak Performance',
    org: 'By Peak Institute',
    participants: 850,
    duration: 60,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80',
    is_premium: true,
    is_verified: false,
    category: 'Fitness' as ChallengeCategory,
  },
]

const TRENDING = [
  {
    id: '3',
    title: '100 Days of Code',
    org: 'DevCommunity',
    day_current: 56,
    day_total: 100,
    participants: 12400,
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=80&q=60',
    is_premium: false,
    is_private: false,
    category: 'Coding' as ChallengeCategory,
  },
  {
    id: '4',
    title: 'Strategic Deep Work',
    org: 'Cal M. Studio',
    day_current: 12,
    day_total: 30,
    participants: 450,
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=80&q=60',
    is_premium: false,
    is_private: true,
    category: 'Business' as ChallengeCategory,
  },
  {
    id: '5',
    title: '6AM Club: Biohacking',
    org: 'Wellness Pro',
    day_current: 22,
    day_total: 60,
    participants: 2100,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=80&q=60',
    is_premium: false,
    is_private: false,
    category: 'Health' as ChallengeCategory,
  },
  {
    id: '6',
    title: '30 Days No Sugar',
    org: 'NutriSquad',
    day_current: 8,
    day_total: 30,
    participants: 3200,
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=80&q=60',
    is_premium: false,
    is_private: false,
    category: 'Health' as ChallengeCategory,
  },
]

export default function ExplorePage() {
  const [activeFilter, setActiveFilter] = useState('Trending')
  const [activeCategory, setActiveCategory] = useState<ChallengeCategory | null>(null)
  const [query, setQuery] = useState('')

  const filtered = TRENDING.filter((c) => {
    const matchCat = !activeCategory || c.category === activeCategory
    const matchQ = !query || c.title.toLowerCase().includes(query.toLowerCase())
    return matchCat && matchQ
  })

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight mb-1">Challenges</h1>
      <p className="text-muted-foreground text-sm mb-5">Discover communities that help you stay consistent.</p>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search Challenges, Communities or Creators"
          className="pl-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-none">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              'flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors',
              activeFilter === f
                ? 'bg-[#5B3BEB] text-white'
                : 'bg-secondary text-secondary-foreground hover:bg-accent'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Featured */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-base">Featured Premium Challenges</h2>
          <button className="text-xs text-[#5B3BEB] font-semibold hover:underline">View All</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
          {FEATURED.map((ch) => (
            <Link
              key={ch.id}
              href={`/challenges/${ch.id}`}
              className="flex-shrink-0 w-56 rounded-2xl overflow-hidden border border-border bg-card hover:shadow-lg transition-all"
            >
              <div className="relative h-36 overflow-hidden">
                <img src={ch.image} alt={ch.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2">
                  <span className="bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Featured
                  </span>
                </div>
                {ch.is_verified && (
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-[#5B3BEB] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold mb-1', CATEGORY_COLORS[ch.category])}>
                  {ch.category}
                </div>
                <p className="font-bold text-sm leading-tight mb-1">{ch.title}</p>
                <p className="text-xs text-muted-foreground mb-2">{ch.org}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{formatNumber(ch.participants)}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{ch.duration} Days</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-5">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              'flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-colors',
              !activeCategory ? 'bg-[#5B3BEB] text-white' : 'bg-secondary text-secondary-foreground hover:bg-accent'
            )}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              className={cn(
                'flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-colors',
                cat === activeCategory ? 'bg-[#5B3BEB] text-white' : 'bg-secondary text-secondary-foreground hover:bg-accent'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Trending list */}
      <div>
        <h2 className="font-bold text-base mb-3">Trending Challenges</h2>
        <div className="space-y-3">
          {filtered.map((ch) => (
            <div key={ch.id} className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card hover:border-[#5B3BEB]/30 transition-colors">
              <img src={ch.image} alt={ch.title} className="h-14 w-14 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="font-bold text-sm truncate">{ch.title}</p>
                  {ch.is_private && <Lock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground mb-1.5">By {ch.org}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">Day {ch.day_current}/{ch.day_total}</span>
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden max-w-24">
                    <div
                      className="h-full striv-progress rounded-full"
                      style={{ width: `${(ch.day_current / ch.day_total) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">• {formatNumber(ch.participants)} members</span>
                </div>
              </div>
              <Button size="sm" variant={ch.is_private ? 'outline' : 'default'}>
                {ch.is_private ? 'Request' : 'Join'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
