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
        <span className="text-xs font-pixel text-retro-cyan">NAME</span>
        <input name="name" required className="mt-2 w-full border-2 border-retro-cyan bg-black p-4 font-mono text-white outline-none" />
      </label>
      <label className="block">
        <span className="text-xs font-pixel text-retro-cyan">EMAIL</span>
        <input name="email" type="email" required className="mt-2 w-full border-2 border-retro-cyan bg-black p-4 font-mono text-white outline-none" />
      </label>
      <label className="block">
        <span className="text-xs font-pixel text-retro-cyan">PASSWORD</span>
        <input name="password" type="password" minLength={6} required className="mt-2 w-full border-2 border-retro-cyan bg-black p-4 font-mono text-white outline-none" />
      </label>
      {error && <p className="border-2 border-retro-magenta bg-retro-magenta/10 p-3 text-sm text-retro-magenta">{error}</p>}
      <button disabled={loading} className="w-full border-2 border-retro-magenta bg-retro-magenta px-6 py-4 font-pixel text-xs uppercase text-white shadow-retro-cyan disabled:opacity-60">
        {loading ? "CREATING..." : "CREATE ACCOUNT"}
      </button>
      <p className="text-center text-sm text-gray-400">
        Already registered? <Link href="/login" className="text-retro-yellow underline">Log in</Link>
      </p>
    </form>
  );
}
