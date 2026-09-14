import { clearSession } from "@/lib/backend/auth";
import { ok } from "@/lib/backend/api";

export const runtime = "nodejs";

export async function POST() {
  await clearSession();
  return ok({ loggedOut: true });
}
