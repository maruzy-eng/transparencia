import { TransparencyFooter } from "@/components/transparency/transparency-footer";
import { TransparencyHeader } from "@/components/transparency/transparency-header";
import type { TransparencyPageContent } from "@/lib/transparency/content-types";
import type { TransparencySiteSettings } from "@/lib/transparency/settings-types";
import { cn } from "@/lib/utils";

interface TransparencyShellProps {
  children: React.ReactNode;
  className?: string;
  settings: TransparencySiteSettings;
  footerContent: TransparencyPageContent["footer"];
}

export function TransparencyShell({
  children,
  className,
  settings,
  footerContent,
}: TransparencyShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FAFBFC] text-[#0F172A]">
      <div className="transparency-page-bg pointer-events-none absolute inset-0" />
      <div className="transparency-shape transparency-shape-one" />
      <div className="transparency-shape transparency-shape-two" />

      <TransparencyHeader settings={settings} />

      <main
        className={cn(
          "relative z-10 mx-auto w-full max-w-[1240px] px-5 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16",
          className,
        )}
      >
        {children}
      </main>

      <TransparencyFooter content={footerContent} settings={settings} />
    </div>
  );
}
