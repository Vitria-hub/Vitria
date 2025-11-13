'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { trpc } from '@/lib/trpc';
import Button from '@/components/Button';
import { TrendingUp, Eye, MousePointerClick, Users, Building2, Settings, CreditCard } from 'lucide-react';

export default function DashboardPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<'profile' | 'metrics'>('profile');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const { data: userAgency } = trpc.agency.myAgency.useQuery();

  const mockMetrics = [
    { label: 'Vistas', value: 1234, icon: Eye, change: '+12%' },
    { label: 'Clics en Perfil', value: 456, icon: MousePointerClick, change: '+8%' },
    { label: 'Contactos', value: 89, icon: Users, change: '+15%' },
    { label: 'Leads', value: 34, icon: TrendingUp, change: '+22%' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-dark/60">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isAgency = userData?.role === 'agency';
  const agencySlug = userAgency?.slug;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Dashboard</h1>
        <p className="text-dark/70">
          Bienvenido, {userData?.full_name || 'Usuario'}
        </p>
      </div>

      {isAgency ? (
        agencySlug ? (
          <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setTab('profile')}
                  className={`px-6 py-4 font-semibold transition ${
                    tab === 'profile'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-dark/60 hover:text-primary'
                  }`}
                >
                  Perfil
                </button>
                <button
                  onClick={() => setTab('metrics')}
                  className={`px-6 py-4 font-semibold transition ${
                    tab === 'metrics'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-dark/60 hover:text-primary'
                  }`}
                >
                  Métricas
                </button>
              </nav>
            </div>

            <div className="p-8">
              {tab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-dark mb-6">Gestionar Perfil</h2>
                  <div className="space-y-4">
                    <Link href={`/agencias/${agencySlug}`}>
                      <Button variant="primary" className="w-full sm:w-auto">
                        Ver Perfil Público
                      </Button>
                    </Link>
                    <Link href="/dashboard/editar-perfil" className="block sm:inline-block sm:ml-4">
                      <Button variant="outline" className="w-full sm:w-auto">
                        <Settings className="w-4 h-4 mr-2" />
                        Editar Información
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-dark mb-2">
                      {userAgency?.name}
                    </h3>
                    <p className="text-dark/60 text-sm">
                      {userAgency?.description || 'Sin descripción'}
                    </p>
                  </div>
                </div>
              )}

              {tab === 'metrics' && (
                <div>
                  <h2 className="text-2xl font-bold text-dark mb-6">Métricas (Últimos 30 días)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mockMetrics.map((metric) => {
                      const Icon = metric.icon;
                      return (
                        <div
                          key={metric.label}
                          className="bg-lilac/10 rounded-lg p-6 border-2 border-lilac/30"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Icon className="w-8 h-8 text-primary" />
                            <span className="text-sm font-semibold text-mint">{metric.change}</span>
                          </div>
                          <p className="text-3xl font-bold text-dark mb-1">{metric.value}</p>
                          <p className="text-sm text-dark/60">{metric.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>
        ) : (
          <div className="bg-white border-2 border-gray-200 rounded-xl p-12 text-center">
            <Building2 className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-primary mb-4">
              Registra tu Agencia
            </h2>
            <p className="text-dark/70 mb-6 max-w-md mx-auto">
              Aún no tienes una agencia registrada. Crea tu perfil para comenzar a recibir clientes.
            </p>
            <Link href="/dashboard/crear-agencia">
              <Button variant="primary" size="lg">
                Crear Mi Agencia
              </Button>
            </Link>
          </div>
        )
      ) : (
        <div className="space-y-6">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-primary">
                Mi Perfil de Cliente
              </h2>
              <Link href="/dashboard/perfil">
                <Button variant="primary">
                  <Settings className="w-4 h-4 mr-2" />
                  Gestionar Perfil
                </Button>
              </Link>
            </div>
            <p className="text-dark/60">
              Completa tu perfil para recibir recomendaciones personalizadas de agencias que se ajusten a tus necesidades.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Agencias Favoritas
            </h2>
            <p className="text-dark/60">
              Aún no has guardado agencias favoritas. Explora el directorio y guarda las que más te interesen.
            </p>
            <Link href="/agencias" className="inline-block mt-4">
              <Button variant="primary">Explorar Agencias</Button>
            </Link>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Mis Reseñas
            </h2>
            <p className="text-dark/60">
              No has dejado reseñas aún. Comparte tu experiencia con otras empresas.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
