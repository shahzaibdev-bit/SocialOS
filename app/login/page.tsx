import Link from "next/link";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-retro-bg px-4 py-12 text-white">
      <div className="mx-auto max-w-md border-4 border-retro-cyan bg-[#111118] p-8 shadow-retro-cyan">
        <Link href="/" className="font-pixel text-xs text-retro-yellow">← HOME</Link>
        <h1 className="mt-8 font-pixel text-3xl uppercase leading-relaxed">Operator Login</h1>
        <p className="mt-4 mb-8 text-gray-400">Access your OmniSocial OS command center.</p>
        <LoginForm />
      </div>
    </main>
  );
}
