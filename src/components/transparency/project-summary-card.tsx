import { PhaseProgress } from "@/components/transparency/phase-progress";
import { PropertyFinancialMetrics } from "@/components/transparency/property-financial-metrics";
import { formatCurrency } from "@/lib/transparency/labels";
import type { Property } from "@/lib/transparency/types";

interface ProjectSummaryCardProps {
  property: Property;
}

export function ProjectSummaryCard({ property }: ProjectSummaryCardProps) {
  return (
    <div className="rounded-[18px] border border-[#E2E8F0]/80 bg-white/95 p-4 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md sm:p-5">
      <PhaseProgress progress={property.progress} compact tone="brand" />

      <PropertyFinancialMetrics
        className="mt-5 border-t-0 pt-0"
        purchasePrice={formatCurrency(property.purchase_price)}
        estimatedSalePrice={formatCurrency(property.estimated_sale_price)}
        estimatedProfit={formatCurrency(property.estimated_profit)}
        valueSize="featured"
      />
    </div>
  );
}
