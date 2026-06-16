import type { Property } from "@/lib/transparency/types";

export interface PortfolioStats {
  publishedCount: number;
  activeCount: number;
  totalPurchasePrice: number;
  totalEstimatedSalePrice: number;
  totalEstimatedProfit: number;
  averageProgress: number | null;
}

function sum(values: Array<number | null | undefined>): number {
  return values.reduce<number>((total, value) => total + (value ?? 0), 0);
}

function average(values: Array<number | null | undefined>): number | null {
  const valid = values.filter((value): value is number => value != null);
  if (valid.length === 0) return null;
  return valid.reduce((total, value) => total + value, 0) / valid.length;
}

export function computePortfolioStats(properties: Property[]): PortfolioStats {
  const activeCount = properties.filter(
    (property) => property.status !== "sold" && property.status !== "paused",
  ).length;

  return {
    publishedCount: properties.length,
    activeCount,
    totalPurchasePrice: sum(properties.map((property) => property.purchase_price)),
    totalEstimatedSalePrice: sum(
      properties.map((property) => property.estimated_sale_price),
    ),
    totalEstimatedProfit: sum(
      properties.map((property) => property.estimated_profit),
    ),
    averageProgress: average(properties.map((property) => property.progress)),
  };
}
