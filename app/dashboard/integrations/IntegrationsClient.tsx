"use client";

import { useRouter } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
import { useState } from "react";
import type { ConnectedAccount, Platform } from "@/lib/backend/types";
import { CheckCircle2, ExternalLink, Facebook, Instagram, Linkedin } from "lucide-react";

const XIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M18.9 2h3.3l-7.2 8.2L23.5 22h-6.7l-5.2-6.8L5.6 22H2.3l7.7-8.8L1.8 2h6.8l4.7 6.2L18.9 2Zm-1.2 17.9h1.8L7.6 4H5.7l12 15.9Z" />
  </svg>
);

const platforms: Array<{ id: Platform; label: string; tone: string; icon: ComponentType<{ className?: string }> }> = [
  { id: "x", label: "X", tone: "from-white/16", icon: XIcon },
  { id: "linkedin", label: "LinkedIn", tone: "from-[#0A66C2]/25", icon: Linkedin },
  { id: "instagram", label: "Instagram", tone: "from-[#E1306C]/25", icon: Instagram },
  { id: "facebook", label: "Facebook", tone: "from-[#1877F2]/25", icon: Facebook },
];

export function IntegrationsClient({
  accounts,
  oauthConfigured,
}: {
  accounts: ConnectedAccount[];
  oauthConfigured: Record<Platform, boolean>;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState("");

  async function connect(platform: Platform) {
    setBusy(platform);

    if (oauthConfigured[platform] && platform !== "x") {
      router.push(`/api/oauth/${platform}/start`);
      return;
    }

    setBusy("");
  }

  async function disconnect(id: string) {
    setBusy(id);
    await fetch(`/api/accounts/${id}`, { method: "DELETE" });
    setBusy("");
    router.refresh();
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {platforms.map((platform) => {
        const account = accounts.find((candidate) => candidate.platform === platform.id);
        const Icon = platform.icon;
        const readyForRealOAuth = oauthConfigured[platform.id];

        return (
          <div key={platform.id} className={`rounded-3xl border border-white/10 bg-gradient-to-br ${platform.tone} to-slate-950 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.25)]`}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black/30">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">{platform.label}</h2>
                  <p className="text-xs text-slate-500">
                    {account
                      ? account.connectionType === "oauth"
                        ? "OAuth connected"
                      : "Legacy demo connector"
                      : platform.id === "x"
                        ? "Skipped"
                        : readyForRealOAuth
                          ? "OAuth credentials detected"
                          : "Credentials needed"}
                  </p>
                </div>
              </div>
              {account && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
            </div>

            <p className="mt-5 min-h-12 text-sm leading-6 text-slate-400">
              {account
                ? `Connected as ${account.displayName}. ${account.connectionType === "oauth" ? "This account is authenticated through real OAuth." : "Disconnect this legacy demo record and reconnect with real OAuth."}`
                : platform.id === "x"
                  ? "X/Twitter is skipped for now because its posting API requires a paid developer tier."
                  : readyForRealOAuth
                  ? "Credentials are present. Click connect to authorize the real account through the provider."
                  : "Real OAuth needs a developer app client ID, client secret, and callback URL for this platform."}
            </p>
            {account ? (
              <button onClick={() => disconnect(account.id)} disabled={busy === account.id} className="mt-5 rounded-xl border border-retro-magenta/40 px-4 py-2.5 text-sm font-semibold text-retro-magenta transition hover:bg-retro-magenta hover:text-white disabled:opacity-60">
                {busy === account.id ? "Disconnecting..." : "Disconnect"}
              </button>
            ) : (
              <button
                onClick={() => connect(platform.id)}
                disabled={busy === platform.id || platform.id === "x" || !readyForRealOAuth}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-retro-cyan px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy === platform.id ? "Connecting..." : platform.id === "x" ? "Skipped" : readyForRealOAuth ? "Connect account" : "Add credentials"}
                <ExternalLink className="h-4 w-4" />
              </button>
            )}
          </div>
        );
      })}
      <div className="rounded-3xl border border-retro-yellow/25 bg-retro-yellow/10 p-6 md:col-span-2">
        <h3 className="text-base font-semibold text-retro-yellow">Connection requirements</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          LinkedIn and Meta OAuth are wired for real provider login. Instagram publishing still requires an Instagram Business or Creator account connected to a Facebook Page. X is skipped for now because its posting API requires a paid developer tier.
        </p>
      </div>
    </div>
  );
}
