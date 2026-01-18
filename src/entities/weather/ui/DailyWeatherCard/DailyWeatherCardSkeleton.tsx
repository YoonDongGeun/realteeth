export function DailyWeatherCardSkeleton() {
  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <div className="h-5 w-24 bg-zinc-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
          <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
        </div>
        <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-700 rounded-full animate-pulse" />
      </div>

      {/* Main Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-baseline gap-2">
          <div className="h-10 w-16 bg-zinc-200 dark:bg-zinc-700 rounded-xl animate-pulse" />
          <div className="h-8 w-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
          <div className="h-10 w-16 bg-zinc-200 dark:bg-zinc-700 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Chart Skeleton */}
      <div className="mt-2 h-48 bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl animate-pulse" />
    </div>
  );
}
