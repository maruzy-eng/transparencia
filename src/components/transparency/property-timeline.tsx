import { CheckCircle2, Circle, Clock3 } from "lucide-react";

import { StatusBadge } from "@/components/transparency/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { PropertyPhase, PropertyUpdate } from "@/lib/transparency/types";
import { EmptyState } from "@/components/transparency/empty-state";

interface PropertyTimelineProps {
  phases: PropertyPhase[];
  updates: PropertyUpdate[];
}

function formatDate(date: string | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function PhaseIcon({ status }: { status: string }) {
  if (status === "completed") {
    return <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
  }
  if (status === "in_progress") {
    return <Clock3 className="h-5 w-5 text-amber-400" />;
  }
  return <Circle className="h-5 w-5 text-muted-foreground" />;
}

export function PropertyTimeline({ phases, updates }: PropertyTimelineProps) {
  if (phases.length === 0 && updates.length === 0) {
    return (
      <EmptyState
        title="Nenhuma atualização disponível"
        description="As fases e atualizações deste imóvel ainda não foram publicadas."
      />
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Fases do projeto</CardTitle>
        </CardHeader>
        <CardContent>
          {phases.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma fase publicada.
            </p>
          ) : (
            <ol className="space-y-6">
              {phases.map((phase, index) => (
                <li key={phase.id} className="relative pl-8">
                  {index < phases.length - 1 && (
                    <span className="absolute left-[9px] top-6 h-[calc(100%+0.5rem)] w-px bg-border" />
                  )}
                  <span className="absolute left-0 top-0.5">
                    <PhaseIcon status={phase.status} />
                  </span>
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium">{phase.title}</h3>
                      <StatusBadge status={phase.status} />
                    </div>
                    {phase.description && (
                      <p className="text-sm text-muted-foreground">
                        {phase.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Atualizações recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {updates.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma atualização publicada.
            </p>
          ) : (
            <div className="space-y-6">
              {updates.map((update, index) => (
                <div key={update.id}>
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-medium">{update.title}</h3>
                      <span className="text-xs uppercase tracking-wide text-amber-400/80">
                        {update.update_type}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(update.created_at)}
                    </p>
                    {update.description && (
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {update.description}
                      </p>
                    )}
                  </div>
                  {index < updates.length - 1 && <Separator className="mt-6" />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
