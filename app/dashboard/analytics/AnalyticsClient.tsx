"use client";

import { FormEvent, useState } from "react";
import type { SafeAiApiKey } from "@/lib/backend/types";
import { BarChart3, Sparkles } from "lucide-react";

export function AnalyticsClient({ keys }: { keys: SafeAiApiKey[] }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [meta, setMeta] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult("");
    setMeta("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/analytics/strategy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: form.get("prompt"),
        provider: form.get("provider") || undefined,
      }),
    });
    const data = await response.json();
    setLoading(false);

    if (!data.ok) {
      setResult(data.error);
      return;
    }

    setResult(data.data.strategy);
    setMeta(`Generated with ${data.data.provider} · ${data.data.model}`);
  }

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_420px]">
      <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-gradient-to-br from-retro-cyan/10 to-slate-950 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-retro-cyan/10 text-retro-cyan">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Ask for a strategy</h2>
            <p className="text-sm text-slate-400">Example: “Analyze LinkedIn drafts and suggest a 7-day content plan.”</p>
          </div>
        </div>

        <textarea
          name="prompt"
          required
          rows={7}
          defaultValue="Analyze all my current social posts and create a practical growth strategy for LinkedIn, Facebook, and Instagram."
          className="mt-6 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white outline-none transition focus:border-retro-cyan"
        />

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <select name="provider" className="rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-white outline-none focus:border-retro-cyan">
            <option value="">Default provider</option>
            {keys.map((key) => (
              <option key={key.id} value={key.provider}>
                {key.label} — {key.defaultModel}
              </option>
            ))}
          </select>
          <button disabled={loading} className="inline-flex items-center gap-2 rounded-2xl bg-retro-magenta px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60">
            <Sparkles className="h-4 w-4" />
            {loading ? "Analyzing..." : "Generate strategy"}
          </button>
        </div>

        {!keys.length && (
          <p className="mt-4 rounded-2xl border border-retro-yellow/20 bg-retro-yellow/10 p-3 text-sm text-retro-yellow">
            Add a provider key in Model Keys for live AI. Until then, SocialOS returns a local strategy brief.
          </p>
        )}
      </form>

      <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
        <h2 className="text-xl font-semibold text-white">Strategy output</h2>
        {meta && <p className="mt-2 text-xs uppercase tracking-[0.18em] text-retro-cyan">{meta}</p>}
        <div className="mt-5 min-h-80 whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-slate-200">
          {loading ? "Building strategy..." : result || "Your analytics and strategy report will appear here."}
        </div>
      </div>
    </div>
  );
}
