import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const analyticsRouter = router({
  trackView: publicProcedure
    .input(z.object({
      agencyId: z.string().uuid(),
      sessionId: z.string().optional(),
      userAgent: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { agencyId, sessionId, userAgent } = input;
      
      const { data: agencyExists } = await supabaseAdmin
        .from('agencies')
        .select('id')
        .eq('id', agencyId)
        .single();
      
      if (!agencyExists) {
        return { success: false, error: 'Agency not found' };
      }
      
      const { error } = await supabaseAdmin.from('interaction_logs').insert({
        agency_id: agencyId,
        interaction_type: 'view',
        session_id: sessionId,
        user_agent: userAgent,
        metadata: {},
      });

      if (error) {
        console.error('Error tracking view:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    }),

  trackContact: publicProcedure
    .input(z.object({
      agencyId: z.string().uuid(),
      contactType: z.enum(['phone_click', 'email_click', 'website_click', 'form_submit']),
      sessionId: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { agencyId, contactType, sessionId } = input;
      
      const { data: agencyExists } = await supabaseAdmin
        .from('agencies')
        .select('id')
        .eq('id', agencyId)
        .single();
      
      if (!agencyExists) {
        return { success: false, error: 'Agency not found' };
      }
      
      const { error } = await supabaseAdmin.from('interaction_logs').insert({
        agency_id: agencyId,
        interaction_type: contactType,
        session_id: sessionId,
      });

      if (error) {
        console.error('Error tracking contact:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    }),

  trackSearch: publicProcedure
    .input(z.object({
      searchQuery: z.string().max(200).optional(),
      serviceCategory: z.string().max(100).optional(),
      locationFilter: z.string().max(100).optional(),
      resultsCount: z.number().min(0).max(1000),
      agenciesShown: z.array(z.string().uuid()).max(50),
      clickedAgencyId: z.string().uuid().optional(),
      clickedPosition: z.number().min(0).max(100).optional(),
      sessionId: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const {
        searchQuery,
        serviceCategory,
        locationFilter,
        resultsCount,
        agenciesShown,
        clickedAgencyId,
        clickedPosition,
        sessionId,
      } = input;
      
      const { error } = await supabaseAdmin.from('search_analytics').insert({
        search_query: searchQuery,
        service_category: serviceCategory,
        location_filter: locationFilter,
        results_count: resultsCount,
        agencies_shown: agenciesShown,
        clicked_agency_id: clickedAgencyId,
        clicked_position: clickedPosition,
        session_id: sessionId,
      });

      if (error) {
        console.error('Error tracking search:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    }),

  getDashboardStats: protectedProcedure
    .input(z.object({
      days: z.number().default(30),
    }))
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      const { days } = input;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateISO = startDate.toISOString();

      const { count: totalUsers } = await supabaseAdmin
        .from('users')
        .select('*', { count: 'exact', head: true });

      const { count: totalAgencies } = await supabaseAdmin
        .from('agencies')
        .select('*', { count: 'exact', head: true });

      const { count: premiumAgencies } = await supabaseAdmin
        .from('agencies')
        .select('*', { count: 'exact', head: true })
        .eq('is_premium', true);

      const { count: totalReviews } = await supabaseAdmin
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      const { count: totalSearches } = await supabaseAdmin
        .from('search_analytics')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDateISO);

      const { count: totalContacts } = await supabaseAdmin
        .from('interaction_logs')
        .select('*', { count: 'exact', head: true })
        .in('interaction_type', ['phone_click', 'email_click', 'website_click', 'form_submit'])
        .gte('created_at', startDateISO);

      const { count: newUsers } = await supabaseAdmin
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDateISO);

      const { count: newAgencies } = await supabaseAdmin
        .from('agencies')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDateISO);

      return {
        totalUsers: totalUsers || 0,
        totalAgencies: totalAgencies || 0,
        premiumAgencies: premiumAgencies || 0,
        totalReviews: totalReviews || 0,
        totalSearches: totalSearches || 0,
        totalContacts: totalContacts || 0,
        newUsers: newUsers || 0,
        newAgencies: newAgencies || 0,
      };
    }),

  getAgencyRanking: protectedProcedure
    .input(z.object({
      days: z.number().default(30),
      limit: z.number().default(10),
    }))
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      const { days, limit } = input;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateISO = startDate.toISOString();

      const { data: viewStats, error: viewError } = await supabaseAdmin.rpc('get_agency_view_stats', {
        start_date: startDateISO,
      });

      if (viewError) {
        console.error('Error getting view stats:', viewError);
        return [];
      }

      const { data: contactStats, error: contactError } = await supabaseAdmin.rpc('get_agency_contact_stats', {
        start_date: startDateISO,
      });

      if (contactError) {
        console.error('Error getting contact stats:', contactError);
        return [];
      }

      const statsMap = new Map();
      
      viewStats?.forEach((row: any) => {
        statsMap.set(row.agency_id, {
          agencyId: row.agency_id,
          views: row.view_count || 0,
          contacts: 0,
        });
      });

      contactStats?.forEach((row: any) => {
        const existing = statsMap.get(row.agency_id) || { agencyId: row.agency_id, views: 0, contacts: 0 };
        existing.contacts = row.contact_count || 0;
        statsMap.set(row.agency_id, existing);
      });

      const agencyIds = Array.from(statsMap.keys());
      if (agencyIds.length === 0) return [];

      const { data: agencies, error: agenciesError } = await supabaseAdmin
        .from('agencies')
        .select('id, name, slug, logo_url, avg_rating, reviews_count, is_premium')
        .in('id', agencyIds);

      if (agenciesError || !agencies) {
        console.error('Error getting agencies:', agenciesError);
        return [];
      }

      const ranking = agencies.map((agency) => {
        const stats = statsMap.get(agency.id) || { views: 0, contacts: 0 };
        const ctr = stats.views > 0 ? (stats.contacts / stats.views) * 100 : 0;
        
        return {
          id: agency.id,
          name: agency.name,
          slug: agency.slug,
          logoUrl: agency.logo_url,
          views: stats.views,
          contacts: stats.contacts,
          ctr: parseFloat(ctr.toFixed(2)),
          avgRating: agency.avg_rating,
          reviewsCount: agency.reviews_count,
          isPremium: agency.is_premium,
        };
      });

      return ranking
        .sort((a, b) => b.views - a.views)
        .slice(0, limit);
    }),

  getMyAgencyAnalytics: protectedProcedure
    .input(z.object({
      days: z.number().default(30),
    }))
    .query(async ({ input, ctx }) => {
      const { days } = input;

      const { data: agency } = await supabaseAdmin
        .from('agencies')
        .select('id')
        .eq('owner_id', ctx.user?.id)
        .single();

      if (!agency) {
        throw new Error('You do not own an agency');
      }

      const agencyId = agency.id;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateISO = startDate.toISOString();

      const { data: interactions, error: interactionsError } = await supabaseAdmin
        .from('interaction_logs')
        .select('interaction_type, created_at')
        .eq('agency_id', agencyId)
        .gte('created_at', startDateISO)
        .order('created_at', { ascending: false });

      if (interactionsError || !interactions) {
        console.error('Error getting interactions:', interactionsError);
        return null;
      }

      const stats = {
        views: 0,
        phoneClicks: 0,
        emailClicks: 0,
        websiteClicks: 0,
        formSubmissions: 0,
      };

      const dailyStats: Record<string, { views: number; contacts: number }> = {};

      interactions.forEach((log) => {
        const date = new Date(log.created_at).toISOString().split('T')[0];
        
        if (!dailyStats[date]) {
          dailyStats[date] = { views: 0, contacts: 0 };
        }

        switch (log.interaction_type) {
          case 'view':
            stats.views++;
            dailyStats[date].views++;
            break;
          case 'phone_click':
            stats.phoneClicks++;
            dailyStats[date].contacts++;
            break;
          case 'email_click':
            stats.emailClicks++;
            dailyStats[date].contacts++;
            break;
          case 'website_click':
            stats.websiteClicks++;
            dailyStats[date].contacts++;
            break;
          case 'form_submit':
            stats.formSubmissions++;
            dailyStats[date].contacts++;
            break;
        }
      });

      const totalContacts = stats.phoneClicks + stats.emailClicks + stats.websiteClicks + stats.formSubmissions;
      const conversionRate = stats.views > 0 ? (totalContacts / stats.views) * 100 : 0;

      const { count: searchAppearances } = await supabaseAdmin
        .from('search_analytics')
        .select('*', { count: 'exact', head: true })
        .contains('agencies_shown', [agencyId])
        .gte('created_at', startDateISO);

      const { count: searchClicks } = await supabaseAdmin
        .from('search_analytics')
        .select('*', { count: 'exact', head: true })
        .eq('clicked_agency_id', agencyId)
        .gte('created_at', startDateISO);

      const { data: searches } = await supabaseAdmin
        .from('search_analytics')
        .select('search_query, service_category')
        .eq('clicked_agency_id', agencyId)
        .gte('created_at', startDateISO);

      const keywordCount: Record<string, number> = {};
      searches?.forEach((search) => {
        const keyword = search.search_query || search.service_category || '';
        if (keyword) {
          keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
        }
      });

      const topKeywords = Object.entries(keywordCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([keyword, count]) => ({ keyword, count }));

      const dailyTrends = Object.entries(dailyStats)
        .map(([date, data]) => ({
          date,
          views: data.views,
          contacts: data.contacts,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      const { count: platformAvgViews } = await supabaseAdmin
        .from('interaction_logs')
        .select('*', { count: 'exact', head: true })
        .eq('interaction_type', 'view')
        .gte('created_at', startDateISO);

      const { count: platformAvgContacts } = await supabaseAdmin
        .from('interaction_logs')
        .select('*', { count: 'exact', head: true })
        .in('interaction_type', ['phone_click', 'email_click', 'website_click', 'form_submit'])
        .gte('created_at', startDateISO);

      const { count: totalAgencies } = await supabaseAdmin
        .from('agencies')
        .select('*', { count: 'exact', head: true });

      const avgViewsPerAgency = totalAgencies ? Math.floor((platformAvgViews || 0) / totalAgencies) : 0;
      const avgContactsPerAgency = totalAgencies ? Math.floor((platformAvgContacts || 0) / totalAgencies) : 0;

      return {
        ...stats,
        totalContacts,
        conversionRate: parseFloat(conversionRate.toFixed(2)),
        searchAppearances: searchAppearances || 0,
        searchClicks: searchClicks || 0,
        topKeywords,
        dailyTrends,
        platformAverage: {
          views: avgViewsPerAgency,
          contacts: avgContactsPerAgency,
        },
      };
    }),

  getAgencyAnalytics: protectedProcedure
    .input(z.object({
      agencyId: z.string(),
      days: z.number().default(30),
    }))
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      const { agencyId, days } = input;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateISO = startDate.toISOString();

      const { data: interactions, error: interactionsError } = await supabaseAdmin
        .from('interaction_logs')
        .select('interaction_type, created_at')
        .eq('agency_id', agencyId)
        .gte('created_at', startDateISO)
        .order('created_at', { ascending: false });

      if (interactionsError || !interactions) {
        console.error('Error getting interactions:', interactionsError);
        return null;
      }

      const stats = {
        views: 0,
        phoneClicks: 0,
        emailClicks: 0,
        websiteClicks: 0,
        formSubmissions: 0,
      };

      interactions.forEach((log) => {
        switch (log.interaction_type) {
          case 'view':
            stats.views++;
            break;
          case 'phone_click':
            stats.phoneClicks++;
            break;
          case 'email_click':
            stats.emailClicks++;
            break;
          case 'website_click':
            stats.websiteClicks++;
            break;
          case 'form_submit':
            stats.formSubmissions++;
            break;
        }
      });

      const totalContacts = stats.phoneClicks + stats.emailClicks + stats.websiteClicks + stats.formSubmissions;
      const conversionRate = stats.views > 0 ? (totalContacts / stats.views) * 100 : 0;

      const { count: searchAppearances } = await supabaseAdmin
        .from('search_analytics')
        .select('*', { count: 'exact', head: true })
        .contains('agencies_shown', [agencyId])
        .gte('created_at', startDateISO);

      const { count: searchClicks } = await supabaseAdmin
        .from('search_analytics')
        .select('*', { count: 'exact', head: true })
        .eq('clicked_agency_id', agencyId)
        .gte('created_at', startDateISO);

      const { data: searches } = await supabaseAdmin
        .from('search_analytics')
        .select('search_query, service_category')
        .eq('clicked_agency_id', agencyId)
        .gte('created_at', startDateISO);

      const keywordCount: Record<string, number> = {};
      searches?.forEach((search) => {
        const keyword = search.search_query || search.service_category || '';
        if (keyword) {
          keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
        }
      });

      const topKeywords = Object.entries(keywordCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([keyword, count]) => ({ keyword, count }));

      return {
        ...stats,
        totalContacts,
        conversionRate: parseFloat(conversionRate.toFixed(2)),
        searchAppearances: searchAppearances || 0,
        searchClicks: searchClicks || 0,
        topKeywords,
      };
    }),
});
