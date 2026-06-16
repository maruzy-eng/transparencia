"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";

import { DeletePropertyDialog } from "@/components/admin/delete-property-dialog";
import { StatusBadge } from "@/components/transparency/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { togglePropertyPublishedAction } from "@/lib/admin/property-actions";
import {
  formatCurrency,
  formatDate,
  formatPercent,
  projectTypeLabel,
} from "@/lib/transparency/labels";
import { visibilityLabel } from "@/lib/admin/property-constants";
import type { Property } from "@/lib/transparency/types";

interface PropertiesTableProps {
  properties: Property[];
}

export function PropertiesTable({ properties }: PropertiesTableProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null);

  function handleTogglePublished(property: Property) {
    startTransition(async () => {
      await togglePropertyPublishedAction(property.id, !property.is_published);
      router.refresh();
    });
  }

  if (properties.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#E2E8F0] bg-white/80 px-6 py-12 text-center">
        <p className="text-base font-medium text-[#0F172A]">
          Nenhum imóvel cadastrado
        </p>
        <p className="mt-2 text-sm text-[#64748B]">
          Comece criando o primeiro imóvel do portfólio.
        </p>
        <Button asChild className="mt-5 checkmate-gradient border-0 text-white">
          <Link href="/admin/properties/new">Criar imóvel</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-[#E2E8F0] bg-[#FAFBFC]">
              <tr className="text-left text-[#64748B]">
                <th className="px-4 py-3 font-medium">Imóvel</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Andamento</th>
                <th className="px-4 py-3 font-medium">Compra</th>
                <th className="px-4 py-3 font-medium">Visibilidade</th>
                <th className="px-4 py-3 font-medium">Publicado</th>
                <th className="px-4 py-3 font-medium">Atualizado</th>
                <th className="px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr
                  key={property.id}
                  className="border-b border-[#F1F5F9] last:border-0"
                >
                  <td className="px-4 py-4">
                    <div className="min-w-[180px]">
                      <p className="font-medium text-[#0F172A]">
                        {property.name}
                      </p>
                      <p className="mt-0.5 text-xs text-[#94A3B8]">
                        /{property.slug}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[#64748B]">
                    {projectTypeLabel(property.project_type)}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={property.status} tone="light" />
                  </td>
                  <td className="px-4 py-4 text-[#64748B]">
                    {formatPercent(property.progress)}
                  </td>
                  <td className="px-4 py-4 text-[#64748B]">
                    {formatCurrency(property.purchase_price)}
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                      variant="outline"
                      className="border-[#E2E8F0] bg-[#FAFBFC] text-[#64748B]"
                    >
                      {visibilityLabel(property.visibility)}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                      variant="outline"
                      className={
                        property.is_published
                          ? "border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]"
                          : "border-[#E2E8F0] bg-[#FAFBFC] text-[#64748B]"
                      }
                    >
                      {property.is_published ? "Sim" : "Não"}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-[#64748B]">
                    {formatDate(property.updated_at)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        disabled={pending}
                        onClick={() => handleTogglePublished(property)}
                        aria-label={
                          property.is_published ? "Despublicar" : "Publicar"
                        }
                      >
                        {property.is_published ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button asChild size="icon" variant="outline">
                        <Link href={`/admin/properties/${property.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => setDeleteTarget(property)}
                      >
                        <Trash2 className="h-4 w-4 text-[#DC2626]" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DeletePropertyDialog
        property={deleteTarget}
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      />
    </>
  );
}
