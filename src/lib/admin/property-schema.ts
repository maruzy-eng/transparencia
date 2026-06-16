import { z } from "zod";

import {
  MEDIA_TYPES,
  PHASE_STATUSES,
  PROJECT_TYPES,
  PROPERTY_STATUSES,
  UPDATE_TYPES,
  VISIBILITY_OPTIONS,
} from "@/lib/admin/property-constants";

const optionalNumber = z
  .union([z.string(), z.number()])
  .optional()
  .transform((value) => {
    if (value === undefined || value === null || value === "") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  });

export const propertyFormSchema = z.object({
  name: z.string().min(2, "Informe o nome do imóvel."),
  slug: z
    .string()
    .min(2, "Informe o slug.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens."),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
  project_type: z.enum(PROJECT_TYPES).nullable(),
  status: z.enum(PROPERTY_STATUSES),
  progress: optionalNumber,
  purchase_price: optionalNumber,
  estimated_rehab_budget: optionalNumber,
  current_spent: optionalNumber,
  estimated_sale_price: optionalNumber,
  actual_sale_price: optionalNumber,
  estimated_profit: optionalNumber,
  actual_profit: optionalNumber,
  cover_image_url: z.string().optional(),
  description: z.string().optional(),
  is_published: z.boolean(),
  visibility: z.enum(VISIBILITY_OPTIONS),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;

export const phaseFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Informe o título da fase."),
  description: z.string().optional(),
  status: z.enum(PHASE_STATUSES),
  sort_order: optionalNumber,
  planned_date: z.string().optional(),
  completed_date: z.string().optional(),
  visibility: z.enum(VISIBILITY_OPTIONS),
});

export type PhaseFormValues = z.infer<typeof phaseFormSchema>;

export const updateFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Informe o título da atualização."),
  description: z.string().optional(),
  update_type: z.enum(UPDATE_TYPES),
  visibility: z.enum(VISIBILITY_OPTIONS),
});

export type UpdateFormValues = z.infer<typeof updateFormSchema>;

export const mediaFormSchema = z.object({
  id: z.string().optional(),
  media_type: z.enum(MEDIA_TYPES),
  url: z.string().url("Informe uma URL válida."),
  thumbnail_url: z.string().optional(),
  phase: z.string().optional(),
  room: z.string().optional(),
  caption: z.string().optional(),
  visibility: z.enum(VISIBILITY_OPTIONS),
});

export type MediaFormValues = z.infer<typeof mediaFormSchema>;

export function toPropertyInsert(values: PropertyFormValues) {
  return {
    name: values.name.trim(),
    slug: values.slug.trim(),
    address: values.address?.trim() || null,
    city: values.city?.trim() || null,
    state: values.state?.trim() || null,
    zip_code: values.zip_code?.trim() || null,
    project_type: values.project_type,
    status: values.status,
    progress: values.progress,
    purchase_price: values.purchase_price,
    estimated_rehab_budget: values.estimated_rehab_budget,
    current_spent: values.current_spent,
    estimated_sale_price: values.estimated_sale_price,
    actual_sale_price: values.actual_sale_price,
    estimated_profit: values.estimated_profit,
    actual_profit: values.actual_profit,
    cover_image_url: values.cover_image_url?.trim() || null,
    description: values.description?.trim() || null,
    is_published: values.is_published,
    visibility: values.visibility,
    last_updated_at: new Date().toISOString(),
  };
}
