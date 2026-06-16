import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminEnvErrorMessage } from "@/lib/env/server";

export interface DashboardProperty {
  id: string;
  name: string;
  slug: string;
  project_type: string | null;
  status: string;
  progress: number | null;
  purchase_price: number | null;
  estimated_sale_price: number | null;
  estimated_profit: number | null;
  is_published: boolean;
  updated_at: string;
}

export interface DashboardRecentUpdate {
  id: string;
  property_id: string;
  property_name: string;
  title: string;
  update_type: string;
  visibility: string;
  created_at: string;
}

export interface DashboardRawData {
  properties: DashboardProperty[];
  mediaCount: number;
  publishedUpdatesCount: number;
  activeAdminUsersCount: number;
  recentUpdates: DashboardRecentUpdate[];
}

export async function getDashboardData(): Promise<DashboardRawData> {
  const envError = getAdminEnvErrorMessage();
  if (envError) {
    throw new Error(envError);
  }

  const supabase = createAdminClient();

  const [
    propertiesResult,
    mediaResult,
    publishedUpdatesResult,
    activeAdminsResult,
    recentUpdatesResult,
  ] = await Promise.all([
    supabase
      .from("properties")
      .select(
        "id, name, slug, project_type, status, progress, purchase_price, estimated_sale_price, estimated_profit, is_published, updated_at",
      )
      .order("updated_at", { ascending: false }),
    supabase.from("property_media").select("id", { count: "exact", head: true }),
    supabase
      .from("property_updates")
      .select("id", { count: "exact", head: true })
      .eq("visibility", "public"),
    supabase
      .from("admin_users")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("property_updates")
      .select("id, property_id, title, update_type, visibility, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  if (propertiesResult.error) {
    throw new Error(
      `Failed to fetch properties: ${propertiesResult.error.message}`,
    );
  }

  if (mediaResult.error) {
    throw new Error(`Failed to fetch media count: ${mediaResult.error.message}`);
  }

  if (publishedUpdatesResult.error) {
    throw new Error(
      `Failed to fetch published updates count: ${publishedUpdatesResult.error.message}`,
    );
  }

  if (activeAdminsResult.error) {
    throw new Error(
      `Failed to fetch active admin users: ${activeAdminsResult.error.message}`,
    );
  }

  if (recentUpdatesResult.error) {
    throw new Error(
      `Failed to fetch recent updates: ${recentUpdatesResult.error.message}`,
    );
  }

  const properties = (propertiesResult.data ?? []) as DashboardProperty[];
  const propertyNameById = new Map(
    properties.map((property) => [property.id, property.name]),
  );

  const recentUpdates: DashboardRecentUpdate[] = (
    recentUpdatesResult.data ?? []
  ).map((update) => ({
    id: update.id,
    property_id: update.property_id,
    property_name:
      propertyNameById.get(update.property_id) ?? "Imóvel desconhecido",
    title: update.title,
    update_type: update.update_type,
    visibility: update.visibility,
    created_at: update.created_at,
  }));

  return {
    properties,
    mediaCount: mediaResult.count ?? 0,
    publishedUpdatesCount: publishedUpdatesResult.count ?? 0,
    activeAdminUsersCount: activeAdminsResult.count ?? 0,
    recentUpdates,
  };
}
