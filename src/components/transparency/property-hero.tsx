import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";

import { ProjectSummaryCard } from "@/components/transparency/project-summary-card";
import { StatusBadge } from "@/components/transparency/status-badge";
import { formatDate, projectTypeLabel } from "@/lib/transparency/labels";
import type { Property } from "@/lib/transparency/types";

interface PropertyHeroProps {
  property: Property;
}

export function PropertyHero({ property }: PropertyHeroProps) {
  const location = [property.city, property.state].filter(Boolean).join(", ");

  return (
    <section className="overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      <div className="relative min-h-[340px] sm:min-h-[380px]">
        {property.cover_image_url ? (
          <Image
            src={property.cover_image_url}
            alt={property.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1240px) 100vw, 1240px"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#F1F5F9] via-[#E2E8F0] to-[#CBD5E1]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/75 via-[#0F172A]/35 to-[#0F172A]/10" />

        <div className="relative flex h-full min-h-[340px] flex-col justify-end gap-6 p-6 sm:min-h-[380px] sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <StatusBadge status={property.status} tone="light" />
              {property.project_type && (
                <span className="rounded-full border border-white/50 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748B] backdrop-blur-sm">
                  {projectTypeLabel(property.project_type)}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-[-0.03em] break-words text-white sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
                {property.name}
              </h1>
              {location && (
                <p className="mt-2 flex items-center gap-2 text-sm text-white/85 sm:text-base">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {location}
                </p>
              )}
            </div>

            {property.description && (
              <p className="max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
                {property.description}
              </p>
            )}

            {property.last_updated_at && (
              <p className="flex items-center gap-2 text-xs text-white/70 sm:text-sm">
                <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                Atualizado em {formatDate(property.last_updated_at)}
              </p>
            )}
          </div>

          <div className="w-full shrink-0 lg:max-w-[360px]">
            <ProjectSummaryCard property={property} />
          </div>
        </div>
      </div>
    </section>
  );
}
