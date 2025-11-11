'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session?.user) {
          const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', session.user.id)
            .single();

          if (!existingUser) {
            const fullName = session.user.user_metadata?.full_name || 
                           session.user.user_metadata?.name || 
                           session.user.email?.split('@')[0] || 
                           'Usuario';

            await supabase.from('users').insert({
              auth_id: session.user.id,
              full_name: fullName,
              role: 'user',
            });
          }

          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('auth_id', session.user.id)
            .single();

          if (userData?.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/dashboard');
          }
        } else {
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Error en callback:', error);
        router.push('/auth/login');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-dark/70">Completando inicio de sesión...</p>
      </div>
    </div>
  );
}
