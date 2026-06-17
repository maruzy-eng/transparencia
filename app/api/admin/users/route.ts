import {
  adminRedirect,
  requireStrictAdminApi,
} from "@/lib/admin/api-route-auth";
import { createAdminUserFromFormData } from "@/lib/admin/user-mutations";

export async function POST(request: Request) {
  const auth = await requireStrictAdminApi(request, "/admin/users");
  if (!auth.admin) return auth.response;

  const formData = await request.formData();
  const result = await createAdminUserFromFormData(formData);

  if (!result.success) {
    return await adminRedirect(request, "/admin/users", {
      error: result.error ?? "Erro ao criar usuário.",
    });
  }

  return await adminRedirect(request, "/admin/users", { saved: "1" });
}
