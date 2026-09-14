import { handleApiError, ok, requireApiUser } from "@/lib/backend/api";
import { updatePostStatus } from "@/lib/backend/services";
import type { PostStatus } from "@/lib/backend/types";

export const runtime = "nodejs";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireApiUser();
    const { id } = await params;
    const body = await request.json();
    const post = await updatePostStatus(user.id, id, String(body.status ?? "draft") as PostStatus);
    return ok({ post });
  } catch (error) {
    return handleApiError(error);
  }
}
