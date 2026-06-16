export type PropertyStatus =
  | "planning"
  | "acquisition"
  | "rehab"
  | "marketing"
  | "sold"
  | "completed"
  | string;

export type Visibility = "public" | "private" | string;

export type PhaseStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "skipped"
  | string;

export type UpdateType =
  | "general"
  | "milestone"
  | "financial"
  | "issue"
  | string;

export type MediaType = "photo" | "video" | string;

export interface Property {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  project_type: string | null;
  status: PropertyStatus;
  progress: number | null;
  purchase_price: number | null;
  estimated_rehab_budget: number | null;
  current_spent: number | null;
  estimated_sale_price: number | null;
  actual_sale_price: number | null;
  estimated_profit: number | null;
  actual_profit: number | null;
  cover_image_url: string | null;
  description: string | null;
  is_published: boolean;
  visibility: Visibility;
  last_updated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyPhase {
  id: string;
  property_id: string;
  title: string;
  description: string | null;
  status: PhaseStatus;
  sort_order: number;
  planned_date: string | null;
  completed_date: string | null;
  visibility: Visibility;
  created_at: string;
}

export interface PropertyUpdate {
  id: string;
  property_id: string;
  title: string;
  description: string | null;
  update_type: UpdateType;
  visibility: Visibility;
  created_at: string;
}

export interface PropertyMedia {
  id: string;
  property_id: string;
  media_type: MediaType;
  url: string;
  thumbnail_url: string | null;
  phase: string | null;
  room: string | null;
  caption: string | null;
  visibility: Visibility;
  created_at: string;
}

export interface PropertyDetail {
  property: Property;
  phases: PropertyPhase[];
  updates: PropertyUpdate[];
  media: PropertyMedia[];
}
