import Link from "next/link";
import { Database, Eye, RefreshCw } from "lucide-react";

import { FeaturedPropertyCard } from "@/components/transparency/featured-property-card";
import type { TransparencyPageContent } from "@/lib/transparency/content-types";
import type { Property } from "@/lib/transparency/types";

interface TransparencyHeroProps {
  featuredProperty?: Property | null;
  content: TransparencyPageContent["hero"];
  trustItems: TransparencyPageContent["trust"];
}

const trustIcons = [Database, RefreshCw, Eye];

export function TransparencyHero({
  featuredProperty,
  content,
  trustItems,
}: TransparencyHeroProps) {
  return (
    <section className="relative pt-2 sm:pt-4">
      <div className="transparency-hero-glow pointer-events-none absolute inset-0" />

      <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-start lg:gap-12 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,460px)] xl:gap-14">
        <div className="space-y-8 sm:space-y-9">
          <span className="checkmate-pill">
            <span className="checkmate-pill-dot" />
            {content.eyebrow}
          </span>

          <div className="space-y-5">
            <h1 className="max-w-[18rem] text-[2rem] font-bold leading-[1.08] tracking-[-0.035em] text-[#0F172A] sm:max-w-2xl sm:text-[2.75rem] lg:max-w-xl lg:text-[3.15rem]">
              {content.title}{" "}
              <span className="checkmate-gradient-text">{content.highlight}</span>
              .
            </h1>
            <p className="max-w-xl text-[15px] leading-[1.7] text-[#64748B] sm:text-base">
              {content.subtitle}
            </p>
          </div>

          <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
            {trustItems.map((label, index) => {
              const Icon = trustIcons[index] ?? Database;
              return (
                <li
                  key={label}
                  className="flex items-center gap-2 text-[13px] text-[#64748B]"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#E2E8F0] bg-white">
                    <Icon className="h-3.5 w-3.5 text-[#39AFF2]" />
                  </span>
                  {label}
                </li>
              );
            })}
          </ul>

          <div className="flex flex-wrap gap-3">
            <Link
              href="#projetos"
              className="checkmate-gradient inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold text-white transition-all hover:brightness-[1.03]"
            >
              {content.primaryCta}
            </Link>
            {content.secondaryCta ? (
              <Link
                href="#projetos"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white px-5 text-sm font-semibold text-[#0F172A] transition-colors hover:bg-[#F8FAFC]"
              >
                {content.secondaryCta}
              </Link>
            ) : null}
          </div>
        </div>

        {featuredProperty ? (
          <FeaturedPropertyCard property={featuredProperty} />
        ) : (
          <div className="rounded-[24px] border border-dashed border-[#E2E8F0] bg-white/70 p-10 text-center">
            <p className="text-sm text-[#64748B]">
              O card em destaque aparecerá aqui quando houver um imóvel
              publicado.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
