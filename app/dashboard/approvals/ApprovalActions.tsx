"use client";

import { useRouter } from "next/navigation";

export function ApprovalActions({ postId }: { postId: string }) {
  const router = useRouter();

  async function approve() {
    await fetch(`/api/posts/${postId}/approve`, { method: "POST" });
    router.refresh();
  }

  async function reject() {
    await fetch(`/api/posts/${postId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "draft" }),
    });
    router.refresh();
  }

  return (
    <div className="mt-5 flex gap-3">
      <button onClick={approve} className="rounded-xl bg-retro-cyan px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110">Approve</button>
      <button onClick={reject} className="rounded-xl border border-retro-magenta/40 px-4 py-2.5 text-sm font-semibold text-retro-magenta transition hover:bg-retro-magenta hover:text-white">Back to Draft</button>
    </div>
  );
}
