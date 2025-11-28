import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { agencyListSchema, agencyBySlugSchema, createAgencySchema, updateAgencySchema } from '@/lib/validators';
import { db } from '../db';
import { enforcePremiumFreshness, enforceSingleAgencyPremiumFreshness } from '../utils/premiumExpiration';
import { sendAgencyReviewEmail, sendAgencyWaitlistEmail, sendAgencyApprovalEmail } from '@/lib/email';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { calculateProfileHealth } from '@/lib/profileHealth';
import { expandCategoryToLegacyIds } from '@/lib/categoryMapping';
import { z } from 'zod';

export const agencyRouter = router({
  list: publicProcedure
    .input(agencyListSchema)
    .query(async ({ input, ctx }) => {
      const { q, region, city, service, category, industry, sizeMin, sizeMax, priceRange, sort, page, limit } = input;
      const offset = (page - 1) * limit;

      let query = db.from('agencies').select('*', { count: 'exact' }).eq('approval_status', 'approved');

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
        const categoriesToSearch = expandCategoryToLegacyIds(category);
        query = query.overlaps('categories', categoriesToSearch);
      }

      if (service) {
        query = query.contains('services', [service]);
      }

      if (industry) {
        query = query.contains('industries', [industry]);
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

      // Custom sorting: Scale Lab always first, then premium, then regular agencies
      const sortedAgencies = [...freshAgencies].sort((a: any, b: any) => {
        // Scale Lab always first
        const aIsScaleLab = a.name === 'Scale Lab';
        const bIsScaleLab = b.name === 'Scale Lab';
        if (aIsScaleLab && !bIsScaleLab) return -1;
        if (!aIsScaleLab && bIsScaleLab) return 1;

        // Then premium agencies
        if (a.is_premium && !b.is_premium) return -1;
        if (!a.is_premium && b.is_premium) return 1;

        // Within same tier, apply the user's sort preference
        switch (sort) {
          case 'rating':
            return (b.avg_rating || 0) - (a.avg_rating || 0);
          case 'reviews':
            return (b.reviews_count || 0) - (a.reviews_count || 0);
          case 'recent':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          default:
            return (b.avg_rating || 0) - (a.avg_rating || 0);
        }
      });

      // Filter information for unauthenticated users - only show basic public info
      const isAuthenticated = !!ctx.userId;
      const filteredAgencies = isAuthenticated
        ? sortedAgencies
        : sortedAgencies.map((agency: any) => ({
            id: agency.id,
            name: agency.name,
            slug: agency.slug,
            description: agency.description,
            logo_url: agency.logo_url,
            cover_url: agency.cover_url,
            categories: agency.categories,
            services: agency.services,
            specialties: agency.specialties,
            is_premium: agency.is_premium,
            is_verified: agency.is_verified,
            avg_rating: agency.avg_rating,
            reviews_count: agency.reviews_count,
            created_at: agency.created_at,
            location_city: agency.location_city,
            location_region: agency.location_region,
            price_range: agency.price_range,
            phone: agency.phone,
            whatsapp_number: agency.whatsapp_number,
          }));

      return {
        agencies: filteredAgencies,
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
      };
    }),

  getBySlug: publicProcedure
    .input(agencyBySlugSchema)
    .query(async ({ input, ctx }) => {
      const { data, error } = await db
        .from('agencies')
        .select('*')
        .eq('slug', input.slug)
        .eq('approval_status', 'approved')
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

      if (data.is_premium && data.premium_until) {
        const now = new Date();
        const premiumUntil = new Date(data.premium_until);
        
        if (premiumUntil < now) {
          await db
            .from('agencies')
            .update({
              is_premium: false,
              updated_at: now.toISOString(),
            })
            .eq('id', data.id);

          data.is_premium = false;
        }
      }

      // Return public agency data - include all user-visible fields, exclude internal/sensitive data
      return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        logo_url: data.logo_url,
        cover_url: data.cover_url,
        categories: data.categories,
        services: data.services,
        specialties: data.specialties,
        industries: data.industries,
        is_premium: data.is_premium,
        is_verified: data.is_verified,
        avg_rating: data.avg_rating,
        reviews_count: data.reviews_count,
        location_city: data.location_city,
        location_region: data.location_region,
        phone: data.phone,
        whatsapp_number: data.whatsapp_number,
        email: data.email,
        website: data.website,
        employees_min: data.employees_min,
        employees_max: data.employees_max,
        price_range: data.price_range,
        created_at: data.created_at,
      };
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
        .select('id, full_name')
        .eq('auth_id', ctx.userId)
        .single();

      if (!userData) throw new Error('User not found');

      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(ctx.userId);
      if (!authUser?.user?.email) throw new Error('User email not found');

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
        const insertData = {
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
            industries: input.industries || [],
            employees_min: input.employeesMin || null,
            employees_max: input.employeesMax || null,
            price_range: input.priceRange || null,
            owner_id: userData.id,
            approval_status: 'pending' as const,
        };

        const { data, error } = await db
          .from('agencies')
          .insert(insertData)
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

        try {
          await Promise.all([
            sendAgencyReviewEmail({
              id: data.id,
              name: data.name,
              email: data.email || '',
              phone: data.phone || '',
              website: data.website || undefined,
              location_city: data.location_city || '',
              location_region: data.location_region || '',
              description: data.description || '',
              categories: data.categories,
              services: data.services,
              owner_email: authUser.user.email,
              owner_name: userData.full_name || 'Usuario',
            }),
            sendAgencyWaitlistEmail(
              data.name,
              authUser.user.email,
              userData.full_name || 'Usuario'
            ),
          ]);
        } catch (emailError) {
          console.error('Error sending emails after agency creation:', emailError);
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

  update: protectedProcedure
    .input(updateAgencySchema)
    .mutation(async ({ input, ctx }) => {
      const { data: userData } = await db
        .from('users')
        .select('id')
        .eq('auth_id', ctx.userId)
        .single();

      if (!userData) throw new Error('User not found');

      const { data: existingAgency } = await db
        .from('agencies')
        .select('id, slug')
        .eq('owner_id', userData.id)
        .single();

      if (!existingAgency) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No se encontró la agencia para actualizar',
        });
      }

      try {
        const updateData: Record<string, unknown> = {};

        if (typeof input.name !== 'undefined') updateData.name = input.name;
        if (typeof input.logo_url !== 'undefined') updateData.logo_url = input.logo_url || null;
        if (typeof input.description !== 'undefined') updateData.description = input.description;
        if (typeof input.website !== 'undefined') updateData.website = input.website || null;
        if (typeof input.email !== 'undefined') updateData.email = input.email;
        if (typeof input.phone !== 'undefined') updateData.phone = input.phone;
        if (typeof input.whatsappNumber !== 'undefined') updateData.whatsapp_number = input.whatsappNumber || null;
        if (typeof input.city !== 'undefined') updateData.location_city = input.city;
        if (typeof input.region !== 'undefined') updateData.location_region = input.region;
        if (typeof input.services !== 'undefined') updateData.services = input.services;
        if (typeof input.categories !== 'undefined') updateData.categories = input.categories;
        if (typeof input.specialties !== 'undefined') updateData.specialties = input.specialties;
        if (typeof input.employeesMin !== 'undefined') updateData.employees_min = input.employeesMin;
        if (typeof input.employeesMax !== 'undefined') updateData.employees_max = input.employeesMax;
        if (typeof input.priceRange !== 'undefined') updateData.price_range = input.priceRange;

        updateData.updated_at = new Date().toISOString();

        const { data, error } = await db
          .from('agencies')
          .update(updateData)
          .eq('id', existingAgency.id)
          .select()
          .single();

        if (error) throw error;

        return data;
      } catch (error: any) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Error al actualizar la agencia: ${error.message}`,
        });
      }
    }),

  getProfileHealth: protectedProcedure
    .input(z.object({
      agencyId: z.string().optional(),
    }))
    .query(async ({ input, ctx }) => {
      let agencyId = input.agencyId;

      if (!agencyId) {
        const { data: agency } = await supabaseAdmin
          .from('agencies')
          .select('id')
          .eq('owner_id', ctx.user?.id)
          .single();

        if (!agency) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No se encontró la agencia',
          });
        }
        agencyId = agency.id;
      }

      const { data: agency, error } = await supabaseAdmin
        .from('agencies')
        .select('*')
        .eq('id', agencyId)
        .single();

      if (error || !agency) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Agencia no encontrada',
        });
      }

      const { count: portfolioCount } = await supabaseAdmin
        .from('portfolio_items')
        .select('*', { count: 'exact', head: true })
        .eq('agency_id', agencyId);

      const agencyWithPortfolio = {
        ...agency,
        portfolio_count: portfolioCount || 0,
      };

      return calculateProfileHealth(agencyWithPortfolio);
    }),

  getCategoryCounts: publicProcedure.query(async () => {
    const { data: agencies, error } = await db
      .from('agencies')
      .select('id, categories')
      .eq('approval_status', 'approved');

    if (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Error al obtener estadísticas de categorías: ${error.message}`,
      });
    }

    const consolidatedCategorySets: Record<string, Set<string>> = {
      'performance-ads': new Set(),
      'social-media': new Set(),
      'branding-identidad': new Set(),
      'desarrollo-web': new Set(),
      'produccion-contenido': new Set(),
      'relaciones-publicas': new Set(),
    };

    const legacyMapping: Record<string, string> = {
      // Consolidated IDs map to themselves
      'performance-ads': 'performance-ads',
      'social-media': 'social-media',
      'branding-identidad': 'branding-identidad',
      'desarrollo-web': 'desarrollo-web',
      'produccion-contenido': 'produccion-contenido',
      'relaciones-publicas': 'relaciones-publicas',
      // Legacy IDs map to consolidated IDs
      'publicidad-digital': 'performance-ads',
      'estrategia-consultoria': 'performance-ads',
      'publicidad': 'performance-ads',
      'contenido-redes': 'social-media',
      'diseno-grafico': 'branding-identidad',
      'video-fotografia': 'produccion-contenido',
    };
    
    agencies?.forEach((agency: any) => {
      if (agency.categories && Array.isArray(agency.categories)) {
        agency.categories.forEach((legacyCategory: string) => {
          const consolidatedCategory = legacyMapping[legacyCategory];
          if (consolidatedCategory && consolidatedCategorySets[consolidatedCategory]) {
            consolidatedCategorySets[consolidatedCategory].add(agency.id);
          }
        });
      }
    });

    const categoryCounts: Record<string, number> = {};
    Object.entries(consolidatedCategorySets).forEach(([category, agencySet]) => {
      categoryCounts[category] = agencySet.size;
    });

    return categoryCounts;
  }),
});
