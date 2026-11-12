export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          category: string;
          location: string;
          year: number;
          area_sq_ft: number;
          client: string;
          description: string;
          materials: Json;
          features: Json;
          cover_image: string;
          gallery: Json;
          videos: Json;
          featured: boolean;
          published: boolean;
          completion_weeks: number;
          before_after: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
        Relationships: [];
      };
      faqs: {
        Row: { id: string; category: string; question: string; answer: string; highlight: string | null; display_order: number; published: boolean; created_at: string; updated_at: string };
        Insert: Omit<Database['public']['Tables']['faqs']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['faqs']['Insert']>;
        Relationships: [];
      };
      testimonials: {
        Row: { id: string; client_name: string; role: string; project: string; location: string; rating: number; quote: string; outcome: string; avatar_url: string | null; year: number; approved: boolean; published: boolean; created_at: string; updated_at: string };
        Insert: Omit<Database['public']['Tables']['testimonials']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['testimonials']['Insert']>;
        Relationships: [];
      };
      inquiries: {
        Row: { id: string; name: string; email: string; phone: string; project_scope: string; property_type: string; estimated_sq_ft: string; location: string; target_timeline: string; message: string; budget_range: string; status: string; notes: string | null; created_at: string };
        Insert: Omit<Database['public']['Tables']['inquiries']['Row'], 'id' | 'created_at' | 'status' | 'notes'> & { status?: string; notes?: string | null };
        Update: Partial<Database['public']['Tables']['inquiries']['Insert']>;
        Relationships: [];
      };
      appointments: {
        Row: { id: string; client_name: string; client_email: string; client_phone: string; consultation_type: string; date: string; time_slot: string; project_type: string; estimated_sq_ft: number | null; budget: string | null; notes: string | null; status: string; created_at: string; google_calendar_event_url: string | null };
        Insert: Omit<Database['public']['Tables']['appointments']['Row'], 'id' | 'created_at' | 'status' | 'estimated_sq_ft' | 'budget' | 'notes' | 'google_calendar_event_url'> & { status?: string; estimated_sq_ft?: number | null; budget?: string | null; notes?: string | null; google_calendar_event_url?: string | null };
        Update: Partial<Database['public']['Tables']['appointments']['Insert']>;
        Relationships: [];
      };
      business_settings: {
        Row: { id: boolean; name: string; tagline: string; phone: string; whatsapp_number: string; email: string; address: string; google_maps_url: string; instagram_url: string; facebook_url: string; youtube_url: string; office_hours: string; updated_at: string };
        Insert: Omit<Database['public']['Tables']['business_settings']['Row'], 'updated_at'>;
        Update: Partial<Database['public']['Tables']['business_settings']['Insert']>;
        Relationships: [];
      };
      admin_roles: {
        Row: { user_id: string; role: string };
        Insert: Database['public']['Tables']['admin_roles']['Row'];
        Update: Partial<Database['public']['Tables']['admin_roles']['Insert']>;
        Relationships: [];
      };
      admin_profiles: {
        Row: { user_id: string; display_name: string; designation: string; updated_at: string };
        Insert: Omit<Database['public']['Tables']['admin_profiles']['Row'], 'updated_at'>;
        Update: Partial<Database['public']['Tables']['admin_profiles']['Insert']>;
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string;
          assigned_to: string | null;
          created_by: string;
          related_project_id: string | null;
          related_inquiry_id: string | null;
          priority: string;
          status: string;
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tasks']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['tasks']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_regalien_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      is_regalien_super_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
