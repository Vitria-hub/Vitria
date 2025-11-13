'use client';

import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@/server/routers/_app';
import { createClient } from '@/utils/supabase/client';

export const trpc = createTRPCReact<AppRouter>();

export function getTRPCClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: typeof window !== 'undefined' 
          ? `${window.location.origin}/api/trpc`
          : '/api/trpc',
        async headers() {
          const supabase = createClient();
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
