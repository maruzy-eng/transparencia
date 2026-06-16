import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminEnvErrorMessage } from "@/lib/env/server";
import type {
  Property,
  PropertyDetail,
  PropertyMedia,
  PropertyPhase,
  PropertyUpdate,
} from "@/lib/transparency/types";

function assertEnv() {
  const envError = getAdminEnvErrorMessage();
  if (envError) {
    throw new Error(envError);
  }
}

export async function getAdminProperties(): Promise<Property[]> {
  assertEnv();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch properties: ${error.message}`);
  }

  return (data ?? []) as Property[];
}

export async function getAdminPropertyById(
  id: string,
): Promise<Property | null> {
  assertEnv();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch property: ${error.message}`);
  }

  return (data as Property | null) ?? null;
}

export async function getAdminPropertyBySlug(
  slug: string,
): Promise<Property | null> {
  assertEnv();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch property: ${error.message}`);
  }

  return (data as Property | null) ?? null;
}

export async function getAdminPropertyPhases(
  propertyId: string,
): Promise<PropertyPhase[]> {
  assertEnv();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("property_phases")
    .select("*")
    .eq("property_id", propertyId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch property phases: ${error.message}`);
  }

  return (data ?? []) as PropertyPhase[];
}

export async function getAdminPropertyUpdates(
  propertyId: string,
): Promise<PropertyUpdate[]> {
  assertEnv();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("property_updates")
    .select("*")
    .eq("property_id", propertyId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch property updates: ${error.message}`);
  }

  return (data ?? []) as PropertyUpdate[];
}

export async function getAdminPropertyMedia(
  propertyId: string,
): Promise<PropertyMedia[]> {
  assertEnv();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("property_media")
    .select("*")
    .eq("property_id", propertyId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch property media: ${error.message}`);
  }

  return (data ?? []) as PropertyMedia[];
}

export async function getAdminPropertyDetail(
  id: string,
): Promise<PropertyDetail | null> {
  const property = await getAdminPropertyById(id);
  if (!property) {
    return null;
  }

  const [phases, updates, media] = await Promise.all([
    getAdminPropertyPhases(property.id),
    getAdminPropertyUpdates(property.id),
    getAdminPropertyMedia(property.id),
  ]);

  return { property, phases, updates, media };
}
