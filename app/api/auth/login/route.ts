import { createSession, logInUser } from "@/lib/backend/auth";
import { handleApiError, ok } from "@/lib/backend/api";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await logInUser({
      email: String(body.email ?? ""),
      password: String(body.password ?? ""),
    });

    await createSession(user.id);
    return ok({ user });
  } catch (error) {
    return handleApiError(error);
  }
}
