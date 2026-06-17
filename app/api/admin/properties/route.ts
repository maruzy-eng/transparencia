import {
  adminRedirect,
  requireAdminApi,
} from "@/lib/admin/api-route-auth";
import { createPropertyFromFormData } from "@/lib/admin/property-form-mutations";

export async function POST(request: Request) {
  const auth = await requireAdminApi(request, "/admin/properties/new");
  if (!auth.admin) return auth.response;

  const formData = await request.formData();
  const result = await createPropertyFromFormData(formData);

  if (!result.success || !result.propertyId) {
    return adminRedirect(request, "/admin/properties/new", {
      error: result.error ?? "Erro ao criar imóvel.",
    });
  }

  return adminRedirect(
    request,
    `/admin/properties/${result.propertyId}/edit`,
    { saved: "1" },
  );
}
