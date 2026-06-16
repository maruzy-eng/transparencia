import { createClient } from "@/lib/supabase/server";
import {
  buildTransparencyPageContent,
  SITE_CONTENT_FALLBACKS,
  type SiteContentRecord,
  type TransparencyPageContent,
} from "@/lib/transparency/content-types";

export async function getSiteContentMap(): Promise<Record<string, string>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("site_content").select("key, value");

    if (error) {
      console.error("Failed to fetch site content:", error.message);
      return { ...SITE_CONTENT_FALLBACKS };
    }

    const map: Record<string, string> = { ...SITE_CONTENT_FALLBACKS };

    for (const row of data ?? []) {
      if (row.key) {
        map[row.key] = row.value ?? "";
      }
    }

    return map;
  } catch {
    return { ...SITE_CONTENT_FALLBACKS };
  }
}

export async function getTransparencyPageContent(): Promise<TransparencyPageContent> {
  const map = await getSiteContentMap();
  return buildTransparencyPageContent(map);
}

export async function getAllSiteContentRecords(): Promise<SiteContentRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .order("group", { ascending: true })
    .order("key", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch site content: ${error.message}`);
  }

  return (data ?? []) as SiteContentRecord[];
}
