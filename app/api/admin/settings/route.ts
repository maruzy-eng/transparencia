import {
  adminRedirect,
  requireAdminApi,
} from "@/lib/admin/api-route-auth";
import { persistSettingFromFormData } from "@/lib/admin/settings-mutations";

export async function POST(request: Request) {
  const auth = await requireAdminApi(request, "/admin/settings");
  if (!auth.admin) return auth.response;

  const formData = await request.formData();
  const result = await persistSettingFromFormData(formData);

  if (!result.success) {
    return await adminRedirect(request, "/admin/settings", {
      error: result.error ?? "Erro ao salvar configuração.",
    });
  }

  return await adminRedirect(request, "/admin/settings", { saved: "1" });
}
