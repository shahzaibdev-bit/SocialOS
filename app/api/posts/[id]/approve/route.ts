import { handleApiError, ok, requireApiUser } from "@/lib/backend/api";
import { approvePost } from "@/lib/backend/services";

export const runtime = "nodejs";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireApiUser();
    const { id } = await params;
    const post = await approvePost(user.id, id);
    return ok({ post });
  } catch (error) {
    return handleApiError(error);
  }
}
