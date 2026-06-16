"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdminOrEditor } from "@/lib/admin/permissions";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SiteContentRecord } from "@/lib/transparency/content-types";

const OPTIONAL_EMPTY_KEYS = new Set(["transparency.hero.secondary_cta"]);

export type ContentActionResult = {
  success: boolean;
  error?: string;
};

const updateContentSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

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

export async function updateSiteContentAction(
  formData: FormData,
): Promise<ContentActionResult> {
  await requireAdminOrEditor();

  const parsed = updateContentSchema.safeParse({
    key: formData.get("key"),
    value: formData.get("value"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const { key, value } = parsed.data;

  if (!value.trim() && !OPTIONAL_EMPTY_KEYS.has(key)) {
    return {
      success: false,
      error: "O conteúdo não pode ficar vazio.",
    };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("site_content")
    .update({ value: value.trim() })
    .eq("key", key);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/content");
  revalidatePath("/transparency");
  return { success: true };
}
