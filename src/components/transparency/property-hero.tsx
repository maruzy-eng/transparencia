import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";

import { StatusBadge } from "@/components/transparency/status-badge";
import { Button } from "@/components/ui/button";
import type { Property } from "@/lib/transparency/types";

interface PropertyHeroProps {
  property: Property;
}

export function PropertyHero({ property }: PropertyHeroProps) {
  const location = [
    property.address,
    property.city,
    property.state,
    property.zip_code,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="overflow-hidden rounded-2xl border border-border/60 bg-card/50">
      <div className="relative min-h-[320px]">
        {property.cover_image_url ? (
          <Image
            src={property.cover_image_url}
            alt={property.name}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
        <div className="relative flex h-full flex-col justify-end gap-6 p-6 sm:p-8">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-fit border-white/10 bg-background/40 backdrop-blur"
          >
            <Link href="/transparency">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao portfólio
            </Link>
          </Button>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={property.status} />
              {property.project_type && (
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-amber-300">
                  {property.project_type}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {property.name}
              </h1>
              {location && (
                <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground sm:text-base">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {location}
                </p>
              )}
            </div>
            {property.description && (
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {property.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
