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
          solver_type: string;
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
          solver_type?: string;
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
          solver_type?: string;
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
    };
  };
}

interface Variable {
  name: string;
  symbol: string;
  unit: string;
}