'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp, signInWithGoogle } from '@/lib/auth';
import { createClient } from '@/utils/supabase/client';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Building2, ArrowRight } from 'lucide-react';

export default function AgencyRegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
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
          router.push('/dashboard');
          return;
        }

        if (userData.role === 'user') {
          router.push('/dashboard');
          return;
        }

        router.push('/dashboard');
      } else {
        setCheckingSession(false);
      }
    };
    
    checkSession();
  }, [router]);

  const handleGoogleSignUp = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle({ 
        role: 'agency',
        redirectPath: '/dashboard'
      });
    } catch (err: any) {
      setError(err.message || 'Error al continuar con Google');
      setGoogleLoading(false);
    }
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const { signIn } = await import('@/lib/auth');
      const { createClient } = await import('@/utils/supabase/client');
      
      const signUpResult = await signUp(email, password, fullName, 'agency');
      
      let signInData;
      try {
        signInData = await signIn(email, password);
      } catch (signInError: any) {
        console.error('Sign in error:', signInError);
        if (signInError.message?.includes('Invalid')) {
          setError('Credenciales inválidas. Por favor, verifica tu email y contraseña.');
        } else {
          setError(signInError.message || 'Error al iniciar sesión. Intenta nuevamente.');
        }
        setLoading(false);
        return;
      }
      
      const supabase = createClient();
      let attempts = 0;
      const maxAttempts = 25;
      
      while (attempts < maxAttempts) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          router.push('/dashboard');
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 200));
        attempts++;
      }
      
      throw new Error('La sesión tardó demasiado en establecerse. Por favor, intenta iniciar sesión desde la página de login.');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Error al crear la cuenta');
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-10 h-10 text-dark" />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">Registra tu Agencia</h1>
          <p className="text-dark/70 text-lg">
            Únete a Vitria y conecta con clientes potenciales
          </p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.8055 10.2292C19.8055 9.55057 19.7501 8.86719 19.6296 8.19922H10.2002V12.0491H15.6014C15.3771 13.2911 14.6571 14.3898 13.6026 15.0878V17.5866H16.8248C18.7172 15.8449 19.8055 13.2728 19.8055 10.2292Z" fill="#4285F4"/>
              <path d="M10.2002 20.0006C12.9511 20.0006 15.2726 19.1151 16.8294 17.5865L13.6072 15.0877C12.7085 15.6979 11.5537 16.0433 10.2049 16.0433C7.54356 16.0433 5.28961 14.2831 4.49246 11.9175H1.16309V14.4927C2.75562 17.8478 6.29152 20.0006 10.2002 20.0006Z" fill="#34A853"/>
              <path d="M4.48714 11.9175C4.07256 10.6755 4.07256 9.32892 4.48714 8.08691V5.51172H1.16244C-0.387475 8.67662 -0.387475 12.3278 1.16244 15.4927L4.48714 11.9175Z" fill="#FBBC04"/>
              <path d="M10.2002 3.95805C11.6248 3.936 13.0026 4.47247 14.0363 5.45722L16.8897 2.60385C15.1844 0.990871 12.9371 0.0808105 10.2002 0.10619C6.29152 0.10619 2.75562 2.25897 1.16309 5.51185L4.4878 8.08704C5.28027 5.71676 7.53889 3.95805 10.2002 3.95805Z" fill="#EA4335"/>
            </svg>
            {googleLoading ? 'Conectando...' : 'Continuar con Google'}
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-dark/60">o crea tu cuenta con email</span>
            </div>
          </div>

          <form onSubmit={handleStep1Submit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Nombre Completo *
              </label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Juan Pérez"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Email *
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
              <label className="block text-sm font-semibold text-dark mb-2">
                Contraseña *
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Confirmar Contraseña *
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" variant="primary" className="w-full" loading={loading}>
              Crear Cuenta
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="mt-6 p-4 bg-lilac/10 rounded-lg">
            <h3 className="font-semibold text-dark mb-2">¿Qué incluye?</h3>
            <ul className="space-y-2 text-sm text-dark/80">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                <span>Perfil profesional completo con portfolio</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                <span>Recibe leads de clientes interesados</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                <span>Métricas y analytics de tu perfil</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                <span>Opciones premium para destacar</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 text-center text-sm text-dark/60">
            ¿Ya tienes cuenta?{' '}
            <Link href="/auth/login" className="text-primary font-semibold hover:underline">
              Inicia sesión aquí
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/auth/registro" className="text-sm text-dark/60 hover:text-primary transition">
            ← Volver a opciones de registro
          </Link>
        </div>
      </div>
    </div>
  );
}
