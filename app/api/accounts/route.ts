import { handleApiError, ok, requireApiUser } from "@/lib/backend/api";
import { connectMockAccount, listDashboardData } from "@/lib/backend/services";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireApiUser();
    const data = await listDashboardData(user.id);
    return ok({ accounts: data.accounts });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireApiUser();
    const body = await request.json();
    const account = await connectMockAccount(user.id, String(body.platform ?? ""));
    return ok({ account });
  } catch (error) {
    return handleApiError(error);
  }
}
