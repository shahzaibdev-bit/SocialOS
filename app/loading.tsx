export default function Loading() {
  return (
    <main className="grid min-h-screen place-items-center bg-retro-bg text-white">
      <div className="text-center">
        <div className="mx-auto h-14 w-14 animate-spin rounded-full border-2 border-retro-cyan border-t-transparent shadow-[0_0_40px_rgba(0,240,255,0.35)]" />
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.3em] text-retro-cyan">Loading SocialOS</p>
      </div>
    </main>
  );
}
