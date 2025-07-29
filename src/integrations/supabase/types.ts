export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          pet_breed: string | null
          pet_name: string | null
          pet_weight: number | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          pet_breed?: string | null
          pet_name?: string | null
          pet_weight?: number | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          pet_breed?: string | null
          pet_name?: string | null
          pet_weight?: number | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ingredients: {
        Row: {
          cost_per_unit: number | null
          created_at: string
          current_stock: number
          id: string
          maximum_stock: number | null
          minimum_stock: number
          name: string
          supplier: string | null
          unit: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cost_per_unit?: number | null
          created_at?: string
          current_stock?: number
          id?: string
          maximum_stock?: number | null
          minimum_stock?: number
          name: string
          supplier?: string | null
          unit?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cost_per_unit?: number | null
          created_at?: string
          current_stock?: number
          id?: string
          maximum_stock?: number | null
          minimum_stock?: number
          name?: string
          supplier?: string | null
          unit?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      inventory_movements: {
        Row: {
          created_at: string
          id: string
          ingredient_id: string
          movement_type: string
          notes: string | null
          quantity: number
          reference_id: string | null
          reference_type: string | null
          unit_cost: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ingredient_id: string
          movement_type: string
          notes?: string | null
          quantity: number
          reference_id?: string | null
          reference_type?: string | null
          unit_cost?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ingredient_id?: string
          movement_type?: string
          notes?: string | null
          quantity?: number
          reference_id?: string | null
          reference_type?: string | null
          unit_cost?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      labels: {
        Row: {
          batch_code: string
          created_at: string
          expiry_date: string
          id: string
          package_size: number
          printed: boolean | null
          product_name: string
          production_date: string
          production_id: string | null
          user_id: string
        }
        Insert: {
          batch_code: string
          created_at?: string
          expiry_date: string
          id?: string
          package_size: number
          printed?: boolean | null
          product_name: string
          production_date: string
          production_id?: string | null
          user_id: string
        }
        Update: {
          batch_code?: string
          created_at?: string
          expiry_date?: string
          id?: string
          package_size?: number
          printed?: boolean | null
          product_name?: string
          production_date?: string
          production_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "labels_production_id_fkey"
            columns: ["production_id"]
            isOneToOne: false
            referencedRelation: "productions"
            referencedColumns: ["id"]
          },
        ]
      }
      menus: {
        Row: {
          client_id: string | null
          created_at: string
          daily_food_amount: number | null
          id: string
          ingredients: Json
          is_active: boolean | null
          meals_per_day: number | null
          name: string
          recipe_file_url: string | null
          special_notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          daily_food_amount?: number | null
          id?: string
          ingredients?: Json
          is_active?: boolean | null
          meals_per_day?: number | null
          name: string
          recipe_file_url?: string | null
          special_notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          daily_food_amount?: number | null
          id?: string
          ingredients?: Json
          is_active?: boolean | null
          meals_per_day?: number | null
          name?: string
          recipe_file_url?: string | null
          special_notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "menus_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          related_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          related_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          related_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      productions: {
        Row: {
          ambient_temperature: number | null
          batch_code: string
          clean_weight: number | null
          created_at: string
          dehydrator_entry_time: string | null
          dehydrator_exit_time: string | null
          dehydrator_temperature: number | null
          epi_used: boolean | null
          expiry_date: string | null
          final_cleaning: boolean | null
          final_weight: number | null
          frozen_weight: number | null
          id: string
          initial_cleaning: boolean | null
          packages_150g: number | null
          packages_60g: number | null
          product_id: string | null
          production_date: string | null
          protein_type: string | null
          status: string
          thaw_time: string | null
          thawed_weight: number | null
          tray_count: number | null
          updated_at: string
          user_id: string
          visual_analysis: boolean | null
          yield_percentage: number | null
        }
        Insert: {
          ambient_temperature?: number | null
          batch_code: string
          clean_weight?: number | null
          created_at?: string
          dehydrator_entry_time?: string | null
          dehydrator_exit_time?: string | null
          dehydrator_temperature?: number | null
          epi_used?: boolean | null
          expiry_date?: string | null
          final_cleaning?: boolean | null
          final_weight?: number | null
          frozen_weight?: number | null
          id?: string
          initial_cleaning?: boolean | null
          packages_150g?: number | null
          packages_60g?: number | null
          product_id?: string | null
          production_date?: string | null
          protein_type?: string | null
          status?: string
          thaw_time?: string | null
          thawed_weight?: number | null
          tray_count?: number | null
          updated_at?: string
          user_id: string
          visual_analysis?: boolean | null
          yield_percentage?: number | null
        }
        Update: {
          ambient_temperature?: number | null
          batch_code?: string
          clean_weight?: number | null
          created_at?: string
          dehydrator_entry_time?: string | null
          dehydrator_exit_time?: string | null
          dehydrator_temperature?: number | null
          epi_used?: boolean | null
          expiry_date?: string | null
          final_cleaning?: boolean | null
          final_weight?: number | null
          frozen_weight?: number | null
          id?: string
          initial_cleaning?: boolean | null
          packages_150g?: number | null
          packages_60g?: number | null
          product_id?: string | null
          production_date?: string | null
          protein_type?: string | null
          status?: string
          thaw_time?: string | null
          thawed_weight?: number | null
          tray_count?: number | null
          updated_at?: string
          user_id?: string
          visual_analysis?: boolean | null
          yield_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "productions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          package_sizes: number[] | null
          updated_at: string
          user_id: string
          validity_days: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          package_sizes?: number[] | null
          updated_at?: string
          user_id: string
          validity_days?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          package_sizes?: number[] | null
          updated_at?: string
          user_id?: string
          validity_days?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
