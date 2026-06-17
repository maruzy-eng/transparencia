import "server-only";

import type { NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE } from "@/lib/admin/cookie-options";
import {
  getSessionTokenFromCookieHeader,
  resolveAdminSessionFromToken,
  type AdminSessionResolution,
} from "@/lib/admin/session";
import type { AdminUser } from "@/lib/admin/types";

export function getSessionTokenFromRequest(
  request: Request | NextRequest,
): string | null {
  const fromHeader = getSessionTokenFromCookieHeader(
    request.headers.get("cookie"),
  );
  if (fromHeader) {
    return fromHeader;
  }

  if ("cookies" in request && typeof request.cookies?.get === "function") {
    return request.cookies.get(ADMIN_SESSION_COOKIE)?.value ?? null;
  }

  return null;
}

export async function resolveAdminSessionFromRequest(
  request: Request | NextRequest,
): Promise<AdminSessionResolution> {
  const token = getSessionTokenFromRequest(request);
  const session = await resolveAdminSessionFromToken(token);

  console.info("[admin-auth]", {
    event: "request_session",
    kind: session.kind,
    hasToken: Boolean(token),
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
