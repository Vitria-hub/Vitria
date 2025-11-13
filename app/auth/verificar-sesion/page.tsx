'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function VerificarSesionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.error('Session error:', sessionError);
          setError('No se pudo verificar la sesión');
          setTimeout(() => router.push('/auth/login?error=session_failed'), 2000);
          return;
        }

        const user = session.user;
        const roleParam = searchParams.get('role');
        
        const response = await fetch('/api/auth/create-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            auth_id: user.id,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario',
            role: roleParam || 'user',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create/verify user');
        }

        const { user: dbUser } = await response.json();

        if (dbUser.role === 'admin') {
          router.push('/admin');
          return;
        }

        if (dbUser.role === 'user') {
          const { data: clientProfile } = await supabase
            .from('client_profiles')
            .select('*')
            .eq('user_id', dbUser.id)
            .single();

          if (!clientProfile) {
            router.push('/auth/registro/cliente/perfil');
            return;
          }

          router.push('/dashboard');
          return;
        }

        if (dbUser.role === 'agency') {
          const { data: agency } = await supabase
            .from('agencies')
            .select('*')
            .eq('owner_id', dbUser.id)
            .single();

          if (!agency) {
            router.push('/dashboard/crear-agencia');
            return;
          }

          router.push('/dashboard');
          return;
        }

        router.push('/dashboard');
        
      } catch (err) {
        console.error('Error verifying session:', err);
        setError('Error al verificar sesión');
        setTimeout(() => router.push('/auth/login?error=verification_failed'), 2000);
      }
    };

    handleSession();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-dark/60">{error}</p>
          <p className="text-sm text-dark/40 mt-2">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-dark/60">Verificando sesión...</p>
      </div>
    </div>
  );
}
