'use client'

import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { SupabaseClient } from '@supabase/supabase-js'
import { type FeedProof } from '@/lib/api/feed'
import { ReactionTray } from './ReactionTray'
import { CommentSection } from './CommentSection'
import { LinkIcon } from 'lucide-react'

interface ProofCardProps {
  proof: FeedProof
  currentUserId: string
  supabaseClient: SupabaseClient
}

export function ProofCard({ proof, currentUserId, supabaseClient }: ProofCardProps) {
  const timeAgo = formatDistanceToNow(new Date(proof.created_at), { addSuffix: true })

  return (
    <div className="bg-[#111111] rounded-xl p-4 mb-3 text-white border border-border/20 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        {proof.user.avatar_url ? (
          <img 
            src={proof.user.avatar_url} 
            alt={proof.user.username} 
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#5B3BEB]/20 flex items-center justify-center shrink-0 text-[#5B3BEB] font-bold">
            {proof.user.username[0]?.toUpperCase()}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-bold text-sm truncate">
              {proof.user.display_name}{' '}
              <span className="font-normal text-[#888888]">@{proof.user.username}</span>
            </h3>
            <span className="text-xs text-[#888888] shrink-0">{timeAgo}</span>
          </div>
          
          <p className="text-xs font-semibold text-[#5B3BEB] mt-0.5">
            Day {proof.day_number} of {proof.challenge?.title || 'Challenge'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4 text-sm leading-relaxed whitespace-pre-wrap">
        {proof.content}
      </div>

      {/* Media / Proof attachment */}
      {proof.proof_type === 'photo' && proof.media_url && (
        <div className="relative w-full rounded-xl overflow-hidden mb-4 bg-black border border-border/20">
          {/* We use standard img for dynamic user content from Supabase to avoid NextJS hostname config issues */}
          <img
            src={proof.media_url}
            alt="Proof"
            className="w-full h-auto object-cover max-h-[600px]"
            loading="lazy"
          />
        </div>
      )}
      
      {proof.proof_type === 'video' && proof.media_url && (
        <div className="relative w-full rounded-xl overflow-hidden mb-4 bg-black border border-border/20">
          <video
            src={proof.media_url}
            controls
            className="w-full h-auto max-h-[600px]"
          />
        </div>
      )}

      {proof.proof_type === 'link' && proof.media_url && (
        <a 
          href={proof.media_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-border/40 hover:bg-white/10 transition-colors mb-4 text-[#3BDFEB] text-sm break-all"
        >
          <LinkIcon className="h-4 w-4 shrink-0" />
          {proof.media_url}
        </a>
      )}

      {/* Interactions */}
      <ReactionTray 
        proofId={proof.id} 
        userId={currentUserId} 
        existingReactions={proof.reactions} 
        supabaseClient={supabaseClient} 
      />

      <CommentSection 
        proofId={proof.id} 
        userId={currentUserId} 
        commentsCount={proof.comments_count} 
        supabaseClient={supabaseClient} 
      />
    </div>
  )
}
