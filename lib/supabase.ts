// DEPRECATED: Do not import the 'supabase' client from this file!
// Instead, use:
// - Browser/Client components: import { createClient } from '@/utils/supabase/client'
// - Server components/API routes: import { createClient } from '@/utils/supabase/server'
// - Admin operations: import { supabaseAdmin } from '@/lib/supabase-admin'

// This file only exports TypeScript types for the database schema
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
      client_profiles: {
        Row: {
          id: string;
          user_id: string;
          business_name: string;
          business_instagram: string | null;
          budget_range: '$' | '$$' | '$$$';
          desired_categories: string[];
          about_business: string | null;
          created_at: string;
          updated_at: string;
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
          specialties: string[];
          facebook_url: string | null;
          instagram_url: string | null;
          linkedin_url: string | null;
          twitter_url: string | null;
          youtube_url: string | null;
          tiktok_url: string | null;
          is_verified: boolean;
          is_premium: boolean;
          premium_until: string | null;
          avg_rating: number;
          reviews_count: number;
          approval_status: 'pending' | 'approved' | 'rejected';
          rejection_reason: string | null;
          approved_at: string | null;
          reviewed_by: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          agency_id: string;
          user_id: string | null;
          author_name: string | null;
          rating: number;
          comment: string | null;
          status: 'pending' | 'approved' | 'rejected';
          reported: boolean;
          created_at: string;
        };
      };
      interaction_logs: {
        Row: {
          id: string;
          agency_id: string;
          interaction_type: string;
          session_id: string | null;
          user_agent: string | null;
          metadata: any;
          created_at: string;
        };
      };
      search_analytics: {
        Row: {
          id: string;
          search_query: string | null;
          service_category: string | null;
          location_filter: string | null;
          results_count: number;
          agencies_shown: string[];
          clicked_agency_id: string | null;
          clicked_position: number | null;
          session_id: string | null;
          created_at: string;
        };
      };
      agency_metrics_daily: {
        Row: {
          id: string;
          agency_id: string;
          metric_date: string;
          views: number;
          unique_visitors: number;
          phone_clicks: number;
          email_clicks: number;
          website_clicks: number;
          form_submissions: number;
          search_appearances: number;
          search_clicks: number;
          created_at: string;
        };
      };
    };
  };
};
