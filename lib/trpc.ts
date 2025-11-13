'use client';

import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@/server/routers/_app';
import { supabase } from './supabase';

export const trpc = createTRPCReact<AppRouter>();

export function getTRPCClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: typeof window !== 'undefined' 
          ? `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/api/trpc`
          : '/api/trpc',
        async headers() {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.access_token) {
            return {
              authorization: `Bearer ${session.access_token}`,
            };
          }
          return {};
        },
      }),
    ],
  });
}
