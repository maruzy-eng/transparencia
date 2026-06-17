export function formatIntegerInput(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "";

  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatIntegerDigits(digits: string): string {
  if (!digits) return "";

  const num = Number(digits);
  if (!Number.isFinite(num)) return "";

  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 0,
  }).format(num);
}

export function parseFormattedNumber(value: string | number): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const trimmed = value.trim();
  if (!trimmed) return null;

  const normalized = trimmed.replace(/\./g, "").replace(",", ".");
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}
