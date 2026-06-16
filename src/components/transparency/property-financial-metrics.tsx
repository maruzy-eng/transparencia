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
}: FinancialMetricProps) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-medium uppercase tracking-wide text-[#64748B] sm:text-[11px]">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-[13px] font-semibold leading-tight break-words sm:text-sm",
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
  const valueClasses =
    valueSize === "featured"
      ? "mt-1 text-[13px] font-semibold leading-tight break-words sm:text-sm lg:text-base"
      : undefined;

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-3 gap-y-4 border-t border-[#E2E8F0] pt-4 sm:grid-cols-3 sm:gap-x-4",
        className,
      )}
    >
      <FinancialMetric
        label="Compra"
        value={purchasePrice}
        valueClassName={cn(valueClasses, "text-[#0F172A]")}
      />
      <FinancialMetric
        label="Venda proj."
        value={estimatedSalePrice}
        valueClassName={cn(valueClasses, "text-[#0F172A]")}
      />
      <FinancialMetric
        label="Lucro est."
        value={estimatedProfit}
        valueClassName={cn(valueClasses, "text-[#53BC76]")}
      />
    </div>
  );
}
