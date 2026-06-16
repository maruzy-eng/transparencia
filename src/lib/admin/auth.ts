import "server-only";

import { verifyPassword } from "@/lib/admin/password";
import {
  clearSessionCookie,
  createSessionToken,
  getAdminUserByEmail,
  setSessionCookie,
  updateLastLoginAt,
} from "@/lib/admin/session";
import { getAdminEnvErrorMessage } from "@/lib/env/server";
import type { AdminUser } from "@/lib/admin/types";

export type LoginResult =
  | { success: true; admin: AdminUser }
  | { success: false; error: string };

export async function authenticateAdmin(
  email: string,
  password: string,
): Promise<LoginResult> {
  const envError = getAdminEnvErrorMessage();
  if (envError) {
    return { success: false, error: envError };
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return {
      success: false,
      error: "Informe e-mail e senha para continuar.",
    };
  }

  const record = await getAdminUserByEmail(normalizedEmail);

  if (!record) {
    return {
      success: false,
      error: "E-mail ou senha incorretos.",
    };
  }

  if (record.status !== "active") {
    return {
      success: false,
      error: "Esta conta está inativa. Entre em contato com um administrador.",
    };
  }

  const passwordValid = await verifyPassword(password, record.password_hash);

  if (!passwordValid) {
    return {
      success: false,
      error: "E-mail ou senha incorretos.",
    };
  }

  const admin: AdminUser = {
    id: record.id,
    name: record.name,
    email: record.email,
    role: record.role,
    status: record.status,
    last_login_at: record.last_login_at,
    created_at: record.created_at,
    updated_at: record.updated_at,
  };

  return { success: true, admin };
}

export async function loginAdmin(
  email: string,
  password: string,
): Promise<LoginResult> {
  const result = await authenticateAdmin(email, password);

  if (!result.success) {
    return result;
  }

  const token = await createSessionToken(result.admin);
  await setSessionCookie(token);
  await updateLastLoginAt(result.admin.id);

  return result;
}

export async function logoutAdmin(): Promise<void> {
  await clearSessionCookie();
}
