import { createClient } from "@/lib/supabase/server";
import type {
  Property,
  PropertyDetail,
  PropertyMedia,
  PropertyPhase,
  PropertyUpdate,
} from "@/lib/transparency/types";

export async function getPublishedProperties(): Promise<Property[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("is_published", true)
    .eq("visibility", "public")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch properties: ${error.message}`);
  }

  return data ?? [];
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .eq("visibility", "public")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch property: ${error.message}`);
  }

  return data;
}

export async function getPropertyPhases(
  propertyId: string,
): Promise<PropertyPhase[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("property_phases")
    .select("*")
    .eq("property_id", propertyId)
    .eq("visibility", "public")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch property phases: ${error.message}`);
  }

  return data ?? [];
}

export async function getPropertyUpdates(
  propertyId: string,
): Promise<PropertyUpdate[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("property_updates")
    .select("*")
    .eq("property_id", propertyId)
    .eq("visibility", "public")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch property updates: ${error.message}`);
  }

  return data ?? [];
}

export async function getPropertyMedia(
  propertyId: string,
): Promise<PropertyMedia[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("property_media")
    .select("*")
    .eq("property_id", propertyId)
    .eq("visibility", "public")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch property media: ${error.message}`);
  }

  return data ?? [];
}

export async function getPropertyDetail(
  slug: string,
): Promise<PropertyDetail | null> {
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return null;
  }

  const [phases, updates, media] = await Promise.all([
    getPropertyPhases(property.id),
    getPropertyUpdates(property.id),
    getPropertyMedia(property.id),
  ]);

  return { property, phases, updates, media };
}
