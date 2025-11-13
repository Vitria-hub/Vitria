import { router, protectedProcedure } from '../trpc';
import { createClientProfileSchema } from '@/lib/validators';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const clientRouter = router({
  createProfile: protectedProcedure
    .input(createClientProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const { data: existingProfile, error: checkError } = await supabaseAdmin
        .from('client_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (existingProfile) {
        throw new Error('Ya existe un perfil de cliente para este usuario');
      }

      const { data, error } = await supabaseAdmin
        .from('client_profiles')
        .insert({
          user_id: userId,
          business_name: input.businessName,
          business_instagram: input.businessInstagram || null,
          budget_range: input.budgetRange,
          desired_categories: input.desiredCategories,
          about_business: input.aboutBusiness || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Database error creating client profile:', error);
        throw new Error(`Error al crear el perfil de cliente: ${error.message}`);
      }

      return data;
    }),

  getMyProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const { data } = await supabaseAdmin
      .from('client_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    return data;
  }),

  updateProfile: protectedProcedure
    .input(createClientProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const { data, error } = await supabaseAdmin
        .from('client_profiles')
        .update({
          business_name: input.businessName,
          business_instagram: input.businessInstagram || null,
          budget_range: input.budgetRange,
          desired_categories: input.desiredCategories,
          about_business: input.aboutBusiness || null,
          updated_at: new Date().toISOString(),
        })
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
