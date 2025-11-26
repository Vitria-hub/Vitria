'use client';

import { useState } from 'react';
import { X, LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/contexts/ToastContext';
import { signInWithGoogle } from '@/lib/auth';
import Button from './Button';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  contextMessage?: string;
}

export default function LoginModal({
  isOpen,
  onClose,
  onSuccess,
  contextMessage = 'Inicia sesión para continuar',
}: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const toast = useToast();

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle({ role: 'user' });
    } catch (error) {
      toast.error('Error al iniciar sesión con Google');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Email o contraseña incorrectos');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Por favor verifica tu email para continuar');
        } else {
          toast.error(error.message);
        }
        setIsLoading(false);
        return;
      }

      if (data.user) {
        toast.success('¡Bienvenido de vuelta!');
        setEmail('');
        setPassword('');
        onClose();
        
        // Wait a bit for auth state to update, then trigger success callback
        setTimeout(() => {
          onSuccess();
        }, 500);
      }
    } catch (error: any) {
      toast.error('Error al iniciar sesión');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <LogIn className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-bold text-primary">Iniciar Sesión</h3>
            </div>
            <p className="text-sm text-dark/60">{contextMessage}</p>
          </div>
          <button onClick={onClose} className="text-dark/60 hover:text-dark">
            <X className="w-6 h-6" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || isLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.8055 10.2292C19.8055 9.55057 19.7501 8.86719 19.6296 8.19922H10.2002V12.0491H15.6014C15.3771 13.2911 14.6571 14.3898 13.6026 15.0878V17.5866H16.8248C18.7172 15.8449 19.8055 13.2728 19.8055 10.2292Z" fill="#4285F4"/>
            <path d="M10.2002 20.0006C12.9511 20.0006 15.2726 19.1151 16.8294 17.5865L13.6072 15.0877C12.7085 15.6979 11.5537 16.0433 10.2049 16.0433C7.54356 16.0433 5.28961 14.2831 4.49246 11.9175H1.16309V14.4927C2.75562 17.8478 6.29152 20.0006 10.2002 20.0006Z" fill="#34A853"/>
            <path d="M4.48714 11.9175C4.07256 10.6755 4.07256 9.32892 4.48714 8.08691V5.51172H1.16244C-0.387475 8.67662 -0.387475 12.3278 1.16244 15.4927L4.48714 11.9175Z" fill="#FBBC04"/>
            <path d="M10.2002 3.95805C11.6248 3.936 13.0026 4.47247 14.0363 5.45722L16.8897 2.60385C15.1844 0.990871 12.9371 0.0808105 10.2002 0.10619C6.29152 0.10619 2.75562 2.25897 1.16309 5.51185L4.4878 8.08704C5.28027 5.71676 7.53889 3.95805 10.2002 3.95805Z" fill="#EA4335"/>
          </svg>
          {googleLoading ? 'Conectando...' : 'Continuar con Google'}
        </button>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-dark/60">o continúa con email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link
              href="/auth/recuperar-contrasena"
              className="text-primary hover:underline"
              onClick={onClose}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Iniciar Sesión
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-dark/60">
            ¿No tienes una cuenta?{' '}
            <Link
              href="/auth/registro"
              className="text-primary font-semibold hover:underline"
              onClick={onClose}
            >
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
