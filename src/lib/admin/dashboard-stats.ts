import {
  projectTypeLabel,
  statusLabel,
} from "@/lib/transparency/labels";
import type {
  DashboardProperty,
  DashboardRawData,
  DashboardRecentUpdate,
} from "@/lib/admin/queries";

const PROJECT_TYPES = ["flip_house", "new_construction", "rental"] as const;
const CHART_PROPERTY_LIMIT = 8;

export interface DashboardKpiItem {
  key: string;
  label: string;
  value: string;
  hint?: string;
}

export interface StatusCountItem {
  status: string;
  label: string;
  count: number;
  percentage: number;
}

export interface TypeCountItem {
  type: string;
  label: string;
  count: number;
}

export interface FinancialComparisonItem {
  id: string;
  name: string;
  purchase: number;
  estimatedSale: number;
}

export interface ProfitByProjectItem {
  id: string;
  name: string;
  profit: number;
}

export interface ProgressByProjectItem {
  id: string;
  name: string;
  progress: number;
}

export interface DashboardChartData {
  byStatus: StatusCountItem[];
  byType: TypeCountItem[];
  financialComparison: FinancialComparisonItem[];
  profitByProject: ProfitByProjectItem[];
  progressByProject: ProgressByProjectItem[];
}

export interface DashboardStats {
  kpis: DashboardKpiItem[];
  charts: DashboardChartData;
  recentUpdates: DashboardRecentUpdate[];
  hasProperties: boolean;
}

function sum(values: Array<number | null | undefined>): number {
  return values.reduce<number>((total, value) => total + (value ?? 0), 0);
}

function average(values: Array<number | null | undefined>): number {
  const valid = values.filter((value): value is number => value != null);
  if (valid.length === 0) return 0;
  return valid.reduce((total, value) => total + value, 0) / valid.length;
}

function truncateName(name: string, maxLength = 22): string {
  if (name.length <= maxLength) return name;
  return `${name.slice(0, maxLength - 1)}…`;
}

function countByStatus(properties: DashboardProperty[]): StatusCountItem[] {
  const total = properties.length;
  const counts = new Map<string, number>();

  for (const property of properties) {
    counts.set(property.status, (counts.get(property.status) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([status, count]) => ({
      status,
      label: statusLabel(status),
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

function countByType(properties: DashboardProperty[]): TypeCountItem[] {
  const counts = new Map<string, number>();

  for (const property of properties) {
    if (!property.project_type) continue;
    counts.set(
      property.project_type,
      (counts.get(property.project_type) ?? 0) + 1,
    );
  }

  return PROJECT_TYPES.map((type) => ({
    type,
    label: projectTypeLabel(type),
    count: counts.get(type) ?? 0,
  }));
}

function buildFinancialComparison(
  properties: DashboardProperty[],
): FinancialComparisonItem[] {
  return properties.slice(0, CHART_PROPERTY_LIMIT).map((property) => ({
    id: property.id,
    name: truncateName(property.name),
    purchase: property.purchase_price ?? 0,
    estimatedSale: property.estimated_sale_price ?? 0,
  }));
}

function buildProfitByProject(
  properties: DashboardProperty[],
): ProfitByProjectItem[] {
  return [...properties]
    .sort(
      (a, b) => (b.estimated_profit ?? 0) - (a.estimated_profit ?? 0),
    )
    .slice(0, CHART_PROPERTY_LIMIT)
    .map((property) => ({
      id: property.id,
      name: truncateName(property.name),
      profit: property.estimated_profit ?? 0,
    }));
}

function buildProgressByProject(
  properties: DashboardProperty[],
): ProgressByProjectItem[] {
  return [...properties]
    .sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0))
    .slice(0, CHART_PROPERTY_LIMIT)
    .map((property) => ({
      id: property.id,
      name: truncateName(property.name),
      progress: property.progress ?? 0,
    }));
}

function formatCount(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value);
}

function formatCurrencyValue(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercentValue(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function buildDashboardStats(data: DashboardRawData): DashboardStats {
  const { properties } = data;
  const publishedCount = properties.filter(
    (property) => property.is_published,
  ).length;
  const activeCount = properties.filter(
    (property) => property.status !== "sold" && property.status !== "paused",
  ).length;
  const soldCount = properties.filter(
    (property) => property.status === "sold",
  ).length;

  const kpis: DashboardKpiItem[] = [
    {
      key: "total",
      label: "Total de imóveis",
      value: formatCount(properties.length),
    },
    {
      key: "published",
      label: "Imóveis publicados",
      value: formatCount(publishedCount),
    },
    {
      key: "unpublished",
      label: "Imóveis não publicados",
      value: formatCount(properties.length - publishedCount),
    },
    {
      key: "active",
      label: "Projetos ativos",
      value: formatCount(activeCount),
      hint: "Exclui vendidos e pausados",
    },
    {
      key: "sold",
      label: "Projetos vendidos",
      value: formatCount(soldCount),
    },
    {
      key: "purchase",
      label: "Valor total adquirido",
      value: formatCurrencyValue(
        sum(properties.map((property) => property.purchase_price)),
      ),
    },
    {
      key: "estimated-sale",
      label: "Venda projetada total",
      value: formatCurrencyValue(
        sum(properties.map((property) => property.estimated_sale_price)),
      ),
    },
    {
      key: "estimated-profit",
      label: "Lucro estimado total",
      value: formatCurrencyValue(
        sum(properties.map((property) => property.estimated_profit)),
      ),
    },
    {
      key: "avg-progress",
      label: "Média de andamento",
      value: formatPercentValue(
        average(properties.map((property) => property.progress)),
      ),
    },
    {
      key: "media",
      label: "Fotos e vídeos",
      value: formatCount(data.mediaCount),
    },
    {
      key: "updates",
      label: "Atualizações publicadas",
      value: formatCount(data.publishedUpdatesCount),
      hint: "Visibilidade pública",
    },
    {
      key: "admins",
      label: "Usuários admin ativos",
      value: formatCount(data.activeAdminUsersCount),
    },
  ];

  return {
    kpis,
    charts: {
      byStatus: countByStatus(properties),
      byType: countByType(properties),
      financialComparison: buildFinancialComparison(properties),
      profitByProject: buildProfitByProject(properties),
      progressByProject: buildProgressByProject(properties),
    },
    recentUpdates: data.recentUpdates,
    hasProperties: properties.length > 0,
  };
}
