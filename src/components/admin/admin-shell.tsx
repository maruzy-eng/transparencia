"use client";

import { Menu } from "lucide-react";
import { useState } from "react";

import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";
import type { AdminUser } from "@/lib/admin/types";

interface AdminShellProps {
  admin: AdminUser;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function AdminShell({
  admin,
  title,
  description,
  children,
}: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-64 shrink-0 lg:block">
        <AdminSidebar admin={admin} />
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/20"
            aria-label="Fechar menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative h-full w-72 max-w-[85vw] shadow-xl">
            <AdminSidebar admin={admin} />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-[#E2E8F0] bg-white px-4 py-3 lg:hidden">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-[#0F172A]">
            Checkmate Admin
          </span>
        </div>

        <AdminHeader admin={admin} title={title} description={description} />
        <main className="flex-1 px-5 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
