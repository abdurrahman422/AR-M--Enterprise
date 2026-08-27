import "server-only";

import { cache } from "react";
import { isFilled, publicEnv } from "@/config/env";
import { data } from "@/lib/data";
import { emptySettings, type SiteSettings } from "@/types/settings";

function pick(stored: string, envValue: string): string {
  return isFilled(stored) ? stored : envValue;
}

export const getResolvedSettings = cache(async (): Promise<SiteSettings> => {
  let stored = emptySettings();
  try {
    stored = await data.settings.get();
  } catch {
    stored = emptySettings();
  }

  return {
    contactEmail: pick(stored.contactEmail, publicEnv.contactEmail),
    contactPhone: pick(stored.contactPhone, publicEnv.contactPhone),
    whatsapp: pick(stored.whatsapp, publicEnv.whatsapp),
    address: pick(stored.address, publicEnv.address),
    linkedin: pick(stored.linkedin, publicEnv.linkedin),
    facebook: pick(stored.facebook, publicEnv.facebook),
    instagram: pick(stored.instagram, publicEnv.instagram),
    youtube: pick(stored.youtube, publicEnv.youtube),
    x: pick(stored.x, publicEnv.x),
    seoTitle: stored.seoTitle,
    seoDescription: stored.seoDescription,
    notifyEmail: stored.notifyEmail,
    notifyEnabled: stored.notifyEnabled,
  };
});
