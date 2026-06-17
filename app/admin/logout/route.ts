import { redirect } from "next/navigation";

import { clearSessionCookie, resolveAdminSession } from "@/lib/admin/session";

export async function GET() {
  console.info("[admin-logout] GET ignored - logout requires POST");

  const session = await resolveAdminSession();
  if (session.kind === "authenticated") {
    redirect("/admin/dashboard");
  }

  redirect("/admin/login");
}

export async function POST() {
  await clearSessionCookie("app/admin/logout/route.ts:POST");
  redirect("/admin/login");
}
