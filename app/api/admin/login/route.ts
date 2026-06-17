import { NextResponse } from "next/server";

import { authenticateAdmin } from "@/lib/admin/auth";
import {
  ADMIN_SESSION_COOKIE,
  getClearSessionCookieOptions,
  getSessionCookieOptions,
} from "@/lib/admin/cookie-options";
import { buildRequestUrl } from "@/lib/admin/request-url";
import { createSessionToken, updateLastLoginAt } from "@/lib/admin/session";

function safeNextPath(next: string): string {
  return next.startsWith("/admin") && !next.startsWith("/admin/login")
    ? next
    : "/admin/dashboard";
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const nextPath = safeNextPath(String(formData.get("next") ?? "/admin/dashboard"));

  const result = await authenticateAdmin(email, password);

  if (!result.success) {
    return NextResponse.redirect(
      buildRequestUrl(request, "/admin/login", {
        error: result.error,
        next: nextPath,
      }),
      303,
    );
  }

  const token = await createSessionToken(result.admin);
  await updateLastLoginAt(result.admin.id);

  console.info("[admin-auth]", {
    event: "login_success",
    userId: result.admin.id,
    secure: getSessionCookieOptions().secure,
    path: getSessionCookieOptions().path,
  });

  const response = NextResponse.redirect(
    buildRequestUrl(request, nextPath),
    303,
  );
  response.cookies.set(ADMIN_SESSION_COOKIE, "", getClearSessionCookieOptions());
  response.cookies.set(ADMIN_SESSION_COOKIE, token, getSessionCookieOptions());

  return response;
}
