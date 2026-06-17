import "server-only";

import { requireAdminOrEditor } from "@/lib/admin/permissions";
import { createAdminClient } from "@/lib/supabase/admin";

export interface SiteSettingRecord {
  id: string;
  key: string;
  value: string;
  type: "text" | "url" | "image";
  updated_at: string;
}

export async function getAdminSiteSettings(): Promise<SiteSettingRecord[]> {
  await requireAdminOrEditor();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .order("key", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch site settings: ${error.message}`);
  }

  return (data ?? []) as SiteSettingRecord[];
}
