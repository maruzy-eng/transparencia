import { NextResponse, type NextRequest } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "@/lib/admin/middleware-auth";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/logout"];

function isPublicAdminPath(pathname: string): boolean {
  return PUBLIC_ADMIN_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const authSecret = process.env.ADMIN_AUTH_SECRET?.trim();
  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const hasValidSession =
    Boolean(authSecret && sessionToken) &&
    (await verifyAdminSessionToken(sessionToken!, authSecret!));

  if (pathname.startsWith("/admin/login")) {
    if (hasValidSession) {
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
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
