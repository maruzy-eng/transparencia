import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  getClearSessionCookieOptions,
  getSessionCookieOptions,
} from "@/lib/admin/cookie-options";
import {
  getSessionTokenFromRequest,
  resolveAdminSessionFromRequest,
} from "@/lib/admin/request-auth";
import { rotateSessionToken } from "@/lib/admin/session";
import type { AdminSessionResolution } from "@/lib/admin/session";
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
  clearCookie = false,
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

function logApiAuthDecision(
  nextPath: string,
  session: AdminSessionResolution,
): void {
  console.info("[admin-auth]", {
    event: "api_auth",
    nextPath,
    kind: session.kind,
    ...(session.kind === "invalid_session" ? { reason: session.reason } : {}),
  });
}

async function unauthenticatedApiResponse(
  request: Request,
  nextPath: string,
  session: AdminSessionResolution,
): Promise<NextResponse> {
  if (session.kind === "env_error") {
    console.error("[admin-auth]", {
      event: "env_misconfigured_block",
      context: "api_route",
      nextPath,
    });
    return NextResponse.redirect(
      new URL(
        `/admin/login?error=${encodeURIComponent(session.message)}`,
        request.url,
      ),
      303,
    );
  }

  return redirectToLogin(
    request,
    nextPath,
    session.kind === "invalid_session",
  );
}

export async function requireAdminApi(
  request: Request,
  nextPath: string,
): Promise<
  | { admin: AdminUser; response: null }
  | { admin: null; response: NextResponse }
> {
  const session = await resolveAdminSessionFromRequest(request);
  logApiAuthDecision(nextPath, session);

  if (session.kind !== "authenticated") {
    return {
      admin: null,
      response: await unauthenticatedApiResponse(request, nextPath, session),
    };
  }

  if (session.admin.role !== "admin" && session.admin.role !== "editor") {
    return {
      admin: null,
      response: await adminRedirect(request, nextPath, {
        error: "Acesso não autorizado.",
      }),
    };
  }

  return { admin: session.admin, response: null };
}

export async function requireStrictAdminApi(
  request: Request,
  nextPath: string,
): Promise<
  | { admin: AdminUser; response: null }
  | { admin: null; response: NextResponse }
> {
  const auth = await requireAdminApi(request, nextPath);
  if (!auth.admin) {
    return auth;
  }

  if (auth.admin.role !== "admin") {
    return {
      admin: null,
      response: await adminRedirect(request, nextPath, {
        error: "Apenas administradores podem executar esta ação.",
      }),
    };
  }

  return auth;
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
