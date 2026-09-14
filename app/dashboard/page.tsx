import { getCurrentUser } from "@/lib/backend/auth";
import { listDashboardData } from "@/lib/backend/services";
import { PageTitle, Panel } from "@/components/Panel";
import Link from "next/link";
import { BarChart3, CalendarClock, CheckCircle2, KeyRound, Link2, Send, Sparkles } from "lucide-react";
import type { ComponentType } from "react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const data = user ? await listDashboardData(user.id) : null;
  const stats: Array<{
    label: string;
    value: number;
    Icon: ComponentType<{ className?: string }>;
    tint: string;
  }> = [
    { label: "Connected", value: data?.stats.connectedAccounts ?? 0, Icon: Link2, tint: "from-retro-cyan/20" },
    { label: "Approvals", value: data?.stats.pendingApprovals ?? 0, Icon: CheckCircle2, tint: "from-retro-yellow/20" },
    { label: "Scheduled", value: data?.stats.scheduledPosts ?? 0, Icon: CalendarClock, tint: "from-retro-magenta/20" },
    { label: "Published", value: data?.stats.publishedPosts ?? 0, Icon: Send, tint: "from-emerald-400/20" },
  ];

  return (
    <>
      <PageTitle title="Command Center" subtitle="Your AI-native social media backend is now active: accounts, approvals, scheduling, brand voice, and MCP agent access." />
      <div className="grid gap-5 md:grid-cols-4">
        {stats.map(({ label, value, Icon, tint }) => (
          <Panel key={label} className={`bg-gradient-to-br ${tint} to-slate-950`}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-400">{label}</p>
              <div className="rounded-xl border border-white/10 bg-white/[0.05] p-2">
                <Icon className="h-4 w-4 text-retro-cyan" />
              </div>
            </div>
            <p className="mt-5 text-4xl font-semibold tracking-tight text-white">{value}</p>
          </Panel>
        ))}
      </div>
      <Panel className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-white">System Flow</h2>
            <p className="mt-1 text-sm text-slate-400">The production path your AI agents and dashboard share.</p>
          </div>
          <span className="rounded-full bg-retro-cyan/10 px-3 py-1 text-xs font-medium text-retro-cyan">Human approved</span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {["OAuth Mock Connect", "AI Draft", "Human Approval", "Scheduled Queue"].map((step, index) => (
            <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-retro-magenta">0{index + 1}</p>
              <p className="mt-3 text-sm font-medium text-slate-200">{step}</p>
            </div>
          ))}
        </div>
      </Panel>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {[
          {
            title: "Add model keys",
            text: "Connect OpenAI, OpenRouter, or Gemini so AI drafts and strategies use your own provider.",
            href: "/dashboard/model-keys",
            icon: KeyRound,
          },
          {
            title: "Generate strategy",
            text: "Ask for LinkedIn, Facebook, Instagram, or combined analytics strategy from your workspace data.",
            href: "/dashboard/analytics",
            icon: BarChart3,
          },
          {
            title: "Draft with AI",
            text: "Create campaign-ready content and route it through approval before publishing.",
            href: "/dashboard/chat",
            icon: Sparkles,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="group rounded-3xl border border-white/10 bg-slate-950/70 p-6 transition hover:-translate-y-1 hover:border-retro-cyan/50 hover:bg-slate-950">
              <Icon className="h-6 w-6 text-retro-cyan" />
              <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
            </Link>
          );
        })}
      </div>
    </>
  );
}
