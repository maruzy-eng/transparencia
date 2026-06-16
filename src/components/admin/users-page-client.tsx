"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { UsersTable } from "@/components/admin/users-table";
import { Button } from "@/components/ui/button";
import type { AdminUser } from "@/lib/admin/types";

interface UsersPageClientProps {
  users: AdminUser[];
  currentUserId: string;
}

export function UsersPageClient({
  users,
  currentUserId,
}: UsersPageClientProps) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#64748B]">
          {users.length} usuário{users.length === 1 ? "" : "s"} cadastrado
          {users.length === 1 ? "" : "s"}
        </p>
        <Button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="checkmate-gradient border-0 text-white hover:brightness-[1.03]"
        >
          <Plus className="h-4 w-4" />
          Novo usuário
        </Button>
      </div>

      <UsersTable
        users={users}
        currentUserId={currentUserId}
        createOpen={createOpen}
        onCreateOpenChange={setCreateOpen}
      />
    </>
  );
}
