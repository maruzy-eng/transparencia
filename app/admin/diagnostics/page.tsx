import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin/permissions";
import { getAdminDiagnostics } from "@/lib/admin/diagnostics";

export const dynamic = "force-dynamic";

function BoolRow({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-[#F1F5F9] py-3 last:border-0">
      <span className="text-sm text-[#64748B]">{label}</span>
      <span
        className={
          value
            ? "rounded-full bg-[#F0FDF4] px-2.5 py-0.5 text-xs font-medium text-[#166534]"
            : "rounded-full bg-[#FEF2F2] px-2.5 py-0.5 text-xs font-medium text-[#B91C1C]"
        }
      >
        {value ? "true" : "false"}
      </span>
    </div>
  );
}

function TextRow({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#F1F5F9] py-3 last:border-0">
      <span className="text-sm text-[#64748B]">{label}</span>
      <span className="text-sm font-medium text-[#0F172A]">
        {value ?? "—"}
      </span>
    </div>
  );
}

export default async function AdminDiagnosticsPage() {
  const admin = await requireAdmin();
  const diagnostics = await getAdminDiagnostics();

  return (
    <AdminShell
      admin={admin}
      title="Diagnóstico"
      description="Verificação temporária de sessão e variáveis de ambiente (sem expor valores secretos)."
    >
      <div className="max-w-xl rounded-2xl border border-[#E2E8F0] bg-white px-6 py-2">
        <BoolRow
          label="hasAdminAuthSecret"
          value={diagnostics.hasAdminAuthSecret}
        />
        <BoolRow
          label="hasServiceRoleKey"
          value={diagnostics.hasServiceRoleKey}
        />
        <BoolRow label="hasSupabaseUrl" value={diagnostics.hasSupabaseUrl} />
        <BoolRow
          label="hasPublishableKey"
          value={diagnostics.hasPublishableKey}
        />
        <BoolRow label="hasCookie" value={diagnostics.hasCookie} />
        <BoolRow label="sessionValid" value={diagnostics.sessionValid} />
        <TextRow
          label="currentUserEmail"
          value={diagnostics.currentUserEmail}
        />
        <TextRow label="currentUserRole" value={diagnostics.currentUserRole} />
        <TextRow label="nodeEnv" value={diagnostics.nodeEnv} />
        <TextRow label="vercelEnv" value={diagnostics.vercelEnv} />
        <TextRow label="sessionKind" value={diagnostics.sessionKind} />
        <TextRow label="cookieSource" value={diagnostics.cookieSource} />
      </div>

      <p className="mt-4 text-xs text-[#94A3B8]">
        Remova esta página após confirmar que a sessão persiste em produção.
      </p>
    </AdminShell>
  );
}
