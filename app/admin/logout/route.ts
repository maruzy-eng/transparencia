import { redirect } from "next/navigation";

import { clearSessionCookie } from "@/lib/admin/session";

export async function GET() {
  await clearSessionCookie();
  redirect("/admin/login");
}

export async function POST() {
  await clearSessionCookie();
  redirect("/admin/login");
}
