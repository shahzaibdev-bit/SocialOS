import { ok } from "@/lib/backend/api";
import { getDatabaseRuntimeInfo, readDb } from "@/lib/backend/db";
import { redis } from "@/lib/backend/redis";

export const runtime = "nodejs";

export async function GET() {
  let database = "mongodb";
  let databaseReachable = true;

  try {
    await readDb();
    const info = getDatabaseRuntimeInfo();
    if (info.usingFallback) {
      database = "local-fallback";
    }
  } catch {
    databaseReachable = false;
  }

  return ok({
    status: databaseReachable ? "ok" : "degraded",
    database,
    redisConfigured: Boolean(redis),
  });
}
