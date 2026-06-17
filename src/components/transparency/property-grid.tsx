import type { Property } from "@/lib/transparency/types";
import { cn } from "@/lib/utils";

import { PropertyCard } from "@/components/transparency/property-card";

interface PropertyGridProps {
  properties: Property[];
  firstImageByPropertyId?: Record<string, string | null>;
  className?: string;
}

export function PropertyGrid({
  properties,
  firstImageByPropertyId = {},
  className,
}: PropertyGridProps) {
  const isSingle = properties.length === 1;
  const highlightFirst = properties.length >= 3;

  return (
    <div
      className={cn(
        "grid w-full gap-5 sm:gap-6",
        isSingle
          ? "grid-cols-1"
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {properties.map((property, index) => (
        <div
          key={property.id}
          className={cn("min-w-0", isSingle && "mx-auto w-full max-w-md lg:max-w-lg")}
        >
          <PropertyCard
            property={property}
            coverImageUrl={firstImageByPropertyId[property.id] ?? null}
            emphasized={highlightFirst && index === 0}
          />
        </div>
      ))}
    </div>
  );
}
