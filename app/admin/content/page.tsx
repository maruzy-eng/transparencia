import { AdminShell } from "@/components/admin/admin-shell";
import { ContentEditor } from "@/components/admin/content-editor";
import { requireAdminOrEditor } from "@/lib/admin/permissions";
import { getAdminSiteContent } from "@/lib/admin/content-queries";

export const dynamic = "force-dynamic";

interface AdminContentPageProps {
  searchParams: Promise<{ error?: string; saved?: string }>;
}

export default async function AdminContentPage({
  searchParams,
}: AdminContentPageProps) {
  const admin = await requireAdminOrEditor();
  const items = await getAdminSiteContent();
  const query = await searchParams;

  return (
    <AdminShell
      admin={admin}
      title="Textos da página"
      description="Edite os textos exibidos no portal público /transparency."
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
          Conteúdo salvo com sucesso.
        </p>
      ) : null}
      <ContentEditor items={items} />
    </AdminShell>
  );
}
