'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SupabaseClient } from '@supabase/supabase-js'
import { MessageCircle, Loader2, Send } from 'lucide-react'
import { getComments, addComment, type CommentType } from '@/lib/api/feed'
import { formatDistanceToNow } from 'date-fns'

interface CommentSectionProps {
  proofId: string
  userId: string
  commentsCount: number
  supabaseClient: SupabaseClient
}

export function CommentSection({ proofId, userId, commentsCount, supabaseClient }: CommentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [content, setContent] = useState('')
  const queryClient = useQueryClient()

  // Only fetch if expanded
  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', proofId],
    queryFn: () => getComments(supabaseClient, proofId),
    enabled: isExpanded,
  })

  const mutation = useMutation({
    mutationFn: (text: string) => addComment(supabaseClient, proofId, userId, text),
    onSuccess: () => {
      setContent('')
      queryClient.invalidateQueries({ queryKey: ['comments', proofId] })
      // We also invalidate the feed to get the updated comment count (or we can assume it incremented)
      // Ideally, the feed query would be invalidated to update the main card's comment count:
      // queryClient.invalidateQueries({ queryKey: ['feed'] })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || mutation.isPending) return
    mutation.mutate(content.trim())
  }

  return (
    <div className="mt-4 border-t border-border/40 pt-3">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-[#888888] hover:text-white transition-colors"
      >
        <MessageCircle className="h-4 w-4" />
        {commentsCount > 0 ? `${commentsCount} comments` : 'Add a comment...'}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-[#5B3BEB]" />
            </div>
          ) : comments?.length === 0 ? (
            <p className="text-sm text-[#888888] text-center py-2">No comments yet. Be the first!</p>
          ) : (
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {comments?.map((comment: CommentType) => (
                <div key={comment.id} className="flex gap-3">
                  {comment.user.avatar_url ? (
                    <img 
                      src={comment.user.avatar_url} 
                      alt={comment.user.username} 
                      className="h-8 w-8 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-[#5B3BEB]/20 flex items-center justify-center shrink-0 text-[#5B3BEB] font-bold text-xs">
                      {comment.user.username[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-sm text-white">@{comment.user.username}</span>
                      <span className="text-[10px] text-[#888888]">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mt-0.5 break-words">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-white/5 border border-border/40 rounded-full px-4 py-2 text-sm text-white placeholder-[#888888] focus:outline-none focus:border-[#5B3BEB]/50 transition-colors"
            />
            <button
              type="submit"
              disabled={!content.trim() || mutation.isPending}
              className="h-9 w-9 rounded-full bg-[#5B3BEB] flex items-center justify-center text-white disabled:opacity-50 transition-colors flex-shrink-0"
            >
              {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
