"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Home, LogIn } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Início",
    href: "/transparency",
    icon: Home,
    match: (pathname: string, hash: string) =>
      pathname === "/transparency" && hash !== "#projetos",
  },
  {
    label: "Projetos",
    href: "/transparency#projetos",
    icon: Building2,
    match: (pathname: string, hash: string) =>
      pathname.startsWith("/transparency/") ||
      (pathname === "/transparency" && hash === "#projetos"),
  },
  {
    label: "Entrar",
    href: "/admin/login",
    icon: LogIn,
    match: (pathname: string) => pathname.startsWith("/admin"),
  },
] as const;

export function TransparencyBottomNav() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, [pathname]);

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E2E8F0]/90 bg-white/92 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0px)" }}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-lg items-stretch justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.match(pathname, hash);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1.5 transition-colors",
                active ? "text-[#0F766E]" : "text-[#64748B]",
              )}
            >
              {active ? (
                <span className="absolute inset-x-2 top-1.5 h-[calc(100%-12px)] rounded-2xl bg-[#F0FDFA]" />
              ) : null}
              <Icon
                className={cn(
                  "relative z-10 h-5 w-5",
                  active && "text-[#39AFF2]",
                )}
                strokeWidth={active ? 2.25 : 1.75}
              />
              <span
                className={cn(
                  "relative z-10 text-[10px] font-semibold tracking-wide",
                  active && "text-[#0F766E]",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
