import {
  adminRedirect,
  requireAdminApi,
} from "@/lib/admin/api-route-auth";
import { persistContentFromFormData } from "@/lib/admin/content-mutations";

export async function POST(request: Request) {
  const auth = await requireAdminApi(request, "/admin/content");
  if (!auth.admin) return auth.response;

  const formData = await request.formData();
  const result = await persistContentFromFormData(formData);

  if (!result.success) {
    return await adminRedirect(request, "/admin/content", {
      error: result.error ?? "Erro ao salvar conteúdo.",
    });
  }

  return await adminRedirect(request, "/admin/content", { saved: "1" });
}
