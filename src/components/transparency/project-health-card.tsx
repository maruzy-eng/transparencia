import { AlertTriangle, CheckCircle2, PauseCircle } from "lucide-react";

import { PhaseProgress } from "@/components/transparency/phase-progress";
import { StatusBadge } from "@/components/transparency/status-badge";
import {
  formatCurrency,
  formatPercent,
  phaseStatusLabel,
} from "@/lib/transparency/labels";
import type { Property, PropertyPhase } from "@/lib/transparency/types";
import { cn } from "@/lib/utils";

interface ProjectHealthCardProps {
  property: Property;
  phases: PropertyPhase[];
}

type HealthIndicator = "finalizado" | "pausado" | "atencao" | "ok";

function getHealthIndicator(
  property: Property,
): { key: HealthIndicator; label: string } {
  if (property.status === "sold") {
    return { key: "finalizado", label: "Finalizado" };
  }
  if (property.status === "paused") {
    return { key: "pausado", label: "Pausado" };
  }
  if (
    property.current_spent != null &&
    property.estimated_rehab_budget != null &&
    property.current_spent > property.estimated_rehab_budget
  ) {
    return { key: "atencao", label: "Em atenção" };
  }
  return { key: "ok", label: "Dentro do orçamento" };
}

function getCurrentPhase(phases: PropertyPhase[]): PropertyPhase | null {
  const inProgress = phases.find((phase) => phase.status === "in_progress");
  if (inProgress) return inProgress;

  const completed = phases.filter((phase) => phase.status === "completed");
  if (completed.length > 0) {
    return completed[completed.length - 1];
  }

  return phases[0] ?? null;
}

function getBudgetUsedPercent(
  currentSpent: number | null,
  rehabBudget: number | null,
): number | null {
  if (currentSpent == null || rehabBudget == null || rehabBudget <= 0) {
    return null;
  }
  return Math.min((currentSpent / rehabBudget) * 100, 100);
}

const indicatorStyles: Record<
  HealthIndicator,
  { className: string; icon: typeof CheckCircle2 }
> = {
  finalizado: {
    className: "border-[#DDF8E8] bg-[#EEF9F3] text-[#15803D]",
    icon: CheckCircle2,
  },
  pausado: {
    className: "border-[#E8EDF3] bg-[#F4F7FA] text-[#64748B]",
    icon: PauseCircle,
  },
  atencao: {
    className: "border-[#FEF3C7] bg-[#FFFBEB] text-[#B45309]",
    icon: AlertTriangle,
  },
  ok: {
    className: "border-[#DDF8E8] bg-[#EEF9F3] text-[#15803D]",
    icon: CheckCircle2,
  },
};

export function ProjectHealthCard({
  property,
  phases,
}: ProjectHealthCardProps) {
  const indicator = getHealthIndicator(property);
  const indicatorStyle = indicatorStyles[indicator.key];
  const IndicatorIcon = indicatorStyle.icon;
  const currentPhase = getCurrentPhase(phases);
  const budgetUsed = getBudgetUsedPercent(
    property.current_spent,
    property.estimated_rehab_budget,
  );

  return (
    <section className="rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-[0_4px_24px_rgba(15,23,42,0.04)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-[#0F172A]">
            Saúde do projeto
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">
            Visão geral do andamento operacional e financeiro
          </p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
            indicatorStyle.className,
          )}
        >
          <IndicatorIcon className="h-3.5 w-3.5 shrink-0" />
          {indicator.label}
        </span>
      </div>

      <div className="mt-6 space-y-6">
        <PhaseProgress progress={property.progress} tone="brand" />

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="min-w-0 rounded-[14px] border border-[#E2E8F0] bg-[#FAFBFC] p-4">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#64748B]">
              Orçamento utilizado
            </p>
            <p className="mt-1 text-xl font-semibold break-words text-[#0F172A]">
              {budgetUsed != null ? formatPercent(budgetUsed) : "—"}
            </p>
            <p className="mt-1 text-xs break-words text-[#64748B]">
              {formatCurrency(property.current_spent)} de{" "}
              {formatCurrency(property.estimated_rehab_budget)}
            </p>
          </div>

          <div className="min-w-0 rounded-[14px] border border-[#E2E8F0] bg-[#FAFBFC] p-4">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#64748B]">
              Fase atual
            </p>
            <p className="mt-1 text-base font-semibold break-words text-[#0F172A]">
              {currentPhase?.title ?? "—"}
            </p>
            {currentPhase && (
              <p className="mt-1 text-xs text-[#64748B]">
                {phaseStatusLabel(currentPhase.status)}
              </p>
            )}
          </div>

          <div className="min-w-0 rounded-[14px] border border-[#E2E8F0] bg-[#FAFBFC] p-4">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#64748B]">
              Status operacional
            </p>
            <div className="mt-2">
              <StatusBadge status={property.status} tone="light" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
