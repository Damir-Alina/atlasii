/**
 * Supabase generated database types — hand-written to match the schema in
 * supabase/migrations/, since there was no network access in this build
 * environment to run `supabase gen types typescript`.
 *
 * Once you have a real Supabase project with these migrations applied, you
 * can regenerate this file for guaranteed accuracy:
 *   npx supabase gen types typescript --project-id <id> > src/types/database.ts
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          avatar_url: string | null;
          level: number;
          xp: number;
          xp_to_next_level: number;
          total_xp: number;
          total_correct: number;
          total_answered: number;
          streak_days: number;
          best_streak_days: number;
          last_active_date: string | null;
          is_premium: boolean;
          role: "user" | "admin";
          settings: Record<string, unknown>;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          created_at: string;
          updated_at: string;
          accuracy: number;
        };
        Insert: {
          id: string;
          full_name?: string;
          avatar_url?: string | null;
          level?: number;
          xp?: number;
          xp_to_next_level?: number;
          total_xp?: number;
          total_correct?: number;
          total_answered?: number;
          streak_days?: number;
          best_streak_days?: number;
          last_active_date?: string | null;
          is_premium?: boolean;
          role?: "user" | "admin";
          settings?: Record<string, unknown>;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
        };
        Update: {
          full_name?: string;
          avatar_url?: string | null;
          level?: number;
          xp?: number;
          xp_to_next_level?: number;
          total_xp?: number;
          total_correct?: number;
          total_answered?: number;
          streak_days?: number;
          best_streak_days?: number;
          last_active_date?: string | null;
          is_premium?: boolean;
          role?: "user" | "admin";
          settings?: Record<string, unknown>;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          icon: string;
          total_questions: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          icon: string;
          total_questions?: number;
        };
        Update: {
          slug?: string;
          name?: string;
          icon?: string;
          total_questions?: number;
        };
      };
      questions: {
        Row: {
          id: string;
          category_id: string;
          type: string;
          target_name: string;
          lng: number;
          lat: number;
          fact: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          type: string;
          target_name: string;
          lng: number;
          lat: number;
          fact?: string | null;
        };
        Update: {
          category_id?: string;
          type?: string;
          target_name?: string;
          lng?: number;
          lat?: number;
          fact?: string | null;
        };
      };
      results: {
        Row: {
          id: string;
          user_id: string;
          category_id: string | null;
          category_name: string;
          accuracy: number;
          xp_earned: number;
          correct_count: number;
          total_count: number;
          duration_seconds: number;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id?: string | null;
          category_name: string;
          accuracy: number;
          xp_earned: number;
          correct_count: number;
          total_count: number;
          duration_seconds?: number;
          completed_at?: string;
        };
        Update: {
          category_name?: string;
          accuracy?: number;
          xp_earned?: number;
          correct_count?: number;
          total_count?: number;
        };
      };
      achievements: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          icon: string;
          goal: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description: string;
          icon: string;
          goal?: number;
        };
        Update: {
          slug?: string;
          title?: string;
          description?: string;
          icon?: string;
          goal?: number;
        };
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          progress: number;
          unlocked: boolean;
          unlocked_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          progress?: number;
          unlocked?: boolean;
          unlocked_at?: string | null;
        };
        Update: {
          progress?: number;
          unlocked?: boolean;
          unlocked_at?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_period_leaderboard: {
        Args: {
          days_back: number;
          result_limit?: number;
          result_offset?: number;
        };
        Returns: {
          user_id: string;
          full_name: string;
          avatar_url: string | null;
          period_xp: number;
          total_count: number;
        }[];
      };
    };
    Enums: Record<string, never>;
  };
}
