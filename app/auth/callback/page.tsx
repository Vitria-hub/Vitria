'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session?.user) {
          const metadataRole = session.user.user_metadata?.role || 'user';
          const allowedRoles = ['user', 'agency'];
          const intendedRole = allowedRoles.includes(metadataRole) ? metadataRole : 'user';
          
          const fullName = session.user.user_metadata?.full_name || 
                         session.user.user_metadata?.name || 
                         session.user.email?.split('@')[0] || 
                         'Usuario';

          const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', session.user.id)
            .single();

          let dbUserId = existingUser?.id;

          if (!existingUser) {
            const { data: newUser } = await supabase.from('users').insert({
              auth_id: session.user.id,
              full_name: fullName,
              role: intendedRole as 'user' | 'agency',
            }).select().single();
            
            dbUserId = newUser?.id;
          } else {
            if (existingUser.role !== intendedRole && existingUser.role !== 'admin') {
              await supabase
                .from('users')
                .update({ role: intendedRole as 'user' | 'agency' })
                .eq('auth_id', session.user.id);
            }
          }

          if (intendedRole === 'user') {
            const { data: clientProfile } = await supabase
              .from('client_profiles')
              .select('*')
              .eq('user_id', dbUserId)
              .single();

            if (!clientProfile) {
              router.push('/auth/registro/cliente/perfil');
              return;
            }
          }

          if (intendedRole === 'agency') {
            const { data: agencyProfile } = await supabase
              .from('agencies')
              .select('*')
              .eq('owner_id', dbUserId)
              .single();

            if (!agencyProfile) {
              router.push('/dashboard/crear-agencia');
              return;
            }
          }

          if (existingUser?.role === 'admin') {
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
  }, [router, searchParams]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-dark/70">Completando inicio de sesión...</p>
      </div>
    </div>
  );
}
