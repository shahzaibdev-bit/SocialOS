"use client";

import { FormEvent, useState } from "react";
import type { SafeAiApiKey } from "@/lib/backend/types";
import { BarChart3, CheckCircle2, Loader2, Sparkles, TriangleAlert } from "lucide-react";

type LinkedInAnalytics = {
  connected: boolean;
  available: boolean;
  accountName?: string;
  latestPost?: {
    id: string;
    text: string;
    publishedAt?: string;
  };
  metrics?: {
    IMPRESSION?: number;
    MEMBERS_REACHED?: number;
    REACTION?: number;
    COMMENT?: number;
    RESHARE?: number;
  };
  impressions?: number | null;
  requiredScopes?: string[];
  grantedScopes?: string[];
  reason?: string;
};

export function AnalyticsClient({ keys }: { keys: SafeAiApiKey[] }) {
  const [loading, setLoading] = useState(false);
  const [linkedinLoading, setLinkedinLoading] = useState(false);
  const [linkedin, setLinkedin] = useState<LinkedInAnalytics | null>(null);
  const [result, setResult] = useState("");
  const [meta, setMeta] = useState("");

  async function loadLinkedInAnalytics() {
    setLinkedinLoading(true);
    const response = await fetch("/api/linkedin/analytics/latest", { cache: "no-store" });
    const data = await response.json();
    setLinkedinLoading(false);

    if (data.ok) {
      setLinkedin(data.data);
    } else {
      setLinkedin({
        connected: false,
        available: false,
        reason: data.error || "Could not load LinkedIn analytics.",
      });
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setLoading(true);
    setResult("");
    setMeta("");
    const form = new FormData(formElement);
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
    setLinkedin(data.data.linkedInAnalytics ?? linkedin);
  }

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_420px]">
      <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-gradient-to-br from-retro-cyan/10 to-slate-950 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-retro-cyan/10 text-retro-cyan">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Performance strategy</h2>
            <p className="text-sm text-slate-400">Ask about live LinkedIn metrics, workspace drafts, or a combined content plan.</p>
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
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
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
        <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">LinkedIn live analytics</p>
              <p className="mt-1 text-xs text-slate-500">
                Pulls your latest member post and impression metrics when LinkedIn grants analytics scopes.
              </p>
            </div>
            <button
              type="button"
              onClick={loadLinkedInAnalytics}
              disabled={linkedinLoading}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-retro-cyan/40 hover:text-white disabled:opacity-60"
            >
              {linkedinLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Check
            </button>
          </div>

          {linkedin && (
            <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-3 text-sm">
              <div className="flex items-center gap-2">
                {linkedin.available ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <TriangleAlert className="h-4 w-4 text-retro-yellow" />}
                <span className={linkedin.available ? "text-emerald-300" : "text-retro-yellow"}>
                  {linkedin.available ? "Analytics available" : linkedin.connected ? "Connected, permission needed" : "Not connected"}
                </span>
              </div>
              {linkedin.available && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-white/[0.04] p-3">
                    <p className="text-xs text-slate-500">Impressions</p>
                    <p className="mt-1 text-2xl font-semibold text-white">{linkedin.metrics?.IMPRESSION ?? "—"}</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.04] p-3">
                    <p className="text-xs text-slate-500">Reactions</p>
                    <p className="mt-1 text-2xl font-semibold text-white">{linkedin.metrics?.REACTION ?? "—"}</p>
                  </div>
                </div>
              )}
              <p className="mt-3 text-xs leading-5 text-slate-400">
                {linkedin.available
                  ? linkedin.latestPost?.text?.slice(0, 160) || "LinkedIn returned account data."
                  : linkedin.reason}
              </p>
            </div>
          )}
        </div>

        <h2 className="text-xl font-semibold text-white">Strategy output</h2>
        {meta && <p className="mt-2 text-xs uppercase tracking-[0.18em] text-retro-cyan">{meta}</p>}
        <div className="mt-5 min-h-80 whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-slate-200">
          {loading ? "Building strategy..." : result || "Your analytics and strategy report will appear here."}
        </div>
      </div>
    </div>
  );
}
