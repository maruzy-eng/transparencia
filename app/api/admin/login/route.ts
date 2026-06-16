import { NextResponse } from "next/server";

import { authenticateAdmin } from "@/lib/admin/auth";
import {
  ADMIN_SESSION_COOKIE,
  getSessionCookieOptions,
} from "@/lib/admin/cookie-options";
import { createSessionToken, updateLastLoginAt } from "@/lib/admin/session";

function safeNextPath(next: string): string {
  return next.startsWith("/admin") && !next.startsWith("/admin/login")
    ? next
    : "/admin/dashboard";
}

function loginRedirectUrl(request: Request, params: Record<string, string>) {
  const url = new URL("/admin/login", request.url);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const nextPath = safeNextPath(String(formData.get("next") ?? "/admin/dashboard"));

  const result = await authenticateAdmin(email, password);

  if (!result.success) {
    const url = loginRedirectUrl(request, { error: result.error, next: nextPath });
    return NextResponse.redirect(url, 303);
  }

  const token = await createSessionToken(result.admin);
  await updateLastLoginAt(result.admin.id);

  const response = NextResponse.redirect(new URL(nextPath, request.url), 303);
  response.cookies.set(ADMIN_SESSION_COOKIE, token, getSessionCookieOptions());

  return response;
}
