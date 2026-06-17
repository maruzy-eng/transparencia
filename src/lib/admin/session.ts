import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";

import {
  ADMIN_SESSION_COOKIE,
  JWT_CLOCK_TOLERANCE,
  SESSION_MAX_AGE_SECONDS,
  getClearSessionCookieOptions,
  getSessionCookieOptions,
} from "@/lib/admin/cookie-options";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminAuthSecret, getAdminEnvErrorMessage } from "@/lib/env/server";
import type {
  AdminSessionPayload,
  AdminUser,
  AdminUserRecord,
} from "@/lib/admin/types";

export { ADMIN_SESSION_COOKIE, SESSION_MAX_AGE_SECONDS };

export type AdminUserLookupResult =
  | { admin: AdminUser; error: null }
  | { admin: null; error: null }
  | { admin: null; error: string };

function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(getAdminAuthSecret());
}

function adminFromSessionPayload(payload: AdminSessionPayload): AdminUser {
  return {
    id: payload.sub,
    name: payload.name,
    email: payload.email,
    role: payload.role,
    status: "active",
    last_login_at: null,
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
  };
}

export async function createSessionToken(
  admin: Pick<AdminUser, "id" | "email" | "name" | "role">,
): Promise<string> {
  return new SignJWT({
    email: admin.email,
    name: admin.name,
    role: admin.role,
  } satisfies Omit<AdminSessionPayload, "sub">)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(admin.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string,
): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
      clockTolerance: JWT_CLOCK_TOLERANCE,
    });

    const sub = payload.sub;
    const email = payload.email;
    const name = payload.name;
    const role = payload.role;

    if (
      typeof sub !== "string" ||
      typeof email !== "string" ||
      typeof name !== "string" ||
      (role !== "admin" && role !== "editor")
    ) {
      return null;
    }

    return {
      sub,
      email,
      name,
      role,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, getSessionCookieOptions());
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "", getClearSessionCookieOptions());
}

export async function getSessionTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const fromStore = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (fromStore) {
    return fromStore;
  }

  const headersList = await headers();
  return getSessionTokenFromCookieHeader(headersList.get("cookie"));
}

export function getSessionTokenFromCookieHeader(
  cookieHeader: string | null,
): string | null {
  if (!cookieHeader) {
    return null;
  }

  for (const part of cookieHeader.split(";")) {
    const [rawName, ...rawValue] = part.trim().split("=");
    if (rawName === ADMIN_SESSION_COOKIE && rawValue.length > 0) {
      return decodeURIComponent(rawValue.join("="));
    }
  }

  return null;
}

export async function getCurrentAdminFromToken(
  token: string,
): Promise<AdminUser | null> {
  if (getAdminEnvErrorMessage()) {
    return null;
  }

  const payload = await verifySessionToken(token);
  if (!payload) {
    return null;
  }

  const lookup = await lookupAdminUserById(payload.sub);

  if (lookup.admin) {
    if (lookup.admin.status !== "active") {
      return null;
    }

    return lookup.admin;
  }

  if (lookup.error) {
    return adminFromSessionPayload(payload);
  }

  return null;
}

export async function refreshSessionCookie(): Promise<void> {
  const token = await getSessionTokenFromCookie();
  if (!token) {
    return;
  }

  const rotated = await rotateSessionToken(token);
  if (rotated) {
    await setSessionCookie(rotated);
    return;
  }

  const payload = await verifySessionToken(token);
  if (!payload) {
    return;
  }

  await setSessionCookie(token);
}

export async function rotateSessionToken(token: string): Promise<string | null> {
  if (getAdminEnvErrorMessage()) {
    return null;
  }

  const payload = await verifySessionToken(token);
  if (!payload) {
    return null;
  }

  return createSessionToken({
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  });
}

export async function lookupAdminUserById(
  id: string,
): Promise<AdminUserLookupResult> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("admin_users")
    .select(
      "id, name, email, role, status, last_login_at, created_at, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return { admin: null, error: error.message };
  }

  if (!data) {
    return { admin: null, error: null };
  }

  return { admin: data as AdminUser, error: null };
}

export async function getAdminUserById(id: string): Promise<AdminUser | null> {
  const result = await lookupAdminUserById(id);
  return result.admin;
}

export async function getAdminUserByEmail(
  email: string,
): Promise<AdminUserRecord | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as AdminUserRecord;
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const token = await getSessionTokenFromCookie();
  if (!token) {
    return null;
  }

  return getCurrentAdminFromToken(token);
}

export async function updateLastLoginAt(adminId: string): Promise<void> {
  const supabase = createAdminClient();

  await supabase
    .from("admin_users")
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", adminId);
}
