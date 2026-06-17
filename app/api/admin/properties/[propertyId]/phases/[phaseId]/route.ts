import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  getSessionCookieOptions,
} from "@/lib/admin/cookie-options";
import { deletePhaseById } from "@/lib/admin/property-phase-mutations";
import { getCurrentAdminFromRequest, getSessionTokenFromRequest } from "@/lib/admin/request-auth";

function editPhasesUrl(request: Request, propertyId: string, params?: Record<string, string>) {
  const url = new URL(`/admin/properties/${propertyId}/edit`, request.url);
  url.searchParams.set("tab", "phases");
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }
  return url;
}

function withSessionCookie(response: NextResponse, request: Request): NextResponse {
  const token = getSessionTokenFromRequest(request);
  if (token) {
    response.cookies.set(ADMIN_SESSION_COOKIE, token, getSessionCookieOptions());
  }
  return response;
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ propertyId: string; phaseId: string }> },
) {
  const { propertyId, phaseId } = await context.params;
  const admin = await getCurrentAdminFromRequest(request);

  if (!admin) {
    return withSessionCookie(
      NextResponse.redirect(
        editPhasesUrl(request, propertyId, {
          error: "Sessão expirada. Faça login novamente para continuar.",
        }),
        303,
      ),
      request,
    );
  }

  const result = await deletePhaseById(propertyId, phaseId);

  if (!result.success) {
    return withSessionCookie(
      NextResponse.redirect(
        editPhasesUrl(request, propertyId, { error: result.error ?? "Erro ao remover fase." }),
        303,
      ),
      request,
    );
  }

  return withSessionCookie(
    NextResponse.redirect(editPhasesUrl(request, propertyId, { saved: "1" }), 303),
    request,
  );
}
