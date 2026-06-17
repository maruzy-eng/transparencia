import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { PropertyForm } from "@/components/admin/property-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireAdminOrEditor } from "@/lib/admin/permissions";

export const dynamic = "force-dynamic";

interface NewPropertyPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function NewPropertyPage({
  searchParams,
}: NewPropertyPageProps) {
  const admin = await requireAdminOrEditor();
  const query = await searchParams;

  return (
    <AdminShell
      admin={admin}
      title="Novo imóvel"
      description="Cadastre um novo projeto no portfólio."
    >
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/properties">Voltar para listagem</Link>
        </Button>
      </div>

      {query.error ? (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-sm text-[#B91C1C]"
        >
          {query.error}
        </p>
      ) : null}

      <Card className="border-[#E2E8F0] bg-white p-6 shadow-none sm:p-8">
        <PropertyForm mode="create" />
      </Card>
    </AdminShell>
  );
}
