import {
  adminRedirect,
  requireAdminApi,
} from "@/lib/admin/api-route-auth";
import {
  deletePropertyById,
  updatePropertyFromFormData,
} from "@/lib/admin/property-form-mutations";

export async function POST(
  request: Request,
  context: { params: Promise<{ propertyId: string }> },
) {
  const { propertyId } = await context.params;
  const auth = await requireAdminApi(
    request,
    `/admin/properties/${propertyId}/edit`,
  );
  if (!auth.admin) return auth.response;

  const formData = await request.formData();
  const result = await updatePropertyFromFormData(propertyId, formData);

  if (!result.success) {
    return await adminRedirect(request, `/admin/properties/${propertyId}/edit`, {
      tab: "general",
      error: result.error ?? "Erro ao salvar imóvel.",
    });
  }

  return await adminRedirect(request, `/admin/properties/${propertyId}/edit`, {
    tab: "general",
    saved: "1",
  });
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ propertyId: string }> },
) {
  const { propertyId } = await context.params;
  const auth = await requireAdminApi(request, "/admin/properties");
  if (!auth.admin) return auth.response;

  const result = await deletePropertyById(propertyId);

  if (!result.success) {
    return await adminRedirect(request, "/admin/properties", {
      error: result.error ?? "Erro ao excluir imóvel.",
    });
  }

  return await adminRedirect(request, "/admin/properties", { saved: "1" });
}
