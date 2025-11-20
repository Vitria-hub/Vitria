'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useToast } from '@/contexts/ToastContext';

export default function RecuperarContrasenaPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/auth/actualizar-contrasena`,
      });

      if (resetError) throw resetError;

      toast.success('¡Enlace enviado! Revisa tu correo electrónico para restablecer tu contraseña.');
      setEmail('');
    } catch (err: any) {
      toast.error(err.message || 'Error al enviar el enlace de recuperación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Recuperar Contraseña</h1>
          <p className="text-dark/70">Te enviaremos un enlace para restablecer tu contraseña</p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
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
                disabled={loading}
              />
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full" 
              loading={loading}
            >
              Enviar Enlace de Recuperación
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-dark/60">
            ¿Recordaste tu contraseña?{' '}
            <Link href="/auth/login" className="text-primary font-semibold hover:underline">
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
