import type { StatusCountItem } from "@/lib/admin/dashboard-stats";
import { Card } from "@/components/ui/card";

interface DashboardStatusSummaryProps {
  items: StatusCountItem[];
}

export function DashboardStatusSummary({
  items,
}: DashboardStatusSummaryProps) {
  if (items.length === 0) {
    return (
      <Card className="border-[#E2E8F0] bg-white p-6 shadow-none">
        <h2 className="text-base font-semibold text-[#0F172A]">
          Resumo por status
        </h2>
        <p className="mt-4 text-sm text-[#64748B]">
          Nenhum imóvel cadastrado para exibir o resumo.
        </p>
      </Card>
    );
  }

  return (
    <Card className="border-[#E2E8F0] bg-white p-6 shadow-none">
      <h2 className="text-base font-semibold text-[#0F172A]">
        Resumo por status
      </h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.status} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-[#0F172A]">{item.label}</span>
              <span className="text-[#64748B]">
                {item.count}{" "}
                <span className="text-[#94A3B8]">
                  ({item.percentage.toFixed(0)}%)
                </span>
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#F1F5F9]">
              <div
                className="h-full rounded-full checkmate-gradient"
                style={{ width: `${Math.max(item.percentage, 4)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
