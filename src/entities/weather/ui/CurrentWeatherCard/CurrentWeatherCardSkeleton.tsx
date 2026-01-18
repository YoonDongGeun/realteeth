export function CurrentWeatherCardSkeleton() {
  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
          <div className="h-5 w-20 bg-zinc-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
        </div>

        {/* Main Info */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-3">
              <div className="h-14 w-28 bg-zinc-200 dark:bg-zinc-700 rounded-xl animate-pulse" />
              <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>

        {/* Grid Details */}
        <div className="grid grid-cols-3 gap-4 mt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
              <div className="h-3 w-8 bg-zinc-200 dark:bg-zinc-700 rounded mb-1 animate-pulse" />
              <div className="h-4 w-12 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
