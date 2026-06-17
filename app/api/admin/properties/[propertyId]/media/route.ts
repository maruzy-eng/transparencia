import {
  adminRedirect,
  requireAdminApi,
} from "@/lib/admin/api-route-auth";
import {
  persistMediaFromFormData,
  uploadMediaFromFormData,
} from "@/lib/admin/property-media-mutations";

export const maxDuration = 60;

export async function POST(
  request: Request,
  context: { params: Promise<{ propertyId: string }> },
) {
  const { propertyId } = await context.params;
  const auth = await requireAdminApi(
    request,
    `/admin/properties/${propertyId}/edit?tab=media`,
  );
  if (!auth.admin) return auth.response;

  const formData = await request.formData();
  const file = formData.get("file");
  const result =
    file instanceof File && file.size > 0
      ? await uploadMediaFromFormData(propertyId, formData)
      : await persistMediaFromFormData(propertyId, formData);

  if (!result.success) {
    return await adminRedirect(request, `/admin/properties/${propertyId}/edit`, {
      tab: "media",
      error: result.error ?? "Erro ao salvar mídia.",
    });
  }

  return await adminRedirect(request, `/admin/properties/${propertyId}/edit`, {
    tab: "media",
    saved: "1",
  });
}
