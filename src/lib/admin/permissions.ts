import "server-only";

import { redirect } from "next/navigation";

import { getCurrentAdmin } from "@/lib/admin/session";
import type { AdminUser } from "@/lib/admin/types";

export class AdminPermissionError extends Error {
  constructor(message = "Acesso não autorizado.") {
    super(message);
    this.name = "AdminPermissionError";
  }
}

export async function requireAdminOrEditor(): Promise<AdminUser> {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  if (admin.role !== "admin" && admin.role !== "editor") {
    throw new AdminPermissionError();
  }

  return admin;
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
