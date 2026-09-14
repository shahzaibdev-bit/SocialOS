"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { AiProvider, SafeAiApiKey } from "@/lib/backend/types";
import { KeyRound, Trash2 } from "lucide-react";

const providers: Array<{ id: AiProvider; label: string; model: string; hint: string }> = [
  { id: "openai", label: "OpenAI / ChatGPT", model: "gpt-4o-mini", hint: "Use an OpenAI platform API key." },
  { id: "openrouter", label: "OpenRouter", model: "openai/gpt-4o-mini", hint: "Use any OpenRouter key and model slug." },
  { id: "gemini", label: "Google Gemini", model: "gemini-1.5-flash", hint: "Use a Gemini API key from Google AI Studio." },
];

export function ModelKeysClient({ keys }: { keys: SafeAiApiKey[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    const response = await fetch("/api/ai-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: form.get("provider"),
        label: form.get("label"),
        apiKey: form.get("apiKey"),
        defaultModel: form.get("defaultModel"),
        isDefault: form.get("isDefault") === "on",
      }),
    });
    const result = await response.json();
    setLoading(false);
    setMessage(result.ok ? "API key saved securely." : result.error);
    if (result.ok) {
      formElement.reset();
      router.refresh();
    }
  }

  async function remove(id: string) {
    await fetch(`/api/ai-keys/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-retro-cyan/10 text-retro-cyan">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Add provider key</h2>
            <p className="text-sm text-slate-400">Stored encrypted. Never exposed in the browser after saving.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-300">Provider</span>
            <select name="provider" className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-white outline-none focus:border-retro-cyan">
              {providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-300">Default model</span>
            <input name="defaultModel" placeholder="gpt-4o-mini" className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-white outline-none focus:border-retro-cyan" />
          </label>
        </div>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-slate-300">Label</span>
          <input name="label" placeholder="My marketing model" className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-white outline-none focus:border-retro-cyan" />
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-slate-300">API key</span>
          <input name="apiKey" type="password" required placeholder="Paste your API key" className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-white outline-none focus:border-retro-cyan" />
        </label>

        <label className="mt-4 flex items-center gap-3 text-sm text-slate-300">
          <input name="isDefault" type="checkbox" defaultChecked />
          Use as default AI provider
        </label>

        <button disabled={loading} className="mt-6 inline-flex items-center justify-center rounded-2xl bg-retro-cyan px-6 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:opacity-60">
          {loading ? "Saving..." : "Save encrypted key"}
        </button>
        {message && <p className="mt-4 text-sm text-retro-cyan">{message}</p>}
      </form>

      <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
        <h2 className="text-xl font-semibold text-white">Connected model providers</h2>
        <div className="mt-5 grid gap-3">
          {keys.map((key) => (
            <div key={key.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{key.label}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-retro-cyan">{key.provider}</p>
                  <p className="mt-2 text-sm text-slate-400">{key.defaultModel}</p>
                  {key.isDefault && <p className="mt-2 text-xs font-semibold text-retro-yellow">Default provider</p>}
                </div>
                <button onClick={() => remove(key.id)} className="rounded-xl border border-retro-magenta/30 p-2 text-retro-magenta hover:bg-retro-magenta hover:text-white">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {!keys.length && <p className="text-sm text-slate-400">No AI provider keys added yet.</p>}
        </div>

        <div className="mt-6 rounded-2xl border border-retro-yellow/20 bg-retro-yellow/10 p-4 text-sm leading-6 text-slate-300">
          OpenRouter lets users choose many models with one key. OpenAI powers ChatGPT API models. Gemini uses Google AI Studio keys.
        </div>
      </div>
    </div>
  );
}
