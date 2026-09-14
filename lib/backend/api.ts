import { NextResponse } from "next/server";
import { getCurrentUser } from "./auth";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function requireApiUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("AUTH_REQUIRED");
  }

  return user;
}

export function handleApiError(error: unknown) {
  if (error instanceof Error && error.message === "AUTH_REQUIRED") {
    return fail("Please log in first.", 401);
  }

  if (
    error instanceof Error &&
    (/querySrv|ECONNREFUSED|ENOTFOUND|ETIMEOUT|server selection|MONGODB_URI/i.test(error.message) ||
      ("code" in error && ["ECONNREFUSED", "ENOTFOUND", "ETIMEOUT"].includes(String(error.code))))
  ) {
    return fail("Database is not reachable. Please check the MongoDB Atlas environment variables in Vercel.", 503);
  }

  return fail(error instanceof Error ? error.message : "Something went wrong.");
}
