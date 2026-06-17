import "server-only";

import { requireAdminOrEditor } from "@/lib/admin/permissions";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SiteContentRecord } from "@/lib/transparency/content-types";

export async function getAdminSiteContent(): Promise<SiteContentRecord[]> {
  await requireAdminOrEditor();
  const supabase = createAdminClient();

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
