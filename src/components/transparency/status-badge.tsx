import { Badge } from "@/components/ui/badge";

import { statusLabel } from "@/lib/transparency/labels";
import { cn } from "@/lib/utils";

const darkStatusVariants: Record<
  string,
  "default" | "secondary" | "success" | "warning" | "muted" | "outline"
> = {
  analysis: "muted",
  under_contract: "secondary",
  purchased: "default",
  permitting: "warning",
  renovation: "warning",
  listing: "default",
  under_offer: "secondary",
  sold: "success",
  paused: "outline",
};

const lightStatusClasses: Record<string, string> = {
  analysis: "border-[#E8EDF3] bg-[#F4F7FA] text-[#64748B]",
  under_contract: "border-[#DDF0FF] bg-[#F0F9FF] text-[#0284C7]",
  purchased: "border-[#E8EDF3] bg-white text-[#1A1A1A]",
  permitting: "border-[#FEF3C7] bg-[#FFFBEB] text-[#B45309]",
  renovation: "border-[#FEF3C7] bg-[#FFFBEB] text-[#B45309]",
  listing: "border-[#DDF0FF] bg-[#F0F9FF] text-[#0284C7]",
  under_offer: "border-[#E8EDF3] bg-[#F4F7FA] text-[#1A1A1A]",
  sold: "border-[#DDF8E8] bg-[#EEF9F3] text-[#15803D]",
  paused: "border-[#E8EDF3] bg-white text-[#64748B]",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
  tone?: "default" | "light";
}

export function StatusBadge({
  status,
  className,
  tone = "default",
}: StatusBadgeProps) {
  if (tone === "light") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "border font-medium",
          lightStatusClasses[status] ??
            "border-[#E2E8F0] bg-white text-[#64748B]",
          className,
        )}
      >
        {statusLabel(status)}
      </Badge>
    );
  }

  const variant = darkStatusVariants[status] ?? "outline";

  return (
    <Badge variant={variant} className={className}>
      {statusLabel(status)}
    </Badge>
  );
}
