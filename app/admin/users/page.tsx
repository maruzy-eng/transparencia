import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { UsersPageClient } from "@/components/admin/users-page-client";
import { requireAdminOrEditor } from "@/lib/admin/permissions";
import { getAdminUsers } from "@/lib/admin/user-queries";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const admin = await requireAdminOrEditor();

  if (admin.role !== "admin") {
    redirect("/admin/dashboard");
  }

  const users = await getAdminUsers();

  return (
    <AdminShell
      admin={admin}
      title="Usuários"
      description="Gerencie contas administrativas e editores."
    >
      <UsersPageClient users={users} currentUserId={admin.id} />
    </AdminShell>
  );
}
