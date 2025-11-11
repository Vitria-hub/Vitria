import { router, publicProcedure, protectedProcedure } from '../trpc';
import { agencyListSchema, agencyBySlugSchema, createAgencySchema } from '@/lib/validators';
import { db } from '../db';

export const agencyRouter = router({
  list: publicProcedure
    .input(agencyListSchema)
    .query(async ({ input }) => {
      const { q, region, city, service, sizeMin, sizeMax, priceRange, sort, page, limit } = input;
      const offset = (page - 1) * limit;

      let query = db.from('agencies').select('*', { count: 'exact' });

      if (q) {
        query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
      }

      if (region) {
        query = query.eq('location_region', region);
      }

      if (city) {
        query = query.eq('location_city', city);
      }

      if (service) {
        query = query.contains('services', [service]);
      }

      if (sizeMin) {
        query = query.gte('employees_min', sizeMin);
      }

      if (sizeMax) {
        query = query.lte('employees_max', sizeMax);
      }

      if (priceRange) {
        query = query.eq('price_range', priceRange);
      }

      switch (sort) {
        case 'rating':
          query = query.order('avg_rating', { ascending: false });
          break;
        case 'reviews':
          query = query.order('reviews_count', { ascending: false });
          break;
        case 'premium':
          query = query.order('is_premium', { ascending: false }).order('avg_rating', { ascending: false });
          break;
        case 'recent':
          query = query.order('created_at', { ascending: false });
          break;
      }

      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        agencies: data || [],
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
      };
    }),

  getBySlug: publicProcedure
    .input(agencyBySlugSchema)
    .query(async ({ input }) => {
      const { data, error } = await db
        .from('agencies')
        .select('*')
        .eq('slug', input.slug)
        .single();

      if (error) throw error;

      return data;
    }),

  myAgency: protectedProcedure
    .query(async ({ ctx }) => {
      const { data: userData } = await db
        .from('users')
        .select('id')
        .eq('auth_id', ctx.userId)
        .single();

      if (!userData) return null;

      const { data, error } = await db
        .from('agencies')
        .select('*')
        .eq('owner_id', userData.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return data || null;
    }),

  create: protectedProcedure
    .input(createAgencySchema)
    .mutation(async ({ input, ctx }) => {
      const { data: userData } = await db
        .from('users')
        .select('id')
        .eq('auth_id', ctx.userId)
        .single();

      if (!userData) throw new Error('User not found');

      const slug = input.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const { data, error } = await db
        .from('agencies')
        .insert({
          name: input.name,
          slug,
          description: input.description || null,
          website: input.website || null,
          email: input.email || null,
          phone: input.phone || null,
          location_city: input.city || null,
          location_region: input.region || null,
          owner_id: userData.id,
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    }),
});
