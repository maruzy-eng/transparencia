import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  getSessionCookieOptions,
} from "@/lib/admin/cookie-options";
import {
  getCurrentAdminFromRequest,
  getSessionTokenFromRequest,
} from "@/lib/admin/request-auth";
import type { AdminUser } from "@/lib/admin/types";

export function withSessionCookie(
  response: NextResponse,
  request: Request,
): NextResponse {
  const token = getSessionTokenFromRequest(request);
  if (token) {
    response.cookies.set(ADMIN_SESSION_COOKIE, token, getSessionCookieOptions());
  }
  return response;
}

export function redirectToLogin(
  request: Request,
  nextPath: string,
): NextResponse {
  return withSessionCookie(
    NextResponse.redirect(
      new URL(
        `/admin/login?next=${encodeURIComponent(nextPath)}`,
        request.url,
      ),
      303,
    ),
    request,
  );
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
    return { admin: null, response: redirectToLogin(request, nextPath) };
  }
  return { admin, response: null };
}

export function adminRedirect(
  request: Request,
  pathname: string,
  params?: Record<string, string>,
): NextResponse {
  const url = new URL(pathname, request.url);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }
  return withSessionCookie(NextResponse.redirect(url, 303), request);
}
