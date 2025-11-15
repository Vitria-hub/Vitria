import { router, publicProcedure } from '../trpc';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { enforcePremiumFreshness } from '../utils/premiumExpiration';

export const sponsorRouter = router({
  listHome: publicProcedure.query(async () => {
    const now = new Date();

    const { data, error } = await supabaseAdmin
      .from('sponsored_slots')
      .select('*, agency:agencies(*)')
      .order('position', { ascending: true });

    if (error) {
      throw error;
    }

    const activeSlots = (data || []).filter((slot: any) => {
      const startsAt = new Date(slot.starts_at);
      const endsAt = new Date(slot.ends_at);
      return startsAt <= now && endsAt >= now;
    }).slice(0, 5);

    const sponsoredSlots = activeSlots;
    
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
