import { router, publicProcedure } from '../trpc';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { enforcePremiumFreshness } from '../utils/premiumExpiration';

export const sponsorRouter = router({
  listHome: publicProcedure.query(async ({ ctx }) => {
    const now = new Date();

    const { data, error } = await supabaseAdmin
      .from('sponsored_slots')
      .select('*, agency:agencies(*)')
      .order('position', { ascending: true});

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

    // Filter information for unauthenticated users - only show basic public info
    const isAuthenticated = !!ctx.session?.user;
    const filteredSlots = isAuthenticated
      ? freshSlots
      : freshSlots.map((slot: any) => ({
          ...slot,
          agency: slot.agency ? {
            id: slot.agency.id,
            name: slot.agency.name,
            slug: slot.agency.slug,
            description: slot.agency.description,
            logo_url: slot.agency.logo_url,
            cover_url: slot.agency.cover_url,
            categories: slot.agency.categories,
            is_premium: slot.agency.is_premium,
            avg_rating: slot.agency.avg_rating,
            reviews_count: slot.agency.reviews_count,
            created_at: slot.agency.created_at,
            location_region: slot.agency.location_region,
          } : null,
        }));

    return filteredSlots;
  }),
});
