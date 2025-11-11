'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp, signInWithGoogle } from '@/lib/auth';
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'user' | 'agency'>('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Error al registrarse con Google');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      await signUp(email, password, fullName, role);
      router.push('/auth/login');
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Crear Cuenta</h1>
          <p className="text-dark/70">Únete a la comunidad de Vitria</p>
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
              <span className="px-4 bg-white text-dark/60">o regístrate con email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Nombre Completo
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
              <label className="block text-sm font-semibold text-dark mb-2">
                Contraseña
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
                Confirmar Contraseña
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-3">
                Tipo de Cuenta
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`p-4 border-2 rounded-lg text-center transition ${
                    role === 'user'
                      ? 'border-primary bg-primary/5 text-primary font-semibold'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-bold mb-1">Cliente</div>
                  <div className="text-xs opacity-70">Busco agencias</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('agency')}
                  className={`p-4 border-2 rounded-lg text-center transition ${
                    role === 'agency'
                      ? 'border-primary bg-primary/5 text-primary font-semibold'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-bold mb-1">Agencia</div>
                  <div className="text-xs opacity-70">Ofrezco servicios</div>
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-dark/60">
            ¿Ya tienes cuenta?{' '}
            <Link href="/auth/login" className="text-primary font-semibold hover:underline">
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
