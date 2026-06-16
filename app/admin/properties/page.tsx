import Link from "next/link";
import { Plus } from "lucide-react";

import { AdminShell } from "@/components/admin/admin-shell";
import { PropertiesTable } from "@/components/admin/properties-table";
import { Button } from "@/components/ui/button";
import { requireAdminOrEditor } from "@/lib/admin/permissions";
import { getAdminProperties } from "@/lib/admin/property-queries";

export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage() {
  const admin = await requireAdminOrEditor();
  const properties = await getAdminProperties();

  return (
    <AdminShell
      admin={admin}
      title="Imóveis"
      description="Gerencie os projetos cadastrados no portal."
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#64748B]">
          {properties.length} imóvel{properties.length === 1 ? "" : "is"} cadastrado
          {properties.length === 1 ? "" : "s"}
        </p>
        <Button
          asChild
          className="checkmate-gradient border-0 text-white hover:brightness-[1.03]"
        >
          <Link href="/admin/properties/new">
            <Plus className="h-4 w-4" />
            Novo imóvel
          </Link>
        </Button>
      </div>

      <PropertiesTable properties={properties} />
    </AdminShell>
  );
}
