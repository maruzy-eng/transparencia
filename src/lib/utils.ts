import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export {
  formatCurrency,
  formatDate,
  formatPercent,
} from "@/lib/transparency/labels";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateEstimatedRoi(
  estimatedProfit: number | null | undefined,
  purchasePrice: number | null | undefined,
): number | null {
  if (
    estimatedProfit == null ||
    purchasePrice == null ||
    purchasePrice <= 0
  ) {
    return null;
  }
  return (estimatedProfit / purchasePrice) * 100;
}
