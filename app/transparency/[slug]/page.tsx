import { notFound } from "next/navigation";

import { MediaGallery } from "@/components/transparency/media-gallery";
import { PhaseProgress } from "@/components/transparency/phase-progress";
import { PropertyHero } from "@/components/transparency/property-hero";
import { PropertyKpis } from "@/components/transparency/property-kpis";
import { PropertyTimeline } from "@/components/transparency/property-timeline";
import { ErrorState } from "@/components/transparency/error-state";
import { getPropertyDetail } from "@/lib/transparency/queries";
import type { PropertyDetail } from "@/lib/transparency/types";

interface PropertyDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function loadPropertyDetail(slug: string): Promise<{
  detail: PropertyDetail | null;
  error: string | null;
}> {
  try {
    const detail = await getPropertyDetail(slug);
    return { detail, error: null };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Ocorreu um erro inesperado ao buscar o imóvel.";

    return { detail: null, error: message };
  }
}

export async function generateMetadata({ params }: PropertyDetailPageProps) {
  const { slug } = await params;
  const { detail } = await loadPropertyDetail(slug);

  if (!detail) {
    return { title: "Imóvel não encontrado | Checkmate Property" };
  }

  return {
    title: `${detail.property.name} | Checkmate Property`,
    description:
      detail.property.description ??
      "Detalhes do imóvel no Portal de Transparência Checkmate Property.",
  };
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { slug } = await params;
  const { detail, error } = await loadPropertyDetail(slug);

  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar o imóvel"
        message={error}
        retryHref="/transparency"
      />
    );
  }

  if (!detail) {
    notFound();
  }

  const { property, phases, updates, media } = detail;

  return (
    <div className="space-y-8">
      <PropertyHero property={property} />
      <PropertyKpis property={property} />
      <section className="rounded-2xl border border-border/60 bg-card/40 p-6">
        <PhaseProgress progress={property.progress} />
      </section>
      <PropertyTimeline phases={phases} updates={updates} />
      <MediaGallery media={media} />
    </div>
  );
}
