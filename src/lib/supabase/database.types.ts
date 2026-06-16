export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string;
          name: string;
          email: string;
          password_hash: string;
          role: "admin" | "editor";
          status: "active" | "inactive";
          last_login_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          password_hash: string;
          role: "admin" | "editor";
          status?: "active" | "inactive";
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          password_hash?: string;
          role?: "admin" | "editor";
          status?: "active" | "inactive";
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      properties: {
        Row: {
          id: string;
          name: string;
          slug: string;
          address: string | null;
          city: string | null;
          state: string | null;
          zip_code: string | null;
          project_type: string | null;
          status: string;
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
          visibility: string;
          last_updated_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          project_type?: string | null;
          status?: string;
          progress?: number | null;
          purchase_price?: number | null;
          estimated_rehab_budget?: number | null;
          current_spent?: number | null;
          estimated_sale_price?: number | null;
          actual_sale_price?: number | null;
          estimated_profit?: number | null;
          actual_profit?: number | null;
          cover_image_url?: string | null;
          description?: string | null;
          is_published?: boolean;
          visibility?: string;
          last_updated_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          project_type?: string | null;
          status?: string;
          progress?: number | null;
          purchase_price?: number | null;
          estimated_rehab_budget?: number | null;
          current_spent?: number | null;
          estimated_sale_price?: number | null;
          actual_sale_price?: number | null;
          estimated_profit?: number | null;
          actual_profit?: number | null;
          cover_image_url?: string | null;
          description?: string | null;
          is_published?: boolean;
          visibility?: string;
          last_updated_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      property_media: {
        Row: {
          id: string;
          property_id: string;
          media_type: string;
          url: string;
          thumbnail_url: string | null;
          phase: string | null;
          room: string | null;
          caption: string | null;
          visibility: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          media_type: string;
          url: string;
          thumbnail_url?: string | null;
          phase?: string | null;
          room?: string | null;
          caption?: string | null;
          visibility?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          media_type?: string;
          url?: string;
          thumbnail_url?: string | null;
          phase?: string | null;
          room?: string | null;
          caption?: string | null;
          visibility?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      property_phases: {
        Row: {
          id: string;
          property_id: string;
          title: string;
          description: string | null;
          status: string;
          sort_order: number;
          planned_date: string | null;
          completed_date: string | null;
          visibility: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          title: string;
          description?: string | null;
          status?: string;
          sort_order?: number;
          planned_date?: string | null;
          completed_date?: string | null;
          visibility?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          title?: string;
          description?: string | null;
          status?: string;
          sort_order?: number;
          planned_date?: string | null;
          completed_date?: string | null;
          visibility?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      property_updates: {
        Row: {
          id: string;
          property_id: string;
          title: string;
          description: string | null;
          update_type: string;
          visibility: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          title: string;
          description?: string | null;
          update_type?: string;
          visibility?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          title?: string;
          description?: string | null;
          update_type?: string;
          visibility?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      site_content: {
        Row: {
          id: string;
          key: string;
          label: string;
          value: string;
          type: "text" | "textarea" | "url";
          group: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          label: string;
          value?: string;
          type?: "text" | "textarea" | "url";
          group: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          label?: string;
          value?: string;
          type?: "text" | "textarea" | "url";
          group?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          type: "text" | "url" | "image";
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value?: string;
          type?: "text" | "url" | "image";
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: string;
          type?: "text" | "url" | "image";
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
