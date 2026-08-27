"use server";

import { redirect } from "next/navigation";
import { serverEnv } from "@/config/env";
import { passwordsMatch } from "@/lib/auth/password";
import {
  clearAdminSessionCookie,
  createAdminSession,
  isAdminAuthConfigured,
  setAdminSessionCookie,
} from "@/lib/auth/session";
import { stringField, type ActionState } from "@/lib/forms";
import { flattenFieldErrors } from "@/lib/validations/common";
import { adminLoginSchema } from "@/lib/validations/auth";

export type LoginState = ActionState;

export async function loginAdmin(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAdminAuthConfigured()) {
    return {
      status: "unconfigured",
      message: "Administrator access is not configured on this environment.",
    };
  }

  const parsed = adminLoginSchema.safeParse({
    email: stringField(formData, "email"),
    password: stringField(formData, "password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: flattenFieldErrors(parsed.error),
    };
  }

  const emailMatches = parsed.data.email.toLowerCase() === serverEnv.adminEmail.toLowerCase();
  const passwordMatches = passwordsMatch(parsed.data.password, serverEnv.adminPassword);

  if (!emailMatches || !passwordMatches) {
    return {
      status: "error",
      message: "Invalid credentials.",
    };
  }

  const token = await createAdminSession(parsed.data.email);
  await setAdminSessionCookie(token);
  redirect("/admin");
}

export async function logoutAdmin(): Promise<void> {
  await clearAdminSessionCookie();
  redirect("/admin/login");
}


