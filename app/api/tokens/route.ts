import { handleApiError, ok, requireApiUser } from "@/lib/backend/api";
import { createMcpToken } from "@/lib/backend/services";
import { readDb } from "@/lib/backend/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireApiUser();
    const db = await readDb();
    const fullUser = db.users.find((candidate) => candidate.id === user.id);
    const tokens = fullUser?.mcpApiTokens.map(({ tokenHash: _tokenHash, ...token }) => token) ?? [];
    return ok({ tokens });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireApiUser();
    const body = await request.json();
    const token = await createMcpToken(user.id, String(body.name ?? "Claude Desktop"));
    return ok({ token });
  } catch (error) {
    return handleApiError(error);
  }
}
