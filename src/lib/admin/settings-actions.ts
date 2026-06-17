"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdminOrEditorForAction } from "@/lib/admin/permissions";
import { createAdminClient } from "@/lib/supabase/admin";
import { refreshSessionCookie } from "@/lib/admin/session";

export type { SiteSettingRecord } from "@/lib/admin/settings-queries";

const updateSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

export type SettingsActionResult = {
  success: boolean;
  error?: string;
};

export async function updateSiteSettingAction(
  formData: FormData,
): Promise<SettingsActionResult> {
  const auth = await requireAdminOrEditorForAction();
  if (!auth.ok) {
    return { success: false, error: auth.error };
  }

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
  await refreshSessionCookie();
  return { success: true };
}

export async function uploadSiteLogoAction(
  formData: FormData,
): Promise<SettingsActionResult> {
  const auth = await requireAdminOrEditorForAction();
  if (!auth.ok) {
    return { success: false, error: auth.error };
  }

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
  await refreshSessionCookie();
  return { success: true };
}
