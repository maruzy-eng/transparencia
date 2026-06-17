import "server-only";

import { revalidatePath } from "next/cache";

import { slugify } from "@/lib/admin/property-constants";
import {
  propertyFormSchema,
  toPropertyInsert,
} from "@/lib/admin/property-schema";
import {
  getAdminPropertyById,
  getAdminPropertyBySlug,
} from "@/lib/admin/property-queries";
import { createAdminClient } from "@/lib/supabase/admin";

export type PropertyMutationResult = {
  success: boolean;
  error?: string;
  propertyId?: string;
};

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

export async function createPropertyFromFormData(
  formData: FormData,
): Promise<PropertyMutationResult> {
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

  revalidatePropertyPaths(data.id);
  return { success: true, propertyId: data.id };
}

export async function updatePropertyFromFormData(
  propertyId: string,
  formData: FormData,
): Promise<PropertyMutationResult> {
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

  revalidatePropertyPaths(propertyId);
  return { success: true, propertyId };
}

export async function togglePropertyPublished(
  propertyId: string,
  isPublished: boolean,
): Promise<PropertyMutationResult> {
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

  revalidatePropertyPaths(propertyId);
  return { success: true, propertyId };
}

export async function deletePropertyById(
  propertyId: string,
): Promise<PropertyMutationResult> {
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

  revalidatePropertyPaths();
  return { success: true };
}

export async function uploadCoverFromFormData(
  propertyId: string,
  formData: FormData,
): Promise<PropertyMutationResult> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Selecione uma imagem de capa." };
  }

  const property = await getAdminPropertyById(propertyId);
  if (!property) {
    return { success: false, error: "Imóvel não encontrado." };
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

  revalidatePropertyPaths(propertyId);
  return { success: true, propertyId };
}
