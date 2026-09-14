import { PageTitle, Panel } from "@/components/Panel";
import { getCurrentUser } from "@/lib/backend/auth";
import { listAiApiKeys, listDashboardData } from "@/lib/backend/services";
import { AnalyticsClient } from "./AnalyticsClient";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const user = await getCurrentUser();
  const [data, keys] = user ? await Promise.all([listDashboardData(user.id), listAiApiKeys(user.id)]) : [null, []];

  return (
    <>
      <PageTitle
        title="Analytics & Strategy"
        subtitle="Ask for platform-specific or combined performance insights. Social API metrics will plug in here; current strategy uses your workspace posts and AI provider keys."
      />
      <div className="grid gap-5 md:grid-cols-4">
        {[
          ["Connected", data?.stats.connectedAccounts ?? 0],
          ["Pending", data?.stats.pendingApprovals ?? 0],
          ["Scheduled", data?.stats.scheduledPosts ?? 0],
          ["Published", data?.stats.publishedPosts ?? 0],
        ].map(([label, value]) => (
          <Panel key={String(label)}>
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
          </Panel>
        ))}
      </div>
      <AnalyticsClient keys={keys} />
    </>
  );
}
