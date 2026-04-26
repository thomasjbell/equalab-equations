// src/lib/supabase/database.types.ts
export interface Database {
  public: {
    Tables: {
      equations: {
        Row: {
          id: string;
          name: string;
          category: string;
          latex: string;
          description: string | null;
          variables: Variable[];
          solver_type: 'linear' | 'quadratic' | 'cubic' | 'geometric' | 'physics' | 'suvat' | 'trigonometry' | 'statistics' | 'chemistry' | 'custom';
          solver_config: any;
          examples: any[];
          is_public: boolean;
          author_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          category: string;
          latex: string;
          description?: string | null;
          variables: Variable[];
          solver_type?: 'linear' | 'quadratic' | 'cubic' | 'geometric' | 'physics' | 'suvat' | 'trigonometry' | 'statistics' | 'chemistry' | 'custom';
          solver_config?: any;
          examples?: any[];
          is_public?: boolean;
          author_id?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          latex?: string;
          description?: string | null;
          variables?: Variable[];
          solver_type?: 'linear' | 'quadratic' | 'cubic' | 'geometric' | 'physics' | 'suvat' | 'trigonometry' | 'statistics' | 'chemistry' | 'custom';
          solver_config?: any;
          examples?: any[];
          is_public?: boolean;
          author_id?: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string | null;
          name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          email?: string | null;
          name?: string | null;
          avatar_url?: string | null;
        };
      };
      user_favorites: {
        Row: {
          id: string;
          user_id: string;
          equation_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          equation_id: string;
        };
        Update: {
          user_id?: string;
          equation_id?: string;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          theme: 'light' | 'dark' | 'system';
          decimal_places: number;
          significant_figures: number;
          number_format: 'decimal_places' | 'significant_figures';
          default_equation_view: 'expanded' | 'collapsed';
          default_result_mode: 'symbolic' | 'decimal' | 'both';
          animations_enabled: boolean;
          auto_solve: boolean;
          favorite_categories: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          theme?: 'light' | 'dark' | 'system';
          decimal_places?: number;
          significant_figures?: number;
          number_format?: 'decimal_places' | 'significant_figures';
          default_equation_view?: 'expanded' | 'collapsed';
          default_result_mode?: 'symbolic' | 'decimal' | 'both';
          animations_enabled?: boolean;
          auto_solve?: boolean;
          favorite_categories?: string[];
        };
        Update: {
          theme?: 'light' | 'dark' | 'system';
          decimal_places?: number;
          significant_figures?: number;
          number_format?: 'decimal_places' | 'significant_figures';
          default_equation_view?: 'expanded' | 'collapsed';
          default_result_mode?: 'symbolic' | 'decimal' | 'both';
          animations_enabled?: boolean;
          auto_solve?: boolean;
          favorite_categories?: string[];
        };
      };
    };
  };
}

interface Variable {
  name: string;
  symbol: string;
  unit: string;
}