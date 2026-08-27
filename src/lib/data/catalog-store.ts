import "server-only";

import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { catalog } from "@/content/catalog";
import { isEphemeralHost } from "@/lib/data/helpers";
import { catalogSchema } from "@/lib/validations/content";
import type { Catalog } from "@/types/content";

const DATA_FILE = path.join(process.cwd(), ".data", "catalog.json");

function seedCatalog(): Catalog {
  return catalogSchema.parse(catalog);
}

export function isCatalogWritable(): boolean {
  return !isEphemeralHost();
}

function mergeMissingById<T extends { id: string }>(current: T[], extras: T[]): T[] {
  const ids = new Set(current.map((item) => item.id));
  return [...current, ...extras.filter((item) => !ids.has(item.id))];
}

function withSeedFallbacks(loaded: Catalog, seed: Catalog): Catalog {
  return {
    ...loaded,
    categories: loaded.categories.length > 0 ? loaded.categories : seed.categories,
    services: mergeMissingById(loaded.services.length > 0 ? loaded.services : seed.services, seed.services),
    solutions: mergeMissingById(loaded.solutions.length > 0 ? loaded.solutions : seed.solutions, seed.solutions),
    projects: loaded.projects,
    resources: loaded.resources ?? seed.resources,
    testimonials: loaded.testimonials ?? seed.testimonials,
    team: loaded.team ?? seed.team,
    inquiries: loaded.inquiries ?? [],
    settings: { ...seed.settings, ...(loaded.settings ?? {}) },
  };
}

export function loadCatalog(): Catalog {
  const seed = seedCatalog();

  if (isCatalogWritable() && existsSync(DATA_FILE)) {
    try {
      return catalogSchema.parse(withSeedFallbacks(JSON.parse(readFileSync(DATA_FILE, "utf8")) as Catalog, seed));
    } catch {
      return seed;
    }
  }

  return seed;
}

export function saveCatalog(next: Catalog): boolean {
  if (!isCatalogWritable()) return false;

  try {
    mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    writeFileSync(DATA_FILE, `${JSON.stringify(catalogSchema.parse(next), null, 2)}\n`, "utf8");
    return true;
  } catch {
    return false;
  }
}
