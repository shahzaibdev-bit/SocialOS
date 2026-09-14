import { handleApiError, ok, requireApiUser } from "@/lib/backend/api";
import { generateAnalyticsStrategy } from "@/lib/backend/services";
import type { AiProvider } from "@/lib/backend/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await requireApiUser();
    const body = await request.json();
    const result = await generateAnalyticsStrategy(
      user.id,
      String(body.prompt ?? ""),
      body.provider ? (String(body.provider) as AiProvider) : undefined,
    );

    return ok(result);
  } catch (error) {
    return handleApiError(error);
  }
}
