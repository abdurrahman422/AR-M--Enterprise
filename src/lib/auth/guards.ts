import "server-only";

import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/session";
import type { AdminSession } from "@/types/auth";

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}
