"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { EmptyState } from "@/components/transparency/empty-state";
import {
  PropertyFilters,
  type PropertyFilterValue,
} from "@/components/transparency/property-filters";
import { PropertyGrid } from "@/components/transparency/property-grid";
import type { TransparencyPageContent } from "@/lib/transparency/content-types";
import type { Property } from "@/lib/transparency/types";

interface PropertyListingProps {
  properties: Property[];
  content: TransparencyPageContent["projects"];
}

function filterProperties(
  properties: Property[],
  filter: PropertyFilterValue,
): Property[] {
  if (filter === "all") return properties;

  if (filter === "flip_house" || filter === "new_construction") {
    return properties.filter((property) => property.project_type === filter);
  }

  return properties.filter((property) => property.status === filter);
}

export function PropertyListing({ properties, content }: PropertyListingProps) {
  const [filter, setFilter] = useState<PropertyFilterValue>("all");

  const filteredProperties = useMemo(
    () => filterProperties(properties, filter),
    [properties, filter],
  );

  return (
    <section id="projetos" className="scroll-mt-28 space-y-8">
      <div className="space-y-5 border-t border-[#E2E8F0] pt-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h2 className="text-[1.75rem] font-bold tracking-[-0.03em] text-[#0F172A] sm:text-[2rem]">
              {content.title}
            </h2>
            <p className="max-w-lg text-sm leading-relaxed text-[#64748B]">
              {content.subtitle}
            </p>
          </div>
          <Link
            href="#projetos"
            className="text-[13px] font-medium text-[#64748B] underline-offset-4 transition-colors hover:text-[#39AFF2] hover:underline"
          >
            Ver todos os projetos
          </Link>
        </div>
        <PropertyFilters value={filter} onChange={setFilter} />
      </div>

      {filteredProperties.length === 0 ? (
        <EmptyState
          title="Nenhum projeto neste filtro"
          description="Tente outro filtro para visualizar os imóveis publicados."
        />
      ) : (
        <PropertyGrid properties={filteredProperties} />
      )}
    </section>
  );
}
