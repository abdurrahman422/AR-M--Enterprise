import type { ListOptions } from "@/types/data-provider";

type Publishable = {
  published: boolean;
  featured?: boolean;
};

type SlugEntity = {
  slug: string;
  published: boolean;
};

export function applyListOptions<T extends Publishable>(
  items: T[],
  options?: ListOptions,
): T[] {
  return items.filter((item) => {
    if (!options?.includeUnpublished && !item.published) return false;
    if (options?.featuredOnly && !item.featured) return false;
    return true;
  });
}

export function findBySlug<T extends SlugEntity>(
  items: T[],
  slug: string,
  options?: ListOptions,
): T | null {
  const item = items.find((entry) => entry.slug === slug) ?? null;
  if (!item) return null;
  if (!options?.includeUnpublished && !item.published) return null;
  return item;
}

export function findById<T extends { id: string; published: boolean }>(
  items: T[],
  id: string,
  options?: ListOptions,
): T | null {
  const item = items.find((entry) => entry.id === id) ?? null;
  if (!item) return null;
  if (!options?.includeUnpublished && !item.published) return null;
  return item;
}

export function isEphemeralHost(): boolean {
  return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function createId(): string {
  return crypto.randomUUID();
}

export function notConfiguredResult(entity: string) {
  return {
    ok: false as const,
    code: "NOT_CONFIGURED" as const,
    message: `${entity} cannot be stored until PostgreSQL is connected.`,
  };
}
