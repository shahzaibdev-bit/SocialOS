import { Redis } from "@upstash/redis";

export const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

export async function getCache<T>(key: string): Promise<T | null> {
  if (!redis) {
    return null;
  }

  return redis.get<T>(key);
}

export async function setCache<T>(key: string, value: T, ttlSeconds = 30) {
  if (!redis) {
    return;
  }

  await redis.set(key, value, { ex: ttlSeconds });
}

export async function deleteCache(...keys: string[]) {
  if (!redis || keys.length === 0) {
    return;
  }

  await redis.del(...keys);
}

export function cacheKeysForUser(userId: string) {
  return {
    dashboard: `cache:dashboard:${userId}`,
    posts: `cache:posts:${userId}`,
    approvals: `cache:posts:${userId}:pending_approval`,
    brand: `cache:brand:${userId}`,
  };
}

export async function invalidateUserCache(userId: string) {
  const keys = cacheKeysForUser(userId);
  await deleteCache(keys.dashboard, keys.posts, keys.approvals, keys.brand);
}

export async function hitRateLimit(key: string, limit = 60, windowSeconds = 60) {
  if (!redis) {
    return { limited: false, remaining: limit };
  }

  const redisKey = `rate:${key}`;
  const count = await redis.incr(redisKey);

  if (count === 1) {
    await redis.expire(redisKey, windowSeconds);
  }

  return {
    limited: count > limit,
    remaining: Math.max(0, limit - count),
  };
}
