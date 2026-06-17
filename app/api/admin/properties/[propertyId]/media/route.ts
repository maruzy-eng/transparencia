import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  getSessionCookieOptions,
} from "@/lib/admin/cookie-options";
import {
  persistMediaFromFormData,
  uploadMediaFromFormData,
} from "@/lib/admin/property-media-mutations";
import {
  getCurrentAdminFromRequest,
  getSessionTokenFromRequest,
} from "@/lib/admin/request-auth";

export const maxDuration = 60;

function editMediaUrl(
  request: Request,
  propertyId: string,
  params?: Record<string, string>,
) {
  const url = new URL(`/admin/properties/${propertyId}/edit`, request.url);
  url.searchParams.set("tab", "media");
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }
  return url;
}

function withSessionCookie(
  response: NextResponse,
  request: Request,
): NextResponse {
  const token = getSessionTokenFromRequest(request);
  if (token) {
    response.cookies.set(ADMIN_SESSION_COOKIE, token, getSessionCookieOptions());
  }
  return response;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ propertyId: string }> },
) {
  const { propertyId } = await context.params;
  const admin = await getCurrentAdminFromRequest(request);

  if (!admin) {
    return withSessionCookie(
      NextResponse.redirect(
        new URL(
          `/admin/login?next=${encodeURIComponent(`/admin/properties/${propertyId}/edit?tab=media`)}`,
          request.url,
        ),
        303,
      ),
      request,
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const result =
    file instanceof File && file.size > 0
      ? await uploadMediaFromFormData(propertyId, formData)
      : await persistMediaFromFormData(propertyId, formData);

  if (!result.success) {
    return withSessionCookie(
      NextResponse.redirect(
        editMediaUrl(request, propertyId, {
          error: result.error ?? "Erro ao salvar mídia.",
        }),
        303,
      ),
      request,
    );
  }

  return withSessionCookie(
    NextResponse.redirect(editMediaUrl(request, propertyId, { saved: "1" }), 303),
    request,
  );
}
