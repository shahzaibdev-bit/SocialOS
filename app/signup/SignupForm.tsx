"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      const result = await response.json();

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <label className="block">
        <span className="text-sm font-medium text-slate-300">Name</span>
        <input name="name" required className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none transition focus:border-retro-cyan" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-slate-300">Email</span>
        <input name="email" type="email" required className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none transition focus:border-retro-cyan" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-slate-300">Password</span>
        <input name="password" type="password" minLength={6} required className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none transition focus:border-retro-cyan" />
      </label>
      {error && <p className="rounded-2xl border border-retro-magenta/30 bg-retro-magenta/10 p-3 text-sm text-retro-magenta">{error}</p>}
      <button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-retro-magenta px-6 py-4 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60">
        {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
        {loading ? "Creating..." : "Create account"}
      </button>
      <p className="text-center text-sm text-slate-400">
        Already registered? <Link href="/login" className="text-retro-yellow underline">Log in</Link>
      </p>
    </form>
  );
}
