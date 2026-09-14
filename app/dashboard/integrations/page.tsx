import { getCurrentUser } from "@/lib/backend/auth";
import { listDashboardData } from "@/lib/backend/services";
import { PageTitle } from "@/components/Panel";
import { IntegrationsClient } from "./IntegrationsClient";

export const dynamic = "force-dynamic";

export default async function IntegrationsPage() {
  const user = await getCurrentUser();
  const data = user ? await listDashboardData(user.id) : { accounts: [] };
  const oauthConfigured = {
    x: false,
    linkedin: Boolean(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET),
    instagram: Boolean(process.env.META_APP_ID && process.env.META_APP_SECRET),
    facebook: Boolean(process.env.META_APP_ID && process.env.META_APP_SECRET),
  };

  return (
    <>
      <PageTitle title="Integrations" subtitle="Connect X, LinkedIn, Instagram, and Facebook. This build can run demo connectors now; real OAuth requires platform developer app credentials." />
      <IntegrationsClient accounts={data.accounts} oauthConfigured={oauthConfigured} />
    </>
  );
}
