import { handleApiError, ok, requireApiUser } from "@/lib/backend/api";
import { generateDraftFromPrompt } from "@/lib/backend/services";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await requireApiUser();
    const body = await request.json();
    const post = await generateDraftFromPrompt(user.id, String(body.prompt ?? ""));

    return ok({
      message: "Draft created and queued for human approval.",
      post,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
