import { router, publicProcedure } from '../trpc';
import { createReviewSchema } from '@/lib/validators';
import { db } from '../db';
import { z } from 'zod';

export const reviewRouter = router({
  create: publicProcedure
    .input(createReviewSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await db
        .from('reviews')
        .insert({
          agency_id: input.agencyId,
          user_id: null,
          rating: input.rating,
          comment: input.comment,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    }),

  listByAgency: publicProcedure
    .input(z.object({ agencyId: z.string().uuid(), status: z.enum(['pending', 'approved', 'rejected']).optional() }))
    .query(async ({ input }) => {
      let query = db
        .from('reviews')
        .select('*')
        .eq('agency_id', input.agencyId);

      if (input.status) {
        query = query.eq('status', input.status);
      } else {
        query = query.eq('status', 'approved');
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    }),
});
