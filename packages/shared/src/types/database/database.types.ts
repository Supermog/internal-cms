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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      client_support_months: {
        Row: {
          client_id: string
          created_at: string
          date: string
          id: string
          rolled_over_from_last_month: number | null
          rollover_hours: number | null
          spent_support_hours: number
          total_support_hours: number
        }
        Insert: {
          client_id: string
          created_at?: string
          date: string
          id?: string
          rolled_over_from_last_month?: number | null
          rollover_hours?: number | null
          spent_support_hours?: number
          total_support_hours?: number
        }
        Update: {
          client_id?: string
          created_at?: string
          date?: string
          id?: string
          rolled_over_from_last_month?: number | null
          rollover_hours?: number | null
          spent_support_hours?: number
          total_support_hours?: number
        }
        Relationships: [
          {
            foreignKeyName: "client_support_months_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string
          hours_per_month: number | null
          id: string
          is_covered_by_support: boolean
          is_monthly_checked: boolean | null
          is_proactive_support: boolean | null
          key_contact_email: string
          key_contact_name: string
          name: string
          short_name: string
          support_level: Database["public"]["Enums"]["client_support_level"]
          support_renewal_date: string | null
          support_status: Database["public"]["Enums"]["client_status"]
        }
        Insert: {
          created_at?: string
          hours_per_month?: number | null
          id?: string
          is_covered_by_support?: boolean
          is_monthly_checked?: boolean | null
          is_proactive_support?: boolean | null
          key_contact_email?: string
          key_contact_name?: string
          name?: string
          short_name?: string
          support_level?: Database["public"]["Enums"]["client_support_level"]
          support_renewal_date?: string | null
          support_status?: Database["public"]["Enums"]["client_status"]
        }
        Update: {
          created_at?: string
          hours_per_month?: number | null
          id?: string
          is_covered_by_support?: boolean
          is_monthly_checked?: boolean | null
          is_proactive_support?: boolean | null
          key_contact_email?: string
          key_contact_name?: string
          name?: string
          short_name?: string
          support_level?: Database["public"]["Enums"]["client_support_level"]
          support_renewal_date?: string | null
          support_status?: Database["public"]["Enums"]["client_status"]
        }
        Relationships: []
      }
      invites: {
        Row: {
          accepted_at: string | null
          client_uid: string | null
          code: string
          created_at: string
          created_by: string
          email: string
          expires_at: string
          id: string
          name: string
          role: string
          status: string
        }
        Insert: {
          accepted_at?: string | null
          client_uid?: string | null
          code?: string
          created_at?: string
          created_by: string
          email?: string
          expires_at?: string
          id?: string
          name?: string
          role?: string
          status?: string
        }
        Update: {
          accepted_at?: string | null
          client_uid?: string | null
          code?: string
          created_at?: string
          created_by?: string
          email?: string
          expires_at?: string
          id?: string
          name?: string
          role?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "invites_client_uid_fkey"
            columns: ["client_uid"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invites_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_comments: {
        Row: {
          body: string
          created_at: string
          id: string
          ticket_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          ticket_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_comments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          assignee_id: string | null
          client_id: string
          created_at: string
          description: string
          estimated_hours: number | null
          id: string
          priority: string
          reporter_id: string
          status: string
          title: string
        }
        Insert: {
          assignee_id?: string | null
          client_id: string
          created_at?: string
          description: string
          estimated_hours?: number | null
          id?: string
          priority: string
          reporter_id: string
          status: string
          title: string
        }
        Update: {
          assignee_id?: string | null
          client_id?: string
          created_at?: string
          description?: string
          estimated_hours?: number | null
          id?: string
          priority?: string
          reporter_id?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "Client tickets_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Client tickets_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Client tickets_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          client_uid: string | null
          created_at: string
          email: string
          id: string
          name: string
          role: string | null
        }
        Insert: {
          client_uid?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: string | null
        }
        Update: {
          client_uid?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_users_client_uid_fkey"
            columns: ["client_uid"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      client_status: "HEALTHY" | "NEEDS_ATTENTION"
      client_support_level: "NONE" | "BASIC" | "PREMIUM"
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
      client_status: ["HEALTHY", "NEEDS_ATTENTION"],
      client_support_level: ["NONE", "BASIC", "PREMIUM"],
    },
  },
} as const
