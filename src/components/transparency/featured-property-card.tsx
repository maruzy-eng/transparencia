import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { PropertyCoverImage, PROPERTY_HOME_COVER_ASPECT_CLASS } from "@/components/transparency/property-cover-image";
import { PropertyFinancialMetrics } from "@/components/transparency/property-financial-metrics";
import { PhaseProgress } from "@/components/transparency/phase-progress";
import { StatusBadge } from "@/components/transparency/status-badge";
import {
  formatCurrency,
  projectTypeLabel,
} from "@/lib/transparency/labels";
import { getPropertyListingCoverUrl } from "@/lib/transparency/media-helpers";
import type { Property } from "@/lib/transparency/types";
import { cn } from "@/lib/utils";

interface FeaturedPropertyCardProps {
  property: Property;
  coverImageUrl?: string | null;
}

export function FeaturedPropertyCard({
  property,
  coverImageUrl = null,
}: FeaturedPropertyCardProps) {
  const location = [property.city, property.state].filter(Boolean).join(", ");
  const imageUrl = getPropertyListingCoverUrl(property, coverImageUrl);
  const propertyHref = `/transparency/${property.slug}`;

  return (
    <article className="relative min-w-0 overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
      <Link
        href={propertyHref}
        className={cn(
          "relative block overflow-hidden bg-[#F8FAFC]",
          PROPERTY_HOME_COVER_ASPECT_CLASS,
        )}
        aria-label={`Ver detalhes de ${property.name}`}
      >
        <PropertyCoverImage
          src={imageUrl}
          alt={property.name}
          priority
          sizes="(max-width: 1024px) 100vw, 560px"
          imageClassName="transition-transform duration-700 hover:scale-[1.02]"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
          <StatusBadge status={property.status} tone="light" />
          {property.project_type && (
            <span className="rounded-full border border-white/60 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748B] backdrop-blur-sm">
              {projectTypeLabel(property.project_type)}
            </span>
          )}
        </div>
      </Link>

      <div className="space-y-5 p-5 sm:p-6 lg:p-7">
        <div className="min-w-0 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#39AFF2]">
            Projeto em destaque
          </p>
          <h2 className="text-2xl font-bold leading-tight tracking-[-0.03em] break-words text-[#0F172A] sm:text-[1.75rem]">
            {property.name}
          </h2>
          {location && (
            <p className="flex items-center gap-1.5 text-sm text-[#64748B]">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {location}
            </p>
          )}
        </div>

        <div className="rounded-[18px] border border-[#E2E8F0] bg-[#FAFBFC] p-4 sm:p-5">
          <PhaseProgress progress={property.progress} compact tone="brand" />

          <PropertyFinancialMetrics
            className="mt-5 border-t-0 pt-0"
            purchasePrice={formatCurrency(property.purchase_price)}
            estimatedSalePrice={formatCurrency(property.estimated_sale_price)}
            estimatedProfit={formatCurrency(property.estimated_profit)}
            valueSize="featured"
          />
        </div>

        <Link
          href={propertyHref}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#0F172A] bg-[#0F172A] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#12313F] sm:w-auto sm:px-6"
        >
          <span>Ver detalhes do projeto</span>
          <ArrowRight className="h-4 w-4 shrink-0" />
        </Link>
      </div>
    </article>
  );
}
