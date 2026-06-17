import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE } from "@/lib/admin/cookie-options";

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

function redirectToLogin(request: NextRequest, nextPath: string) {
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", nextPath);
  return NextResponse.redirect(loginUrl);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value?.trim();

  if (isPublicApiAdminPath(pathname) || isPublicAdminPath(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (!sessionToken) {
    const isServerAction =
      request.method === "POST" && request.headers.has("next-action");

    if (!isServerAction) {
      return redirectToLogin(
        request,
        `${pathname}${request.nextUrl.search}`,
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
