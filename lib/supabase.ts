import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          auth_id: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'user' | 'agency' | 'admin';
          created_at: string;
        };
      };
      agencies: {
        Row: {
          id: string;
          owner_id: string | null;
          name: string;
          slug: string;
          logo_url: string | null;
          cover_url: string | null;
          description: string | null;
          website: string | null;
          email: string | null;
          phone: string | null;
          location_city: string | null;
          location_region: string | null;
          employees_min: number | null;
          employees_max: number | null;
          price_range: string | null;
          services: string[];
          categories: string[];
          is_verified: boolean;
          is_premium: boolean;
          premium_until: string | null;
          avg_rating: number;
          reviews_count: number;
          created_at: string;
          updated_at: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          agency_id: string;
          user_id: string | null;
          rating: number;
          comment: string | null;
          status: 'pending' | 'approved' | 'rejected';
          reported: boolean;
          created_at: string;
        };
      };
    };
  };
};
