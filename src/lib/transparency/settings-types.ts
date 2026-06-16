export const SITE_SETTINGS_FALLBACKS = {
  "portal.name": "Checkmate Property Transparency",
  "portal.logo_url": "",
  "portal.logo_compact_url": "",
  "portal.footer_text":
    "Checkmate Property — Transparência em investimentos imobiliários.",
} as const;

export interface TransparencySiteSettings {
  portalName: string;
  logoUrl: string | null;
  logoCompactUrl: string | null;
  footerText: string;
}

export function buildSiteSettings(
  map: Record<string, string>,
): TransparencySiteSettings {
  const portalName =
    map["portal.name"]?.trim() || SITE_SETTINGS_FALLBACKS["portal.name"];
  const logoUrl = map["portal.logo_url"]?.trim() || null;
  const logoCompactUrl = map["portal.logo_compact_url"]?.trim() || null;
  const footerText =
    map["portal.footer_text"]?.trim() ||
    SITE_SETTINGS_FALLBACKS["portal.footer_text"];

  return {
    portalName,
    logoUrl,
    logoCompactUrl,
    footerText,
  };
}
