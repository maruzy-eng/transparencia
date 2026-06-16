"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { CheckmateLogo } from "@/components/transparency/checkmate-logo";
import type { TransparencySiteSettings } from "@/lib/transparency/settings-types";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projetos", href: "/transparency#projetos" },
];

function isActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-30 border-b border-[#E2E8F0]/80 bg-white/88 backdrop-blur-md">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-8">
        <div className="flex h-[68px] items-center gap-4">
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

            <button
              type="button"
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] transition-colors hover:bg-[#F8FAFC] md:hidden"
            >
              {mobileOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label="Fechar menu"
            className="fixed inset-0 z-40 bg-[#0F172A]/15 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 w-full max-w-xs border-b border-l border-[#E2E8F0] bg-white px-5 py-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:px-6 md:hidden">
            <nav className="flex flex-col gap-0.5">
              {navLinks.map((item) => {
                const active = isActive(item.href, pathname);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-[#F0FDFA] text-[#0F766E]"
                        : "text-[#0F172A] hover:bg-[#F8FAFC]",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <Link
              href="/admin/login"
              onClick={() => setMobileOpen(false)}
              className="checkmate-gradient mt-3 inline-flex h-10 w-full items-center justify-center rounded-lg text-sm font-semibold text-white"
            >
              Login
            </Link>
          </div>
        </>
      )}
    </header>
  );
}
