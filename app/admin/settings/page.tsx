import { AdminShell } from "@/components/admin/admin-shell";
import { LogoUploader } from "@/components/admin/logo-uploader";
import { requireAdminOrEditor } from "@/lib/admin/permissions";
import { getAdminSiteSettings } from "@/lib/admin/settings-queries";

export const dynamic = "force-dynamic";

interface AdminSettingsPageProps {
  searchParams: Promise<{ error?: string; saved?: string }>;
}

export default async function AdminSettingsPage({
  searchParams,
}: AdminSettingsPageProps) {
  const admin = await requireAdminOrEditor();
  const settings = await getAdminSiteSettings();
  const query = await searchParams;

  return (
    <AdminShell
      admin={admin}
      title="Configurações"
      description="Logo, nome do portal e textos visuais."
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
          Configuração salva com sucesso.
        </p>
      ) : null}
      <LogoUploader settings={settings} />
    </AdminShell>
  );
}
