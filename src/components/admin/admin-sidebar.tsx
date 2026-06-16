"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { AdminRole, AdminUser } from "@/lib/admin/types";

interface AdminSidebarProps {
  admin: AdminUser;
}

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: AdminRole[];
  disabled?: boolean;
};

const navItems: NavItem[] = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "editor"],
  },
  {
    href: "/admin/properties",
    label: "Imóveis",
    icon: Building2,
    roles: ["admin", "editor"],
  },
  {
    href: "/admin/content",
    label: "Textos da página",
    icon: FileText,
    roles: ["admin", "editor"],
  },
  {
    href: "/admin/settings",
    label: "Configurações",
    icon: Settings,
    roles: ["admin", "editor"],
  },
  {
    href: "/admin/users",
    label: "Usuários",
    icon: Users,
    roles: ["admin"],
  },
];

export function AdminSidebar({ admin }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full flex-col border-r border-[#E2E8F0] bg-white">
      <div className="border-b border-[#E2E8F0] px-5 py-5">
        <Link href="/admin/dashboard" className="block">
          <span className="text-[11px] font-bold tracking-[0.16em] text-[#0F172A]">
            CHECKMATE
          </span>
          <p className="mt-1 text-xs text-[#64748B]">Painel administrativo</p>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          if (!item.roles.includes(admin.role)) {
            return null;
          }

          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          if (item.disabled) {
            return (
              <span
                key={item.href}
                className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#94A3B8]"
                aria-disabled="true"
                title="Em breve"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </span>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-[#EEF9F3] font-medium text-[#0F766E]"
                  : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#E2E8F0] p-3">
        <Link
          href="/admin/logout"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#64748B] transition-colors hover:bg-[#FEF2F2] hover:text-[#DC2626]"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Link>
      </div>
    </aside>
  );
}
