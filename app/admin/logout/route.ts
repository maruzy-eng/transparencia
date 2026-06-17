import { redirect } from "next/navigation";

import { clearSessionCookie } from "@/lib/admin/session";

export async function GET() {
  await clearSessionCookie("app/admin/logout/route.ts:GET");
  redirect("/admin/login");
}

export async function POST() {
  await clearSessionCookie("app/admin/logout/route.ts:POST");
  redirect("/admin/login");
}
