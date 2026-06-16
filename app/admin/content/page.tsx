import { AdminShell } from "@/components/admin/admin-shell";
import { ContentEditor } from "@/components/admin/content-editor";
import { requireAdminOrEditor } from "@/lib/admin/permissions";
import { getAdminSiteContent } from "@/lib/admin/content-actions";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const admin = await requireAdminOrEditor();
  const items = await getAdminSiteContent();

  return (
    <AdminShell
      admin={admin}
      title="Textos da página"
      description="Edite os textos exibidos no portal público /transparency."
    >
      <ContentEditor items={items} />
    </AdminShell>
  );
}
