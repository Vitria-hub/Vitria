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
          try {
            const supabase = createClient();
            let { data: { session }, error } = await supabase.auth.getSession();
            
            if (error || !session) {
              return {};
            }
            
            if (session?.expires_at) {
              const expiresAt = new Date(session.expires_at * 1000);
              const now = new Date();
              const timeUntilExpiry = expiresAt.getTime() - now.getTime();
              
              if (timeUntilExpiry < 300000) {
                const { data, error: refreshError } = await supabase.auth.refreshSession();
                if (!refreshError && data?.session) {
                  session = data.session;
                }
              }
            }
            
            if (session?.access_token) {
              return {
                authorization: `Bearer ${session.access_token}`,
              };
            }
          } catch (err) {
            console.error('Error getting auth token:', err);
          }
          return {};
        },
      }),
    ],
  });
}
