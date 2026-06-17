"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { CheckmateLogo } from "@/components/transparency/checkmate-logo";
import type { TransparencySiteSettings } from "@/lib/transparency/settings-types";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/transparency" },
  { label: "Projetos", href: "/transparency#projetos" },
];

function isActive(href: string, pathname: string) {
  if (href === "/transparency" && !href.includes("#")) {
    return pathname === "/transparency";
  }
  if (href.startsWith("/transparency")) {
    return pathname === "/transparency" || pathname.startsWith("/transparency/");
  }
  return false;
}

interface TransparencyHeaderProps {
  settings: TransparencySiteSettings;
}

export function TransparencyHeader({ settings }: TransparencyHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-[#E2E8F0]/80 bg-white/88 backdrop-blur-md">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-8">
        <div className="flex h-[60px] items-center gap-4 md:h-[68px]">
          <Link href="/transparency" className="shrink-0 py-1">
            <CheckmateLogo settings={settings} />
          </Link>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <nav className="hidden items-center gap-0.5 md:flex">
              {navLinks.map((item) => {
                const active = isActive(item.href, pathname);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                      active
                        ? "bg-[#F0FDFA] text-[#0F766E]"
                        : "text-[#64748B] hover:text-[#0F172A]",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <Link
              href="/admin/login"
              className="checkmate-gradient hidden h-9 shrink-0 items-center justify-center rounded-lg px-4 text-[13px] font-semibold text-white transition-all hover:brightness-[1.03] md:inline-flex"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
