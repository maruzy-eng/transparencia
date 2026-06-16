import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";

import { PropertyCoverImage } from "@/components/transparency/property-cover-image";
import { PropertyFinancialMetrics } from "@/components/transparency/property-financial-metrics";
import { PhaseProgress } from "@/components/transparency/phase-progress";
import { StatusBadge } from "@/components/transparency/status-badge";
import {
  formatCurrency,
  projectTypeLabel,
} from "@/lib/transparency/labels";
import type { Property } from "@/lib/transparency/types";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  className?: string;
  emphasized?: boolean;
}

export function PropertyCard({
  property,
  className,
  emphasized = false,
}: PropertyCardProps) {
  const location = [property.city, property.state].filter(Boolean).join(", ");

  return (
    <article
      className={cn(
        "group flex h-full min-w-0 flex-col overflow-hidden rounded-[22px] border border-[#E2E8F0] bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#39AFF2]/20 hover:shadow-[0_14px_36px_rgba(15,23,42,0.05)]",
        emphasized && "ring-1 ring-[#39AFF2]/10",
        className,
      )}
    >
      <div className="relative p-3 pb-0">
        <div
          className={cn(
            "relative overflow-hidden rounded-[16px] bg-[#F8FAFC]",
            emphasized ? "aspect-[16/9]" : "aspect-[16/10]",
          )}
        >
          <PropertyCoverImage
            src={property.cover_image_url}
            alt={property.name}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            imageClassName="transition-transform duration-500 group-hover:scale-[1.015]"
          />
          <div className="absolute left-3 top-3">
            <StatusBadge status={property.status} tone="light" />
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col px-5 pb-5 pt-4">
        <div className="space-y-1.5">
          {property.project_type && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
              {projectTypeLabel(property.project_type)}
            </p>
          )}
          <h3 className="text-lg font-bold leading-snug tracking-[-0.02em] text-[#0F172A] sm:text-xl">
            {property.name}
          </h3>
          {location && (
            <p className="flex items-center gap-1.5 text-[13px] text-[#64748B]">
              <MapPin className="h-3.5 w-3.5 shrink-0 opacity-70" />
              {location}
            </p>
          )}
        </div>

        <div className="mt-5 space-y-5">
          <PhaseProgress progress={property.progress} compact tone="brand" />

          <PropertyFinancialMetrics
            purchasePrice={formatCurrency(property.purchase_price)}
            estimatedSalePrice={formatCurrency(property.estimated_sale_price)}
            estimatedProfit={formatCurrency(property.estimated_profit)}
          />
        </div>

        <Link
          href={`/transparency/${property.slug}`}
          className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors group-hover:text-[#39AFF2]"
        >
          Ver detalhes
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  );
}
