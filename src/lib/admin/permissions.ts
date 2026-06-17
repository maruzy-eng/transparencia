import "server-only";

import { redirect } from "next/navigation";

import { getCurrentAdmin, clearSessionCookie } from "@/lib/admin/session";
import type { AdminUser } from "@/lib/admin/types";

export class AdminPermissionError extends Error {
  constructor(message = "Acesso não autorizado.") {
    super(message);
    this.name = "AdminPermissionError";
  }
}

async function redirectToLogin(): Promise<never> {
  await clearSessionCookie();
  redirect("/admin/login");
}

export async function requireAdminOrEditor(): Promise<AdminUser> {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return redirectToLogin();
  }

  if (admin.role !== "admin" && admin.role !== "editor") {
    throw new AdminPermissionError();
  }

  return admin;
}

export type AdminActionAuthResult =
  | { ok: true; admin: AdminUser }
  | { ok: false; error: string };

export async function requireAdminOrEditorForAction(): Promise<AdminActionAuthResult> {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return {
      ok: false,
      error: "Sessão expirada. Faça login novamente para continuar.",
    };
  }

  if (admin.role !== "admin" && admin.role !== "editor") {
    return { ok: false, error: "Acesso não autorizado." };
  }

  return { ok: true, admin };
}

export async function requireAdminForAction(): Promise<AdminActionAuthResult> {
  const auth = await requireAdminOrEditorForAction();

  if (!auth.ok) {
    return auth;
  }

  if (auth.admin.role !== "admin") {
    return {
      ok: false,
      error: "Apenas administradores podem executar esta ação.",
    };
  }

  return auth;
}

export async function requireAdmin(): Promise<AdminUser> {
  const admin = await requireAdminOrEditor();

  if (admin.role !== "admin") {
    throw new AdminPermissionError(
      "Apenas administradores podem acessar esta área.",
    );
  }

  return admin;
}

export function canModifyAdminUser(
  actor: AdminUser,
  targetUserId: string,
): boolean {
  return actor.id !== targetUserId;
}

export function canDeactivateAdminUser(
  actor: AdminUser,
  targetUserId: string,
): boolean {
  if (actor.id === targetUserId) {
    return false;
  }

  return actor.role === "admin";
}
