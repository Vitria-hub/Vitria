import { router, protectedProcedure } from '../trpc';
import { createClientProfileSchema } from '@/lib/validators';
import { db } from '../db';

export const clientRouter = router({
  createProfile: protectedProcedure
    .input(createClientProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const { data: existingProfile } = await db.rpc('check_client_profile_exists', { p_user_id: userId }).catch(() => null);

      if (existingProfile) {
        throw new Error('Ya existe un perfil de cliente para este usuario');
      }

      const { data, error } = await db.rpc('create_client_profile', {
        p_user_id: userId,
        p_business_name: input.businessName,
        p_budget_range: input.budgetRange,
        p_business_instagram: input.businessInstagram || null,
        p_desired_categories: input.desiredCategories,
        p_about_business: input.aboutBusiness || null,
      });

      if (error) {
        console.error('Database error creating client profile:', error);
        throw new Error(`Error al crear el perfil de cliente: ${error.message}`);
      }

      return data;
    }),

  getMyProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const { data } = await db
      .from('client_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    return data;
  }),

  updateProfile: protectedProcedure
    .input(createClientProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const { data, error } = await (db
        .from('client_profiles')
        .update({
          business_name: input.businessName,
          business_instagram: input.businessInstagram || null,
          budget_range: input.budgetRange,
          desired_categories: input.desiredCategories,
          about_business: input.aboutBusiness || null,
          updated_at: new Date().toISOString(),
        }) as any)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Database error updating client profile:', error);
        throw new Error(`Error al actualizar el perfil: ${error.message}`);
      }

      return data;
    }),
});
