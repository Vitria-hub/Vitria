import { router, publicProcedure } from '../trpc';
import { db } from '../db';

export const sponsorRouter = router({
  listHome: publicProcedure.query(async () => {
    const now = new Date().toISOString();

    const { data, error } = await db
      .from('sponsored_slots')
      .select('*, agency:agencies(*)')
      .lte('starts_at', now)
      .gte('ends_at', now)
      .order('position', { ascending: true })
      .limit(5);

    if (error) throw error;

    return data || [];
  }),
});
