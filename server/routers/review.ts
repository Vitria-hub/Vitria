import { router, publicProcedure, protectedProcedure } from '../trpc';
import { createReviewSchema } from '@/lib/validators';
import { db } from '../db';
import { z } from 'zod';

export const reviewRouter = router({
  create: protectedProcedure
    .input(createReviewSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id;

      const { data: existingReview } = await db
        .from('reviews')
        .select('*')
        .eq('user_id', userId)
        .eq('agency_id', input.agencyId)
        .single();

      if (existingReview) {
        throw new Error('Ya has dejado una reseña para esta agencia');
      }

      const { data, error } = await db
        .from('reviews')
        .insert({
          agency_id: input.agencyId,
          user_id: userId,
          rating: input.rating,
          comment: input.comment,
          status: 'pending',
        } as any)
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
        .select(`
          *,
          author:users!reviews_user_id_fkey (
            id,
            full_name
          )
        `)
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
