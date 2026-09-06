import "server-only";

import { serverEnv } from "@/config/env";
import { catalogProvider } from "@/lib/data/catalog-provider";
import { neonProvider } from "@/lib/data/neon-provider";
import { isNeonConfigured } from "@/lib/db/neon";
import type { DataProvider } from "@/types/data-provider";

export function getDataProvider(): DataProvider {
  if (serverEnv.dataDriver === "neon" && isNeonConfigured()) {
    return neonProvider;
  }

  return catalogProvider;
}

export const data = {
  get categories() {
    return getDataProvider().categories;
  },
  get products() {
    return getDataProvider().products;
  },
  get services() {
    return getDataProvider().services;
  },
  get solutions() {
    return getDataProvider().solutions;
  },
  get projects() {
    return getDataProvider().projects;
  },
  get resources() {
    return getDataProvider().resources;
  },
  get testimonials() {
    return getDataProvider().testimonials;
  },
  get team() {
    return getDataProvider().team;
  },
  get inquiries() {
    return getDataProvider().inquiries;
  },
  get settings() {
    return getDataProvider().settings;
  },
};
