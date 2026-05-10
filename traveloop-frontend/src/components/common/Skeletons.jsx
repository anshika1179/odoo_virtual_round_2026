/* Card Skeleton */
export function CardSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass rounded-2xl overflow-hidden">
          <div className="h-40 skeleton" />
          <div className="p-5 space-y-3">
            <div className="h-5 skeleton rounded-lg w-3/4" />
            <div className="h-4 skeleton rounded-lg w-full" />
            <div className="h-4 skeleton rounded-lg w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* Row Skeleton */
export function RowSkeleton({ count = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl skeleton shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 skeleton rounded-lg w-1/3" />
            <div className="h-3 skeleton rounded-lg w-2/3" />
          </div>
          <div className="h-8 w-20 skeleton rounded-lg shrink-0" />
        </div>
      ))}
    </div>
  );
}

/* Table Skeleton */
export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-amber-700/15 to-orange-600/15 px-6 py-4">
        <div className="h-5 skeleton rounded-lg w-40" />
      </div>
      <div className="p-4 space-y-3">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-4 px-2">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className={`h-4 skeleton rounded-lg ${c === 0 ? 'w-1/4' : 'flex-1'}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* Stat Card Skeleton */
export function StatSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass rounded-2xl p-6 space-y-3">
          <div className="w-12 h-12 rounded-xl skeleton" />
          <div className="h-8 skeleton rounded-lg w-16" />
          <div className="h-4 skeleton rounded-lg w-24" />
        </div>
      ))}
    </div>
  );
}

/* Feed/Post Skeleton */
export function FeedSkeleton({ count = 3 }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass rounded-2xl overflow-hidden">
          <div className="h-52 skeleton" />
          <div className="p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full skeleton" />
              <div className="space-y-1.5">
                <div className="h-4 skeleton rounded-lg w-24" />
                <div className="h-3 skeleton rounded-lg w-16" />
              </div>
            </div>
            <div className="h-5 skeleton rounded-lg w-3/4" />
            <div className="h-4 skeleton rounded-lg w-full" />
            <div className="h-4 skeleton rounded-lg w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
