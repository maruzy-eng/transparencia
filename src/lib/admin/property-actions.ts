"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { slugify } from "@/lib/admin/property-constants";
import {
  deletePhaseById,
  persistPhaseFromFormData,
} from "@/lib/admin/property-phase-mutations";
import {
  mediaFormSchema,
  propertyFormSchema,
  toPropertyInsert,
  updateFormSchema,
} from "@/lib/admin/property-schema";
import {
  getAdminPropertyById,
  getAdminPropertyBySlug,
} from "@/lib/admin/property-queries";
import { requireAdminOrEditorForAction } from "@/lib/admin/permissions";
import { createAdminClient } from "@/lib/supabase/admin";
import { refreshSessionCookie } from "@/lib/admin/session";

export type ActionResult = {
  success: boolean;
  error?: string;
};

async function assertAdminAction(): Promise<ActionResult | null> {
  const auth = await requireAdminOrEditorForAction();
  if (!auth.ok) {
    return { success: false, error: auth.error };
  }
  return null;
}

async function completeAdminAction(
  propertyId?: string,
): Promise<ActionResult> {
  await refreshSessionCookie();
  revalidatePropertyPaths(propertyId);
  return { success: true };
}

function revalidatePropertyPaths(propertyId?: string) {
  revalidatePath("/admin/properties");
  revalidatePath("/admin/dashboard");
  revalidatePath("/transparency");
  if (propertyId) {
    revalidatePath(`/admin/properties/${propertyId}/edit`);
  }
}

function parsePropertyForm(formData: FormData) {
  return propertyFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    address: formData.get("address") || undefined,
    city: formData.get("city") || undefined,
    state: formData.get("state") || undefined,
    zip_code: formData.get("zip_code") || undefined,
    project_type: formData.get("project_type") || null,
    status: formData.get("status"),
    progress: formData.get("progress"),
    purchase_price: formData.get("purchase_price"),
    estimated_rehab_budget: formData.get("estimated_rehab_budget"),
    current_spent: formData.get("current_spent"),
    estimated_sale_price: formData.get("estimated_sale_price"),
    actual_sale_price: formData.get("actual_sale_price"),
    estimated_profit: formData.get("estimated_profit"),
    actual_profit: formData.get("actual_profit"),
    cover_image_url: formData.get("cover_image_url") || undefined,
    description: formData.get("description") || undefined,
    is_published: formData.get("is_published") === "on",
    visibility: formData.get("visibility"),
  });
}

export async function createPropertyAction(
  formData: FormData,
): Promise<ActionResult> {
  const authError = await assertAdminAction();
  if (authError) return authError;

  const parsed = parsePropertyForm(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const values = parsed.data;
  const slug = values.slug || slugify(values.name);
  const existing = await getAdminPropertyBySlug(slug);

  if (existing) {
    return {
      success: false,
      error: "Já existe um imóvel com este slug. Escolha outro.",
    };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("properties")
    .insert({ ...toPropertyInsert({ ...values, slug }), slug })
    .select("id")
    .single();

  if (error || !data) {
    return {
      success: false,
      error: error?.message ?? "Não foi possível criar o imóvel.",
    };
  }

  await refreshSessionCookie();
  revalidatePropertyPaths(data.id);
  redirect(`/admin/properties/${data.id}/edit`);
}

export async function updatePropertyAction(
  propertyId: string,
  formData: FormData,
): Promise<ActionResult> {
  const authError = await assertAdminAction();
  if (authError) return authError;

  const parsed = parsePropertyForm(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const values = parsed.data;
  const existing = await getAdminPropertyBySlug(values.slug);
  if (existing && existing.id !== propertyId) {
    return {
      success: false,
      error: "Já existe outro imóvel com este slug.",
    };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("properties")
    .update(toPropertyInsert(values))
    .eq("id", propertyId);

  if (error) {
    return { success: false, error: error.message };
  }

  return completeAdminAction(propertyId);
}

export async function togglePropertyPublishedAction(
  propertyId: string,
  isPublished: boolean,
): Promise<ActionResult> {
  const authError = await assertAdminAction();
  if (authError) return authError;
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("properties")
    .update({
      is_published: isPublished,
      last_updated_at: new Date().toISOString(),
    })
    .eq("id", propertyId);

  if (error) {
    return { success: false, error: error.message };
  }

  return completeAdminAction(propertyId);
}

export async function deletePropertyAction(
  propertyId: string,
): Promise<ActionResult> {
  const authError = await assertAdminAction();
  if (authError) return authError;
  const supabase = createAdminClient();

  await supabase.from("property_media").delete().eq("property_id", propertyId);
  await supabase.from("property_updates").delete().eq("property_id", propertyId);
  await supabase.from("property_phases").delete().eq("property_id", propertyId);

  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", propertyId);

  if (error) {
    return { success: false, error: error.message };
  }

  await refreshSessionCookie();
  revalidatePropertyPaths();
  redirect("/admin/properties");
}

async function deleteStorageFile(url: string) {
  const marker = "/storage/v1/object/public/property-media/";
  const index = url.indexOf(marker);
  if (index === -1) return;

  const path = url.slice(index + marker.length);
  const supabase = createAdminClient();
  await supabase.storage.from("property-media").remove([path]);
}

export async function savePhaseAction(
  propertyId: string,
  formData: FormData,
): Promise<ActionResult> {
  const authError = await assertAdminAction();
  if (authError) return authError;

  const result = await persistPhaseFromFormData(propertyId, formData);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  await refreshSessionCookie();
  return { success: true };
}

export async function deletePhaseAction(
  propertyId: string,
  phaseId: string,
): Promise<ActionResult> {
  const authError = await assertAdminAction();
  if (authError) return authError;

  const result = await deletePhaseById(propertyId, phaseId);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  await refreshSessionCookie();
  return { success: true };
}

export async function saveUpdateAction(
  propertyId: string,
  formData: FormData,
): Promise<ActionResult> {
  const authError = await assertAdminAction();
  if (authError) return authError;

  const parsed = updateFormSchema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    update_type: formData.get("update_type"),
    visibility: formData.get("visibility"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const values = parsed.data;
  const supabase = createAdminClient();
  const payload = {
    property_id: propertyId,
    title: values.title.trim(),
    description: values.description?.trim() || null,
    update_type: values.update_type,
    visibility: values.visibility,
  };

  if (values.id) {
    const { error } = await supabase
      .from("property_updates")
      .update(payload)
      .eq("id", values.id);
    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase.from("property_updates").insert(payload);
    if (error) return { success: false, error: error.message };
  }

  await supabase
    .from("properties")
    .update({ last_updated_at: new Date().toISOString() })
    .eq("id", propertyId);

  return completeAdminAction(propertyId);
}

export async function deleteUpdateAction(
  propertyId: string,
  updateId: string,
): Promise<ActionResult> {
  const authError = await assertAdminAction();
  if (authError) return authError;
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("property_updates")
    .delete()
    .eq("id", updateId);

  if (error) {
    return { success: false, error: error.message };
  }

  return completeAdminAction(propertyId);
}

export async function saveMediaAction(
  propertyId: string,
  formData: FormData,
): Promise<ActionResult> {
  const authError = await assertAdminAction();
  if (authError) return authError;

  const parsed = mediaFormSchema.safeParse({
    id: formData.get("id") || undefined,
    media_type: formData.get("media_type"),
    url: formData.get("url"),
    thumbnail_url: formData.get("thumbnail_url") || undefined,
    phase: formData.get("phase") || undefined,
    room: formData.get("room") || undefined,
    caption: formData.get("caption") || undefined,
    visibility: formData.get("visibility"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const values = parsed.data;
  const supabase = createAdminClient();
  const payload = {
    property_id: propertyId,
    media_type: values.media_type,
    url: values.url.trim(),
    thumbnail_url: values.thumbnail_url?.trim() || null,
    phase: values.phase?.trim() || null,
    room: values.room?.trim() || null,
    caption: values.caption?.trim() || null,
    visibility: values.visibility,
  };

  if (values.id) {
    const { error } = await supabase
      .from("property_media")
      .update(payload)
      .eq("id", values.id);
    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase.from("property_media").insert(payload);
    if (error) return { success: false, error: error.message };
  }

  return completeAdminAction(propertyId);
}

export async function deleteMediaAction(
  propertyId: string,
  mediaId: string,
  mediaUrl?: string,
): Promise<ActionResult> {
  const authError = await assertAdminAction();
  if (authError) return authError;
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("property_media")
    .delete()
    .eq("id", mediaId);

  if (error) {
    return { success: false, error: error.message };
  }

  if (mediaUrl) {
    await deleteStorageFile(mediaUrl);
  }

  return completeAdminAction(propertyId);
}

export async function uploadPropertyMediaAction(
  propertyId: string,
  formData: FormData,
): Promise<ActionResult> {
  const authError = await assertAdminAction();
  if (authError) return authError;

  const file = formData.get("file");
  const mediaType = String(formData.get("media_type") ?? "photo");
  const visibility = String(formData.get("visibility") ?? "public");
  const caption = String(formData.get("caption") ?? "").trim();

  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Selecione um arquivo para upload." };
  }

  const property = await getAdminPropertyById(propertyId);
  if (!property) {
    return { success: false, error: "Imóvel não encontrado." };
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const objectPath = `${propertyId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const supabase = createAdminClient();

  const { error: uploadError } = await supabase.storage
    .from("property-media")
    .upload(objectPath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  const { data: publicData } = supabase.storage
    .from("property-media")
    .getPublicUrl(objectPath);

  const { error: insertError } = await supabase.from("property_media").insert({
    property_id: propertyId,
    media_type: mediaType,
    url: publicData.publicUrl,
    thumbnail_url: null,
    phase: null,
    room: null,
    caption: caption || null,
    visibility,
  });

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  return completeAdminAction(propertyId);
}

export async function uploadCoverImageAction(
  propertyId: string,
  formData: FormData,
): Promise<ActionResult> {
  const authError = await assertAdminAction();
  if (authError) return authError;

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Selecione uma imagem de capa." };
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const objectPath = `${propertyId}/cover-${Date.now()}.${extension}`;
  const supabase = createAdminClient();

  const { error: uploadError } = await supabase.storage
    .from("property-media")
    .upload(objectPath, file, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  const { data: publicData } = supabase.storage
    .from("property-media")
    .getPublicUrl(objectPath);

  const { error: updateError } = await supabase
    .from("properties")
    .update({
      cover_image_url: publicData.publicUrl,
      last_updated_at: new Date().toISOString(),
    })
    .eq("id", propertyId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  return completeAdminAction(propertyId);
}
