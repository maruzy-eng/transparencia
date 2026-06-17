import {
  adminRedirect,
  requireAdminApi,
} from "@/lib/admin/api-route-auth";
import { persistPhaseFromFormData } from "@/lib/admin/property-phase-mutations";

export async function POST(
  request: Request,
  context: { params: Promise<{ propertyId: string }> },
) {
  const { propertyId } = await context.params;
  const auth = await requireAdminApi(
    request,
    `/admin/properties/${propertyId}/edit?tab=phases`,
  );
  if (!auth.admin) return auth.response;

  const formData = await request.formData();
  const result = await persistPhaseFromFormData(propertyId, formData);

  if (!result.success) {
    return await adminRedirect(request, `/admin/properties/${propertyId}/edit`, {
      tab: "phases",
      error: result.error ?? "Erro ao salvar fase.",
    });
  }

  return await adminRedirect(request, `/admin/properties/${propertyId}/edit`, {
    tab: "phases",
    saved: "1",
  });
}
