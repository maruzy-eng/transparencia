import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { PropertyForm } from "@/components/admin/property-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireAdminOrEditor } from "@/lib/admin/permissions";

export const dynamic = "force-dynamic";

export default async function NewPropertyPage() {
  const admin = await requireAdminOrEditor();

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

      <Card className="border-[#E2E8F0] bg-white p-6 shadow-none sm:p-8">
        <PropertyForm mode="create" />
      </Card>
    </AdminShell>
  );
}
