import { Progress } from "@/components/ui/progress";
import { cn, formatPercent } from "@/lib/utils";

interface PhaseProgressProps {
  progress: number | null;
  compact?: boolean;
  className?: string;
  tone?: "default" | "brand";
}

export function PhaseProgress({
  progress,
  compact = false,
  className,
  tone = "default",
}: PhaseProgressProps) {
  const value = Math.min(Math.max(progress ?? 0, 0), 100);

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "flex min-w-0 items-center justify-between gap-2",
          compact ? "text-xs" : "text-sm",
        )}
      >
        <span
          className={cn(
            "shrink-0",
            compact ? "text-[#64748B]" : "font-medium",
          )}
        >
          Andamento
        </span>
        <span
          className={cn(
            "shrink-0 tabular-nums font-semibold",
            tone === "brand" ? "text-[#39AFF2]" : "text-amber-400",
          )}
        >
          {formatPercent(value)}
        </span>
      </div>
      <Progress
        value={value}
        className={tone === "brand" ? "bg-[#E8EDF3]" : undefined}
        indicatorClassName={
          tone === "brand" ? "checkmate-gradient" : undefined
        }
      />
    </div>
  );
}
