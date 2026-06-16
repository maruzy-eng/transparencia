export const SITE_CONTENT_FALLBACKS = {
  "transparency.hero.eyebrow": "Transparência em tempo real",
  "transparency.hero.title":
    "Da aquisição à venda, acompanhe cada projeto com",
  "transparency.hero.highlight": "transparência real",
  "transparency.hero.subtitle":
    "Veja status, andamento, fotos, vídeos, valores investidos e resultados dos projetos publicados pela Checkmate Property.",
  "transparency.hero.primary_cta": "Ver projetos",
  "transparency.hero.secondary_cta": "",
  "transparency.trust.item_1": "Dados reais",
  "transparency.trust.item_2": "Atualizações constantes",
  "transparency.trust.item_3": "Visibilidade por projeto",
  "transparency.projects.title": "Projetos em destaque",
  "transparency.projects.subtitle":
    "Acompanhe os imóveis publicados pela Checkmate Property.",
  "transparency.footer.text":
    "Checkmate Property — Transparência em investimentos imobiliários.",
} as const;

export type SiteContentKey = keyof typeof SITE_CONTENT_FALLBACKS;

export interface SiteContentRecord {
  id: string;
  key: string;
  label: string;
  value: string;
  type: "text" | "textarea" | "url";
  group: string;
  updated_at: string;
}

export interface TransparencyPageContent {
  hero: {
    eyebrow: string;
    title: string;
    highlight: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
  };
  trust: [string, string, string];
  projects: {
    title: string;
    subtitle: string;
  };
  footer: {
    text: string;
  };
}

export function getContentValue(
  map: Record<string, string>,
  key: SiteContentKey,
): string {
  const value = map[key]?.trim();
  return value || SITE_CONTENT_FALLBACKS[key];
}

export function buildTransparencyPageContent(
  map: Record<string, string>,
): TransparencyPageContent {
  return {
    hero: {
      eyebrow: getContentValue(map, "transparency.hero.eyebrow"),
      title: getContentValue(map, "transparency.hero.title"),
      highlight: getContentValue(map, "transparency.hero.highlight"),
      subtitle: getContentValue(map, "transparency.hero.subtitle"),
      primaryCta: getContentValue(map, "transparency.hero.primary_cta"),
      secondaryCta: getContentValue(map, "transparency.hero.secondary_cta"),
    },
    trust: [
      getContentValue(map, "transparency.trust.item_1"),
      getContentValue(map, "transparency.trust.item_2"),
      getContentValue(map, "transparency.trust.item_3"),
    ],
    projects: {
      title: getContentValue(map, "transparency.projects.title"),
      subtitle: getContentValue(map, "transparency.projects.subtitle"),
    },
    footer: {
      text: getContentValue(map, "transparency.footer.text"),
    },
  };
}
