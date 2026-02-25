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
      budget_limits: {
        Row: {
          category: string
          created_at: string
          current_amount: number
          id: string
          is_active: boolean | null
          limit_amount: number
          period_end: string
          period_start: string
          type: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          current_amount?: number
          id?: string
          is_active?: boolean | null
          limit_amount: number
          period_end: string
          period_start: string
          type: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          current_amount?: number
          id?: string
          is_active?: boolean | null
          limit_amount?: number
          period_end?: string
          period_start?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      deposit_addresses: {
        Row: {
          address: string
          created_at: string
          id: string
          is_active: boolean
          network: string
          token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          is_active?: boolean
          network: string
          token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          is_active?: boolean
          network?: string
          token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
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
          price_label: string | null
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
          price_label?: string | null
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
          price_label?: string | null
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
      points_accounts: {
        Row: {
          balance: number
          created_at: string
          frozen: number
          id: string
          lifetime_earned: number
          lifetime_spent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          frozen?: number
          id?: string
          lifetime_earned?: number
          lifetime_spent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          frozen?: number
          id?: string
          lifetime_earned?: number
          lifetime_spent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      points_config: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      points_ledger: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          source: string
          source_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          source: string
          source_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          source?: string
          source_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      points_redemptions: {
        Row: {
          created_at: string
          exchange_rate: Json
          id: string
          points_spent: number
          status: string
          trial_balance_received: number
          user_id: string
        }
        Insert: {
          created_at?: string
          exchange_rate: Json
          id?: string
          points_spent: number
          status?: string
          trial_balance_received: number
          user_id: string
        }
        Update: {
          created_at?: string
          exchange_rate?: Json
          id?: string
          points_spent?: number
          status?: string
          trial_balance_received?: number
          user_id?: string
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
          option_id: string | null
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
          option_id?: string | null
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
          option_id?: string | null
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
            foreignKeyName: "positions_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "event_options"
            referencedColumns: ["id"]
          },
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
          auth_method: string | null
          avatar_url: string | null
          balance: number | null
          created_at: string
          email: string | null
          id: string
          trial_balance: number | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          auth_method?: string | null
          avatar_url?: string | null
          balance?: number | null
          created_at?: string
          email?: string | null
          id?: string
          trial_balance?: number | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          auth_method?: string | null
          avatar_url?: string | null
          balance?: number | null
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
      referral_codes: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean | null
          updated_at: string
          user_id: string
          uses_count: number | null
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
          user_id: string
          uses_count?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
          user_id?: string
          uses_count?: number | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          level: number
          metadata: Json | null
          points_awarded: number | null
          qualified_at: string | null
          referee_id: string
          referral_code: string
          referrer_id: string
          rewarded_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          level?: number
          metadata?: Json | null
          points_awarded?: number | null
          qualified_at?: string | null
          referee_id: string
          referral_code: string
          referrer_id: string
          rewarded_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          level?: number
          metadata?: Json | null
          points_awarded?: number | null
          qualified_at?: string | null
          referee_id?: string
          referral_code?: string
          referrer_id?: string
          rewarded_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          max_completions: number | null
          name: string
          reward_points: number
          sort_order: number | null
          trigger_condition: Json
          type: string
          updated_at: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          max_completions?: number | null
          name: string
          reward_points: number
          sort_order?: number | null
          trigger_condition: Json
          type: string
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          max_completions?: number | null
          name?: string
          reward_points?: number
          sort_order?: number | null
          trigger_condition?: Json
          type?: string
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
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
          confirmations: number | null
          created_at: string
          description: string | null
          id: string
          network: string | null
          required_confirmations: number | null
          status: string
          tx_hash: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          confirmations?: number | null
          created_at?: string
          description?: string | null
          id?: string
          network?: string | null
          required_confirmations?: number | null
          status?: string
          tx_hash?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          confirmations?: number | null
          created_at?: string
          description?: string | null
          id?: string
          network?: string | null
          required_confirmations?: number | null
          status?: string
          tx_hash?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      treasure_drops: {
        Row: {
          created_at: string
          dropped_at: string
          id: string
          points_dropped: number
          target_points: number
          tier: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dropped_at?: string
          id?: string
          points_dropped: number
          target_points: number
          tier: string
          user_id: string
        }
        Update: {
          created_at?: string
          dropped_at?: string
          id?: string
          points_dropped?: number
          target_points?: number
          tier?: string
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
      user_tasks: {
        Row: {
          claimed_at: string | null
          completed_at: string | null
          created_at: string
          id: string
          metadata: Json | null
          points_awarded: number | null
          progress: Json | null
          status: string
          task_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          claimed_at?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          points_awarded?: number | null
          progress?: Json | null
          status?: string
          task_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          claimed_at?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          points_awarded?: number | null
          progress?: Json | null
          status?: string
          task_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
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
          label: string | null
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
          label?: string | null
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
          label?: string | null
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
      increment_referral_uses: { Args: { _code: string }; Returns: undefined }
      lookup_referral_code: {
        Args: { _code: string }
        Returns: {
          code: string
          is_active: boolean
          referrer_id: string
        }[]
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
