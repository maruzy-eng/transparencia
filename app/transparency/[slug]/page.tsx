import { notFound } from "next/navigation";

import { DetailPageShell } from "@/components/transparency/detail-page-shell";
import { MediaGallery } from "@/components/transparency/media-gallery";
import { ProjectHealthCard } from "@/components/transparency/project-health-card";
import { PropertyHero } from "@/components/transparency/property-hero";
import { PropertyKpis } from "@/components/transparency/property-kpis";
import { PropertyPhasesTimeline } from "@/components/transparency/property-phases-timeline";
import { PropertyUpdatesList } from "@/components/transparency/property-updates-list";
import { ErrorState } from "@/components/transparency/error-state";
import { getPropertyDetail } from "@/lib/transparency/queries";
import { getHeroImageUrl } from "@/lib/transparency/media-helpers";
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
  const heroImageUrl = getHeroImageUrl(property, media);

  return (
    <DetailPageShell>
      <PropertyHero property={property} heroImageUrl={heroImageUrl} />
      <div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
        <MediaGallery media={media} />
        <PropertyKpis property={property} />
        <PropertyPhasesTimeline phases={phases} />
        <ProjectHealthCard property={property} phases={phases} />
        <PropertyUpdatesList updates={updates} />
      </div>
    </DetailPageShell>
  );
}
