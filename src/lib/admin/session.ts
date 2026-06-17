import "server-only";

import { SignJWT, jwtVerify } from "jose";

import {
  ADMIN_SESSION_COOKIE,
  JWT_CLOCK_TOLERANCE,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/admin/cookie-options";
import {
  clearSessionCookie,
  getSessionTokenFromCookie,
  getSessionTokenFromCookieHeader,
  setSessionCookie,
} from "@/lib/admin/session-cookie-store";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getAdminAuthSecret,
  getAdminEnvErrorMessage,
  getMissingAdminEnvVars,
} from "@/lib/env/server";
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

export type AdminSessionResolution =
  | { kind: "authenticated"; admin: AdminUser }
  | { kind: "no_session" }
  | {
      kind: "invalid_session";
      reason: "invalid_jwt" | "inactive_user" | "deleted_user";
    }
  | { kind: "env_error"; message: string }
  | { kind: "db_unavailable"; message: string };

function logAdminAuth(
  event: string,
  detail: Record<string, string | boolean | undefined> = {},
): void {
  console.info("[admin-auth]", { event, ...detail });
}

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

export {
  clearSessionCookie,
  getSessionTokenFromCookie,
  getSessionTokenFromCookieHeader,
  setSessionCookie,
};

const DB_UNAVAILABLE_MESSAGE =
  "Serviço temporariamente indisponível. Tente novamente em instantes.";

export async function resolveAdminSessionFromToken(
  token: string | null | undefined,
): Promise<AdminSessionResolution> {
  const trimmed = token?.trim();
  if (!trimmed) {
    logAdminAuth("missing_cookie");
    return { kind: "no_session" };
  }

  const envError = getAdminEnvErrorMessage();
  if (envError) {
    console.error("[admin-auth]", {
      event: "service_role_missing",
      missing: getMissingAdminEnvVars().join(","),
    });
    return { kind: "env_error", message: envError };
  }

  const payload = await verifySessionToken(trimmed);
  if (!payload) {
    logAdminAuth("jwt_invalid");
    return { kind: "invalid_session", reason: "invalid_jwt" };
  }

  try {
    const lookup = await lookupAdminUserById(payload.sub);
    if (lookup.admin) {
      if (lookup.admin.status !== "active") {
        logAdminAuth("user_inactive", { userId: payload.sub });
        return { kind: "invalid_session", reason: "inactive_user" };
      }
      logAdminAuth("session_valid", { userId: payload.sub, source: "db" });
      return { kind: "authenticated", admin: lookup.admin };
    }

    if (!lookup.error) {
      logAdminAuth("user_not_found", { userId: payload.sub });
      return { kind: "invalid_session", reason: "deleted_user" };
    }

    logAdminAuth("db_unavailable", {
      userId: payload.sub,
      dbError: true,
    });
    return { kind: "db_unavailable", message: DB_UNAVAILABLE_MESSAGE };
  } catch {
    logAdminAuth("db_unavailable", {
      userId: payload.sub,
      dbException: true,
    });
    return { kind: "db_unavailable", message: DB_UNAVAILABLE_MESSAGE };
  }
}

export async function resolveAdminSession(): Promise<AdminSessionResolution> {
  const token = await getSessionTokenFromCookie();
  return resolveAdminSessionFromToken(token);
}

export async function getCurrentAdminFromToken(
  token: string,
): Promise<AdminUser | null> {
  const session = await resolveAdminSessionFromToken(token);
  return session.kind === "authenticated" ? session.admin : null;
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
  const session = await resolveAdminSession();
  return session.kind === "authenticated" ? session.admin : null;
}

export async function updateLastLoginAt(adminId: string): Promise<void> {
  const supabase = createAdminClient();

  await supabase
    .from("admin_users")
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", adminId);
}
