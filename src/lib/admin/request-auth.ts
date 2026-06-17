import "server-only";

import type { NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE } from "@/lib/admin/cookie-options";
import {
  getCurrentAdminFromToken,
  getSessionTokenFromCookieHeader,
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

export async function getCurrentAdminFromRequest(
  request: Request | NextRequest,
): Promise<AdminUser | null> {
  const token = getSessionTokenFromRequest(request);
  if (!token) {
    return null;
  }

  return getCurrentAdminFromToken(token);
}
