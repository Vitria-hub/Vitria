import 'server-only';
import { appRouter } from '@/server/routers/_app';
import { createContext } from '@/server/trpc';
import { headers as getHeaders } from 'next/headers';
import { cache } from 'react';

/**
 * Server-side tRPC caller for Next.js App Router server components.
 * 
 * IMPORTANT LIMITATIONS:
 * - Currently only works correctly for PUBLIC procedures (publicProcedure)
 * - Does NOT properly forward authentication context for protected procedures
 * - Use only for non-authenticated endpoints like getCategoryCounts
 * 
 * For authenticated server-side calls, use client components with tRPC hooks
 * or fetch data in server components via direct database queries.
 * 
 * Future improvement: Forward actual request/cookies to properly support
 * authenticated procedures in server components.
 */
export const serverClient = cache(async () => {
  const headersList = await getHeaders();
  
  const req = new Request('http://localhost:5000', {
    headers: headersList as HeadersInit,
  });
  
  const context = await createContext({
    req,
    resHeaders: new Headers(),
  });

  return appRouter.createCaller(context);
});
