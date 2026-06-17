import "server-only";

import { redirect } from "next/navigation";

import {
  resolveAdminSession,
  type AdminSessionResolution,
} from "@/lib/admin/session";
import type { AdminUser } from "@/lib/admin/types";

export class AdminPermissionError extends Error {
  constructor(message = "Acesso não autorizado.") {
    super(message);
    this.name = "AdminPermissionError";
  }
}

function logPermissionDecision(
  fn: string,
  session: AdminSessionResolution,
): void {
  console.info("[admin-auth]", {
    event: "permission_check",
    fn,
    kind: session.kind,
    ...(session.kind === "invalid_session" ? { reason: session.reason } : {}),
  });
}

async function handleMissingSession(
  session: AdminSessionResolution,
): Promise<never> {
  if (session.kind === "invalid_session") {
    console.info("[admin-auth]", {
      event: "jwt_invalid",
      context: "requireAdminOrEditor",
      reason: session.reason,
    });
  }

  if (session.kind === "no_session") {
    console.info("[admin-auth]", {
      event: "missing_cookie",
      context: "requireAdminOrEditor",
    });
  }

  if (session.kind === "env_error") {
    console.error("[admin-auth]", {
      event: "env_misconfigured_block",
      context: "requireAdminOrEditor",
    });
    throw new Error(session.message);
  }

  if (session.kind === "db_unavailable") {
    console.error("[admin-auth]", {
      event: "db_unavailable",
      context: "requireAdminOrEditor",
    });
    throw new Error(session.message);
  }

  redirect("/admin/login");
}

function sessionErrorMessage(session: AdminSessionResolution): string {
  if (session.kind === "env_error" || session.kind === "db_unavailable") {
    return session.message;
  }

  if (session.kind === "invalid_session" && session.reason === "inactive_user") {
    return "Esta conta está inativa. Entre em contato com um administrador.";
  }

  return "Sessão expirada. Faça login novamente para continuar.";
}

export async function requireAdminOrEditor(): Promise<AdminUser> {
  const session = await resolveAdminSession();
  logPermissionDecision("requireAdminOrEditor", session);

  if (session.kind !== "authenticated") {
    return handleMissingSession(session);
  }

  if (session.admin.role !== "admin" && session.admin.role !== "editor") {
    throw new AdminPermissionError();
  }

  return session.admin;
}

export type AdminActionAuthResult =
  | { ok: true; admin: AdminUser }
  | { ok: false; error: string };

export async function requireAdminOrEditorForAction(): Promise<AdminActionAuthResult> {
  const session = await resolveAdminSession();
  logPermissionDecision("requireAdminOrEditorForAction", session);

  if (session.kind !== "authenticated") {
    return { ok: false, error: sessionErrorMessage(session) };
  }

  if (session.admin.role !== "admin" && session.admin.role !== "editor") {
    return { ok: false, error: "Acesso não autorizado." };
  }

  return { ok: true, admin: session.admin };
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
