import "server-only";

import { cookies, headers } from "next/headers";

import {
  ADMIN_SESSION_COOKIE,
  getClearSessionCookieOptions,
  getSessionCookieOptions,
} from "@/lib/admin/cookie-options";

const ALLOWED_SESSION_CLEAR_CALLERS = new Set([
  "app/admin/logout/route.ts:POST",
]);

export function isAllowedSessionClearCaller(caller: string): boolean {
  return ALLOWED_SESSION_CLEAR_CALLERS.has(caller);
}

export async function clearSessionCookie(caller: string): Promise<void> {
  console.info("[admin-session]", {
    event: "clearAdminSession_called",
    caller,
  });

  if (!isAllowedSessionClearCaller(caller)) {
    console.error("[admin-session]", {
      event: "clearAdminSession_blocked",
      caller,
      message: "admin_session may only be cleared from /admin/logout",
    });
    return;
  }

  console.info("[admin-logout] clearing admin_session via POST");

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "", getClearSessionCookieOptions());
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, getSessionCookieOptions());
}

export async function getSessionTokenFromCookie(): Promise<string | null> {
  const headersList = await headers();
  const fromHeader = getSessionTokenFromCookieHeader(headersList.get("cookie"));
  if (fromHeader) {
    return fromHeader;
  }

  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_SESSION_COOKIE)?.value ?? null;
}

export function getSessionTokenFromCookieHeader(
  cookieHeader: string | null,
): string | null {
  if (!cookieHeader) {
    return null;
  }

  const prefix = `${ADMIN_SESSION_COOKIE}=`;
  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      const raw = trimmed.slice(prefix.length);
      if (!raw) {
        return null;
      }

      try {
        return decodeURIComponent(raw);
      } catch {
        return raw;
      }
    }
  }

  return null;
}
