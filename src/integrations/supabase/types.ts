export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_name: string
          event_type: Database["public"]["Enums"]["analytics_event_type"]
          id: string
          page_url: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_name: string
          event_type: Database["public"]["Enums"]["analytics_event_type"]
          id?: string
          page_url?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_name?: string
          event_type?: Database["public"]["Enums"]["analytics_event_type"]
          id?: string
          page_url?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          house_value_growth_rate: number | null
          id: string
          tax_filing_status: string
          tax_rate: number | null
        }
        Insert: {
          created_at?: string
          email: string
          house_value_growth_rate?: number | null
          id: string
          tax_filing_status?: string
          tax_rate?: number | null
        }
        Update: {
          created_at?: string
          email?: string
          house_value_growth_rate?: number | null
          id?: string
          tax_filing_status?: string
          tax_rate?: number | null
        }
        Relationships: []
      }
      project_files: {
        Row: {
          created_at: string | null
          file_category: string
          file_path: string
          file_type: string
          id: string
          project_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          file_category: string
          file_path: string
          file_type: string
          id?: string
          project_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          file_category?: string
          file_path?: string
          file_type?: string
          id?: string
          project_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          ai_analysis_result: string | null
          builder_name: string | null
          builder_url: string | null
          completion_date: string
          cost: number
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          insurance_reduction_analysis: string | null
          insurance_reduction_eligible: boolean | null
          name: string
          property_id: string
          qualifies_for_basis: boolean | null
          start_date: string | null
          tax_credits_analysis: string | null
          tax_credits_eligible: boolean | null
          user_id: string
        }
        Insert: {
          ai_analysis_result?: string | null
          builder_name?: string | null
          builder_url?: string | null
          completion_date: string
          cost: number
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          insurance_reduction_analysis?: string | null
          insurance_reduction_eligible?: boolean | null
          name: string
          property_id: string
          qualifies_for_basis?: boolean | null
          start_date?: string | null
          tax_credits_analysis?: string | null
          tax_credits_eligible?: boolean | null
          user_id: string
        }
        Update: {
          ai_analysis_result?: string | null
          builder_name?: string | null
          builder_url?: string | null
          completion_date?: string
          cost?: number
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          insurance_reduction_analysis?: string | null
          insurance_reduction_eligible?: boolean | null
          name?: string
          property_id?: string
          qualifies_for_basis?: boolean | null
          start_date?: string | null
          tax_credits_analysis?: string | null
          tax_credits_eligible?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          city: string
          created_at: string | null
          current_value: number
          id: string
          lived_in_property_2_of_5_years: boolean | null
          name: string
          property_type: string
          purchase_date: string
          purchase_price: number
          state: string
          street_address: string
          user_id: string
          zip_code: string
        }
        Insert: {
          city?: string
          created_at?: string | null
          current_value: number
          id?: string
          lived_in_property_2_of_5_years?: boolean | null
          name: string
          property_type: string
          purchase_date: string
          purchase_price: number
          state?: string
          street_address: string
          user_id: string
          zip_code?: string
        }
        Update: {
          city?: string
          created_at?: string | null
          current_value?: number
          id?: string
          lived_in_property_2_of_5_years?: boolean | null
          name?: string
          property_type?: string
          purchase_date?: string
          purchase_price?: number
          state?: string
          street_address?: string
          user_id?: string
          zip_code?: string
        }
        Relationships: []
      }
      property_modal_views: {
        Row: {
          created_at: string
          id: string
          property_id: string
          tax_savings_modal_viewed: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          property_id: string
          tax_savings_modal_viewed?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          property_id?: string
          tax_savings_modal_viewed?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_modal_views_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_forms: {
        Row: {
          created_at: string | null
          data: Json
          form_type: Database["public"]["Enums"]["tax_form_type"]
          id: string
          property_id: string
          tax_year: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data: Json
          form_type: Database["public"]["Enums"]["tax_form_type"]
          id?: string
          property_id: string
          tax_year: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json
          form_type?: Database["public"]["Enums"]["tax_form_type"]
          id?: string
          property_id?: string
          tax_year?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tax_forms_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      user_credits: {
        Row: {
          created_at: string | null
          credit_type: Database["public"]["Enums"]["credit_type"]
          credits_limit: number
          credits_used: number
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          credit_type: Database["public"]["Enums"]["credit_type"]
          credits_limit?: number
          credits_used?: number
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          credit_type?: Database["public"]["Enums"]["credit_type"]
          credits_limit?: number
          credits_used?: number
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      analytics_event_type: "click" | "pageview" | "custom"
      credit_type: "irs_gpt"
      tax_form_type: "8949" | "SCHEDULE_D"
      user_credit_type: "irs_gpt"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
