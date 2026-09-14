import { getCurrentUser } from "@/lib/backend/auth";
import { completeOAuthCallback } from "@/lib/backend/oauth";
import type { Platform } from "@/lib/backend/types";
import { redirect } from "next/navigation";

export const runtime = "nodejs";

function assertOAuthPlatform(platform: string): asserts platform is Extract<Platform, "linkedin" | "facebook" | "instagram"> {
  if (!["linkedin", "facebook", "instagram"].includes(platform)) {
    throw new Error("OAuth is not enabled for this platform.");
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ platform: string }> }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/dashboard/integrations");
  }

  const { platform } = await params;
  assertOAuthPlatform(platform);
  return completeOAuthCallback(request, platform, user.id);
}
