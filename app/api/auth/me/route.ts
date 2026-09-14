import { getCurrentUser } from "@/lib/backend/auth";
import { ok } from "@/lib/backend/api";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  return ok({ user });
}
