import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { PropertyForm } from "@/components/admin/property-form";
import { PropertyMediaEditor } from "@/components/admin/property-media-editor";
import { PropertyPhasesEditor } from "@/components/admin/property-phases-editor";
import { PropertyUpdatesEditor } from "@/components/admin/property-updates-editor";
import { DeletePropertyDialogTrigger } from "@/components/admin/delete-property-dialog-trigger";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requireAdminOrEditor } from "@/lib/admin/permissions";
import { getAdminPropertyDetail } from "@/lib/admin/property-queries";

export const dynamic = "force-dynamic";

interface EditPropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const admin = await requireAdminOrEditor();
  const { id } = await params;
  const detail = await getAdminPropertyDetail(id);

  if (!detail) {
    notFound();
  }

  const { property, phases, updates, media } = detail;

  return (
    <AdminShell
      admin={admin}
      title={property.name}
      description="Edite dados, fases, atualizações e mídia do imóvel."
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/properties">Voltar para listagem</Link>
        </Button>
        {property.is_published ? (
          <Button asChild variant="outline" size="sm">
            <Link href={`/transparency/${property.slug}`} target="_blank">
              Ver no portal
            </Link>
          </Button>
        ) : null}
        <DeletePropertyDialogTrigger property={property} />
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Dados gerais</TabsTrigger>
          <TabsTrigger value="phases">Fases ({phases.length})</TabsTrigger>
          <TabsTrigger value="updates">Atualizações ({updates.length})</TabsTrigger>
          <TabsTrigger value="media">Mídia ({media.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="border-[#E2E8F0] bg-white p-6 shadow-none sm:p-8">
            <PropertyForm property={property} mode="edit" />
          </Card>
        </TabsContent>

        <TabsContent value="phases">
          <Card className="border-[#E2E8F0] bg-white p-6 shadow-none sm:p-8">
            <PropertyPhasesEditor propertyId={property.id} phases={phases} />
          </Card>
        </TabsContent>

        <TabsContent value="updates">
          <Card className="border-[#E2E8F0] bg-white p-6 shadow-none sm:p-8">
            <PropertyUpdatesEditor propertyId={property.id} updates={updates} />
          </Card>
        </TabsContent>

        <TabsContent value="media">
          <Card className="border-[#E2E8F0] bg-white p-6 shadow-none sm:p-8">
            <PropertyMediaEditor propertyId={property.id} media={media} />
          </Card>
        </TabsContent>
      </Tabs>
    </AdminShell>
  );
}
