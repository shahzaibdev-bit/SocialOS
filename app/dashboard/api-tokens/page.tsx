import { PageTitle } from "@/components/Panel";
import { getCurrentUser } from "@/lib/backend/auth";
import { readDb } from "@/lib/backend/db";
import { TokenManager } from "./TokenManager";

export const dynamic = "force-dynamic";

export default async function ApiTokensPage() {
  const user = await getCurrentUser();
  const db = await readDb();
  const tokens =
    db.users
      .find((candidate) => candidate.id === user?.id)
      ?.mcpApiTokens.map(({ tokenHash: _tokenHash, ...token }) => token) ?? [];

  return (
    <>
      <PageTitle title="MCP Tokens" subtitle="Create personal API tokens for remote AI agents. Use them as Bearer tokens with /api/mcp." />
      <TokenManager tokens={tokens} />
    </>
  );
}
