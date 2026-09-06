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
import { checkRateLimit, clearRateLimit } from "@/lib/security/rate-limit";

export type LoginState = ActionState;

export async function loginAdmin(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAdminAuthConfigured()) {
    return {
      status: "unconfigured",
      message: "Administrator access is not configured on this environment.",
    };
  }

  const submittedEmail = stringField(formData, "email");
  const rateLimit = await checkRateLimit({
    scope: "admin-login",
    limit: 5,
    windowMs: 15 * 60 * 1000,
    discriminator: submittedEmail,
  });
  if (!rateLimit.allowed) {
    const minutes = Math.max(1, Math.ceil(rateLimit.retryAfterSeconds / 60));
    return {
      status: "error",
      message: `Too many sign-in attempts. Try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`,
    };
  }

  const parsed = adminLoginSchema.safeParse({
    email: submittedEmail,
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
  clearRateLimit(rateLimit.key);
  await setAdminSessionCookie(token);
  redirect("/admin");
}

export async function logoutAdmin(): Promise<void> {
  await clearAdminSessionCookie();
  redirect("/admin/login");
}

