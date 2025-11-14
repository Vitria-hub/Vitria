import { router, protectedProcedure } from '../trpc';
import { db } from '../db';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { approveAgencySchema, rejectAgencySchema } from '@/lib/validators';
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
      status: z.enum(['all', 'verified', 'unverified']).default('all'),
    }))
    .query(async ({ input }) => {
      const { page, limit, status } = input;
      const offset = (page - 1) * limit;

      let query = db.from('agencies').select('*, users!agencies_owner_id_fkey(full_name, role)', { count: 'exact' });

      if (status === 'verified') {
        query = query.eq('is_verified', true);
      } else if (status === 'unverified') {
        query = query.eq('is_verified', false);
      }

      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        agencies: data || [],
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
      };
    }),

  getAgency: adminProcedure
    .input(z.object({ agencyId: z.string().uuid() }))
    .query(async ({ input }) => {
      const { data, error } = await db
        .from('agencies')
        .select('*, users!agencies_owner_id_fkey(full_name, email, role)')
        .eq('id', input.agencyId)
        .single();

      if (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Agencia no encontrada',
        });
      }

      return data;
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
});
