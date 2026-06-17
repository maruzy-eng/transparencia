import "server-only";

import { getMissingAdminEnvVars } from "@/lib/env/server";
import {
  getSessionTokenFromCookie,
  resolveAdminSession,
} from "@/lib/admin/session";

export type AdminDiagnostics = {
  hasAdminAuthSecret: boolean;
  hasServiceRoleKey: boolean;
  hasSupabaseUrl: boolean;
  hasPublishableKey: boolean;
  hasCookie: boolean;
  sessionValid: boolean;
  currentUserEmail: string | null;
  currentUserRole: string | null;
  nodeEnv: string;
  vercelEnv: string;
  sessionKind: string;
  cookieSource: "present" | "absent";
};

export async function getAdminDiagnostics(): Promise<AdminDiagnostics> {
  const missing = getMissingAdminEnvVars();
  const token = await getSessionTokenFromCookie();
  const session = await resolveAdminSession();

  return {
    hasAdminAuthSecret: !missing.includes("ADMIN_AUTH_SECRET"),
    hasServiceRoleKey: !missing.includes("SUPABASE_SERVICE_ROLE_KEY"),
    hasSupabaseUrl: !missing.includes("NEXT_PUBLIC_SUPABASE_URL"),
    hasPublishableKey: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim(),
    ),
    hasCookie: Boolean(token),
    sessionValid: session.kind === "authenticated",
    currentUserEmail:
      session.kind === "authenticated" ? session.admin.email : null,
    currentUserRole:
      session.kind === "authenticated" ? session.admin.role : null,
    nodeEnv: process.env.NODE_ENV ?? "unknown",
    vercelEnv: process.env.VERCEL_ENV ?? "not_vercel",
    sessionKind: session.kind,
    cookieSource: token ? "present" : "absent",
  };
}
