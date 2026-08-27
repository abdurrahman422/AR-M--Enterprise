import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { publicEnv, serverEnv, isFilled } from "@/config/env";

export function isSupabaseConfigured(): boolean {
  return isFilled(publicEnv.supabaseUrl) && isFilled(publicEnv.supabaseAnonKey);
}

export function isSupabaseWritable(): boolean {
  return isSupabaseConfigured() && isFilled(serverEnv.supabaseServiceRoleKey);
}

export function createSupabaseServerClient(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase environment variables are not configured.");
  }

  const key = isFilled(serverEnv.supabaseServiceRoleKey)
    ? serverEnv.supabaseServiceRoleKey
    : publicEnv.supabaseAnonKey;

  return createClient(publicEnv.supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
