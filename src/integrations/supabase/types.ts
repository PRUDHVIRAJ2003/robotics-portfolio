export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          icon_type: string | null
          id: string
          is_published: boolean | null
          link: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon_type?: string | null
          id?: string
          is_published?: boolean | null
          link?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon_type?: string | null
          id?: string
          is_published?: boolean | null
          link?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      certifications: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          image: string | null
          is_published: boolean | null
          issue_date: string | null
          issuer: string
          title: string
          updated_at: string
          verification_link: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          image?: string | null
          is_published?: boolean | null
          issue_date?: string | null
          issuer: string
          title: string
          updated_at?: string
          verification_link?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          image?: string | null
          is_published?: boolean | null
          issue_date?: string | null
          issuer?: string
          title?: string
          updated_at?: string
          verification_link?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean | null
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          name?: string
        }
        Relationships: []
      }
      education: {
        Row: {
          certificate_link: string | null
          created_at: string
          degree: string
          display_order: number | null
          grade: string | null
          id: string
          institution: string
          is_published: boolean | null
          period: string
          updated_at: string
        }
        Insert: {
          certificate_link?: string | null
          created_at?: string
          degree: string
          display_order?: number | null
          grade?: string | null
          id?: string
          institution: string
          is_published?: boolean | null
          period: string
          updated_at?: string
        }
        Update: {
          certificate_link?: string | null
          created_at?: string
          degree?: string
          display_order?: number | null
          grade?: string | null
          id?: string
          institution?: string
          is_published?: boolean | null
          period?: string
          updated_at?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          certificate_link: string | null
          company: string
          created_at: string
          display_order: number | null
          id: string
          is_published: boolean | null
          period: string
          responsibilities: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          certificate_link?: string | null
          company: string
          created_at?: string
          display_order?: number | null
          id?: string
          is_published?: boolean | null
          period: string
          responsibilities?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          certificate_link?: string | null
          company?: string
          created_at?: string
          display_order?: number | null
          id?: string
          is_published?: boolean | null
          period?: string
          responsibilities?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      invite_codes: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          is_active: boolean | null
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean | null
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean | null
          subscribed_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          data_link: string | null
          display_order: number | null
          full_description: string | null
          github_link: string | null
          id: string
          images: string[] | null
          is_featured: boolean | null
          is_published: boolean | null
          live_link: string | null
          short_description: string
          technologies: string[] | null
          thumbnail: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_link?: string | null
          display_order?: number | null
          full_description?: string | null
          github_link?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          is_published?: boolean | null
          live_link?: string | null
          short_description: string
          technologies?: string[] | null
          thumbnail?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_link?: string | null
          display_order?: number | null
          full_description?: string | null
          github_link?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          is_published?: boolean | null
          live_link?: string | null
          short_description?: string
          technologies?: string[] | null
          thumbnail?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      publications: {
        Row: {
          authors: string[] | null
          created_at: string
          description: string | null
          doi: string | null
          id: string
          is_published: boolean | null
          link: string | null
          publication_date: string | null
          publisher: string | null
          title: string
          updated_at: string
        }
        Insert: {
          authors?: string[] | null
          created_at?: string
          description?: string | null
          doi?: string | null
          id?: string
          is_published?: boolean | null
          link?: string | null
          publication_date?: string | null
          publisher?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          authors?: string[] | null
          created_at?: string
          description?: string | null
          doi?: string | null
          id?: string
          is_published?: boolean | null
          link?: string | null
          publication_date?: string | null
          publisher?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      use_invite_code: {
        Args: { p_code: string; p_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
