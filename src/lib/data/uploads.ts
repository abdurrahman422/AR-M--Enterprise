import "server-only";

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { isFilled, publicEnv, serverEnv } from "@/config/env";
import { isCatalogWritable } from "@/lib/data/catalog-store";
import { createId } from "@/lib/data/helpers";
import { createSupabaseServerClient } from "@/lib/db/supabase";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

const MAX_BYTES = 8 * 1024 * 1024;

export type UploadResult =
  | { ok: true; url: string; fileName: string }
  | { ok: false; message: string };

export async function savePublicUpload(
  file: File,
  folder: "products" | "documents" | "identify" | "projects",
): Promise<UploadResult> {
  if (!isCatalogWritable()) {
    return {
      ok: false,
      message: "File storage is not available on this host. Use a URL, or connect Supabase storage.",
    };
  }

  if (file.size === 0) {
    return { ok: false, message: "The selected file is empty." };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, message: "Files must be 8MB or smaller." };
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return { ok: false, message: "Use JPG, PNG, WebP, or PDF." };
  }

  const fileName = `${createId()}.${extension}`;

  if (serverEnv.dataDriver === "neon" || serverEnv.dataDriver === "supabase") {
    if (!isFilled(publicEnv.supabaseUrl) || !isFilled(serverEnv.supabaseServiceRoleKey)) {
      return { ok: false, message: "Supabase storage is not configured for server uploads." };
    }
    const storagePath = `${folder}/${fileName}`;
    const client = createSupabaseServerClient();
    const { error } = await client.storage.from("media").upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });
    if (error) return { ok: false, message: "The file could not be stored." };
    const { data } = client.storage.from("media").getPublicUrl(storagePath);
    return { ok: true, url: data.publicUrl, fileName: file.name };
  }

  const relativeDir = path.join("public", "media", folder);
  const absoluteDir = path.join(process.cwd(), relativeDir);

  try {
    mkdirSync(absoluteDir, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    writeFileSync(path.join(absoluteDir, fileName), bytes);
    return { ok: true, url: `/media/${folder}/${fileName}`, fileName: file.name };
  } catch {
    return { ok: false, message: "The file could not be stored." };
  }
}
