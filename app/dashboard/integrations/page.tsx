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
      <PageTitle title="Integrations" subtitle="Connect LinkedIn, Facebook, and Instagram through real OAuth. X is visible for roadmap tracking but remains disabled while its API tier is paid." />
      <IntegrationsClient accounts={data.accounts} oauthConfigured={oauthConfigured} />
    </>
  );
}
