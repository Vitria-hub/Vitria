'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn, signInWithGoogle } from '@/lib/auth';
import { createClient } from '@/utils/supabase/client';
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('id, role')
          .eq('auth_id', session.user.id)
          .single();

        if (!userData) {
          setCheckingSession(false);
          return;
        }

        if (userData.role === 'admin') {
          router.push('/admin');
          return;
        }

        if (userData.role === 'agency') {
          const { data: agency } = await supabase
            .from('agencies')
            .select('id')
            .eq('owner_id', userData.id)
            .single();

          if (!agency) {
            router.push('/dashboard/crear-agencia');
          } else {
            router.push('/dashboard');
          }
          return;
        }

        if (userData.role === 'user') {
          const { data: clientProfile } = await supabase
            .from('client_profiles')
            .select('id')
            .eq('user_id', userData.id)
            .single();

          if (!clientProfile) {
            router.push('/auth/registro/cliente/perfil');
          } else {
            router.push('/dashboard');
          }
          return;
        }

        router.push('/dashboard');
      } else {
        setCheckingSession(false);
      }
    };
    
    checkSession();
  }, [router]);

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión con Google');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const authData = await signIn(email, password);
      const supabase = createClient();
      
      if (authData.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('auth_id', authData.user.id)
          .single();

        if (userData?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
        router.refresh();
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.message?.includes('Email not confirmed') || err.message?.includes('not confirmed')) {
        setError('Debes confirmar tu email antes de iniciar sesión. Revisa tu correo.');
      } else if (err.message?.includes('Invalid login credentials')) {
        setError('Email o contraseña incorrectos');
      } else {
        setError(err.message || 'Error al iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-dark/60">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Iniciar Sesión</h1>
          <p className="text-dark/70">Accede a tu cuenta de Vitria</p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.8055 10.2292C19.8055 9.55057 19.7501 8.86719 19.6296 8.19922H10.2002V12.0491H15.6014C15.3771 13.2911 14.6571 14.3898 13.6026 15.0878V17.5866H16.8248C18.7172 15.8449 19.8055 13.2728 19.8055 10.2292Z" fill="#4285F4"/>
              <path d="M10.2002 20.0006C12.9511 20.0006 15.2726 19.1151 16.8294 17.5865L13.6072 15.0877C12.7085 15.6979 11.5537 16.0433 10.2049 16.0433C7.54356 16.0433 5.28961 14.2831 4.49246 11.9175H1.16309V14.4927C2.75562 17.8478 6.29152 20.0006 10.2002 20.0006Z" fill="#34A853"/>
              <path d="M4.48714 11.9175C4.07256 10.6755 4.07256 9.32892 4.48714 8.08691V5.51172H1.16244C-0.387475 8.67662 -0.387475 12.3278 1.16244 15.4927L4.48714 11.9175Z" fill="#FBBC04"/>
              <path d="M10.2002 3.95805C11.6248 3.936 13.0026 4.47247 14.0363 5.45722L16.8897 2.60385C15.1844 0.990871 12.9371 0.0808105 10.2002 0.10619C6.29152 0.10619 2.75562 2.25897 1.16309 5.51185L4.4878 8.08704C5.28027 5.71676 7.53889 3.95805 10.2002 3.95805Z" fill="#EA4335"/>
            </svg>
            {googleLoading ? 'Conectando...' : 'Continuar con Google'}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-dark/60">o continúa con email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-dark">
                  Contraseña
                </label>
                <Link 
                  href="/auth/recuperar-contrasena" 
                  className="text-sm text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-dark/60">
            ¿No tienes cuenta?{' '}
            <Link href="/auth/registro" className="text-primary font-semibold hover:underline">
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
