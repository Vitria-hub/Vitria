import { router, protectedProcedure } from '../trpc';
import { trackAgencyContactSchema } from '@/lib/validators';
import { db } from '../db';
import { z } from 'zod';

export const contactRouter = router({
  create: protectedProcedure
    .input(trackAgencyContactSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const recentContact = await db
        .from('agency_contacts')
        .select('*')
        .eq('client_user_id', userId)
        .eq('agency_id', input.agencyId)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .single();

      if (recentContact.data) {
        throw new Error('Ya contactaste esta agencia recientemente. Espera 24 horas para contactar nuevamente.');
      }

      const { data: clientProfile } = await db
        .from('client_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      const { data: contact, error } = await db
        .from('agency_contacts')
        .insert({
          client_user_id: userId,
          agency_id: input.agencyId,
          contact_method: input.contactMethod,
          message: input.message,
          business_name: clientProfile?.business_name,
          budget_range: clientProfile?.budget_range,
          desired_categories: clientProfile?.desired_categories,
        } as any)
        .select()
        .single();

      if (error) {
        throw new Error('Error al registrar el contacto');
      }

      return contact;
    }),

  listForAgency: protectedProcedure
    .input(
      z.object({
        agencyId: z.string().uuid(),
        page: z.number().default(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const { data: agency } = await db
        .from('agencies')
        .select('owner_user_id')
        .eq('id', input.agencyId)
        .single();

      if (!agency || agency.owner_user_id !== userId) {
        throw new Error('No tienes permiso para ver los leads de esta agencia');
      }

      const offset = (input.page - 1) * input.limit;

      const { data: contacts, error } = await db
        .from('agency_contacts')
        .select(`
          *,
          client:users!client_user_id (
            id,
            full_name,
            email
          )
        `)
        .eq('agency_id', input.agencyId)
        .order('created_at', { ascending: false })
        .range(offset, offset + input.limit - 1);

      if (error) {
        throw new Error('Error al obtener los leads');
      }

      const { count } = await db
        .from('agency_contacts')
        .select('*', { count: 'exact', head: true })
        .eq('agency_id', input.agencyId);

      return {
        contacts: contacts || [],
        total: count || 0,
        page: input.page,
        totalPages: Math.ceil((count || 0) / input.limit),
      };
    }),
});
