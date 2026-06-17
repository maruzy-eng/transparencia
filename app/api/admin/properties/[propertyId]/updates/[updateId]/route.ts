import {
  adminRedirect,
  requireAdminApi,
} from "@/lib/admin/api-route-auth";
import { deleteUpdateById } from "@/lib/admin/property-update-mutations";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ propertyId: string; updateId: string }> },
) {
  const { propertyId, updateId } = await context.params;
  const auth = await requireAdminApi(
    request,
    `/admin/properties/${propertyId}/edit?tab=updates`,
  );
  if (!auth.admin) return auth.response;

  const result = await deleteUpdateById(propertyId, updateId);

  if (!result.success) {
    return adminRedirect(
      request,
      `/admin/properties/${propertyId}/edit`,
      { tab: "updates", error: result.error ?? "Erro ao remover atualização." },
    );
  }

  return adminRedirect(
    request,
    `/admin/properties/${propertyId}/edit`,
    { tab: "updates", saved: "1" },
  );
}
