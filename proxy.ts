import { NextResponse, type NextRequest } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  getClearSessionCookieOptions,
  getSessionCookieOptions,
} from "@/lib/admin/cookie-options";
import { verifyAdminSessionToken } from "@/lib/admin/middleware-auth";
import { rotateSessionToken } from "@/lib/admin/session";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/logout"];
const PUBLIC_API_ADMIN_PATHS = ["/api/admin/login"];

function isPublicAdminPath(pathname: string): boolean {
  return PUBLIC_ADMIN_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

function isPublicApiAdminPath(pathname: string): boolean {
  return PUBLIC_API_ADMIN_PATHS.some((path) => pathname === path);
}

async function attachSessionCookie(
  response: NextResponse,
  token: string,
): Promise<NextResponse> {
  const refreshed = await rotateSessionToken(token);
  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    refreshed ?? token,
    getSessionCookieOptions(),
  );
  return response;
}

function clearSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    "",
    getClearSessionCookieOptions(),
  );
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authSecret = process.env.ADMIN_AUTH_SECRET?.trim();
  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (isPublicApiAdminPath(pathname)) {
    return NextResponse.next();
  }

  if (!authSecret) {
    return NextResponse.next();
  }

  const hasValidSession = Boolean(
    sessionToken &&
      (await verifyAdminSessionToken(sessionToken, authSecret)),
  );

  if (pathname.startsWith("/api/admin")) {
    if (sessionToken && hasValidSession) {
      return attachSessionCookie(NextResponse.next(), sessionToken);
    }
    return NextResponse.next();
  }

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin/login")) {
    if (hasValidSession && request.method === "GET") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/admin/logout")) {
    return NextResponse.next();
  }

  if (isPublicAdminPath(pathname)) {
    return NextResponse.next();
  }

  if (!hasValidSession) {
    const isServerAction =
      request.method === "POST" && request.headers.has("next-action");

    if (!isServerAction) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
      const response = NextResponse.redirect(loginUrl);
      if (sessionToken) {
        clearSessionCookie(response);
      }
      return response;
    }

    return NextResponse.next();
  }

  if (sessionToken) {
    return attachSessionCookie(NextResponse.next(), sessionToken);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
