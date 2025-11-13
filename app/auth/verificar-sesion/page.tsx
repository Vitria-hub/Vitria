'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

function VerificarSesionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const handleSession = async () => {
      try {
        const supabase = createClient();
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.error('Session error:', sessionError);
          setError('No se pudo verificar la sesión');
          setTimeout(() => router.push('/auth/login?error=session_failed'), 2000);
          return;
        }

        const user = session.user;
        
        console.log('Session verification - checking for existing user');
        
        const { data: existingUser, error: userCheckError } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', user.id)
          .single();

        let dbUser;

        if (existingUser) {
          console.log('Existing user found with role:', existingUser.role);
          dbUser = existingUser;
        } else {
          console.log('New user - checking for role parameter');
          const roleParam = searchParams.get('role');
          
          if (!roleParam) {
            console.log('No role specified for new user - redirecting to account type selection');
            router.push('/auth/seleccionar-tipo');
            return;
          }

          const intendedRole = roleParam;
          console.log('Creating new user with role:', intendedRole);
          
          const response = await fetch('/api/auth/create-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              auth_id: user.id,
              full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario',
              role: intendedRole,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to create user');
          }

          const responseData = await response.json();
          dbUser = responseData.user;
        }

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

export default function VerificarSesionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-dark/60">Cargando...</p>
        </div>
      </div>
    }>
      <VerificarSesionContent />
    </Suspense>
  );
}
