import {
  adminRedirect,
  requireAdminApi,
} from "@/lib/admin/api-route-auth";
import { deletePhaseById } from "@/lib/admin/property-phase-mutations";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ propertyId: string; phaseId: string }> },
) {
  const { propertyId, phaseId } = await context.params;
  const auth = await requireAdminApi(
    request,
    `/admin/properties/${propertyId}/edit?tab=phases`,
  );
  if (!auth.admin) return auth.response;

  const result = await deletePhaseById(propertyId, phaseId);

  if (!result.success) {
    return await adminRedirect(request, `/admin/properties/${propertyId}/edit`, {
      tab: "phases",
      error: result.error ?? "Erro ao remover fase.",
    });
  }

  return await adminRedirect(request, `/admin/properties/${propertyId}/edit`, {
    tab: "phases",
    saved: "1",
  });
}
