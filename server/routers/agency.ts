import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { agencyListSchema, agencyBySlugSchema, createAgencySchema } from '@/lib/validators';
import { db } from '../db';
import { enforcePremiumFreshness, enforceSingleAgencyPremiumFreshness } from '../utils/premiumExpiration';

export const agencyRouter = router({
  list: publicProcedure
    .input(agencyListSchema)
    .query(async ({ input }) => {
      const { q, region, city, service, category, sizeMin, sizeMax, priceRange, sort, page, limit } = input;
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

      if (category) {
        query = query.overlaps('categories', [category]);
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

      const freshAgencies = await enforcePremiumFreshness(data || []);

      return {
        agencies: freshAgencies,
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
        .maybeSingle();

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Database error: ${error.message}`,
        });
      }
      
      if (!data) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Agency not found',
        });
      }

      const agency: any = data;

      if (agency.is_premium && agency.premium_until) {
        const now = new Date();
        const premiumUntil = new Date(agency.premium_until);
        
        if (premiumUntil < now) {
          await db
            .from('agencies')
            .update({
              is_premium: false,
              updated_at: now.toISOString(),
            } as any)
            .eq('id', agency.id);

          return {
            ...agency,
            is_premium: false,
          };
        }
      }

      return agency;
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

      if (!data) return null;

      const freshAgency = await enforceSingleAgencyPremiumFreshness(data);

      return freshAgency;
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

      const { data: existingSlug } = await db
        .from('agencies')
        .select('slug')
        .eq('slug', slug)
        .maybeSingle();

      if (existingSlug) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: `Ya existe una agencia con un nombre similar. Por favor usa un nombre diferente para tu agencia.`,
        });
      }

      try {
        const { data, error } = await db
          .from('agencies')
          .insert({
            name: input.name,
            slug,
            logo_url: input.logo_url || null,
            description: input.description || null,
            website: input.website || null,
            email: input.email || null,
            phone: input.phone || null,
            location_city: input.city || null,
            location_region: input.region || null,
            services: input.services || [],
            categories: input.categories || [],
            specialties: input.specialties || [],
            employees_min: input.employeesMin || null,
            employees_max: input.employeesMax || null,
            price_range: input.priceRange || null,
            owner_id: userData.id,
          })
          .select()
          .single();

        if (error) {
          if (error.code === '23505') {
            throw new TRPCError({
              code: 'CONFLICT',
              message: `Ya existe una agencia con este nombre. Por favor elige un nombre diferente.`,
            });
          }
          throw error;
        }

        return data;
      } catch (error: any) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Error al crear la agencia: ${error.message}`,
        });
      }
    }),
});
