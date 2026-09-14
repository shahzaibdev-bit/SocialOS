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
    <aside className="rounded-3xl border border-white/10 bg-slate-950/85 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
      <Link href="/" className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-retro-cyan to-retro-magenta text-sm font-black text-white shadow-lg shadow-retro-cyan/20">
          OS
        </span>
        <span>
          <span className="block text-base font-semibold text-white">OmniSocial</span>
          <span className="block text-xs text-slate-500">Control Center</span>
        </span>
      </Link>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Signed in</p>
        <p className="mt-1 truncate text-sm font-medium text-white">{name}</p>
      </div>

      <nav className="mt-6 grid gap-1.5">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-retro-cyan text-slate-950 shadow-lg shadow-retro-cyan/20"
                  : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={logout}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-retro-magenta/30 px-4 py-3 text-sm font-semibold text-retro-magenta transition hover:bg-retro-magenta hover:text-white"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  );
}
