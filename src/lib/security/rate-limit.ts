import "server-only";

import { createHash } from "node:crypto";
import { headers } from "next/headers";

type Bucket = {
  count: number;
  resetAt: number;
};

type RateLimitStore = Map<string, Bucket>;

const globalForRateLimit = globalThis as typeof globalThis & {
  __armRateLimitStore?: RateLimitStore;
};

const store = globalForRateLimit.__armRateLimitStore ?? new Map<string, Bucket>();
globalForRateLimit.__armRateLimitStore = store;

function digest(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

async function requestIdentity(): Promise<string> {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    requestHeaders.get("cf-connecting-ip") ??
    requestHeaders.get("x-real-ip") ??
    forwarded ??
    "unknown"
  );
}

function pruneExpired(now: number): void {
  if (store.size < 500) return;
  for (const [key, bucket] of store) {
    if (bucket.resetAt <= now) store.delete(key);
  }
}

export type RateLimitResult =
  | { allowed: true; key: string }
  | { allowed: false; key: string; retryAfterSeconds: number };

export async function checkRateLimit({
  scope,
  limit,
  windowMs,
  discriminator = "",
}: {
  scope: string;
  limit: number;
  windowMs: number;
  discriminator?: string;
}): Promise<RateLimitResult> {
  const now = Date.now();
  pruneExpired(now);

  const identity = await requestIdentity();
  const key = `${scope}:${digest(`${identity}:${discriminator.toLowerCase()}`)}`;
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, key };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      key,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return { allowed: true, key };
}

export function clearRateLimit(key: string): void {
  store.delete(key);
}
