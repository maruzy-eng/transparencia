import type { AdminUser } from "@/lib/admin/types";

interface AdminHeaderProps {
  admin: AdminUser;
  title: string;
  description?: string;
}

function formatRole(role: AdminUser["role"]): string {
  return role === "admin" ? "Administrador" : "Editor";
}

export function AdminHeader({ admin, title, description }: AdminHeaderProps) {
  return (
    <header className="border-b border-[#E2E8F0] bg-white/80 px-5 py-5 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#0F172A] sm:text-2xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 text-sm text-[#64748B]">{description}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-[#FAFBFC] px-4 py-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full checkmate-gradient text-sm font-semibold text-white">
            {admin.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#0F172A]">
              {admin.name}
            </p>
            <p className="text-xs text-[#64748B]">{formatRole(admin.role)}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
