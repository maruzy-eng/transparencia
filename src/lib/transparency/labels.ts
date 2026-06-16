const STATUS_LABELS: Record<string, string> = {
  analysis: "Em análise",
  under_contract: "Em contrato",
  purchased: "Comprado",
  permitting: "Permits",
  renovation: "Em reforma",
  listing: "Listado",
  under_offer: "Under Offer",
  sold: "Vendido",
  paused: "Pausado",
};

const PROJECT_TYPE_LABELS: Record<string, string> = {
  flip_house: "Flip House",
  new_construction: "New Construction",
  rental: "Rental",
};

export function statusLabel(status: string | null | undefined): string {
  if (!status) return "—";
  return STATUS_LABELS[status] ?? status.replaceAll("_", " ");
}

export function projectTypeLabel(
  projectType: string | null | undefined,
): string {
  if (!projectType) return "—";
  return PROJECT_TYPE_LABELS[projectType] ?? projectType.replaceAll("_", " ");
}

export function formatCurrency(value: number | null | undefined): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatPercent(value: number | null | undefined): string {
  if (value == null) return "—";
  return `${value.toFixed(1)}%`;
}
