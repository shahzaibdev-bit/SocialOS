import { handleApiError, ok, requireApiUser } from "@/lib/backend/api";
import { deleteAiApiKey } from "@/lib/backend/services";

export const runtime = "nodejs";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireApiUser();
    const { id } = await params;
    await deleteAiApiKey(user.id, id);
    return ok({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
