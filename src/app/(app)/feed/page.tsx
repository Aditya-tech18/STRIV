'use client'

import { useEffect, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Compass, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getFeedProofs } from '@/lib/api/feed'
import { FeedSkeleton } from '@/components/feed/FeedSkeleton'
import { ProofCard } from '@/components/feed/ProofCard'

export default function FeedPage() {
  const { profile, supabaseClient, loading: authLoading } = useAuth()
  const router = useRouter()
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Redirect if no profile exists
  useEffect(() => {
    if (!authLoading && !profile?.id) {
      router.replace('/login')
    }
  }, [authLoading, profile, router])

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['feed', profile?.id],
    queryFn: ({ pageParam }) => getFeedProofs(supabaseClient, profile!.id, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => (lastPage.length === 10 ? pages.length : undefined),
    enabled: !!profile?.id,
  })

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.5 }
    )

    const currentRef = loadMoreRef.current
    if (currentRef) observer.observe(currentRef)

    return () => {
      if (currentRef) observer.unobserve(currentRef)
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  if (authLoading || status === 'pending') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-6 px-4">
        <FeedSkeleton />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
        <p className="text-red-500 font-semibold">Failed to load feed.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition"
        >
          Try Again
        </button>
      </div>
    )
  }

  const proofs = data.pages.flat()
  const isEmpty = proofs.length === 0

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-4 sm:pt-8 px-4 pb-24">
      <div className="max-w-lg mx-auto w-full">
        <h1 className="text-2xl font-black text-white tracking-tight mb-6">Home Feed</h1>
        
        {isEmpty ? (
          <div className="bg-[#111111] rounded-2xl p-8 text-center border border-border/20 flex flex-col items-center mt-10 shadow-lg">
            <div className="h-16 w-16 bg-[#5B3BEB]/10 rounded-full flex items-center justify-center mb-4">
              <Compass className="h-8 w-8 text-[#5B3BEB]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No posts yet 👀</h2>
            <p className="text-[#888888] text-sm mb-6 max-w-xs">
              Follow people to see their progress, or start your own challenge to build your streak.
            </p>
            <Link 
              href="/explore" 
              className="bg-[#5B3BEB] text-white font-semibold py-2.5 px-6 rounded-xl shadow-[0_4px_16px_rgba(91,59,235,0.35)] hover:bg-[#4A2DD4] active:bg-[#3A1EC4] transition-colors"
            >
              Explore Challenges
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {proofs.map((proof) => (
              <ProofCard 
                key={proof.id} 
                proof={proof} 
                currentUserId={profile!.id} 
                supabaseClient={supabaseClient} 
              />
            ))}
            
            {/* Infinite Scroll Trigger */}
            <div ref={loadMoreRef} className="py-6 flex justify-center">
              {isFetchingNextPage && <Loader2 className="h-6 w-6 animate-spin text-[#5B3BEB]" />}
              {!hasNextPage && proofs.length > 0 && (
                <p className="text-xs text-[#888888] font-semibold uppercase tracking-wider">You caught up!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
