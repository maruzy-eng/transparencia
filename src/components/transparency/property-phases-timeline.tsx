import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  LoaderCircle,
} from "lucide-react";

import { formatDate, phaseStatusLabel } from "@/lib/transparency/labels";
import type { PropertyPhase } from "@/lib/transparency/types";
import { cn } from "@/lib/utils";

interface PropertyPhasesTimelineProps {
  phases: PropertyPhase[];
}

function PhaseIcon({ status }: { status: string }) {
  if (status === "completed") {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EEF9F3]">
        <CheckCircle2 className="h-4 w-4 text-[#15803D]" />
      </span>
    );
  }
  if (status === "in_progress") {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ECFDF5] ring-2 ring-[#2EC7A6]/30">
        <LoaderCircle className="h-4 w-4 text-[#0D9488]" />
      </span>
    );
  }
  if (status === "delayed") {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFFBEB]">
        <AlertTriangle className="h-4 w-4 text-[#D97706]" />
      </span>
    );
  }
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F4F7FA]">
      <Circle className="h-4 w-4 text-[#94A3B8]" />
    </span>
  );
}

function phaseStatusBadgeClass(status: string): string {
  switch (status) {
    case "completed":
      return "border-[#DDF8E8] bg-[#EEF9F3] text-[#15803D]";
    case "in_progress":
      return "border-[#CCFBF1] bg-[#F0FDFA] text-[#0D9488]";
    case "delayed":
      return "border-[#FEF3C7] bg-[#FFFBEB] text-[#B45309]";
    case "skipped":
      return "border-[#E8EDF3] bg-[#F4F7FA] text-[#64748B]";
    default:
      return "border-[#E8EDF3] bg-[#F4F7FA] text-[#64748B]";
  }
}

export function PropertyPhasesTimeline({ phases }: PropertyPhasesTimelineProps) {
  return (
    <section className="rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-[0_4px_24px_rgba(15,23,42,0.04)] sm:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold tracking-tight text-[#0F172A]">
          Fases do projeto
        </h2>
        <p className="mt-1 text-sm text-[#64748B]">
          Cronograma e marcos de execução
        </p>
      </div>

      {phases.length === 0 ? (
        <p className="text-sm text-[#64748B]">Nenhuma fase publicada.</p>
      ) : (
        <ol className="space-y-0">
          {phases.map((phase, index) => (
            <li key={phase.id} className="relative flex gap-4 pb-8 last:pb-0">
              {index < phases.length - 1 && (
                <span className="absolute left-[13px] top-8 h-[calc(100%-1rem)] w-px bg-[#E2E8F0]" />
              )}
              <div className="relative z-10 shrink-0">
                <PhaseIcon status={phase.status} />
              </div>
              <div className="min-w-0 flex-1 space-y-2 pt-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-[#0F172A]">{phase.title}</h3>
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                      phaseStatusBadgeClass(phase.status),
                    )}
                  >
                    {phaseStatusLabel(phase.status)}
                  </span>
                </div>
                {phase.description && (
                  <p className="text-sm leading-relaxed text-[#64748B]">
                    {phase.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#64748B]">
                  {phase.planned_date && (
                    <span>Previsto: {formatDate(phase.planned_date)}</span>
                  )}
                  {phase.completed_date && (
                    <span>Concluído: {formatDate(phase.completed_date)}</span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
