import "server-only";

import type { NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE } from "@/lib/admin/cookie-options";
import { getSessionTokenFromCookieHeader } from "@/lib/admin/session-cookie-store";
import type { AdminUser } from "@/lib/admin/types";
import {
  resolveAdminSessionFromToken,
  type AdminSessionResolution,
} from "@/lib/admin/session";

export type CookieReadSource = "next_cookies" | "cookie_header" | "none";

export function getSessionTokenFromRequest(
  request: Request | NextRequest,
): string | null {
  if ("cookies" in request && typeof request.cookies?.get === "function") {
    const fromNextCookies = request.cookies.get(ADMIN_SESSION_COOKIE)?.value?.trim();
    if (fromNextCookies) {
      return fromNextCookies;
    }
  }

  const fromHeader = getSessionTokenFromCookieHeader(
    request.headers.get("cookie"),
  );
  if (fromHeader) {
    return fromHeader;
  }

  return null;
}

export function getCookieReadSource(
  request: Request | NextRequest,
): CookieReadSource {
  if ("cookies" in request && typeof request.cookies?.get === "function") {
    const fromNextCookies = request.cookies.get(ADMIN_SESSION_COOKIE)?.value?.trim();
    if (fromNextCookies) {
      return "next_cookies";
    }
  }

  const fromHeader = getSessionTokenFromCookieHeader(
    request.headers.get("cookie"),
  );
  if (fromHeader) {
    return "cookie_header";
  }

  return "none";
}

export async function resolveAdminSessionFromRequest(
  request: Request | NextRequest,
): Promise<AdminSessionResolution> {
  const token = getSessionTokenFromRequest(request);
  const source = getCookieReadSource(request);
  const session = await resolveAdminSessionFromToken(token);

  console.info("[admin-auth]", {
    event: "request_session",
    kind: session.kind,
    hasToken: Boolean(token),
    cookieSource: source,
    ...(session.kind === "invalid_session" ? { reason: session.reason } : {}),
  });

  return session;
}

export async function getCurrentAdminFromRequest(
  request: Request | NextRequest,
): Promise<AdminUser | null> {
  const session = await resolveAdminSessionFromRequest(request);
  return session.kind === "authenticated" ? session.admin : null;
}
