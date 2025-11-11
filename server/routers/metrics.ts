import { router, publicProcedure } from '../trpc';
import { trackMetricSchema } from '@/lib/validators';
import { db } from '../db';
import { z } from 'zod';

export const metricsRouter = router({
  track: publicProcedure
    .input(trackMetricSchema)
    .mutation(async ({ input }) => {
      const today = new Date().toISOString().split('T')[0];
      const field = `${input.event}s`;

      const { error } = await db.rpc('increment_metric', {
        p_day: today,
        p_agency_id: input.agencyId,
        p_field: field,
      });

      if (error) {
        const { error: insertError } = await db
          .from('agency_metrics_daily')
          .insert({
            day: today,
            agency_id: input.agencyId,
            [field]: 1,
          });

        if (insertError) console.error('Metrics error:', insertError);
      }

      return { success: true };
    }),

  getByAgency: publicProcedure
    .input(z.object({ agencyId: z.string().uuid(), days: z.number().default(30) }))
    .query(async ({ input }) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      const { data, error } = await db
        .from('agency_metrics_daily')
        .select('*')
        .eq('agency_id', input.agencyId)
        .gte('day', startDate.toISOString().split('T')[0])
        .order('day', { ascending: false });

      if (error) throw error;

      return data || [];
    }),
});
