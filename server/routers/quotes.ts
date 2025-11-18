import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendQuoteNotificationToAgency, sendQuoteConfirmationToClient } from '@/lib/email';

export const quotesRouter = router({
  submitQuote: publicProcedure
    .input(z.object({
      agencyId: z.string().uuid(),
      clientName: z.string().min(2).max(100),
      clientEmail: z.string().email(),
      clientPhone: z.string().optional(),
      projectName: z.string().min(3).max(200),
      projectDescription: z.string().min(10).max(1000),
      budgetRange: z.string().optional(),
      serviceCategory: z.string().optional(),
      clientUserId: z.string().uuid().optional(),
    }))
    .mutation(async ({ input }) => {
      const {
        agencyId,
        clientName,
        clientEmail,
        clientPhone,
        projectName,
        projectDescription,
        budgetRange,
        serviceCategory,
        clientUserId,
      } = input;

      const { data: agency, error: agencyError } = await supabaseAdmin
        .from('agencies')
        .select('id, name, email, owner_id')
        .eq('id', agencyId)
        .single();

      if (agencyError || !agency) {
        throw new Error('Agency not found');
      }

      let agencyEmail = agency.email;
      
      if (!agencyEmail) {
        const { data: owner } = await supabaseAdmin.auth.admin.getUserById(agency.owner_id);
        agencyEmail = owner?.email || null;
        
        if (!agencyEmail) {
          throw new Error('Cannot send quote: agency has no email and owner has no email');
        }
      }

      const { data: quote, error: quoteError } = await supabaseAdmin
        .from('quote_requests')
        .insert({
          agency_id: agencyId,
          client_user_id: clientUserId || null,
          client_name: clientName,
          client_email: clientEmail,
          client_phone: clientPhone || null,
          project_name: projectName,
          project_description: projectDescription,
          budget_range: budgetRange || null,
          service_category: serviceCategory || null,
          status: 'pending',
        })
        .select()
        .single();

      if (quoteError || !quote) {
        console.error('Error creating quote:', quoteError);
        throw new Error('Failed to submit quote request');
      }

      try {
        await sendQuoteNotificationToAgency({
          agencyName: agency.name,
          agencyEmail: agencyEmail,
          clientName,
          clientEmail,
          clientPhone: clientPhone || '',
          projectName,
          projectDescription,
          budgetRange: budgetRange || 'No especificado',
          serviceCategory: serviceCategory || 'No especificado',
          quoteId: quote.id,
        });

        await sendQuoteConfirmationToClient({
          clientName,
          clientEmail,
          agencyName: agency.name,
          projectName,
        });
      } catch (emailError) {
        console.error('Error sending quote emails:', emailError);
      }

      await supabaseAdmin.from('interaction_logs').insert({
        agency_id: agencyId,
        interaction_type: 'form_submit',
        metadata: { quote_id: quote.id },
      });

      return { success: true, quoteId: quote.id };
    }),

  getAgencyQuotes: protectedProcedure
    .input(z.object({
      status: z.enum(['pending', 'contacted', 'won', 'lost', 'all']).default('all'),
      limit: z.number().min(1).max(100).default(50),
    }))
    .query(async ({ input, ctx }) => {
      const { status, limit } = input;

      const { data: agency } = await supabaseAdmin
        .from('agencies')
        .select('id')
        .eq('owner_id', ctx.user?.id)
        .single();

      if (!agency) {
        throw new Error('You do not own an agency');
      }

      let query = supabaseAdmin
        .from('quote_requests')
        .select('*')
        .eq('agency_id', agency.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (status !== 'all') {
        query = query.eq('status', status);
      }

      const { data: quotes, error } = await query;

      if (error) {
        console.error('Error fetching agency quotes:', error);
        throw new Error('Failed to fetch quotes');
      }

      return quotes || [];
    }),

  getAllQuotes: protectedProcedure
    .input(z.object({
      status: z.enum(['pending', 'contacted', 'won', 'lost', 'all']).default('all'),
      limit: z.number().min(1).max(500).default(100),
      agencyId: z.string().uuid().optional(),
    }))
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      const { status, limit, agencyId } = input;

      let query = supabaseAdmin
        .from('quote_requests')
        .select(`
          *,
          agencies:agency_id (
            name,
            slug,
            logo_url,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (status !== 'all') {
        query = query.eq('status', status);
      }

      if (agencyId) {
        query = query.eq('agency_id', agencyId);
      }

      const { data: quotes, error } = await query;

      if (error) {
        console.error('Error fetching all quotes:', error);
        throw new Error('Failed to fetch quotes');
      }

      return quotes || [];
    }),

  getQuoteStats: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      const { count: totalQuotes } = await supabaseAdmin
        .from('quote_requests')
        .select('*', { count: 'exact', head: true });

      const { count: pendingQuotes } = await supabaseAdmin
        .from('quote_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: contactedQuotes } = await supabaseAdmin
        .from('quote_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'contacted');

      const { count: wonQuotes } = await supabaseAdmin
        .from('quote_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'won');

      const { count: lostQuotes } = await supabaseAdmin
        .from('quote_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'lost');

      const { data: agencyQuoteCounts, error } = await supabaseAdmin
        .from('quote_requests')
        .select('agency_id, agencies:agency_id(name, slug, logo_url)')
        .order('created_at', { ascending: false });

      const agencyStats = new Map<string, { name: string; slug: string; logoUrl: string | null; count: number }>();

      agencyQuoteCounts?.forEach((quote: any) => {
        const agencyId = quote.agency_id;
        const existing = agencyStats.get(agencyId);
        if (existing) {
          existing.count++;
        } else if (quote.agencies) {
          agencyStats.set(agencyId, {
            name: quote.agencies.name,
            slug: quote.agencies.slug,
            logoUrl: quote.agencies.logo_url,
            count: 1,
          });
        }
      });

      const topAgencies = Array.from(agencyStats.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      const conversionRate = totalQuotes && totalQuotes > 0 ? ((wonQuotes || 0) / totalQuotes) * 100 : 0;

      return {
        totalQuotes: totalQuotes || 0,
        pendingQuotes: pendingQuotes || 0,
        contactedQuotes: contactedQuotes || 0,
        wonQuotes: wonQuotes || 0,
        lostQuotes: lostQuotes || 0,
        conversionRate: parseFloat(conversionRate.toFixed(2)),
        topAgencies,
      };
    }),

  updateQuoteStatus: protectedProcedure
    .input(z.object({
      quoteId: z.string().uuid(),
      status: z.enum(['pending', 'contacted', 'won', 'lost']),
      adminNotes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      const { quoteId, status, adminNotes } = input;

      const { error } = await supabaseAdmin
        .from('quote_requests')
        .update({
          status,
          admin_notes: adminNotes || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', quoteId);

      if (error) {
        console.error('Error updating quote status:', error);
        throw new Error('Failed to update quote status');
      }

      return { success: true };
    }),
});
