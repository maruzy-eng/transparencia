import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  getClearSessionCookieOptions,
  getSessionCookieOptions,
} from "@/lib/admin/cookie-options";
import {
  getCurrentAdminFromRequest,
  getSessionTokenFromRequest,
} from "@/lib/admin/request-auth";
import { rotateSessionToken } from "@/lib/admin/session";
import type { AdminUser } from "@/lib/admin/types";

export async function attachSessionCookie(
  response: NextResponse,
  request: Request,
): Promise<NextResponse> {
  const token = getSessionTokenFromRequest(request);
  if (!token) {
    return response;
  }

  const refreshed = await rotateSessionToken(token);
  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    refreshed ?? token,
    getSessionCookieOptions(),
  );
  return response;
}

export function clearSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    "",
    getClearSessionCookieOptions(),
  );
  return response;
}

export async function redirectToLogin(
  request: Request,
  nextPath: string,
  clearCookie = true,
): Promise<NextResponse> {
  const response = NextResponse.redirect(
    new URL(
      `/admin/login?next=${encodeURIComponent(nextPath)}`,
      request.url,
    ),
    303,
  );

  if (clearCookie) {
    clearSessionCookie(response);
  }

  return response;
}

export async function requireAdminApi(
  request: Request,
  nextPath: string,
): Promise<
  | { admin: AdminUser; response: null }
  | { admin: null; response: NextResponse }
> {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin) {
    return {
      admin: null,
      response: await redirectToLogin(request, nextPath),
    };
  }
  return { admin, response: null };
}

export async function adminRedirect(
  request: Request,
  pathname: string,
  params?: Record<string, string>,
): Promise<NextResponse> {
  const url = new URL(pathname, request.url);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  return attachSessionCookie(NextResponse.redirect(url, 303), request);
}
