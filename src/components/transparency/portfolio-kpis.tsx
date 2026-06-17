import {
  Activity,
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

function formatCurrencyCompact(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `$${Math.round(value / 1_000)}K`;
  }

  return formatCurrency(value);
}

function PortfolioProgressRing({
  progress,
}: {
  progress: number | null;
}) {
  const value = Math.min(Math.max(progress ?? 0, 0), 100);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex h-[148px] w-[148px] items-center justify-center">
        <svg
          viewBox="0 0 128 128"
          className="h-full w-full -rotate-90"
          aria-hidden
        >
          <defs>
            <linearGradient
              id="portfolio-progress-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#53BC76" />
              <stop offset="50%" stopColor="#2EC7A6" />
              <stop offset="100%" stopColor="#39AFF2" />
            </linearGradient>
          </defs>
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="#E8EDF3"
            strokeWidth="10"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="url(#portfolio-progress-gradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold tracking-tight text-[#0F172A]">
            {formatPercent(value)}
          </span>
          <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">
            Andamento
          </span>
        </div>
      </div>
    </div>
  );
}

function PortfolioFinancialChart({ stats }: { stats: PortfolioStats }) {
  const bars = [
    {
      key: "purchase",
      label: "Adquirido",
      value: stats.totalPurchasePrice,
      gradient: "from-[#39AFF2]/90 to-[#2EC7A6]/80",
      glow: "shadow-[0_12px_28px_rgba(57,175,242,0.22)]",
    },
    {
      key: "sale",
      label: "Venda projetada",
      value: stats.totalEstimatedSalePrice,
      gradient: "from-[#2EC7A6]/90 to-[#53BC76]/85",
      glow: "shadow-[0_12px_28px_rgba(46,199,166,0.2)]",
    },
    {
      key: "profit",
      label: "Lucro estimado",
      value: stats.totalEstimatedProfit,
      gradient: "from-[#53BC76] to-[#39AFF2]",
      glow: "shadow-[0_14px_32px_rgba(83,188,118,0.28)]",
    },
  ];

  const maxValue = Math.max(...bars.map((bar) => bar.value), 1);
  const hasFinancialData = bars.some((bar) => bar.value > 0);

  return (
    <div className="relative min-h-[240px] rounded-[20px] border border-[#EEF2F6] bg-gradient-to-br from-[#FAFBFC] via-white to-[#F4FAFF] p-5 sm:p-6">
      <div
        className="pointer-events-none absolute inset-0 rounded-[20px] opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(15,23,42,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.03) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
            Distribuição financeira
          </p>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Comparativo agregado do portfólio publicado
          </p>
        </div>
      </div>

      {!hasFinancialData ? (
        <div className="relative flex h-40 items-center justify-center rounded-[16px] border border-dashed border-[#E2E8F0] bg-white/70 text-sm text-[#94A3B8]">
          Valores financeiros aparecerão quando houver dados cadastrados.
        </div>
      ) : (
        <div className="relative flex h-44 items-end justify-center gap-5 sm:gap-8 md:gap-10">
          {[0, 25, 50, 75].map((line) => (
            <div
              key={line}
              className="pointer-events-none absolute inset-x-0 border-t border-[#E8EDF3]/80"
              style={{ bottom: `${line}%` }}
            />
          ))}

          {bars.map((bar) => {
            const heightPercent = Math.max((bar.value / maxValue) * 100, 6);

            return (
              <div
                key={bar.key}
                className="group relative flex h-full w-full max-w-[88px] flex-col items-center justify-end"
              >
                <span
                  className={cn(
                    "mb-2 text-[11px] font-semibold tabular-nums sm:text-xs",
                    bar.key === "profit" ? "text-[#0F766E]" : "text-[#475569]",
                  )}
                >
                  {formatCurrencyCompact(bar.value)}
                </span>
                <div
                  className={cn(
                    "w-full rounded-t-[16px] bg-gradient-to-t transition-transform duration-500 group-hover:scale-[1.02]",
                    bar.gradient,
                    bar.glow,
                    bar.key === "profit" && "ring-1 ring-[#53BC76]/20",
                  )}
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="mt-3 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#64748B]">
                  {bar.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const summaryMetrics = [
  {
    key: "publishedCount",
    label: "Projetos publicados",
    icon: Building2,
    format: (stats: PortfolioStats) => String(stats.publishedCount),
  },
  {
    key: "activeCount",
    label: "Projetos ativos",
    icon: Activity,
    format: (stats: PortfolioStats) => String(stats.activeCount),
  },
  {
    key: "totalPurchasePrice",
    label: "Valor total adquirido",
    icon: CircleDollarSign,
    format: (stats: PortfolioStats) => formatCurrency(stats.totalPurchasePrice),
  },
  {
    key: "totalEstimatedSalePrice",
    label: "Venda projetada total",
    icon: TrendingUp,
    format: (stats: PortfolioStats) =>
      formatCurrency(stats.totalEstimatedSalePrice),
  },
  {
    key: "totalEstimatedProfit",
    label: "Lucro estimado total",
    icon: TrendingUp,
    format: (stats: PortfolioStats) =>
      formatCurrency(stats.totalEstimatedProfit),
  },
] as const;

export function PortfolioKpis({ stats }: PortfolioKpisProps) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
      <div className="border-b border-[#F1F5F9] bg-gradient-to-r from-white via-[#FAFBFC] to-[#F4FAFF] px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#39AFF2]">
              Panorama do portfólio
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-[-0.03em] text-[#0F172A] sm:text-2xl">
              Performance em números
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[#64748B]">
            Visão consolidada dos projetos publicados com leitura financeira e
            operacional.
          </p>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.85fr)]">
        <div className="border-b border-[#F1F5F9] p-5 sm:p-7 lg:border-b-0 lg:border-r">
          <PortfolioFinancialChart stats={stats} />
        </div>

        <div className="flex flex-col justify-between gap-6 p-5 sm:p-7">
          <PortfolioProgressRing progress={stats.averageProgress} />

          <div className="grid grid-cols-2 gap-3">
            {summaryMetrics.slice(0, 2).map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.key}
                  className="rounded-[16px] border border-[#EEF2F6] bg-[#FAFBFC] px-3.5 py-4"
                >
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-[0_4px_14px_rgba(15,23,42,0.05)]">
                    <Icon className="h-4 w-4 text-[#39AFF2]" strokeWidth={1.75} />
                  </div>
                  <p className="text-lg font-bold tracking-tight text-[#0F172A]">
                    {item.format(stats)}
                  </p>
                  <p className="mt-1 text-[10px] leading-snug text-[#64748B]">
                    {item.label}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 divide-y border-t border-[#F1F5F9] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {summaryMetrics.slice(2).map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.key}
              className="flex min-w-0 items-center gap-4 px-5 py-5 sm:px-6"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#F4FAFF] to-[#EEF9F3]">
                <Icon
                  className={cn(
                    "h-5 w-5",
                    item.key === "totalEstimatedProfit"
                      ? "text-[#53BC76]"
                      : "text-[#39AFF2]",
                  )}
                  strokeWidth={1.75}
                />
              </div>
              <div className="min-w-0">
                <p
                  className={cn(
                    "truncate text-base font-bold tracking-tight sm:text-lg",
                    item.key === "totalEstimatedProfit"
                      ? "text-[#0F766E]"
                      : "text-[#0F172A]",
                  )}
                >
                  {item.format(stats)}
                </p>
                <p className="mt-0.5 text-[11px] text-[#64748B]">{item.label}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
