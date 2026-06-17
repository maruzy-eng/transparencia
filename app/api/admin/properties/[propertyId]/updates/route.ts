import {
  adminRedirect,
  requireAdminApi,
} from "@/lib/admin/api-route-auth";
import { persistUpdateFromFormData } from "@/lib/admin/property-update-mutations";

export async function POST(
  request: Request,
  context: { params: Promise<{ propertyId: string }> },
) {
  const { propertyId } = await context.params;
  const auth = await requireAdminApi(
    request,
    `/admin/properties/${propertyId}/edit?tab=updates`,
  );
  if (!auth.admin) return auth.response;

  const formData = await request.formData();
  const result = await persistUpdateFromFormData(propertyId, formData);

  if (!result.success) {
    return adminRedirect(
      request,
      `/admin/properties/${propertyId}/edit`,
      { tab: "updates", error: result.error ?? "Erro ao salvar atualização." },
    );
  }

  return adminRedirect(
    request,
    `/admin/properties/${propertyId}/edit`,
    { tab: "updates", saved: "1" },
  );
}
