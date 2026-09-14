export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(0,240,255,0.12),transparent_34%),radial-gradient(circle_at_top_right,rgba(255,0,60,0.10),transparent_34%),#070A12] p-4 text-white md:p-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <div className="h-[calc(100vh-3rem)] animate-pulse rounded-3xl border border-white/10 bg-slate-950/80" />
        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-8">
          <div className="h-4 w-40 animate-pulse rounded-full bg-retro-cyan/25" />
          <div className="mt-4 h-10 w-80 max-w-full animate-pulse rounded-2xl bg-white/10" />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="h-40 animate-pulse rounded-3xl border border-white/10 bg-slate-950/70" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
