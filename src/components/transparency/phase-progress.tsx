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
      <div className="flex items-center justify-between text-sm">
        <span className={compact ? "text-muted-foreground" : "font-medium"}>
          Andamento
        </span>
        <span
          className={cn(
            compact ? "font-medium" : "font-medium",
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
