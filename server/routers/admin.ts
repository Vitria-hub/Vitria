import { router, protectedProcedure } from '../trpc';
import { db } from '../db';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { approveAgencySchema, rejectAgencySchema, adminCreateReviewSchema } from '@/lib/validators';
import { sendAgencyApprovalEmail } from '@/lib/email';
import { supabaseAdmin } from '@/lib/supabase-admin';

const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const { data: userData } = await db
    .from('users')
    .select('role')
    .eq('auth_id', ctx.userId)
    .single();

  if (!userData || userData.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Acceso denegado - requiere rol de administrador' });
  }

  return next({ ctx });
});

export const adminRouter = router({
  stats: adminProcedure.query(async () => {
    const [agenciesResult, usersResult, reviewsResult, pendingAgenciesResult, pendingReviewsResult] = await Promise.all([
      db.from('agencies').select('id', { count: 'exact', head: true }),
      db.from('users').select('id', { count: 'exact', head: true }),
      db.from('reviews').select('id', { count: 'exact', head: true }),
      db.from('agencies').select('id', { count: 'exact', head: true }).eq('approval_status', 'pending'),
      db.from('reviews').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);

    return {
      totalAgencies: agenciesResult.count || 0,
      totalUsers: usersResult.count || 0,
      totalReviews: reviewsResult.count || 0,
      pendingAgencies: pendingAgenciesResult.count || 0,
      pendingReviews: pendingReviewsResult.count || 0,
    };
  }),

  listAgencies: adminProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      status: z.enum(['all', 'pending', 'approved', 'rejected']).default('pending'),
    }))
    .query(async ({ input }) => {
      const { page, limit, status } = input;
      const offset = (page - 1) * limit;

      console.log('[Admin listAgencies] Fetching with params:', { page, limit, status, offset });

      let query = db.from('agencies').select(`*`, { count: 'exact' });

      if (status === 'pending') {
        query = query.eq('approval_status', 'pending');
      } else if (status === 'approved') {
        query = query.eq('approval_status', 'approved');
      } else if (status === 'rejected') {
        query = query.eq('approval_status', 'rejected');
      }

      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data: agencies, error, count } = await query;

      console.log('[Admin listAgencies] Query result:', { 
        dataCount: agencies?.length, 
        totalCount: count, 
        error: error?.message 
      });

      if (error) {
        console.error('[Admin listAgencies] Error:', error);
        throw error;
      }

      // Fetch user data separately to avoid join issues
      const agenciesWithUsers = await Promise.all(
        (agencies || []).map(async (agency: any) => {
          const { data: user } = await db
            .from('users')
            .select('full_name, role')
            .eq('id', agency.owner_id)
            .single();
          
          const { count: portfolioCount } = await db
            .from('portfolio_items')
            .select('*', { count: 'exact', head: true })
            .eq('agency_id', agency.id);

          return {
            ...agency,
            users: user || null,
            portfolio_items: [{ count: portfolioCount || 0 }],
          };
        })
      );

      console.log('[Admin listAgencies] Final result with users:', agenciesWithUsers.length);

      return {
        agencies: agenciesWithUsers,
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
      };
    }),

  getAgency: adminProcedure
    .input(z.object({ agencyId: z.string().uuid() }))
    .query(async ({ input }) => {
      console.log('[Admin getAgency] Fetching agency:', input.agencyId);
      
      const { data: agency, error } = await db
        .from('agencies')
        .select('*')
        .eq('id', input.agencyId)
        .single();

      if (error) {
        console.error('[Admin getAgency] Error fetching agency:', error);
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Agencia no encontrada',
        });
      }

      if (!agency) {
        console.error('[Admin getAgency] Agency not found:', input.agencyId);
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Agencia no encontrada',
        });
      }

      console.log('[Admin getAgency] Agency found:', agency.name, 'owner_id:', agency.owner_id);

      // Fetch user data separately only if owner_id exists
      let user = null;
      if (agency.owner_id) {
        const { data: userData, error: userError } = await db
          .from('users')
          .select('full_name, email, role')
          .eq('id', agency.owner_id as string)
          .single();
        
        if (userError) {
          console.warn('[Admin getAgency] Error fetching user data:', userError);
        }
        user = userData;
      } else {
        console.warn('[Admin getAgency] Agency has no owner_id');
      }

      return {
        ...agency,
        users: user || null,
      } as any;
    }),

  verifyAgency: adminProcedure
    .input(z.object({ agencyId: z.string().uuid(), verified: z.boolean() }))
    .mutation(async ({ input }) => {
      const { data, error } = await db
        .from('agencies')
        .update({ is_verified: input.verified })
        .eq('id', input.agencyId)
        .select()
        .single();

      if (error) throw error;

      return data;
    }),

  deleteAgency: adminProcedure
    .input(z.object({ agencyId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const { error } = await db
        .from('agencies')
        .delete()
        .eq('id', input.agencyId);

      if (error) throw error;

      return { success: true };
    }),

  setPremium: adminProcedure
    .input(z.object({
      agencyId: z.string().uuid(),
      isPremium: z.boolean(),
      durationDays: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const updateData: any = {
        is_premium: input.isPremium,
        updated_at: new Date().toISOString(),
      };

      if (input.isPremium && input.durationDays) {
        const premiumUntil = new Date();
        premiumUntil.setDate(premiumUntil.getDate() + input.durationDays);
        updateData.premium_until = premiumUntil.toISOString();
      } else if (!input.isPremium) {
        updateData.premium_until = null;
      }

      const { data, error } = await db
        .from('agencies')
        .update(updateData)
        .eq('id', input.agencyId)
        .select()
        .single();

      if (error) throw error;

      return data;
    }),

  cleanExpiredPremium: adminProcedure
    .mutation(async () => {
      const now = new Date().toISOString();
      
      const { data, error } = await db
        .from('agencies')
        .update({
          is_premium: false,
          updated_at: now,
        })
        .eq('is_premium', true)
        .lt('premium_until', now)
        .select();

      if (error) throw error;

      return {
        success: true,
        expiredCount: data?.length || 0,
        expiredAgencies: data || [],
      };
    }),

  listReviews: adminProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      status: z.enum(['all', 'pending', 'approved', 'rejected']).default('all'),
    }))
    .query(async ({ input }) => {
      const { page, limit, status } = input;
      const offset = (page - 1) * limit;

      let query = db.from('reviews').select('*, agencies(name, slug)', { count: 'exact' });

      if (status !== 'all') {
        query = query.eq('status', status);
      }

      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        reviews: data || [],
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
      };
    }),

  updateReviewStatus: adminProcedure
    .input(z.object({
      reviewId: z.string().uuid(),
      status: z.enum(['pending', 'approved', 'rejected']),
    }))
    .mutation(async ({ input }) => {
      const { data, error } = await db
        .from('reviews')
        .update({ status: input.status })
        .eq('id', input.reviewId)
        .select()
        .single();

      if (error) throw error;

      return data;
    }),

  deleteReview: adminProcedure
    .input(z.object({ reviewId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const { error } = await db
        .from('reviews')
        .delete()
        .eq('id', input.reviewId);

      if (error) throw error;

      return { success: true };
    }),

  listUsers: adminProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      role: z.enum(['all', 'user', 'agency', 'admin']).default('all'),
    }))
    .query(async ({ input }) => {
      const { page, limit, role } = input;
      const offset = (page - 1) * limit;

      let query = db.from('users').select('*', { count: 'exact' });

      if (role !== 'all') {
        query = query.eq('role', role);
      }

      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        users: data || [],
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
      };
    }),

  updateUserRole: adminProcedure
    .input(z.object({
      userId: z.string().uuid(),
      role: z.enum(['user', 'agency', 'admin']),
    }))
    .mutation(async ({ input }) => {
      const { data, error } = await db
        .from('users')
        .update({ role: input.role })
        .eq('id', input.userId)
        .select()
        .single();

      if (error) throw error;

      return data;
    }),

  getUser: adminProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .query(async ({ input }) => {
      const { data, error } = await db
        .from('users')
        .select('*')
        .eq('id', input.userId)
        .single();

      if (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Usuario no encontrado',
        });
      }

      return data;
    }),

  updateUser: adminProcedure
    .input(z.object({
      userId: z.string().uuid(),
      full_name: z.string().min(1),
      email: z.string().email(),
    }))
    .mutation(async ({ input }) => {
      const { userId, ...updateData } = input;

      const { data, error } = await db
        .from('users')
        .update({
          full_name: updateData.full_name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Error al actualizar el usuario',
        });
      }

      if (updateData.email) {
        const { data: existingUser } = await db
          .from('users')
          .select('auth_id')
          .eq('id', userId)
          .single();

        if (existingUser?.auth_id) {
          try {
            await supabaseAdmin.auth.admin.updateUserById(existingUser.auth_id, {
              email: updateData.email,
            });
          } catch (authError: any) {
            console.error('Error updating auth email:', authError);
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Error al actualizar el email en autenticación',
            });
          }
        }
      }

      return data;
    }),

  deleteUser: adminProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const { error } = await db
        .from('users')
        .delete()
        .eq('id', input.userId);

      if (error) throw error;

      return { success: true };
    }),

  approveAgency: adminProcedure
    .input(approveAgencySchema)
    .mutation(async ({ input, ctx }) => {
      const { data: agency, error: fetchError } = await db
        .from('agencies')
        .select('*, users!agencies_owner_id_fkey(full_name, auth_id)')
        .eq('id', input.agencyId)
        .single();

      if (fetchError || !agency) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Agencia no encontrada',
        });
      }

      if (agency.approval_status === 'approved') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Esta agencia ya está aprobada',
        });
      }

      const { data: adminUser } = await db
        .from('users')
        .select('id')
        .eq('auth_id', ctx.userId)
        .single();

      const { data, error } = await db
        .from('agencies')
        .update({
          approval_status: 'approved',
          approved_at: new Date().toISOString(),
          reviewed_by: adminUser?.id || null,
          rejection_reason: null,
        })
        .eq('id', input.agencyId)
        .select()
        .single();

      if (error) throw error;

      const ownerAuthId = (agency as any).users?.auth_id;
      if (ownerAuthId) {
        const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(ownerAuthId);
        if (authUser?.user?.email) {
          try {
            await sendAgencyApprovalEmail(
              agency.name,
              authUser.user.email,
              (agency as any).users?.full_name || 'Usuario',
              agency.slug
            );
          } catch (emailError) {
            console.error('Error sending approval email:', emailError);
          }
        }
      }

      return data;
    }),

  rejectAgency: adminProcedure
    .input(rejectAgencySchema)
    .mutation(async ({ input, ctx }) => {
      const { data: agency, error: fetchError } = await db
        .from('agencies')
        .select('id, name, approval_status')
        .eq('id', input.agencyId)
        .single();

      if (fetchError || !agency) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Agencia no encontrada',
        });
      }

      if (agency.approval_status === 'rejected') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Esta agencia ya está rechazada',
        });
      }

      const { data: adminUser } = await db
        .from('users')
        .select('id')
        .eq('auth_id', ctx.userId)
        .single();

      const { data, error } = await db
        .from('agencies')
        .update({
          approval_status: 'rejected',
          rejection_reason: input.rejectionReason,
          reviewed_by: adminUser?.id || null,
        })
        .eq('id', input.agencyId)
        .select()
        .single();

      if (error) throw error;

      return data;
    }),

  listSponsoredSlots: adminProcedure.query(async () => {
    const { data, error } = await supabaseAdmin
      .from('sponsored_slots')
      .select('*, agency:agencies(id, name, slug, logo_url, is_premium)')
      .order('position', { ascending: true });

    if (error) throw error;

    return data || [];
  }),

  addSponsoredSlot: adminProcedure
    .input(z.object({
      agencyId: z.string().uuid(),
      position: z.number().min(1).max(10),
      durationDays: z.number().min(1).max(365),
    }))
    .mutation(async ({ input }) => {
      const { data: agency, error: agencyError } = await supabaseAdmin
        .from('agencies')
        .select('approval_status')
        .eq('id', input.agencyId)
        .single();

      if (agencyError || !agency) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Agencia no encontrada',
        });
      }

      if (agency.approval_status !== 'approved') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Solo las agencias aprobadas pueden ser destacadas',
        });
      }

      const { data: existingSlots } = await supabaseAdmin
        .from('sponsored_slots')
        .select('id, starts_at, ends_at')
        .eq('position', input.position);

      const startsAt = new Date();
      const endsAt = new Date();
      endsAt.setDate(endsAt.getDate() + input.durationDays);

      const hasOverlap = existingSlots?.some((slot: any) => {
        const slotStart = new Date(slot.starts_at);
        const slotEnd = new Date(slot.ends_at);
        return (startsAt <= slotEnd && endsAt >= slotStart);
      });

      if (hasOverlap) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: `La posición ${input.position} ya está ocupada en el período seleccionado`,
        });
      }

      const { data, error } = await supabaseAdmin
        .from('sponsored_slots')
        .insert({
          agency_id: input.agencyId,
          position: input.position,
          starts_at: startsAt.toISOString(),
          ends_at: endsAt.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    }),

  updateSponsoredSlot: adminProcedure
    .input(z.object({
      slotId: z.string().uuid(),
      position: z.number().min(1).max(10).optional(),
      endsAt: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { data: currentSlot, error: fetchError } = await supabaseAdmin
        .from('sponsored_slots')
        .select('position, starts_at, ends_at')
        .eq('id', input.slotId)
        .single();

      if (fetchError || !currentSlot) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Slot no encontrado',
        });
      }

      const updateData: any = {};
      
      if (input.position !== undefined) {
        const { data: existingSlots } = await supabaseAdmin
          .from('sponsored_slots')
          .select('id, starts_at, ends_at')
          .eq('position', input.position)
          .neq('id', input.slotId);

        const startsAt = new Date(currentSlot.starts_at);
        const endsAt = input.endsAt ? new Date(input.endsAt) : new Date(currentSlot.ends_at);

        const hasOverlap = existingSlots?.some((slot: any) => {
          const slotStart = new Date(slot.starts_at);
          const slotEnd = new Date(slot.ends_at);
          return (startsAt <= slotEnd && endsAt >= slotStart);
        });

        if (hasOverlap) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: `La posición ${input.position} ya está ocupada en el período seleccionado`,
          });
        }

        updateData.position = input.position;
      }
      
      if (input.endsAt) {
        updateData.ends_at = input.endsAt;
      }

      const { data, error } = await supabaseAdmin
        .from('sponsored_slots')
        .update(updateData)
        .eq('id', input.slotId)
        .select()
        .single();

      if (error) throw error;

      return data;
    }),

  removeSponsoredSlot: adminProcedure
    .input(z.object({ slotId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const { error } = await supabaseAdmin
        .from('sponsored_slots')
        .delete()
        .eq('id', input.slotId);

      if (error) throw error;

      return { success: true };
    }),

  createReview: adminProcedure
    .input(adminCreateReviewSchema)
    .mutation(async ({ input }) => {
      const { data: agency, error: agencyError } = await db
        .from('agencies')
        .select('id, name')
        .eq('id', input.agencyId)
        .single();

      if (agencyError || !agency) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Agencia no encontrada',
        });
      }

      const { data, error } = await db
        .from('reviews')
        .insert({
          agency_id: input.agencyId,
          user_id: null,
          author_name: input.authorName,
          rating: input.rating,
          comment: input.comment,
          status: 'approved',
        } as any)
        .select()
        .single();

      if (error || !data) throw error || new Error('Failed to create review');

      return data;
    }),

  updateAgency: adminProcedure
    .input(z.object({
      agencyId: z.string().uuid(),
      name: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().min(1),
      email: z.string().email(),
      phone: z.string().min(1),
      whatsapp_number: z.string().optional().or(z.literal('')),
      website: z.string().url().optional().or(z.literal('')),
      location_city: z.string().min(1),
      location_region: z.string().min(1),
      categories: z.array(z.string()).min(1),
      services: z.array(z.string()),
      logo_url: z.string().url().optional().or(z.literal('')),
      cover_url: z.string().url().optional().or(z.literal('')),
      employees_min: z.number().int().min(0).nullable(),
      employees_max: z.number().int().min(0).nullable(),
      price_range: z.enum(['$', '$$', '$$$']).nullable().or(z.literal('')),
      specialties: z.array(z.string()).optional(),
      facebook_url: z.string().url().optional().or(z.literal('')),
      instagram_url: z.string().url().optional().or(z.literal('')),
      linkedin_url: z.string().url().optional().or(z.literal('')),
      twitter_url: z.string().url().optional().or(z.literal('')),
      youtube_url: z.string().url().optional().or(z.literal('')),
      tiktok_url: z.string().url().optional().or(z.literal('')),
    }))
    .mutation(async ({ input }) => {
      const { agencyId, ...updateData } = input;

      const { data: existingAgency, error: fetchError } = await db
        .from('agencies')
        .select('id, name')
        .eq('id', agencyId)
        .single();

      if (fetchError || !existingAgency) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Agencia no encontrada',
        });
      }

      const cleanedData: Record<string, any> = {
        name: updateData.name,
        slug: updateData.slug,
        description: updateData.description,
        email: updateData.email,
        phone: updateData.phone,
        whatsapp_number: updateData.whatsapp_number || null,
        website: updateData.website || null,
        location_city: updateData.location_city,
        location_region: updateData.location_region,
        categories: updateData.categories,
        services: updateData.services,
        logo_url: updateData.logo_url || null,
        cover_url: updateData.cover_url || null,
        employees_min: updateData.employees_min ?? null,
        employees_max: updateData.employees_max ?? null,
        price_range: updateData.price_range || null,
        specialties: updateData.specialties ?? [],
        facebook_url: updateData.facebook_url || null,
        instagram_url: updateData.instagram_url || null,
        linkedin_url: updateData.linkedin_url || null,
        twitter_url: updateData.twitter_url || null,
        youtube_url: updateData.youtube_url || null,
        tiktok_url: updateData.tiktok_url || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await db
        .from('agencies')
        .update(cleanedData as any)
        .eq('id', agencyId)
        .select()
        .single();

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Error al actualizar la agencia',
        });
      }

      return data;
    }),
});
