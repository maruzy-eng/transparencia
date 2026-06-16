import Link from "next/link";
import { ExternalLink, Globe } from "lucide-react";

import { CheckmateLogo } from "@/components/transparency/checkmate-logo";
import type { TransparencyPageContent } from "@/lib/transparency/content-types";
import type { TransparencySiteSettings } from "@/lib/transparency/settings-types";

interface TransparencyFooterProps {
  content: TransparencyPageContent["footer"];
  settings: TransparencySiteSettings;
}

export function TransparencyFooter({ content, settings }: TransparencyFooterProps) {
  const footerText = content.text || settings.footerText;

  return (
    <footer className="relative z-10 border-t border-[#E2E8F0] bg-[#FAFBFC]">
      <div className="mx-auto flex max-w-[1240px] flex-col items-center gap-5 px-5 py-8 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <Link href="/transparency" className="shrink-0 opacity-90">
          <CheckmateLogo compact settings={settings} />
        </Link>

        <p className="max-w-md text-center text-sm text-[#64748B]">
          {footerText}
        </p>

        <div className="flex items-center gap-2">
          <a
            href="https://checkmateproperty.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Site Checkmate Property"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#64748B] transition-colors hover:border-[#39AFF2]/30 hover:text-[#39AFF2]"
          >
            <Globe className="h-4 w-4" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Checkmate Property"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#64748B] transition-colors hover:border-[#39AFF2]/30 hover:text-[#39AFF2]"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
