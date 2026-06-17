import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface FinancialMetricProps {
  label: string;
  value: ReactNode;
  valueClassName?: string;
}

function FinancialMetric({
  label,
  value,
  valueClassName,
  compact = false,
}: FinancialMetricProps & { compact?: boolean }) {
  return (
    <div className="min-w-0 overflow-hidden">
      <p
        className={cn(
          "font-medium uppercase tracking-wide text-[#64748B]",
          compact
            ? "truncate text-[9px] leading-tight sm:text-[10px]"
            : "text-[10px] sm:text-[11px]",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-0.5 font-semibold leading-tight tabular-nums",
          compact
            ? "truncate text-[10px] sm:text-[11px]"
            : "break-words text-[13px] sm:text-sm",
          valueClassName ?? "text-[#0F172A]",
        )}
      >
        {value}
      </p>
    </div>
  );
}

interface PropertyFinancialMetricsProps {
  purchasePrice: string;
  estimatedSalePrice: string;
  estimatedProfit: string;
  className?: string;
  valueSize?: "default" | "featured";
}

export function PropertyFinancialMetrics({
  purchasePrice,
  estimatedSalePrice,
  estimatedProfit,
  className,
  valueSize = "default",
}: PropertyFinancialMetricsProps) {
  const compact = valueSize === "featured";

  return (
    <div
      className={cn(
        "grid border-t border-[#E2E8F0] pt-4",
        compact
          ? "grid-cols-3 gap-x-2 gap-y-3 pt-0"
          : "grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 sm:gap-x-4",
        className,
      )}
    >
      <FinancialMetric
        label="Compra"
        value={purchasePrice}
        compact={compact}
        valueClassName="text-[#0F172A]"
      />
      <FinancialMetric
        label="Venda proj."
        value={estimatedSalePrice}
        compact={compact}
        valueClassName="text-[#0F172A]"
      />
      <FinancialMetric
        label="Lucro est."
        value={estimatedProfit}
        compact={compact}
        valueClassName="text-[#53BC76]"
      />
    </div>
  );
}
