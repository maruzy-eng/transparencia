import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminEnvErrorMessage } from "@/lib/env/server";
import type { AdminUser } from "@/lib/admin/types";

function assertEnv() {
  const envError = getAdminEnvErrorMessage();
  if (envError) {
    throw new Error(envError);
  }
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  assertEnv();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("admin_users")
    .select(
      "id, name, email, role, status, last_login_at, created_at, updated_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch admin users: ${error.message}`);
  }

  return (data ?? []) as AdminUser[];
}

export async function getAdminUserByEmailForAdmin(
  email: string,
): Promise<AdminUser | null> {
  assertEnv();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("admin_users")
    .select(
      "id, name, email, role, status, last_login_at, created_at, updated_at",
    )
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch admin user: ${error.message}`);
  }

  return (data as AdminUser | null) ?? null;
}
