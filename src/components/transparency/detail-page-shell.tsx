import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface DetailPageShellProps {
  children: React.ReactNode;
}

export function DetailPageShell({ children }: DetailPageShellProps) {
  return (
    <div className="space-y-6">
      <Link
        href="/transparency"
        className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium text-[#64748B] shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-[#CBD5E1] hover:text-[#0F172A]"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" />
        Voltar ao portfólio
      </Link>
      {children}
    </div>
  );
}
