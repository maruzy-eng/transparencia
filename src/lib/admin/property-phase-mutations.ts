import "server-only";

import { revalidatePath } from "next/cache";

import { phaseFormSchema } from "@/lib/admin/property-schema";
import { createAdminClient } from "@/lib/supabase/admin";

export type PhaseMutationResult = {
  success: boolean;
  error?: string;
};

function mapPhaseError(message: string): string {
  if (message.includes("property_phases_status_check")) {
    return "Status de fase inválido. Use Pendente, Em andamento, Concluída ou Atrasada.";
  }
  return message;
}

function revalidatePhasePaths(propertyId: string) {
  revalidatePath("/admin/properties");
  revalidatePath("/admin/dashboard");
  revalidatePath("/transparency");
  revalidatePath(`/admin/properties/${propertyId}/edit`);
}

export async function persistPhaseFromFormData(
  propertyId: string,
  formData: FormData,
): Promise<PhaseMutationResult> {
  const parsed = phaseFormSchema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    status: formData.get("status"),
    sort_order: formData.get("sort_order"),
    planned_date: formData.get("planned_date") || undefined,
    completed_date: formData.get("completed_date") || undefined,
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
    status: values.status,
    sort_order: values.sort_order ?? 0,
    planned_date: values.planned_date || null,
    completed_date: values.completed_date || null,
    visibility: values.visibility,
  };

  if (values.id) {
    const { error } = await supabase
      .from("property_phases")
      .update(payload)
      .eq("id", values.id);
    if (error) {
      return { success: false, error: mapPhaseError(error.message) };
    }
  } else {
    const { error } = await supabase.from("property_phases").insert(payload);
    if (error) {
      return { success: false, error: mapPhaseError(error.message) };
    }
  }

  await supabase
    .from("properties")
    .update({ last_updated_at: new Date().toISOString() })
    .eq("id", propertyId);

  revalidatePhasePaths(propertyId);
  return { success: true };
}

export async function deletePhaseById(
  propertyId: string,
  phaseId: string,
): Promise<PhaseMutationResult> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("property_phases")
    .delete()
    .eq("id", phaseId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePhasePaths(propertyId);
  return { success: true };
}
