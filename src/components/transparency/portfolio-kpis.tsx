import {
  Activity,
  BarChart3,
  Building2,
  CircleDollarSign,
  TrendingUp,
} from "lucide-react";

import type { PortfolioStats } from "@/lib/transparency/portfolio-stats";
import {
  formatCurrency,
  formatPercent,
} from "@/lib/transparency/labels";
import { cn } from "@/lib/utils";

interface PortfolioKpisProps {
  stats: PortfolioStats;
}

const kpiItems = [
  {
    key: "publishedCount",
    label: "Projetos publicados",
    icon: Building2,
    accent: false,
    format: (stats: PortfolioStats) => String(stats.publishedCount),
  },
  {
    key: "activeCount",
    label: "Projetos ativos",
    icon: Activity,
    accent: false,
    format: (stats: PortfolioStats) => String(stats.activeCount),
  },
  {
    key: "totalPurchasePrice",
    label: "Valor total adquirido",
    icon: CircleDollarSign,
    accent: false,
    format: (stats: PortfolioStats) => formatCurrency(stats.totalPurchasePrice),
  },
  {
    key: "totalEstimatedSalePrice",
    label: "Venda projetada total",
    icon: TrendingUp,
    accent: false,
    format: (stats: PortfolioStats) =>
      formatCurrency(stats.totalEstimatedSalePrice),
  },
  {
    key: "totalEstimatedProfit",
    label: "Lucro estimado total",
    icon: TrendingUp,
    accent: true,
    format: (stats: PortfolioStats) =>
      formatCurrency(stats.totalEstimatedProfit),
  },
  {
    key: "averageProgress",
    label: "Média de andamento",
    icon: BarChart3,
    accent: false,
    format: (stats: PortfolioStats) => formatPercent(stats.averageProgress),
  },
] as const;

export function PortfolioKpis({ stats }: PortfolioKpisProps) {
  return (
    <section className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 2xl:grid-cols-6">
      {kpiItems.map((item) => {
        const Icon = item.icon;

        return (
          <article
            key={item.key}
            className="flex min-h-[132px] min-w-0 flex-col overflow-hidden rounded-[18px] border border-[#E2E8F0] bg-white px-4 py-5 sm:min-h-[140px] sm:px-5"
          >
            <div className="mb-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F4F7FA]">
              <Icon className="h-4 w-4 text-[#39AFF2]" strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-lg font-bold leading-tight tracking-tight break-words xl:text-xl 2xl:text-2xl",
                  item.accent ? "text-[#53BC76]" : "text-[#0F172A]",
                )}
              >
                {item.format(stats)}
              </p>
              <p className="mt-2.5 text-[11px] leading-snug text-[#64748B] sm:text-xs">
                {item.label}
              </p>
            </div>
          </article>
        );
      })}
    </section>
  );
}
