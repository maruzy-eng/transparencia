import { formatDate } from "@/lib/transparency/labels";
import type { DashboardRecentUpdate } from "@/lib/admin/queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DashboardRecentActivityProps {
  items: DashboardRecentUpdate[];
}

function visibilityLabel(visibility: string): string {
  if (visibility === "public") return "Pública";
  if (visibility === "investor") return "Investidor";
  if (visibility === "team") return "Equipe";
  if (visibility === "admin") return "Admin";
  return visibility;
}

export function DashboardRecentActivity({
  items,
}: DashboardRecentActivityProps) {
  return (
    <Card className="border-[#E2E8F0] bg-white p-6 shadow-none">
      <h2 className="text-base font-semibold text-[#0F172A]">
        Últimas atualizações
      </h2>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-[#64748B]">
          Nenhuma atualização registrada ainda.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-[#E2E8F0]">
          {items.map((item) => (
            <li key={item.id} className="flex flex-col gap-2 py-4 first:pt-0">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#0F172A]">
                    {item.title}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-[#64748B]">
                    {item.property_name}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="shrink-0 border-[#E2E8F0] bg-[#FAFBFC] text-[#64748B]"
                >
                  {visibilityLabel(item.visibility)}
                </Badge>
              </div>
              <p className="text-xs text-[#94A3B8]">
                {formatDate(item.created_at)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
