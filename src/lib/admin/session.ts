import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

import {
  ADMIN_SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/admin/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminAuthSecret, getAdminEnvErrorMessage, isProduction } from "@/lib/env/server";
import type {
  AdminSessionPayload,
  AdminUser,
  AdminUserRecord,
} from "@/lib/admin/types";

export { ADMIN_SESSION_COOKIE, SESSION_MAX_AGE_SECONDS };

function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(getAdminAuthSecret());
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

  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction(),
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction(),
    maxAge: 0,
    path: "/",
  });
}

export async function getSessionTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_SESSION_COOKIE)?.value ?? null;
}

export async function getAdminUserById(id: string): Promise<AdminUser | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("admin_users")
    .select(
      "id, name, email, role, status, last_login_at, created_at, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as AdminUser;
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
  if (getAdminEnvErrorMessage()) {
    return null;
  }

  const token = await getSessionTokenFromCookie();
  if (!token) {
    return null;
  }

  const payload = await verifySessionToken(token);
  if (!payload) {
    return null;
  }

  const admin = await getAdminUserById(payload.sub);
  if (!admin || admin.status !== "active") {
    return null;
  }

  return admin;
}

export async function updateLastLoginAt(adminId: string): Promise<void> {
  const supabase = createAdminClient();

  await supabase
    .from("admin_users")
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", adminId);
}
