import {
  adminRedirect,
  requireAdminApi,
} from "@/lib/admin/api-route-auth";
import {
  logAdminActionFailed,
  logAdminActionStarted,
  logAdminActionSucceeded,
} from "@/lib/admin/action-log";
import { createPropertyFromFormData } from "@/lib/admin/property-form-mutations";

const ACTION = "createProperty";

export async function POST(request: Request) {
  logAdminActionStarted(ACTION);
  const auth = await requireAdminApi(request, "/admin/properties/new");
  if (!auth.admin) return auth.response;

  const formData = await request.formData();
  const result = await createPropertyFromFormData(formData);

  if (!result.success || !result.propertyId) {
    logAdminActionFailed(ACTION, result.error);
    return await adminRedirect(request, "/admin/properties/new", {
      error: result.error ?? "Erro ao criar imóvel.",
    });
  }

  logAdminActionSucceeded(ACTION);
  return await adminRedirect(
    request,
    `/admin/properties/${result.propertyId}/edit`,
    { saved: "1" },
  );
}
