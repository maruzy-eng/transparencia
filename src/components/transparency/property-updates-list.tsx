import { formatDate, updateTypeLabel } from "@/lib/transparency/labels";
import type { PropertyUpdate } from "@/lib/transparency/types";
import { cn } from "@/lib/utils";

interface PropertyUpdatesListProps {
  updates: PropertyUpdate[];
}

function updateTypeBadgeClass(type: string): string {
  switch (type) {
    case "construction":
      return "border-[#FEF3C7] bg-[#FFFBEB] text-[#B45309]";
    case "financial":
      return "border-[#DDF0FF] bg-[#F0F9FF] text-[#0284C7]";
    case "document":
      return "border-[#E8EDF3] bg-[#F4F7FA] text-[#64748B]";
    case "media":
      return "border-[#EDE9FE] bg-[#F5F3FF] text-[#7C3AED]";
    case "sale":
      return "border-[#DDF8E8] bg-[#EEF9F3] text-[#15803D]";
    default:
      return "border-[#E8EDF3] bg-[#F4F7FA] text-[#64748B]";
  }
}

export function PropertyUpdatesList({ updates }: PropertyUpdatesListProps) {
  return (
    <section className="rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-[0_4px_24px_rgba(15,23,42,0.04)] sm:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold tracking-tight text-[#0F172A]">
          Atualizações recentes
        </h2>
        <p className="mt-1 text-sm text-[#64748B]">
          Registros publicados pela equipe Checkmate
        </p>
      </div>

      {updates.length === 0 ? (
        <p className="text-sm text-[#64748B]">
          Nenhuma atualização publicada para este projeto ainda.
        </p>
      ) : (
        <div className="space-y-4">
          {updates.map((update) => (
            <article
              key={update.id}
              className="rounded-[14px] border border-[#E2E8F0] bg-[#FAFBFC] p-4 transition-colors hover:border-[#CBD5E1]"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="min-w-0 font-semibold break-words text-[#0F172A]">
                  {update.title}
                </h3>
                <span
                  className={cn(
                    "shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                    updateTypeBadgeClass(update.update_type),
                  )}
                >
                  {updateTypeLabel(update.update_type)}
                </span>
              </div>
              <p className="mt-2 text-xs text-[#64748B]">
                {formatDate(update.created_at)}
              </p>
              {update.description && (
                <p className="mt-3 text-sm leading-relaxed text-[#64748B]">
                  {update.description}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
