import { requireApiUser } from "@/lib/backend/api";
import { createOAuthStartResponse } from "@/lib/backend/oauth";
import type { Platform } from "@/lib/backend/types";

export const runtime = "nodejs";

function assertOAuthPlatform(platform: string): asserts platform is Extract<Platform, "linkedin" | "facebook" | "instagram"> {
  if (!["linkedin", "facebook", "instagram"].includes(platform)) {
    throw new Error("OAuth is not enabled for this platform.");
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ platform: string }> }) {
  await requireApiUser();
  const { platform } = await params;
  assertOAuthPlatform(platform);
  return createOAuthStartResponse(request, platform);
}
