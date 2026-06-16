"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/card";
import type { DashboardChartData } from "@/lib/admin/dashboard-stats";

interface DashboardChartsProps {
  data: DashboardChartData;
  hasProperties: boolean;
}

const COLORS = {
  green: "#53BC76",
  teal: "#2EC7A6",
  blue: "#39AFF2",
  slate: "#64748B",
  grid: "#E2E8F0",
};

function formatUsd(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function ChartEmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-[280px] items-center justify-center rounded-xl border border-dashed border-[#E2E8F0] bg-[#FAFBFC] px-6 text-center">
      <p className="text-sm text-[#64748B]">{message}</p>
    </div>
  );
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-[#E2E8F0] bg-white p-5 shadow-none sm:p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-[#0F172A]">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-[#64748B]">{description}</p>
        ) : null}
      </div>
      {children}
    </Card>
  );
}

const tooltipStyle = {
  borderRadius: "8px",
  border: "1px solid #E2E8F0",
  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.06)",
};

export function DashboardCharts({ data, hasProperties }: DashboardChartsProps) {
  if (!hasProperties) {
    return (
      <ChartCard title="Visão gráfica">
        <ChartEmptyState message="Cadastre imóveis para visualizar os gráficos do portfólio." />
      </ChartCard>
    );
  }

  const statusHasData = data.byStatus.some((item) => item.count > 0);
  const typeHasData = data.byType.some((item) => item.count > 0);
  const financialHasData = data.financialComparison.some(
    (item) => item.purchase > 0 || item.estimatedSale > 0,
  );
  const profitHasData = data.profitByProject.some((item) => item.profit !== 0);
  const progressHasData = data.progressByProject.some(
    (item) => item.progress > 0,
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Projetos por status"
          description="Distribuição dos imóveis cadastrados."
        >
          {statusHasData ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={data.byStatus}
                layout="vertical"
                margin={{ top: 0, right: 8, left: 8, bottom: 0 }}
              >
                <CartesianGrid stroke={COLORS.grid} horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fill: COLORS.slate, fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={110}
                  tick={{ fill: COLORS.slate, fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [value, "Projetos"]}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {data.byStatus.map((_, index) => (
                    <Cell
                      key={`status-${index}`}
                      fill={index % 2 === 0 ? COLORS.green : COLORS.blue}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmptyState message="Sem dados de status para exibir." />
          )}
        </ChartCard>

        <ChartCard
          title="Projetos por tipo"
          description="Flip House, New Construction e Rental."
        >
          {typeHasData ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={data.byType}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid stroke={COLORS.grid} vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: COLORS.slate, fontSize: 12 }}
                  interval={0}
                  angle={-12}
                  textAnchor="end"
                  height={64}
                />
                <YAxis allowDecimals={false} tick={{ fill: COLORS.slate, fontSize: 12 }} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [value, "Projetos"]}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {data.byType.map((entry, index) => (
                    <Cell
                      key={entry.type}
                      fill={
                        index === 0
                          ? COLORS.green
                          : index === 1
                            ? COLORS.teal
                            : COLORS.blue
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmptyState message="Sem dados de tipo de projeto para exibir." />
          )}
        </ChartCard>
      </div>

      <ChartCard
        title="Valor de compra × venda projetada"
        description="Comparativo por imóvel (até 8 mais recentes)."
      >
        {financialHasData ? (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={data.financialComparison}
              margin={{ top: 8, right: 8, left: 0, bottom: 48 }}
            >
              <CartesianGrid stroke={COLORS.grid} vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: COLORS.slate, fontSize: 11 }}
                interval={0}
                angle={-18}
                textAnchor="end"
                height={72}
              />
              <YAxis
                tick={{ fill: COLORS.slate, fontSize: 12 }}
                tickFormatter={(value) => formatUsd(Number(value))}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, name) => [
                  formatUsd(Number(value)),
                  name === "purchase" ? "Compra" : "Venda projetada",
                ]}
              />
              <Legend
                formatter={(value) =>
                  value === "purchase" ? "Compra" : "Venda projetada"
                }
              />
              <Bar
                dataKey="purchase"
                fill={COLORS.slate}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="estimatedSale"
                fill={COLORS.blue}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ChartEmptyState message="Sem valores financeiros cadastrados." />
        )}
      </ChartCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Lucro estimado por projeto"
          description="Top imóveis por lucro estimado."
        >
          {profitHasData ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data.profitByProject}
                layout="vertical"
                margin={{ top: 0, right: 8, left: 8, bottom: 0 }}
              >
                <CartesianGrid stroke={COLORS.grid} horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: COLORS.slate, fontSize: 12 }}
                  tickFormatter={(value) => formatUsd(Number(value))}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{ fill: COLORS.slate, fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [formatUsd(Number(value)), "Lucro"]}
                />
                <Bar dataKey="profit" fill={COLORS.green} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmptyState message="Sem lucro estimado cadastrado." />
          )}
        </ChartCard>

        <ChartCard
          title="Andamento por projeto"
          description="Progresso percentual dos imóveis."
        >
          {progressHasData ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data.progressByProject}
                layout="vertical"
                margin={{ top: 0, right: 8, left: 8, bottom: 0 }}
              >
                <CartesianGrid stroke={COLORS.grid} horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fill: COLORS.slate, fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{ fill: COLORS.slate, fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [`${Number(value).toFixed(1)}%`, "Andamento"]}
                />
                <Bar dataKey="progress" fill={COLORS.teal} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmptyState message="Sem andamento registrado." />
          )}
        </ChartCard>
      </div>
    </div>
  );
}
