import { handleApiError, ok, requireApiUser } from "@/lib/backend/api";
import { listAiApiKeys, saveAiApiKey } from "@/lib/backend/services";
import type { AiProvider } from "@/lib/backend/types";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireApiUser();
    const keys = await listAiApiKeys(user.id);
    return ok({ keys });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireApiUser();
    const body = await request.json();
    const key = await saveAiApiKey(user.id, {
      provider: String(body.provider ?? "") as AiProvider,
      label: String(body.label ?? ""),
      apiKey: String(body.apiKey ?? ""),
      defaultModel: String(body.defaultModel ?? ""),
      isDefault: Boolean(body.isDefault),
    });

    return ok({ key });
  } catch (error) {
    return handleApiError(error);
  }
}
