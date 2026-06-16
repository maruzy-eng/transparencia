import { createClient } from "@/lib/supabase/server";
import {
  buildSiteSettings,
  SITE_SETTINGS_FALLBACKS,
  type TransparencySiteSettings,
} from "@/lib/transparency/settings-types";

export async function getSiteSettingsMap(): Promise<Record<string, string>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("site_settings").select("key, value");

    if (error) {
      console.error("Failed to fetch site settings:", error.message);
      return { ...SITE_SETTINGS_FALLBACKS };
    }

    const map: Record<string, string> = { ...SITE_SETTINGS_FALLBACKS };

    for (const row of data ?? []) {
      if (row.key) {
        map[row.key] = row.value ?? "";
      }
    }

    return map;
  } catch {
    return { ...SITE_SETTINGS_FALLBACKS };
  }
}

export async function getTransparencySiteSettings(): Promise<TransparencySiteSettings> {
  const map = await getSiteSettingsMap();
  return buildSiteSettings(map);
}

export type { TransparencySiteSettings };
