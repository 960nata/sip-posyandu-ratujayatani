export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Welcome Section Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-200 dark:bg-[#252525] rounded-lg"></div>
          <div className="h-4 w-96 bg-slate-100 dark:bg-[#202020] rounded-lg"></div>
        </div>
        <div className="h-10 w-32 bg-slate-200 dark:bg-[#252525] rounded-lg"></div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="dash-card">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-slate-200 dark:bg-[#252525] rounded-lg"></div>
              <div className="w-16 h-6 bg-slate-100 dark:bg-[#202020] rounded-full"></div>
            </div>
            <div className="h-4 w-32 bg-slate-100 dark:bg-[#202020] rounded-lg"></div>
            <div className="h-8 w-16 bg-slate-200 dark:bg-[#252525] rounded-lg"></div>
          </div>
        ))}
      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="dash-card">
          <div className="h-6 w-48 bg-slate-200 dark:bg-[#252525] rounded-lg mb-4"></div>
          <div className="h-72 bg-slate-100 dark:bg-[#202020] rounded-lg"></div>
        </div>
        <div className="dash-card">
          <div className="h-6 w-48 bg-slate-200 dark:bg-[#252525] rounded-lg mb-4"></div>
          <div className="h-72 bg-slate-100 dark:bg-[#202020] rounded-lg"></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="dash-card">
        <div className="h-6 w-48 bg-slate-200 dark:bg-[#252525] rounded-lg mb-4"></div>
        <div className="space-y-3">
          <div className="h-10 bg-slate-200 dark:bg-[#252525] rounded-lg"></div>
          <div className="h-10 bg-slate-100 dark:bg-[#202020] rounded-lg"></div>
          <div className="h-10 bg-slate-100 dark:bg-[#202020] rounded-lg"></div>
          <div className="h-10 bg-slate-100 dark:bg-[#202020] rounded-lg"></div>
        </div>
      </div>
    </div>
  )
}
