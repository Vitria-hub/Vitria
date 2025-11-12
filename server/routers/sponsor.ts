import { router, publicProcedure } from '../trpc';
import { db } from '../db';
import { enforcePremiumFreshness } from '../utils/premiumExpiration';

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

    const sponsoredSlots = data || [];
    
    const freshSlots = await Promise.all(
      sponsoredSlots.map(async (slot) => {
        if (!slot.agency) {
          return slot;
        }
        
        const freshAgencies = await enforcePremiumFreshness([slot.agency]);
        
        return {
          ...slot,
          agency: freshAgencies[0],
        };
      })
    );

    return freshSlots;
  }),
});
