import { router, protectedProcedure } from '../trpc';
import { createClientProfileSchema } from '@/lib/validators';
import { db } from '../db';

export const clientRouter = router({
  createProfile: protectedProcedure
    .input(createClientProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      try {
        const { data: existingCheck } = await (db.rpc as any)('check_client_profile_exists', { p_user_id: userId });
        
        if (existingCheck) {
          throw new Error('Ya existe un perfil de cliente para este usuario');
        }
      } catch (err) {
        // Ignore check errors, continue with creation
      }

      const { data, error } = await (db.rpc as any)('create_client_profile', {
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

      return data?.[0] || data;
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
