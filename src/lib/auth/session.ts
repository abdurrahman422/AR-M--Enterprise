import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { isFilled, serverEnv } from "@/config/env";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/constants";
import { AuthNotConfiguredError } from "@/lib/errors";
import type { AdminSession } from "@/types/auth";

function getSecretKey(): Uint8Array {
  if (!isFilled(serverEnv.authSecret) || serverEnv.authSecret.length < 32) {
    throw new AuthNotConfiguredError();
  }

  return new TextEncoder().encode(serverEnv.authSecret);
}

export function isAdminAuthConfigured(): boolean {
  return (
    isFilled(serverEnv.authSecret) &&
    serverEnv.authSecret.length >= 32 &&
    isFilled(serverEnv.adminEmail) &&
    isFilled(serverEnv.adminPassword)
  );
}

export async function createAdminSession(email: string): Promise<string> {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + SESSION_MAX_AGE_SECONDS;

  return new SignJWT({ email, role: "admin", issuedAt, expiresAt })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email)
    .setIssuedAt(issuedAt)
    .setExpirationTime(expiresAt)
    .sign(getSecretKey());
}

export async function readAdminSession(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const email = typeof payload.email === "string" ? payload.email : "";
    const role = payload.role === "admin" ? "admin" : null;
    const issuedAt = typeof payload.issuedAt === "number" ? payload.issuedAt : 0;
    const expiresAt = typeof payload.expiresAt === "number" ? payload.expiresAt : 0;

    if (!email || !role) return null;

    return { email, role, issuedAt, expiresAt };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return readAdminSession(token);
}

export async function setAdminSessionCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}


