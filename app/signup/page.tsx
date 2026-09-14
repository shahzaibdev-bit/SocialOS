import Link from "next/link";
import { SignupForm } from "./SignupForm";

export default function SignupPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,rgba(0,240,255,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,0,60,0.16),transparent_34%),#070A12] px-4 py-12 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/85 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.42)] backdrop-blur-xl">
        <Link href="/" className="text-sm font-semibold text-retro-cyan hover:text-retro-yellow">← Home</Link>
        <h1 className="mt-8 text-3xl font-semibold tracking-tight">Create workspace</h1>
        <p className="mt-3 mb-8 text-sm leading-6 text-slate-400">Start managing drafts, approvals, platform accounts, AI keys, analytics, and MCP agent access.</p>
        <SignupForm />
      </div>
    </main>
  );
}
