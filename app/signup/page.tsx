import Link from "next/link";
import { SignupForm } from "./SignupForm";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-retro-bg px-4 py-12 text-white">
      <div className="mx-auto max-w-md border-4 border-retro-magenta bg-[#111118] p-8 shadow-retro-cyan">
        <Link href="/" className="font-pixel text-xs text-retro-yellow">← HOME</Link>
        <h1 className="mt-8 font-pixel text-3xl uppercase leading-relaxed">Create Your OS</h1>
        <p className="mt-4 mb-8 text-gray-400">Start managing drafts, approvals, platform accounts, and MCP agent access.</p>
        <SignupForm />
      </div>
    </main>
  );
}
