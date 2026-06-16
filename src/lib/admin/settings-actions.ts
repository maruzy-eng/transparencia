"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdminOrEditor } from "@/lib/admin/permissions";
import { createAdminClient } from "@/lib/supabase/admin";

export type SettingsActionResult = {
  success: boolean;
  error?: string;
};

export interface SiteSettingRecord {
  id: string;
  key: string;
  value: string;
  type: "text" | "url" | "image";
  updated_at: string;
}

const updateSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

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

export async function updateSiteSettingAction(
  formData: FormData,
): Promise<SettingsActionResult> {
  await requireAdminOrEditor();

  const parsed = updateSettingSchema.safeParse({
    key: formData.get("key"),
    value: formData.get("value"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("site_settings")
    .update({ value: parsed.data.value.trim() })
    .eq("key", parsed.data.key);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/transparency");
  return { success: true };
}

export async function uploadSiteLogoAction(
  formData: FormData,
): Promise<SettingsActionResult> {
  await requireAdminOrEditor();

  const file = formData.get("file");
  const variant = String(formData.get("variant") ?? "main");

  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Selecione um arquivo de imagem." };
  }

  const settingKey =
    variant === "compact" ? "portal.logo_compact_url" : "portal.logo_url";
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "png";
  const objectPath = `logos/${variant}-${Date.now()}.${extension}`;
  const supabase = createAdminClient();

  const { error: uploadError } = await supabase.storage
    .from("site-assets")
    .upload(objectPath, file, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  const { data: publicData } = supabase.storage
    .from("site-assets")
    .getPublicUrl(objectPath);

  const { error: updateError } = await supabase
    .from("site_settings")
    .update({ value: publicData.publicUrl })
    .eq("key", settingKey);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/transparency");
  return { success: true };
}
