import {
  adminRedirect,
  requireStrictAdminApi,
} from "@/lib/admin/api-route-auth";
import { resetAdminUserPasswordFromFormData } from "@/lib/admin/user-mutations";

interface RouteContext {
  params: Promise<{ userId: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  const { userId } = await context.params;
  const auth = await requireStrictAdminApi(request, "/admin/users");
  if (!auth.admin) return auth.response;

  const formData = await request.formData();
  const result = await resetAdminUserPasswordFromFormData(userId, formData);

  if (!result.success) {
    return await adminRedirect(request, "/admin/users", {
      error: result.error ?? "Erro ao redefinir senha.",
    });
  }

  return await adminRedirect(request, "/admin/users", { saved: "1" });
}
