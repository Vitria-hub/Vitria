import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { ObjectStorageService } from '../objectStorage';
import { TRPCError } from '@trpc/server';

export const uploadRouter = router({
  getUploadUrl: protectedProcedure
    .mutation(async () => {
      try {
        const objectStorageService = new ObjectStorageService();
        const uploadURL = await objectStorageService.getObjectEntityUploadURL();
        return { uploadURL };
      } catch (error) {
        console.error('Error getting upload URL:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error al obtener URL de carga',
        });
      }
    }),

  setLogoAcl: protectedProcedure
    .input(z.object({
      logoURL: z.string(),
      agencyId: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      try {
        const objectStorageService = new ObjectStorageService();
        const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
          input.logoURL,
          {
            owner: userId,
            visibility: "public",
          },
        );

        return { objectPath };
      } catch (error) {
        console.error('Error setting logo ACL:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error al configurar el logo',
        });
      }
    }),

  setCoverAcl: protectedProcedure
    .input(z.object({
      coverURL: z.string(),
      agencyId: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      try {
        const objectStorageService = new ObjectStorageService();
        const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
          input.coverURL,
          {
            owner: userId,
            visibility: "public",
          },
        );

        return { objectPath };
      } catch (error) {
        console.error('Error setting cover ACL:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error al configurar la portada',
        });
      }
    }),
});
