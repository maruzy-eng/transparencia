import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-[22px] border border-dashed border-[#E2E8F0] bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#F4F7FA]">
        <Inbox className="h-5 w-5 text-[#64748B]" />
      </div>
      <div className="mx-auto mt-4 max-w-md space-y-2">
        <h2 className="text-base font-bold text-[#0F172A]">{title}</h2>
        <p className="text-sm leading-relaxed text-[#64748B]">{description}</p>
      </div>
    </div>
  );
}
