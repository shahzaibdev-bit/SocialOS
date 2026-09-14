import { handleApiError, ok, requireApiUser } from "@/lib/backend/api";
import { getBrandProfile, updateBrandProfile } from "@/lib/backend/services";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireApiUser();
    const brand = await getBrandProfile(user.id);
    return ok({ brand });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireApiUser();
    const body = await request.json();
    const brand = await updateBrandProfile(user.id, {
      voice: String(body.voice ?? ""),
      bannedWords: Array.isArray(body.bannedWords) ? body.bannedWords.map(String) : [],
      approvalMode: body.approvalMode === "auto_schedule" ? "auto_schedule" : "draft_only",
    });

    return ok({ brand });
  } catch (error) {
    return handleApiError(error);
  }
}
