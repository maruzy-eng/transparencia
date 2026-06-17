import {
  adminRedirect,
  requireAdminApi,
} from "@/lib/admin/api-route-auth";
import { uploadCoverFromFormData } from "@/lib/admin/property-form-mutations";

export const maxDuration = 60;

export async function POST(
  request: Request,
  context: { params: Promise<{ propertyId: string }> },
) {
  const { propertyId } = await context.params;
  const nextPath = `/admin/properties/${propertyId}/edit?tab=general`;
  const auth = await requireAdminApi(request, nextPath);
  if (!auth.admin) return auth.response;

  const formData = await request.formData();
  const result = await uploadCoverFromFormData(propertyId, formData);

  if (!result.success) {
    return adminRedirect(request, `/admin/properties/${propertyId}/edit`, {
      tab: "general",
      error: result.error ?? "Erro no upload da capa.",
    });
  }

  return adminRedirect(request, `/admin/properties/${propertyId}/edit`, {
    tab: "general",
    saved: "1",
  });
}
