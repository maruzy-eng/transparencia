import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { UsersPageClient } from "@/components/admin/users-page-client";
import { requireAdminOrEditor } from "@/lib/admin/permissions";
import { getAdminUsers } from "@/lib/admin/user-queries";

export const dynamic = "force-dynamic";

interface AdminUsersPageProps {
  searchParams: Promise<{ error?: string; saved?: string }>;
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const admin = await requireAdminOrEditor();
  const query = await searchParams;

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
      {query.error ? (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-sm text-[#B91C1C]"
        >
          {query.error}
        </p>
      ) : null}
      {query.saved === "1" ? (
        <p className="mb-4 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-3 py-2 text-sm text-[#166534]">
          Alteração salva com sucesso.
        </p>
      ) : null}
      <UsersPageClient users={users} currentUserId={admin.id} />
    </AdminShell>
  );
}
