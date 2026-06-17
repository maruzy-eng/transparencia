import "server-only";

import { revalidatePath } from "next/cache";

import { hashPassword } from "@/lib/admin/password";
import { canDeactivateAdminUser } from "@/lib/admin/permissions";
import {
  createUserSchema,
  resetPasswordSchema,
  updateUserSchema,
} from "@/lib/admin/user-schema";
import { getAdminUserByEmailForAdmin } from "@/lib/admin/user-queries";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AdminUser } from "@/lib/admin/types";

export type UserMutationResult = {
  success: boolean;
  error?: string;
};

function revalidateUserPaths() {
  revalidatePath("/admin/users");
  revalidatePath("/admin/dashboard");
}

function parseCreateUser(formData: FormData) {
  return createUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
    status: formData.get("status") ?? "active",
    password: formData.get("password"),
  });
}

function parseUpdateUser(formData: FormData) {
  return updateUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
    status: formData.get("status"),
  });
}

export async function createAdminUserFromFormData(
  formData: FormData,
): Promise<UserMutationResult> {
  const parsed = parseCreateUser(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const values = parsed.data;
  const email = values.email.trim().toLowerCase();
  const existing = await getAdminUserByEmailForAdmin(email);

  if (existing) {
    return { success: false, error: "Já existe um usuário com este e-mail." };
  }

  const passwordHash = await hashPassword(values.password);
  const supabase = createAdminClient();

  const { error } = await supabase.from("admin_users").insert({
    name: values.name.trim(),
    email,
    password_hash: passwordHash,
    role: values.role,
    status: values.status,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateUserPaths();
  return { success: true };
}

export async function updateAdminUserFromFormData(
  userId: string,
  actor: AdminUser,
  formData: FormData,
): Promise<UserMutationResult> {
  const parsed = parseUpdateUser(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const values = parsed.data;
  const email = values.email.trim().toLowerCase();
  const existing = await getAdminUserByEmailForAdmin(email);

  if (existing && existing.id !== userId) {
    return {
      success: false,
      error: "Já existe outro usuário com este e-mail.",
    };
  }

  if (
    values.status === "inactive" &&
    !canDeactivateAdminUser(actor, userId)
  ) {
    return {
      success: false,
      error: "Você não pode desativar sua própria conta.",
    };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("admin_users")
    .update({
      name: values.name.trim(),
      email,
      role: values.role,
      status: values.status,
    })
    .eq("id", userId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateUserPaths();
  return { success: true };
}

export async function resetAdminUserPasswordFromFormData(
  userId: string,
  formData: FormData,
): Promise<UserMutationResult> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Senha inválida.",
    };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("admin_users")
    .update({ password_hash: passwordHash })
    .eq("id", userId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateUserPaths();
  return { success: true };
}

export async function setAdminUserStatus(
  userId: string,
  actor: AdminUser,
  status: "active" | "inactive",
): Promise<UserMutationResult> {
  if (status === "inactive" && !canDeactivateAdminUser(actor, userId)) {
    return {
      success: false,
      error: "Você não pode desativar sua própria conta.",
    };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("admin_users")
    .update({ status })
    .eq("id", userId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateUserPaths();
  return { success: true };
}
