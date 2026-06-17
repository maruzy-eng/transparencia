import "server-only";

import { revalidatePath } from "next/cache";

import { updateFormSchema } from "@/lib/admin/property-schema";
import { createAdminClient } from "@/lib/supabase/admin";

export type UpdateMutationResult = {
  success: boolean;
  error?: string;
};

function revalidateUpdatePaths(propertyId: string) {
  revalidatePath("/admin/properties");
  revalidatePath("/admin/dashboard");
  revalidatePath("/transparency");
  revalidatePath(`/admin/properties/${propertyId}/edit`);
}

function mapUpdateError(message: string): string {
  if (message.includes("property_updates_update_type_check")) {
    return "Tipo de atualização inválido.";
  }
  return message;
}

export async function persistUpdateFromFormData(
  propertyId: string,
  formData: FormData,
): Promise<UpdateMutationResult> {
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
    if (error) {
      return { success: false, error: mapUpdateError(error.message) };
    }
  } else {
    const { error } = await supabase.from("property_updates").insert(payload);
    if (error) {
      return { success: false, error: mapUpdateError(error.message) };
    }
  }

  await supabase
    .from("properties")
    .update({ last_updated_at: new Date().toISOString() })
    .eq("id", propertyId);

  revalidateUpdatePaths(propertyId);
  return { success: true };
}

export async function deleteUpdateById(
  propertyId: string,
  updateId: string,
): Promise<UpdateMutationResult> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("property_updates")
    .delete()
    .eq("id", updateId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateUpdatePaths(propertyId);
  return { success: true };
}
