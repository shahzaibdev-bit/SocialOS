"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Bot, CheckCircle2, FileText, Home, KeyRound, Link2, LogOut, Palette, ShieldCheck } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/integrations", label: "Integrations", icon: Link2 },
  { href: "/dashboard/posts", label: "Posts", icon: FileText },
  { href: "/dashboard/approvals", label: "Approvals", icon: CheckCircle2 },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/brand", label: "Brand Voice", icon: Palette },
  { href: "/dashboard/chat", label: "AI Studio", icon: Bot },
  { href: "/dashboard/model-keys", label: "Model Keys", icon: ShieldCheck },
  { href: "/dashboard/api-tokens", label: "MCP Tokens", icon: KeyRound },
];

export function DashboardNav({ name }: { name: string }) {
  const router = useRouter();
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-4 z-40 rounded-[28px] border border-white/10 bg-slate-950/90 p-3 shadow-[0_28px_90px_rgba(0,0,0,0.32)] backdrop-blur-2xl">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-retro-cyan to-retro-magenta text-sm font-black text-white shadow-lg shadow-retro-cyan/20">
              OS
            </span>
            <span>
              <span className="block text-base font-semibold text-white">OmniSocial</span>
              <span className="block text-xs text-slate-500">Professional workspace</span>
            </span>
          </Link>

          <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 md:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.9)]" />
            <span className="max-w-40 truncate text-sm text-slate-300">{name}</span>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto rounded-2xl bg-white/[0.025] p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-white text-slate-950 shadow-lg shadow-retro-cyan/10"
                    : "text-slate-400 hover:bg-white/[0.07] hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-retro-cyan" : ""}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={logout}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-retro-magenta/50 hover:bg-retro-magenta/10 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  );
}
