import { AdminShell } from "@/components/admin/admin-shell";
import { LogoUploader } from "@/components/admin/logo-uploader";
import { requireAdminOrEditor } from "@/lib/admin/permissions";
import { getAdminSiteSettings } from "@/lib/admin/settings-actions";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const admin = await requireAdminOrEditor();
  const settings = await getAdminSiteSettings();

  return (
    <AdminShell
      admin={admin}
      title="Configurações"
      description="Logo, nome do portal e textos visuais."
    >
      <LogoUploader settings={settings} />
    </AdminShell>
  );
}
