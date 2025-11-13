import { router, protectedProcedure } from '../trpc';
import { createClientProfileSchema } from '@/lib/validators';
import { directDb } from '@/lib/db-direct';

export const clientRouter = router({
  createProfile: protectedProcedure
    .input(createClientProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const existingCheck = await directDb.query(
        'SELECT * FROM client_profiles WHERE user_id = $1',
        [userId]
      );

      if (existingCheck.rows.length > 0) {
        throw new Error('Ya existe un perfil de cliente para este usuario');
      }

      const result = await directDb.query(
        `INSERT INTO client_profiles 
        (user_id, business_name, business_instagram, budget_range, desired_categories, about_business)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
          userId,
          input.businessName,
          input.businessInstagram || null,
          input.budgetRange,
          input.desiredCategories,
          input.aboutBusiness || null
        ]
      );

      if (result.rows.length === 0) {
        throw new Error('Error al crear el perfil de cliente');
      }

      return result.rows[0];
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
