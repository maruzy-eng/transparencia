import "server-only";

import { revalidatePath } from "next/cache";

import { getAdminPropertyById } from "@/lib/admin/property-queries";
import {
  normalizeMediaType,
  type MediaType,
} from "@/lib/admin/property-constants";
import { mediaFormSchema } from "@/lib/admin/property-schema";
import { createAdminClient } from "@/lib/supabase/admin";

export type MediaMutationResult = {
  success: boolean;
  error?: string;
};

function revalidateMediaPaths(propertyId: string) {
  revalidatePath("/admin/properties");
  revalidatePath("/admin/dashboard");
  revalidatePath("/transparency");
  revalidatePath(`/admin/properties/${propertyId}/edit`);
}

function mapMediaError(message: string): string {
  if (message.includes("property_media_media_type_check")) {
    return "Tipo de mídia inválido. Use Foto ou Vídeo.";
  }
  return message;
}

function resolveUploadMediaType(file: File, selected: string): MediaType {
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("image/")) return "image";
  return normalizeMediaType(selected);
}

async function deleteStorageFile(url: string) {
  const marker = "/storage/v1/object/public/property-media/";
  const index = url.indexOf(marker);
  if (index === -1) return;

  const path = url.slice(index + marker.length);
  const supabase = createAdminClient();
  await supabase.storage.from("property-media").remove([path]);
}

export async function persistMediaFromFormData(
  propertyId: string,
  formData: FormData,
): Promise<MediaMutationResult> {
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
    media_type: normalizeMediaType(values.media_type),
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
    if (error) return { success: false, error: mapMediaError(error.message) };
  } else {
    const { error } = await supabase.from("property_media").insert(payload);
    if (error) return { success: false, error: mapMediaError(error.message) };
  }

  await supabase
    .from("properties")
    .update({ last_updated_at: new Date().toISOString() })
    .eq("id", propertyId);

  revalidateMediaPaths(propertyId);
  return { success: true };
}

export async function uploadMediaFromFormData(
  propertyId: string,
  formData: FormData,
): Promise<MediaMutationResult> {
  const file = formData.get("file");
  const mediaType = resolveUploadMediaType(
    file instanceof File ? file : new File([], "empty"),
    String(formData.get("media_type") ?? "image"),
  );
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
    return { success: false, error: mapMediaError(insertError.message) };
  }

  await supabase
    .from("properties")
    .update({ last_updated_at: new Date().toISOString() })
    .eq("id", propertyId);

  revalidateMediaPaths(propertyId);
  return { success: true };
}

export async function deleteMediaById(
  propertyId: string,
  mediaId: string,
  mediaUrl?: string,
): Promise<MediaMutationResult> {
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

  revalidateMediaPaths(propertyId);
  return { success: true };
}
