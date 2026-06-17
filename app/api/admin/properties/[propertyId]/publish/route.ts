import {
  adminRedirect,
  requireAdminApi,
} from "@/lib/admin/api-route-auth";
import { togglePropertyPublished } from "@/lib/admin/property-form-mutations";

export async function POST(
  request: Request,
  context: { params: Promise<{ propertyId: string }> },
) {
  const { propertyId } = await context.params;
  const auth = await requireAdminApi(request, "/admin/properties");
  if (!auth.admin) return auth.response;

  const formData = await request.formData();
  const isPublished = formData.get("is_published") === "true";
  const result = await togglePropertyPublished(propertyId, isPublished);

  if (!result.success) {
    return adminRedirect(request, "/admin/properties", {
      error: result.error ?? "Erro ao atualizar publicação.",
    });
  }

  return adminRedirect(request, "/admin/properties", { saved: "1" });
}
