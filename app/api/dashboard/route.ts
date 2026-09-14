import { handleApiError, ok, requireApiUser } from "@/lib/backend/api";
import { listDashboardData } from "@/lib/backend/services";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireApiUser();
    return ok(await listDashboardData(user.id));
  } catch (error) {
    return handleApiError(error);
  }
}
