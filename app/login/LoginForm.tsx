"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const result = await response.json();
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <label className="block">
        <span className="text-xs font-pixel text-retro-cyan">EMAIL</span>
        <input name="email" type="email" required className="mt-2 w-full border-2 border-retro-cyan bg-black p-4 font-mono text-white outline-none" />
      </label>
      <label className="block">
        <span className="text-xs font-pixel text-retro-cyan">PASSWORD</span>
        <input name="password" type="password" required className="mt-2 w-full border-2 border-retro-cyan bg-black p-4 font-mono text-white outline-none" />
      </label>
      {error && <p className="border-2 border-retro-magenta bg-retro-magenta/10 p-3 text-sm text-retro-magenta">{error}</p>}
      <button disabled={loading} className="w-full border-2 border-retro-magenta bg-retro-magenta px-6 py-4 font-pixel text-xs uppercase text-white shadow-retro-cyan disabled:opacity-60">
        {loading ? "LOGGING IN..." : "LOGIN"}
      </button>
      <p className="text-center text-sm text-gray-400">
        New operator? <Link href="/signup" className="text-retro-yellow underline">Create an account</Link>
      </p>
    </form>
  );
}
