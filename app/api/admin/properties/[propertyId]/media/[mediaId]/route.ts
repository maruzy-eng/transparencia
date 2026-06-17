import {
  adminRedirect,
  requireAdminApi,
} from "@/lib/admin/api-route-auth";
import { deleteMediaById } from "@/lib/admin/property-media-mutations";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ propertyId: string; mediaId: string }> },
) {
  const { propertyId, mediaId } = await context.params;
  const auth = await requireAdminApi(
    request,
    `/admin/properties/${propertyId}/edit?tab=media`,
  );
  if (!auth.admin) return auth.response;

  const mediaUrl = new URL(request.url).searchParams.get("url") ?? undefined;
  const result = await deleteMediaById(propertyId, mediaId, mediaUrl);

  if (!result.success) {
    return await adminRedirect(request, `/admin/properties/${propertyId}/edit`, {
      tab: "media",
      error: result.error ?? "Erro ao remover mídia.",
    });
  }

  return await adminRedirect(request, `/admin/properties/${propertyId}/edit`, {
    tab: "media",
    saved: "1",
  });
}
