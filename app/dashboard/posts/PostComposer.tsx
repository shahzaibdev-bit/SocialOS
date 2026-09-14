"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { Platform } from "@/lib/backend/types";

const platforms: Array<{ id: Platform; label: string }> = [
  { id: "x", label: "X" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
];

export function PostComposer() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const targetPlatforms = platforms.filter((platform) => form.get(platform.id)).map((platform) => platform.id);
    const status = String(form.get("status"));
    setSaving(true);
    setMessage("");

    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: form.get("content"),
        targetPlatforms,
        status,
        scheduledFor: form.get("scheduledFor"),
        timezone: form.get("timezone"),
      }),
    });
    const result = await response.json();
    setSaving(false);

    setMessage(result.ok ? "Post saved." : result.error);
    if (result.ok) {
      formElement.reset();
      router.refresh();
    }
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
      <h2 className="text-xl font-semibold text-white">Create Post</h2>
      <p className="mt-2 text-sm text-slate-400">Draft once, adapt across selected platforms, and route through approval.</p>
      <textarea name="content" required rows={6} placeholder="Write or paste your post idea..." className="mt-5 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white outline-none transition focus:border-retro-cyan" />
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <input name="scheduledFor" type="datetime-local" className="rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-white outline-none focus:border-retro-cyan" />
        <input name="timezone" defaultValue="Asia/Karachi" className="rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-white outline-none focus:border-retro-cyan" />
      </div>
      <div className="mt-5 flex flex-wrap gap-4">
        {platforms.map((platform) => (
          <label key={platform.id} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
            <input name={platform.id} type="checkbox" defaultChecked={platform.id === "x" || platform.id === "linkedin"} />
            {platform.label}
          </label>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-4">
        <select name="status" defaultValue="pending_approval" className="rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-white outline-none focus:border-retro-magenta">
          <option value="draft">Draft</option>
          <option value="pending_approval">Pending Approval</option>
          <option value="scheduled">Scheduled</option>
        </select>
        <button disabled={saving} className="rounded-2xl bg-retro-magenta px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
          {saving ? "Saving..." : "Save Post"}
        </button>
      </div>
      {message && <p className="mt-4 text-sm text-retro-cyan">{message}</p>}
    </form>
  );
}
