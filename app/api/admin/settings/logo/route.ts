import {
  adminRedirect,
  requireAdminApi,
} from "@/lib/admin/api-route-auth";
import { uploadLogoFromFormData } from "@/lib/admin/settings-mutations";

export const maxDuration = 60;

export async function POST(request: Request) {
  const auth = await requireAdminApi(request, "/admin/settings");
  if (!auth.admin) return auth.response;

  const formData = await request.formData();
  const result = await uploadLogoFromFormData(formData);

  if (!result.success) {
    return await adminRedirect(request, "/admin/settings", {
      error: result.error ?? "Erro no upload do logo.",
    });
  }

  return await adminRedirect(request, "/admin/settings", { saved: "1" });
}
