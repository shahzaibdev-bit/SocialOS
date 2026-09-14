import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/backend/auth";
import { getLinkedInLatestAnalytics } from "@/lib/backend/linkedin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
    }

    const data = await getLinkedInLatestAnalytics(user.id);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Could not load LinkedIn analytics." },
      { status: 500 },
    );
  }
}
