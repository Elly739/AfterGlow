export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type EventStatus = "draft" | "upcoming" | "live" | "archived" | "closed";
export type RetentionMode = "permanent" | "duration" | "until_date";

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          slug: string;
          description: string | null;
          cover_image_path: string | null;
          venue: string | null;
          starts_at: string | null;
          status: EventStatus;
          guest_uploads_enabled: boolean;
          guest_messages_enabled: boolean;
          downloads_enabled: boolean;
          retention_mode: RetentionMode;
          retention_days: number | null;
          retention_until: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          title: string;
          slug: string;
          description?: string | null;
          cover_image_path?: string | null;
          venue?: string | null;
          starts_at?: string | null;
          status?: EventStatus;
          guest_uploads_enabled?: boolean;
          guest_messages_enabled?: boolean;
          downloads_enabled?: boolean;
          retention_mode?: RetentionMode;
          retention_days?: number | null;
          retention_until?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          cover_image_path?: string | null;
          venue?: string | null;
          starts_at?: string | null;
          status?: EventStatus;
          guest_uploads_enabled?: boolean;
          guest_messages_enabled?: boolean;
          downloads_enabled?: boolean;
          retention_mode?: RetentionMode;
          retention_days?: number | null;
          retention_until?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      event_access: {
        Row: {
          event_id: string;
          token_hash: string;
          enabled: boolean;
          expires_at: string | null;
          created_at: string;
          rotated_at: string | null;
        };
        Insert: {
          event_id: string;
          token_hash: string;
          enabled?: boolean;
          expires_at?: string | null;
          created_at?: string;
          rotated_at?: string | null;
        };
        Update: {
          event_id?: string;
          token_hash?: string;
          enabled?: boolean;
          expires_at?: string | null;
          created_at?: string;
          rotated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "event_access_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: true;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_event_with_access: {
        Args: {
          p_title: string;
          p_slug: string;
          p_description: string | null;
          p_venue: string | null;
          p_starts_at: string | null;
          p_guest_uploads_enabled: boolean;
          p_guest_messages_enabled: boolean;
          p_downloads_enabled: boolean;
          p_retention_mode: RetentionMode;
          p_retention_days: number | null;
          p_retention_until: string | null;
          p_token_hash: string;
          p_status?: EventStatus;
        };
        Returns: string;
      };
      list_public_events: {
        Args: Record<PropertyKey, never>;
        Returns: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          venue: string | null;
          starts_at: string | null;
          status: EventStatus;
        }[];
      };
      get_public_event: {
        Args: { p_slug: string };
        Returns: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          venue: string | null;
          starts_at: string | null;
          status: EventStatus;
        }[];
      };
      verify_event_access: {
        Args: { p_slug: string; p_token_hash: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Event = Database["public"]["Tables"]["events"]["Row"];
