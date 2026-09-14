import { handleApiError, ok, requireApiUser } from "@/lib/backend/api";
import { createPost, listPosts } from "@/lib/backend/services";
import type { Platform, PostStatus } from "@/lib/backend/types";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const user = await requireApiUser();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as PostStatus | null;
    const posts = await listPosts(user.id, status ?? undefined);
    return ok({ posts });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireApiUser();
    const body = await request.json();
    const post = await createPost(user.id, {
      content: String(body.content ?? ""),
      targetPlatforms: Array.isArray(body.targetPlatforms) ? (body.targetPlatforms as Platform[]) : [],
      status: (body.status as PostStatus | undefined) ?? "pending_approval",
      scheduledFor: body.scheduledFor ? String(body.scheduledFor) : null,
      timezone: String(body.timezone ?? "Asia/Karachi"),
      mediaUrls: Array.isArray(body.mediaUrls) ? body.mediaUrls.map(String) : [],
    });

    return ok({ post });
  } catch (error) {
    return handleApiError(error);
  }
}
