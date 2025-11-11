import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { supabase } from '@/lib/supabase';

export const analyticsRouter = router({
  // Trackear vista de perfil
  trackView: publicProcedure
    .input(z.object({
      agencyId: z.string(),
      sessionId: z.string().optional(),
      userAgent: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { agencyId, sessionId, userAgent } = input;
      
      // Insertar log de interacción
      await supabase.from('interaction_logs').insert({
        agency_id: agencyId,
        interaction_type: 'view',
        session_id: sessionId,
        user_agent: userAgent,
        metadata: {},
      });

      return { success: true };
    }),

  // Trackear click en contacto (teléfono, email, website)
  trackContact: publicProcedure
    .input(z.object({
      agencyId: z.string(),
      contactType: z.enum(['phone_click', 'email_click', 'website_click', 'form_submit']),
      sessionId: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { agencyId, contactType, sessionId } = input;
      
      await supabase.from('interaction_logs').insert({
        agency_id: agencyId,
        interaction_type: contactType,
        session_id: sessionId,
      });

      return { success: true };
    }),

  // Trackear búsqueda
  trackSearch: publicProcedure
    .input(z.object({
      searchQuery: z.string().optional(),
      serviceCategory: z.string().optional(),
      locationFilter: z.string().optional(),
      resultsCount: z.number(),
      agenciesShown: z.array(z.string()),
      clickedAgencyId: z.string().optional(),
      clickedPosition: z.number().optional(),
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
      
      await supabase.from('search_analytics').insert({
        search_query: searchQuery,
        service_category: serviceCategory,
        location_filter: locationFilter,
        results_count: resultsCount,
        agencies_shown: agenciesShown,
        clicked_agency_id: clickedAgencyId,
        clicked_position: clickedPosition,
        session_id: sessionId,
      });

      return { success: true };
    }),

  // Obtener estadísticas generales del dashboard
  getDashboardStats: publicProcedure
    .input(z.object({
      days: z.number().default(30),
    }))
    .query(async ({ input }) => {
      const { days } = input;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Total usuarios
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Total agencias
      const { count: totalAgencies } = await supabase
        .from('agencies')
        .select('*', { count: 'exact', head: true });

      // Agencias premium
      const { count: premiumAgencies } = await supabase
        .from('agencies')
        .select('*', { count: 'exact', head: true })
        .eq('is_premium', true);

      // Total reviews
      const { count: totalReviews } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      // Búsquedas del período
      const { count: totalSearches } = await supabase
        .from('search_analytics')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString());

      // Contactos generados
      const { count: totalContacts } = await supabase
        .from('interaction_logs')
        .select('*', { count: 'exact', head: true })
        .in('interaction_type', ['phone_click', 'email_click', 'website_click', 'form_submit'])
        .gte('created_at', startDate.toISOString());

      // Nuevos usuarios del período
      const { count: newUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString());

      // Nuevas agencias del período
      const { count: newAgencies } = await supabase
        .from('agencies')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString());

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

  // Obtener ranking de agencias
  getAgencyRanking: publicProcedure
    .input(z.object({
      days: z.number().default(30),
      limit: z.number().default(10),
    }))
    .query(async ({ input }) => {
      const { days, limit } = input;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Obtener métricas por agencia
      const { data: interactions } = await supabase
        .from('interaction_logs')
        .select('agency_id, interaction_type')
        .gte('created_at', startDate.toISOString());

      if (!interactions) return [];

      // Agrupar por agencia
      const agencyStats: Record<string, { views: number; contacts: number }> = {};
      
      interactions.forEach((log) => {
        if (!agencyStats[log.agency_id]) {
          agencyStats[log.agency_id] = { views: 0, contacts: 0 };
        }
        
        if (log.interaction_type === 'view') {
          agencyStats[log.agency_id].views++;
        } else if (['phone_click', 'email_click', 'website_click', 'form_submit'].includes(log.interaction_type)) {
          agencyStats[log.agency_id].contacts++;
        }
      });

      // Obtener información de las agencias
      const agencyIds = Object.keys(agencyStats);
      const { data: agencies } = await supabase
        .from('agencies')
        .select('id, name, slug, logo_url, avg_rating, reviews_count, is_premium')
        .in('id', agencyIds);

      if (!agencies) return [];

      // Combinar datos y calcular CTR
      const ranking = agencies.map((agency) => {
        const stats = agencyStats[agency.id];
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

      // Ordenar por vistas y limitar
      return ranking
        .sort((a, b) => b.views - a.views)
        .slice(0, limit);
    }),

  // Obtener detalles de analytics de una agencia
  getAgencyAnalytics: publicProcedure
    .input(z.object({
      agencyId: z.string(),
      days: z.number().default(30),
    }))
    .query(async ({ input }) => {
      const { agencyId, days } = input;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Interacciones del período
      const { data: interactions } = await supabase
        .from('interaction_logs')
        .select('interaction_type, created_at')
        .eq('agency_id', agencyId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (!interactions) return null;

      // Contar por tipo
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

      // Búsquedas donde apareció
      const { count: searchAppearances } = await supabase
        .from('search_analytics')
        .select('*', { count: 'exact', head: true })
        .contains('agencies_shown', [agencyId])
        .gte('created_at', startDate.toISOString());

      // Clicks desde búsquedas
      const { count: searchClicks } = await supabase
        .from('search_analytics')
        .select('*', { count: 'exact', head: true })
        .eq('clicked_agency_id', agencyId)
        .gte('created_at', startDate.toISOString());

      // Top keywords
      const { data: searches } = await supabase
        .from('search_analytics')
        .select('search_query, service_category')
        .eq('clicked_agency_id', agencyId)
        .gte('created_at', startDate.toISOString())
        .not('search_query', 'is', null);

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
