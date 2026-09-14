"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type TokenRecord = {
  id: string;
  name: string;
  createdAt: string;
  lastUsedAt?: string;
};

export function TokenManager({ tokens }: { tokens: TokenRecord[] }) {
  const router = useRouter();
  const [newToken, setNewToken] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.get("name") }),
    });
    const result = await response.json();

    if (result.ok) {
      setNewToken(result.data.token.token);
      event.currentTarget.reset();
      router.refresh();
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <h2 className="text-xl font-semibold text-white">Generate MCP Token</h2>
        <p className="mt-2 text-sm text-slate-400">Use these tokens as Bearer credentials for remote AI agents.</p>
        <input name="name" placeholder="Claude Desktop / Cursor token" className="mt-5 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none transition focus:border-retro-cyan" />
        <button className="mt-5 rounded-2xl bg-retro-magenta px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110">Generate Token</button>
        {newToken && (
          <div className="mt-5 rounded-2xl border border-retro-yellow/30 bg-retro-yellow/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-retro-yellow">Copy this token now</p>
            <code className="mt-3 block break-all text-retro-cyan">{newToken}</code>
          </div>
        )}
      </form>
      <div className="grid gap-3">
        {tokens.map((token) => (
          <div key={token.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <p className="text-sm font-semibold text-retro-cyan">{token.name}</p>
            <p className="mt-2 text-xs text-slate-500">Created {new Date(token.createdAt).toLocaleString()}{token.lastUsedAt ? ` · Last used ${new Date(token.lastUsedAt).toLocaleString()}` : ""}</p>
          </div>
        ))}
        {!tokens.length && <p className="text-sm text-slate-400">No MCP tokens yet.</p>}
      </div>
    </div>
  );
}
