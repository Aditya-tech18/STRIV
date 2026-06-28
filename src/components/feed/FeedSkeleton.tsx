export function FeedSkeleton() {
  return (
    <div className="space-y-3 max-w-lg mx-auto w-full pb-20">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-[#111111] rounded-xl p-4 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-border/40 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-border/40 rounded w-1/3" />
              <div className="h-3 bg-border/40 rounded w-1/4" />
            </div>
            <div className="w-8 h-8 rounded-full bg-border/40 shrink-0" />
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-border/40 rounded w-3/4" />
            <div className="h-4 bg-border/40 rounded w-1/2" />
          </div>
          
          <div className="w-full aspect-[4/5] sm:aspect-square bg-border/20 rounded-xl mb-4" />
          
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="h-9 w-12 bg-border/40 rounded-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
