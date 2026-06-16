"use client";

import { projectTypeLabel, statusLabel } from "@/lib/transparency/labels";
import { cn } from "@/lib/utils";

export type PropertyFilterValue =
  | "all"
  | "renovation"
  | "permitting"
  | "listing"
  | "sold"
  | "flip_house"
  | "new_construction";

interface PropertyFiltersProps {
  value: PropertyFilterValue;
  onChange: (value: PropertyFilterValue) => void;
}

const filters: Array<{ value: PropertyFilterValue; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "renovation", label: statusLabel("renovation") },
  { value: "permitting", label: statusLabel("permitting") },
  { value: "listing", label: statusLabel("listing") },
  { value: "sold", label: statusLabel("sold") },
  { value: "flip_house", label: projectTypeLabel("flip_house") },
  { value: "new_construction", label: projectTypeLabel("new_construction") },
];

export function PropertyFilters({ value, onChange }: PropertyFiltersProps) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {filters.map((filter) => {
        const isActive = value === filter.value;

        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChange(filter.value)}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
              isActive
                ? "checkmate-filter-active"
                : "border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#CBD5E1] hover:text-[#0F172A]",
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
