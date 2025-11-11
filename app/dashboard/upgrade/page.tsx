'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import Button from '@/components/Button';
import { Check, Loader } from 'lucide-react';

export default function UpgradePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const { data: userAgency } = trpc.agency.myAgency.useQuery();

  const createCheckoutMutation = trpc.billing.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });

  const handleUpgrade = () => {
    const agencyId = userAgency?.id;
    if (!agencyId) {
      alert('Debes crear una agencia primero');
      return;
    }
    
    createCheckoutMutation.mutate({
      plan: 'premium',
      agencyId,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Actualiza a Premium
        </h1>
        <p className="text-xl text-dark/70">
          Destaca tu agencia y obtén más clientes
        </p>
      </div>

      <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl p-8 md:p-12 shadow-xl">
        <div className="text-center mb-8">
          <div className="text-5xl font-bold mb-2">$49</div>
          <div className="text-xl opacity-90">por mes</div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {[
            'Aparece primero en todas las búsquedas',
            'Badge Premium verificado en tu perfil',
            'Destacado en el carrusel de la home',
            'Portafolio ilimitado de proyectos',
            'Estadísticas detalladas de visitas',
            'Métricas de conversión y leads',
            '3x más visibilidad que el plan Free',
            'Soporte prioritario',
          ].map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <Check className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
              <span className="text-white/95">{feature}</span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={handleUpgrade}
            variant="accent"
            size="lg"
            disabled={createCheckoutMutation.isLoading}
            className="text-lg px-12 py-4"
          >
            {createCheckoutMutation.isLoading ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              'Actualizar Ahora'
            )}
          </Button>
          <p className="mt-4 text-sm opacity-80">
            Pago seguro con Stripe • Cancela cuando quieras
          </p>
        </div>

        {createCheckoutMutation.error && (
          <div className="mt-6 bg-red-100 border-2 border-red-300 text-red-800 px-4 py-3 rounded-lg text-center">
            Error al procesar el pago. Inténtalo de nuevo.
          </div>
        )}
      </div>

      <div className="mt-12 text-center text-dark/60">
        <p className="mb-2">¿Tienes dudas sobre el plan Premium?</p>
        <a href="mailto:soporte@vitria.cl" className="text-primary font-semibold hover:underline">
          Contáctanos
        </a>
      </div>
    </div>
  );
}
