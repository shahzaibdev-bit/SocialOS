"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { BrandProfile } from "@/lib/backend/types";

export function BrandForm({ brand }: { brand: BrandProfile }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/brand", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        voice: form.get("voice"),
        bannedWords: String(form.get("bannedWords") ?? "").split(",").map((word) => word.trim()).filter(Boolean),
        approvalMode: form.get("approvalMode"),
      }),
    });
    const result = await response.json();
    setMessage(result.ok ? "Brand profile saved." : result.error);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-retro-yellow">Brand voice</span>
        <textarea name="voice" defaultValue={brand.voice} rows={7} className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white outline-none transition focus:border-retro-cyan" />
      </label>
      <label className="mt-5 block">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-retro-yellow">Banned words</span>
        <input name="bannedWords" defaultValue={brand.bannedWords.join(", ")} className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none transition focus:border-retro-cyan" />
      </label>
      <label className="mt-5 block">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-retro-yellow">AI mode</span>
        <select name="approvalMode" defaultValue={brand.approvalMode} className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none transition focus:border-retro-magenta">
          <option value="draft_only">Draft Only — human approval required</option>
          <option value="auto_schedule">Auto Schedule — creates scheduled queue items</option>
        </select>
      </label>
      <button className="mt-6 rounded-2xl bg-retro-magenta px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110">Save Brand Voice</button>
      {message && <p className="mt-4 text-sm text-retro-cyan">{message}</p>}
    </form>
  );
}
