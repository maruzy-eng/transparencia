import {
  adminRedirect,
  requireStrictAdminApi,
} from "@/lib/admin/api-route-auth";
import { setAdminUserStatus } from "@/lib/admin/user-mutations";

interface RouteContext {
  params: Promise<{ userId: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  const { userId } = await context.params;
  const auth = await requireStrictAdminApi(request, "/admin/users");
  if (!auth.admin) return auth.response;

  const formData = await request.formData();
  const status = formData.get("status");

  if (status !== "active" && status !== "inactive") {
    return await adminRedirect(request, "/admin/users", {
      error: "Status inválido.",
    });
  }

  const result = await setAdminUserStatus(userId, auth.admin, status);

  if (!result.success) {
    return await adminRedirect(request, "/admin/users", {
      error: result.error ?? "Erro ao alterar status.",
    });
  }

  return await adminRedirect(request, "/admin/users", { saved: "1" });
}
