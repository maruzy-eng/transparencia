"use server";

import { redirect } from "next/navigation";

import { loginAdmin, logoutAdmin } from "@/lib/admin/auth";

export type LoginActionState = {
  error?: string;
};

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/admin/dashboard");

  const result = await loginAdmin(email, password);

  if (!result.success) {
    return { error: result.error };
  }

  const safeNext =
    nextPath.startsWith("/admin") && !nextPath.startsWith("/admin/login")
      ? nextPath
      : "/admin/dashboard";

  redirect(safeNext);
}

export async function logoutAction(): Promise<void> {
  await logoutAdmin();
  redirect("/admin/login");
}
