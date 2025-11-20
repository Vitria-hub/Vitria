'use client';

import { useState } from 'react';
import { X, LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/contexts/ToastContext';
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
  const toast = useToast();

  if (!isOpen) return null;

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
              href="/auth/registro/cliente"
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
