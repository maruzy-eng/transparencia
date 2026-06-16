import {
  Building2,
  Camera,
  CircleDollarSign,
  FileText,
  TrendingUp,
  Users,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import type { DashboardKpiItem } from "@/lib/admin/dashboard-stats";

interface DashboardKpisProps {
  items: DashboardKpiItem[];
}

const KPI_ICONS: Record<string, typeof Building2> = {
  total: Building2,
  published: Building2,
  unpublished: Building2,
  active: TrendingUp,
  sold: CircleDollarSign,
  purchase: CircleDollarSign,
  "estimated-sale": CircleDollarSign,
  "estimated-profit": TrendingUp,
  "avg-progress": TrendingUp,
  media: Camera,
  updates: FileText,
  admins: Users,
};

export function DashboardKpis({ items }: DashboardKpisProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {items.map((item) => {
        const Icon = KPI_ICONS[item.key] ?? Building2;

        return (
          <Card
            key={item.key}
            className="border-[#E2E8F0] bg-white p-5 shadow-none"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-[#64748B]">{item.label}</p>
                <p className="mt-2 break-words text-2xl font-semibold tracking-tight text-[#0F172A]">
                  {item.value}
                </p>
                {item.hint ? (
                  <p className="mt-1 text-xs text-[#94A3B8]">{item.hint}</p>
                ) : null}
              </div>
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E2E8F0] bg-[#FAFBFC]">
                <Icon className="h-4 w-4 text-[#39AFF2]" />
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
