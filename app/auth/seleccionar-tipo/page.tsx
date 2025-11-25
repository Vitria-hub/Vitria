'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Button from '@/components/Button';
import { User, Building2 } from 'lucide-react';

export default function SeleccionarTipoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelection = async (role: 'user' | 'agency') => {
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        setError('No se encontró una sesión activa');
        setTimeout(() => router.push('/auth/login'), 2000);
        return;
      }

      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', session.user.id)
        .single();

      let dbUser;

      if (existingUser) {
        console.log('Existing user found with role:', existingUser.role);
        
        if (existingUser.role !== role) {
          console.log('Updating user role from', existingUser.role, 'to', role);
          const { error: updateError } = await supabase
            .from('users')
            .update({ role })
            .eq('id', existingUser.id);
          
          if (updateError) {
            console.error('Error updating role:', updateError);
            throw new Error('Error al actualizar el tipo de cuenta');
          }
          
          dbUser = { ...existingUser, role };
        } else {
          dbUser = existingUser;
        }
      } else {
        console.log('Creating new user with selected role:', role);
        const response = await fetch('/api/auth/create-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            auth_id: session.user.id,
            full_name: session.user.user_metadata?.full_name || 
                      session.user.user_metadata?.name || 
                      session.user.email?.split('@')[0] || 
                      'Usuario',
            role,
          }),
        });

        if (!response.ok) {
          throw new Error('Error al crear el perfil');
        }

        const responseData = await response.json();
        dbUser = responseData.user;
      }

      if (dbUser.role === 'agency') {
        router.push('/dashboard');
        return;
      }

      if (dbUser.role === 'user') {
        router.push('/dashboard');
        return;
      }

    } catch (err: any) {
      setError(err.message || 'Error al procesar la selección');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            ¿Qué tipo de cuenta necesitas?
          </h1>
          <p className="text-dark/70 text-lg">
            Selecciona el tipo de cuenta para continuar
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => handleSelection('user')}
            disabled={loading}
            className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-primary hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-left group"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-lilac/20 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-primary mb-2">
                  Soy un Cliente
                </h3>
                <p className="text-dark/70">
                  Busco agencias para mis proyectos
                </p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-dark/80">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                <span>Encuentra agencias especializadas</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                <span>Compara servicios y precios</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                <span>Lee reseñas de otros clientes</span>
              </li>
            </ul>
          </button>

          <button
            onClick={() => handleSelection('agency')}
            disabled={loading}
            className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-primary hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-left group"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-primary mb-2">
                  Soy una Agencia
                </h3>
                <p className="text-dark/70">
                  Quiero ofrecer mis servicios
                </p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-dark/80">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                <span>Crea tu perfil profesional</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                <span>Recibe leads de clientes</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                <span>Destaca con opciones premium</span>
              </li>
            </ul>
          </button>
        </div>

        {loading && (
          <div className="text-center mt-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-dark/60 mt-2">Procesando...</p>
          </div>
        )}
      </div>
    </div>
  );
}
