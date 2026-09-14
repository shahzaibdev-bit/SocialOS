"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function ChatDraftForm() {
  const router = useRouter();
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult("");
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: form.get("prompt") }),
      });
      const data = await response.json();

      setResult(data.ok ? `${data.data.message} Post ID: ${data.data.post.id}` : data.error);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-gradient-to-br from-retro-magenta/10 to-slate-950 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
      <h2 className="text-xl font-semibold text-white">AI Draft Console</h2>
      <p className="mt-3 text-sm leading-6 text-slate-400">This endpoint creates real draft records through the same shared service used by the dashboard and MCP layer.</p>
      <textarea name="prompt" required rows={6} placeholder="Example: create a launch post for our new analytics dashboard..." className="mt-5 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white outline-none transition focus:border-retro-cyan" />
      <button disabled={loading} className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-retro-cyan px-6 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:opacity-60">
        {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />}
        {loading ? "Drafting..." : "Generate Draft"}
      </button>
      {loading && <p className="mt-4 text-sm text-slate-400">Using your selected model provider and saving the draft to MongoDB...</p>}
      {result && <p className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-retro-cyan">{result}</p>}
    </form>
  );
}
