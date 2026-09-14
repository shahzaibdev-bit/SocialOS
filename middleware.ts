import { NextResponse, type NextRequest } from "next/server";
import { Redis } from "@upstash/redis/cloudflare";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

function getClientKey(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "local";
  return `${ip}:${request.nextUrl.pathname}`;
}

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (!redis) {
    return NextResponse.next();
  }

  const windowSeconds = 60;
  const limit = request.nextUrl.pathname.startsWith("/api/auth") ? 20 : 80;
  const key = `rate:${getClientKey(request)}`;
  let count: number;

  try {
    count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, windowSeconds);
    }
  } catch {
    return NextResponse.next();
  }

  if (count > limit) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please slow down and try again shortly." },
      {
        status: 429,
        headers: {
          "Retry-After": String(windowSeconds),
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", String(limit));
  response.headers.set("X-RateLimit-Remaining", String(Math.max(0, limit - count)));
  return response;
}

export const config = {
  matcher: "/api/:path*",
};
