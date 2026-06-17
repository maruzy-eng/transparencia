import {
  Activity,
  CircleDot,
  DollarSign,
  Hammer,
  Percent,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { StatusBadge } from "@/components/transparency/status-badge";
import {
  formatCurrency,
  formatPercent,
} from "@/lib/transparency/labels";
import type { Property } from "@/lib/transparency/types";
import { calculateEstimatedRoi, cn } from "@/lib/utils";

interface PropertyKpisProps {
  property: Property;
}

interface KpiItem {
  key: string;
  label: string;
  value: string;
  icon: typeof DollarSign;
  accent?: boolean;
  isStatus?: boolean;
}

export function PropertyKpis({ property }: PropertyKpisProps) {
  const estimatedRoi = calculateEstimatedRoi(
    property.estimated_profit,
    property.purchase_price,
  );

  const kpis: KpiItem[] = [
    {
      key: "purchase_price",
      label: "Valor de compra",
      value: formatCurrency(property.purchase_price),
      icon: DollarSign,
    },
    {
      key: "estimated_rehab_budget",
      label: "Orçamento de obra",
      value: formatCurrency(property.estimated_rehab_budget),
      icon: Hammer,
    },
    {
      key: "current_spent",
      label: "Valor gasto atual",
      value: formatCurrency(property.current_spent),
      icon: Receipt,
    },
    {
      key: "estimated_sale_price",
      label: "Venda projetada",
      value: formatCurrency(property.estimated_sale_price),
      icon: TrendingUp,
    },
    {
      key: "estimated_profit",
      label: "Lucro estimado",
      value: formatCurrency(property.estimated_profit),
      icon: Wallet,
      accent: true,
    },
    {
      key: "estimated_roi",
      label: "ROI estimado",
      value: formatPercent(estimatedRoi),
      icon: Percent,
    },
    {
      key: "progress",
      label: "Andamento",
      value: formatPercent(property.progress),
      icon: Activity,
    },
    {
      key: "status",
      label: "Status",
      value: "",
      icon: CircleDot,
      isStatus: true,
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;

        return (
          <div
            key={kpi.key}
            className="min-w-0 rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.03)] sm:p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] font-medium uppercase tracking-wide text-[#64748B]">
                {kpi.label}
              </p>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FAFBFC] text-[#64748B]">
                <Icon className="h-4 w-4" />
              </span>
            </div>

            {kpi.isStatus ? (
              <div className="mt-3">
                <StatusBadge status={property.status} tone="light" />
              </div>
            ) : (
              <p
                className={cn(
                  "mt-2 text-xl font-semibold break-words sm:text-2xl",
                  kpi.accent ? "text-[#53BC76]" : "text-[#0F172A]",
                )}
              >
                {kpi.value}
              </p>
            )}
          </div>
        );
      })}
    </section>
  );
}
