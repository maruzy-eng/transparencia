import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Property } from "@/lib/transparency/types";
import {
  calculateEstimatedRoi,
  formatCurrency,
  formatPercent,
} from "@/lib/utils";

interface PropertyKpisProps {
  property: Property;
}

const kpiConfig = [
  {
    key: "purchase_price",
    label: "Valor de compra",
    accent: false,
  },
  {
    key: "estimated_rehab_budget",
    label: "Orçamento de obra",
    accent: false,
  },
  {
    key: "current_spent",
    label: "Valor gasto atual",
    accent: false,
  },
  {
    key: "estimated_sale_price",
    label: "Venda projetada",
    accent: false,
  },
  {
    key: "estimated_profit",
    label: "Lucro estimado",
    accent: true,
  },
  {
    key: "progress",
    label: "Andamento",
    accent: false,
    isPercent: true,
  },
] as const;

export function PropertyKpis({ property }: PropertyKpisProps) {
  const estimatedRoi = calculateEstimatedRoi(
    property.estimated_profit,
    property.purchase_price,
  );

  const values: Record<string, string> = {
    purchase_price: formatCurrency(property.purchase_price),
    estimated_rehab_budget: formatCurrency(property.estimated_rehab_budget),
    current_spent: formatCurrency(property.current_spent),
    estimated_sale_price: formatCurrency(property.estimated_sale_price),
    estimated_profit: formatCurrency(property.estimated_profit),
    progress: formatPercent(property.progress),
    estimated_roi: formatPercent(estimatedRoi),
  };

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpiConfig.map((kpi) => (
        <Card key={kpi.key} className="bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {kpi.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={
                kpi.accent
                  ? "text-2xl font-semibold text-emerald-400"
                  : "text-2xl font-semibold"
              }
            >
              {"isPercent" in kpi && kpi.isPercent
                ? formatPercent(property.progress)
                : values[kpi.key]}
            </p>
          </CardContent>
        </Card>
      ))}
      <Card className="bg-card/70">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            ROI estimado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold text-amber-400">
            {values.estimated_roi}
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
