'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SupabaseClient } from '@supabase/supabase-js'
import { toggleReaction, type ReactionType } from '@/lib/api/feed'

interface ReactionTrayProps {
  proofId: string
  userId: string
  existingReactions: Array<{ id: string; user_id: string; reaction_type: ReactionType }>
  supabaseClient: SupabaseClient
}

const REACTION_CONFIG = [
  { type: 'fire' as ReactionType, emoji: '🔥' },
  { type: 'clap' as ReactionType, emoji: '👏' },
  { type: 'strong' as ReactionType, emoji: '💪' },
  { type: 'mind_blown' as ReactionType, emoji: '🤯' },
]

export function ReactionTray({ proofId, userId, existingReactions, supabaseClient }: ReactionTrayProps) {
  // We use local state for optimistic updates to make it incredibly snappy
  // without needing complex infinite-query cache manipulation.
  const [localReactions, setLocalReactions] = useState(existingReactions)

  const mutation = useMutation({
    mutationFn: (type: ReactionType) => toggleReaction(supabaseClient, proofId, userId, type),
    onMutate: async (type) => {
      // Optimistically update local state
      const hasReacted = localReactions.find((r) => r.user_id === userId && r.reaction_type === type)
      
      if (hasReacted) {
        // Remove reaction
        setLocalReactions((prev) => prev.filter((r) => r.id !== hasReacted.id))
      } else {
        // Add optimistic reaction (using a fake ID)
        setLocalReactions((prev) => [
          ...prev,
          { id: `temp-${Date.now()}`, user_id: userId, reaction_type: type },
        ])
      }
      
      return { hasReacted }
    },
    onError: (err, type, context) => {
      // Revert on error by using the previous state (or triggering a full refetch)
      // Since this is a simple local state, a real app might just refetch the feed query here.
      console.error('[ReactionTray] Failed to toggle reaction', err)
    }
  })

  const handleToggle = (type: ReactionType) => {
    mutation.mutate(type)
  }

  return (
    <div className="flex items-center gap-2 mt-3">
      {REACTION_CONFIG.map(({ type, emoji }) => {
        const count = localReactions.filter((r) => r.reaction_type === type).length
        const isReactedByMe = localReactions.some((r) => r.user_id === userId && r.reaction_type === type)

        return (
          <button
            key={type}
            onClick={() => handleToggle(type)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              isReactedByMe
                ? type === 'fire'
                  ? 'bg-[#FF6B35]/20 text-[#FF6B35]'
                  : 'bg-[#5B3BEB]/20 text-[#5B3BEB]'
                : 'bg-white/5 text-[#888888] hover:bg-white/10 hover:text-white'
            }`}
          >
            <span>{emoji}</span>
            {count > 0 && <span>{count}</span>}
          </button>
        )
      })}
    </div>
  )
}
