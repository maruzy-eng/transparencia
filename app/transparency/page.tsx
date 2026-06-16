import { EmptyState } from "@/components/transparency/empty-state";
import { ErrorState } from "@/components/transparency/error-state";
import { PortfolioKpis } from "@/components/transparency/portfolio-kpis";
import { PropertyListing } from "@/components/transparency/property-listing";
import { TransparencyHero } from "@/components/transparency/transparency-hero";
import { getTransparencyPageContent } from "@/lib/transparency/content";
import { getPublishedProperties } from "@/lib/transparency/queries";
import { computePortfolioStats } from "@/lib/transparency/portfolio-stats";
import type { Property } from "@/lib/transparency/types";

async function loadPublishedProperties(): Promise<{
  properties: Property[] | null;
  error: string | null;
}> {
  try {
    const properties = await getPublishedProperties();
    return { properties, error: null };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Ocorreu um erro inesperado ao buscar os imóveis.";

    return { properties: null, error: message };
  }
}

export default async function TransparencyPage() {
  const [{ properties, error }, pageContent] = await Promise.all([
    loadPublishedProperties(),
    getTransparencyPageContent(),
  ]);

  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar o portfólio"
        message={error}
        retryHref="/transparency"
      />
    );
  }

  const publishedProperties = properties ?? [];
  const featuredProperty = publishedProperties[0] ?? null;
  const portfolioStats = computePortfolioStats(publishedProperties);

  return (
    <div className="space-y-14 sm:space-y-16 lg:space-y-20">
      <TransparencyHero
        featuredProperty={featuredProperty}
        content={pageContent.hero}
        trustItems={pageContent.trust}
      />

      {publishedProperties.length > 0 && (
        <PortfolioKpis stats={portfolioStats} />
      )}

      {publishedProperties.length === 0 ? (
        <EmptyState
          title="Nenhum imóvel publicado"
          description="Quando houver imóveis com visibilidade pública, eles aparecerão aqui."
        />
      ) : (
        <PropertyListing
          properties={publishedProperties}
          content={pageContent.projects}
        />
      )}
    </div>
  );
}
