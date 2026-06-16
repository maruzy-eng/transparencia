export const PROPERTY_STATUSES = [
  "analysis",
  "under_contract",
  "purchased",
  "permitting",
  "renovation",
  "listing",
  "under_offer",
  "sold",
  "paused",
] as const;

export const PROJECT_TYPES = [
  "flip_house",
  "new_construction",
  "rental",
] as const;

export const VISIBILITY_OPTIONS = [
  "public",
  "investor",
  "team",
  "admin",
] as const;

export const PHASE_STATUSES = [
  "pending",
  "in_progress",
  "completed",
  "skipped",
] as const;

export const UPDATE_TYPES = [
  "general",
  "milestone",
  "financial",
  "issue",
] as const;

export const MEDIA_TYPES = ["photo", "video"] as const;

export type PropertyStatus = (typeof PROPERTY_STATUSES)[number];
export type ProjectType = (typeof PROJECT_TYPES)[number];
export type VisibilityOption = (typeof VISIBILITY_OPTIONS)[number];

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function visibilityLabel(visibility: string): string {
  const labels: Record<string, string> = {
    public: "Pública",
    investor: "Investidor",
    team: "Equipe",
    admin: "Admin",
  };
  return labels[visibility] ?? visibility;
}

export function phaseStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "Pendente",
    in_progress: "Em andamento",
    completed: "Concluída",
    skipped: "Ignorada",
  };
  return labels[status] ?? status;
}

export function updateTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    general: "Geral",
    milestone: "Marco",
    financial: "Financeiro",
    issue: "Problema",
  };
  return labels[type] ?? type;
}
