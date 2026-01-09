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
      event_options: {
        Row: {
          created_at: string
          event_id: string
          final_price: number | null
          id: string
          is_winner: boolean | null
          label: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_id: string
          final_price?: number | null
          id: string
          is_winner?: boolean | null
          label: string
          price?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_id?: string
          final_price?: number | null
          id?: string
          is_winner?: boolean | null
          label?: string
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_options_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_relations: {
        Row: {
          created_at: string
          display_order: number
          id: string
          related_event_id: string
          source_event_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          related_event_id: string
          source_event_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          related_event_id?: string
          source_event_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          category: string
          created_at: string
          description: string | null
          end_date: string | null
          icon: string
          id: string
          is_resolved: boolean
          name: string
          rules: string | null
          settled_at: string | null
          settlement_description: string | null
          source_name: string | null
          source_url: string | null
          start_date: string | null
          updated_at: string
          volume: string | null
          winning_option_id: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          icon?: string
          id: string
          is_resolved?: boolean
          name: string
          rules?: string | null
          settled_at?: string | null
          settlement_description?: string | null
          source_name?: string | null
          source_url?: string | null
          start_date?: string | null
          updated_at?: string
          volume?: string | null
          winning_option_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          icon?: string
          id?: string
          is_resolved?: boolean
          name?: string
          rules?: string | null
          settled_at?: string | null
          settlement_description?: string | null
          source_name?: string | null
          source_url?: string | null
          start_date?: string | null
          updated_at?: string
          volume?: string | null
          winning_option_id?: string | null
        }
        Relationships: []
      }
      positions: {
        Row: {
          closed_at: string | null
          created_at: string
          entry_price: number
          event_name: string
          id: string
          leverage: number
          margin: number
          mark_price: number
          option_label: string
          pnl: number | null
          pnl_percent: number | null
          side: string
          size: number
          sl_mode: string | null
          sl_value: number | null
          status: string
          tp_mode: string | null
          tp_value: number | null
          trade_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          closed_at?: string | null
          created_at?: string
          entry_price: number
          event_name: string
          id?: string
          leverage?: number
          margin: number
          mark_price: number
          option_label: string
          pnl?: number | null
          pnl_percent?: number | null
          side: string
          size: number
          sl_mode?: string | null
          sl_value?: number | null
          status?: string
          tp_mode?: string | null
          tp_value?: number | null
          trade_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          closed_at?: string | null
          created_at?: string
          entry_price?: number
          event_name?: string
          id?: string
          leverage?: number
          margin?: number
          mark_price?: number
          option_label?: string
          pnl?: number | null
          pnl_percent?: number | null
          side?: string
          size?: number
          sl_mode?: string | null
          sl_value?: number | null
          status?: string
          tp_mode?: string | null
          tp_value?: number | null
          trade_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "positions_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trades"
            referencedColumns: ["id"]
          },
        ]
      }
      price_history: {
        Row: {
          created_at: string
          event_id: string
          id: string
          option_id: string
          price: number
          recorded_at: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          option_id: string
          price: number
          recorded_at?: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          option_id?: string
          price?: number
          recorded_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          trial_balance: number | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          trial_balance?: number | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          trial_balance?: number | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      trades: {
        Row: {
          amount: number
          closed_at: string | null
          created_at: string
          event_name: string
          fee: number
          id: string
          leverage: number
          margin: number
          option_label: string
          order_type: string
          pnl: number | null
          price: number
          quantity: number
          side: string
          sl_mode: string | null
          sl_value: number | null
          status: string
          tp_mode: string | null
          tp_value: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          closed_at?: string | null
          created_at?: string
          event_name: string
          fee?: number
          id?: string
          leverage?: number
          margin: number
          option_label: string
          order_type: string
          pnl?: number | null
          price: number
          quantity: number
          side: string
          sl_mode?: string | null
          sl_value?: number | null
          status?: string
          tp_mode?: string | null
          tp_value?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          closed_at?: string | null
          created_at?: string
          event_name?: string
          fee?: number
          id?: string
          leverage?: number
          margin?: number
          option_label?: string
          order_type?: string
          pnl?: number | null
          price?: number
          quantity?: number
          side?: string
          sl_mode?: string | null
          sl_value?: number | null
          status?: string
          tp_mode?: string | null
          tp_value?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          type?: string
          updated_at?: string
          user_id?: string
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
      wallets: {
        Row: {
          address: string
          connected_at: string
          created_at: string
          full_address: string
          icon: string
          id: string
          is_primary: boolean
          network: string
          updated_at: string
          user_id: string
          wallet_type: string
        }
        Insert: {
          address: string
          connected_at?: string
          created_at?: string
          full_address: string
          icon?: string
          id?: string
          is_primary?: boolean
          network?: string
          updated_at?: string
          user_id: string
          wallet_type?: string
        }
        Update: {
          address?: string
          connected_at?: string
          created_at?: string
          full_address?: string
          icon?: string
          id?: string
          is_primary?: boolean
          network?: string
          updated_at?: string
          user_id?: string
          wallet_type?: string
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
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
